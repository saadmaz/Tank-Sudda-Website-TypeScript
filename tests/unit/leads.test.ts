import { describe, expect, it, vi } from "vitest";
import { bookingDateWindow, bookingSubmissionSchema } from "@/lib/validation/booking";
import { createReference, leadToText, REFERENCE_PATTERN } from "@/server/leads/format";
import { processLead } from "@/server/leads/submit";
import type { Lead } from "@/server/leads/types";
import { configuredChannels, type NotificationChannel } from "@/server/notifications/channels";
import { createRateLimiter } from "@/server/rate-limit";

const now = new Date();

function submission(overrides: Record<string, unknown> = {}) {
  return {
    service: "water-tank-deep-cleaning",
    propertyType: "house",
    tankType: "overhead-plastic",
    capacity: "under-1000",
    tankCount: 1,
    organisationName: "",
    siteNotes: "",
    town: "Galle",
    address: "1 Example Lane, Galle",
    preferredDate: bookingDateWindow(now).min,
    timeWindow: "flexible",
    notes: "",
    name: "Test Customer",
    phone: "0771234567",
    email: "",
    contactPreference: "phone",
    marketingConsent: false,
    privacyAcknowledged: true,
    website: "",
    startedAt: now.getTime() - 60_000,
    ...overrides,
  };
}

const toLead = (_data: unknown, meta: { reference: string; submittedAt: string }): Lead => ({
  kind: "booking",
  reference: meta.reference,
  submittedAt: meta.submittedAt,
  contact: { name: "Test Customer", phone: "+94771234567", email: null },
  fields: [{ label: "Service", value: "Deep cleaning" }],
  marketingConsent: false,
});

function channel(fail = false): NotificationChannel & { send: ReturnType<typeof vi.fn> } {
  return {
    name: "test",
    send: vi.fn(async () => (fail ? Promise.reject(new Error("down")) : undefined)),
  };
}

const run = (input: unknown, channels: NotificationChannel[], allow = true) =>
  processLead({
    input,
    schema: bookingSubmissionSchema,
    toLead,
    allow: () => allow,
    clientKey: "test",
    channels,
    now,
  });

describe("lead submission pipeline", () => {
  it("delivers a valid request and returns a reference", async () => {
    const ch = channel();
    const result = await run(submission(), [ch]);
    expect(result.ok).toBe(true);
    expect(result.ok && REFERENCE_PATTERN.test(result.reference)).toBe(true);
    expect(ch.send).toHaveBeenCalledOnce();
  });

  it("returns field errors for invalid input without delivering", async () => {
    const ch = channel();
    const result = await run(submission({ phone: "1", address: "" }), [ch]);
    expect(result).toMatchObject({ ok: false, error: "validation" });
    expect(!result.ok && Object.keys(result.fieldErrors ?? {})).toEqual(
      expect.arrayContaining(["phone", "address"]),
    );
    expect(ch.send).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions", async () => {
    const ch = channel();
    const result = await run(submission({ website: "http://spam" }), [ch]);
    // Looks successful to the sender, but nothing is delivered.
    expect(result.ok).toBe(true);
    expect(ch.send).not.toHaveBeenCalled();
  });

  it("rejects forms submitted implausibly fast", async () => {
    const ch = channel();
    const result = await run(submission({ startedAt: now.getTime() - 500 }), [ch]);
    expect(result).toMatchObject({ ok: false, error: "validation" });
    expect(ch.send).not.toHaveBeenCalled();
  });

  it("enforces the rate limit", async () => {
    expect(await run(submission(), [channel()], false)).toMatchObject({
      ok: false,
      error: "rate_limited",
    });
  });

  it("never reports success when no channel is configured outside development", async () => {
    expect(await run(submission(), [])).toMatchObject({ ok: false, error: "not_configured" });
  });

  it("reports failure when every channel fails, success if any succeeds", async () => {
    expect(await run(submission(), [channel(true)])).toMatchObject({
      ok: false,
      error: "delivery_failed",
    });
    expect((await run(submission(), [channel(true), channel()])).ok).toBe(true);
  });
});

describe("lead formatting and configuration", () => {
  it("creates references in the documented format", () => {
    expect(createReference("2026-10-12")).toMatch(/^TS-20261012-[A-HJ-NP-Z2-9]{5}$/);
  });

  it("writes a plain-text summary that says the booking is unconfirmed", () => {
    const text = leadToText(toLead(null, { reference: "TS-20261012-ABCDE", submittedAt: "x" }));
    expect(text).toContain("Service: Deep cleaning");
    expect(text).toContain("request only");
  });

  it("configures channels only from complete environment settings", () => {
    expect(configuredChannels({})).toHaveLength(0);
    expect(configuredChannels({ RESEND_API_KEY: "k", LEAD_EMAIL_FROM: "a@b.lk" })).toHaveLength(0);
    expect(
      configuredChannels({
        RESEND_API_KEY: "k",
        LEAD_EMAIL_FROM: "a@b.lk",
        LEAD_EMAIL_TO: "x@y.lk, z@y.lk",
      }).map((c) => c.name),
    ).toEqual(["email"]);
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(configuredChannels({ LEAD_WEBHOOK_URL: "http://insecure.test" })).toHaveLength(0);
    expect(
      configuredChannels({ LEAD_WEBHOOK_URL: "https://hooks.test/x" }).map((c) => c.name),
    ).toEqual(["webhook"]);
    errors.mockRestore();
  });
});

describe("rate limiter", () => {
  it("allows up to the limit within the window", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("a", 10)).toBe(true);
    expect(limiter.check("a", 20)).toBe(false);
    expect(limiter.check("b", 20)).toBe(true);
    expect(limiter.check("a", 1500)).toBe(true);
  });
});
