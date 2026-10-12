import "server-only";
import type { z } from "zod";
import { todayInSriLanka } from "@/lib/dates";
import { checkSpamSignals, toFieldErrors } from "@/lib/validation/common";
import {
  configuredChannels,
  deliverLead,
  type NotificationChannel,
} from "@/server/notifications/channels";
import { createReference } from "./format";
import type { Lead, SubmissionResult } from "./types";

interface ProcessOptions<S extends z.ZodType<{ website?: string; startedAt: number }>> {
  input: unknown;
  schema: S;
  toLead: (data: z.output<S>, meta: { reference: string; submittedAt: string }) => Lead;
  allow: (key: string) => boolean;
  clientKey: string;
  channels?: NotificationChannel[];
  now?: Date;
}

/**
 * Shared pipeline for public forms: rate limit → validate → spam checks →
 * deliver. A success result is returned only when at least one configured
 * channel accepted the lead (or, in development, it was logged).
 */
export async function processLead<S extends z.ZodType<{ website?: string; startedAt: number }>>(
  options: ProcessOptions<S>,
): Promise<SubmissionResult> {
  const now = options.now ?? new Date();

  if (!options.allow(options.clientKey)) {
    return {
      ok: false,
      error: "rate_limited",
      message:
        "We have received several requests from you in a short time. Please wait a few minutes and try again.",
    };
  }

  const parsed = options.schema.safeParse(options.input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      message: "Please check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const reference = createReference(todayInSriLanka(now));
  const verdict = checkSpamSignals(parsed.data, now.getTime());
  if (verdict === "honeypot") {
    // Do not reveal the check to automated senders; nothing is delivered.
    return { ok: true, reference };
  }
  if (verdict === "too-fast") {
    return {
      ok: false,
      error: "validation",
      message: "That was very quick! Please check your details and send again.",
    };
  }
  if (verdict === "expired") {
    return {
      ok: false,
      error: "expired",
      message: "This form has expired. Please reload the page and try again.",
    };
  }

  const channels = options.channels ?? configuredChannels();
  if (channels.length === 0 && process.env.NODE_ENV !== "development") {
    console.error("[lead] No delivery channel configured; submission rejected.");
    return {
      ok: false,
      error: "not_configured",
      message: "Online requests are not available at the moment. Please try again later.",
    };
  }

  const lead = options.toLead(parsed.data, { reference, submittedAt: now.toISOString() });
  const outcome = await deliverLead(lead, channels);
  if (outcome.delivered.length === 0) {
    return {
      ok: false,
      error: "delivery_failed",
      message: "We could not send your request just now. Please try again in a few minutes.",
    };
  }
  return { ok: true, reference };
}
