import "server-only";
import { createHmac } from "node:crypto";
import { business } from "@/data/business";
import { renderCustomerEmail, renderTeamEmail } from "@/server/leads/email";
import { leadToText } from "@/server/leads/format";
import type { Lead } from "@/server/leads/types";

export interface NotificationChannel {
  name: string;
  send(lead: Lead): Promise<void>;
}

const TIMEOUT_MS = 10_000;

interface ResendMessage {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string;
}

async function sendWithResend(apiKey: string, message: ResendMessage): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Resend responded with ${response.status}`);
}

/**
 * Email via the Resend HTTP API (https://resend.com). Sends the team
 * notification and, when the customer gave an email address, a confirmation
 * to them. The lead counts as delivered once the team email is accepted; a
 * failed confirmation is logged but does not fail the submission.
 */
export function resendChannel(config: {
  apiKey: string;
  from: string;
  to: string[];
  /** Where customer replies go (the business inbox). */
  replyTo?: string | null;
  /** Send the customer a confirmation (default true). */
  confirmToCustomer?: boolean;
}): NotificationChannel {
  return {
    name: "email",
    async send(lead) {
      const team = renderTeamEmail(lead);
      await sendWithResend(config.apiKey, {
        from: config.from,
        to: config.to,
        ...team,
        ...(lead.contact.email ? { reply_to: lead.contact.email } : {}),
      });

      const customer = config.confirmToCustomer === false ? null : renderCustomerEmail(lead);
      if (!customer || !lead.contact.email) return;
      try {
        await sendWithResend(config.apiKey, {
          from: config.from,
          to: [lead.contact.email],
          ...customer,
          ...(config.replyTo ? { reply_to: config.replyTo } : {}),
        });
      } catch (error) {
        console.error(`[lead] Customer confirmation for ${lead.reference} failed:`, error);
      }
    },
  };
}

/**
 * JSON webhook (e.g. an automation tool, Google Apps Script or a future
 * internal API). When a secret is set, the body is signed with HMAC-SHA256 in
 * the X-TankSudda-Signature header so the receiver can verify it.
 */
export function webhookChannel(config: {
  url: string;
  secret: string | null;
}): NotificationChannel {
  return {
    name: "webhook",
    async send(lead) {
      const body = JSON.stringify({ type: `lead.${lead.kind}`, lead });
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (config.secret) {
        headers["X-TankSudda-Signature"] =
          `sha256=${createHmac("sha256", config.secret).update(body).digest("hex")}`;
      }
      const response = await fetch(config.url, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`Webhook responded with ${response.status}`);
    },
  };
}

/** Development only: prints the lead to the server console. Never used in production. */
export const developmentLogChannel: NotificationChannel = {
  name: "development-log",
  async send(lead) {
    console.info(
      `\n[lead:development-only] Not delivered anywhere; configure a channel.\n${leadToText(lead)}\n`,
    );
  },
};

type Env = Record<string, string | undefined>;

/** Builds the channels configured through environment variables. */
export function configuredChannels(env: Env = process.env): NotificationChannel[] {
  const channels: NotificationChannel[] = [];
  const recipients = (env.LEAD_EMAIL_TO ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (env.RESEND_API_KEY && env.LEAD_EMAIL_FROM && recipients.length > 0) {
    channels.push(
      resendChannel({
        apiKey: env.RESEND_API_KEY,
        from: env.LEAD_EMAIL_FROM,
        to: recipients,
        replyTo: env.LEAD_REPLY_TO || business.email,
        confirmToCustomer: env.LEAD_CUSTOMER_CONFIRMATION !== "0",
      }),
    );
  }
  if (env.LEAD_WEBHOOK_URL) {
    try {
      const url = new URL(env.LEAD_WEBHOOK_URL);
      if (url.protocol === "https:") {
        channels.push(
          webhookChannel({ url: url.toString(), secret: env.LEAD_WEBHOOK_SECRET ?? null }),
        );
      } else {
        console.error("LEAD_WEBHOOK_URL must use https; webhook channel disabled.");
      }
    } catch {
      console.error("LEAD_WEBHOOK_URL is not a valid URL; webhook channel disabled.");
    }
  }
  return channels;
}

export function isLeadDeliveryConfigured(env: Env = process.env): boolean {
  return configuredChannels(env).length > 0;
}

export interface DeliveryOutcome {
  delivered: string[];
  failed: string[];
}

/** Sends a lead to every channel. Succeeds if at least one channel accepted it. */
export async function deliverLead(
  lead: Lead,
  channels: NotificationChannel[] = configuredChannels(),
): Promise<DeliveryOutcome> {
  const active =
    channels.length === 0 && process.env.NODE_ENV === "development"
      ? [developmentLogChannel]
      : channels;
  const results = await Promise.allSettled(active.map((channel) => channel.send(lead)));
  const outcome: DeliveryOutcome = { delivered: [], failed: [] };
  results.forEach((result, index) => {
    const name = active[index]!.name;
    if (result.status === "fulfilled") {
      outcome.delivered.push(name);
    } else {
      outcome.failed.push(name);
      console.error(`[lead] ${lead.reference}: delivery via ${name} failed`, result.reason);
    }
  });
  return outcome;
}
