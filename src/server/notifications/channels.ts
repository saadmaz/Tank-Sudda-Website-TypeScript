import "server-only";
import { createHmac } from "node:crypto";
import { leadSubject, leadToText } from "@/server/leads/format";
import type { Lead } from "@/server/leads/types";

export interface NotificationChannel {
  name: string;
  send(lead: Lead): Promise<void>;
}

const TIMEOUT_MS = 10_000;

/** Email via the Resend HTTP API (https://resend.com). */
export function resendChannel(config: {
  apiKey: string;
  from: string;
  to: string[];
}): NotificationChannel {
  return {
    name: "email",
    async send(lead) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: config.from,
          to: config.to,
          subject: leadSubject(lead),
          text: leadToText(lead),
          ...(lead.contact.email ? { reply_to: lead.contact.email } : {}),
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`Resend responded with ${response.status}`);
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
      resendChannel({ apiKey: env.RESEND_API_KEY, from: env.LEAD_EMAIL_FROM, to: recipients }),
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
