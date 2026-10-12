import { describe, expect, it } from "vitest";
import {
  bookingDateWindow,
  bookingSchema,
  bookingSubmissionSchema,
  getActiveSteps,
  isDateInBookingWindow,
  type BookingInput,
} from "@/lib/validation/booking";
import { checkSpamSignals, normalisePhone } from "@/lib/validation/common";
import { contactSchema } from "@/lib/validation/contact";

describe("phone numbers", () => {
  it.each([
    ["077 123 4567", "+94771234567"],
    ["0771234567", "+94771234567"],
    ["+94 77 123 4567", "+94771234567"],
    ["0094771234567", "+94771234567"],
    ["011-234-5678", "+94112345678"],
    ["+44 20 7946 0958", "+442079460958"],
  ])("normalises %s", (input, expected) => {
    expect(normalisePhone(input)).toBe(expected);
  });

  it.each(["12345", "077 123", "+94 77 123", "abc", "0071234567"])("rejects %s", (input) => {
    expect(normalisePhone(input)).toBeNull();
  });
});

describe("booking date window", () => {
  // 2026-10-12 20:00 UTC is already 2026-10-13 in Sri Lanka (UTC+5:30).
  const now = new Date("2026-10-12T20:00:00Z");

  it("starts tomorrow in Sri Lanka time", () => {
    expect(bookingDateWindow(now)).toEqual({ min: "2026-10-14", max: "2027-04-11" });
  });

  it("accepts dates inside the window only", () => {
    expect(isDateInBookingWindow("2026-10-14", now)).toBe(true);
    expect(isDateInBookingWindow("2026-10-13", now)).toBe(false);
    expect(isDateInBookingWindow("2027-04-12", now)).toBe(false);
    expect(isDateInBookingWindow("not-a-date", now)).toBe(false);
  });
});

function validBooking(): BookingInput {
  const { min } = bookingDateWindow();
  return {
    service: "sump-cleaning",
    propertyType: "house",
    tankType: "sump",
    capacity: "1000-2500",
    tankCount: 1,
    organisationName: "",
    siteNotes: "",
    town: "Kandy",
    address: "12 Example Road, Kandy",
    preferredDate: min,
    timeWindow: "morning",
    notes: "",
    name: "Test Customer",
    phone: "077 123 4567",
    email: "",
    contactPreference: "phone",
    marketingConsent: false,
    privacyAcknowledged: true,
  };
}

describe("booking schema", () => {
  it("accepts a complete request", () => {
    expect(bookingSchema.safeParse(validBooking()).success).toBe(true);
  });

  it("requires privacy acknowledgement", () => {
    const result = bookingSchema.safeParse({ ...validBooking(), privacyAcknowledged: false });
    expect(result.success).toBe(false);
  });

  it("requires an email when email contact is preferred", () => {
    const result = bookingSchema.safeParse({ ...validBooking(), contactPreference: "email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["email"]);
    expect(
      bookingSchema.safeParse({ ...validBooking(), contactPreference: "email", email: "a@b.lk" })
        .success,
    ).toBe(true);
  });

  it("reports the email rule even while other fields are still invalid", () => {
    const result = bookingSchema.safeParse({
      ...validBooking(),
      contactPreference: "email",
      privacyAcknowledged: false,
    });
    const paths = result.error?.issues.map((issue) => issue.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["email", "privacyAcknowledged"]));
  });

  it.each([
    ["unknown service", { service: "painting" }],
    ["zero tanks", { tankCount: 0 }],
    ["past date", { preferredDate: "2020-01-01" }],
    ["bad phone", { phone: "123" }],
    ["bad email", { email: "nope" }],
    ["short address", { address: "x" }],
    ["long notes", { notes: "a".repeat(1001) }],
  ])("rejects %s", (_label, overrides) => {
    expect(bookingSchema.safeParse({ ...validBooking(), ...overrides }).success).toBe(false);
  });

  it("server schema requires the anti-spam fields", () => {
    expect(bookingSubmissionSchema.safeParse(validBooking()).success).toBe(false);
    expect(
      bookingSubmissionSchema.safeParse({ ...validBooking(), startedAt: 1, website: "" }).success,
    ).toBe(true);
  });

  it("adds the site step only for larger properties", () => {
    expect(getActiveSteps({ propertyType: "house" }).map((s) => s.id)).not.toContain("site");
    expect(getActiveSteps({ propertyType: "apartment-building" }).map((s) => s.id)).toContain(
      "site",
    );
    expect(getActiveSteps({}).at(-1)?.id).toBe("review");
  });
});

describe("contact schema", () => {
  const base = {
    name: "Test",
    phone: "",
    email: "test@example.org",
    topic: "general" as const,
    message: "A question about sump cleaning.",
    privacyAcknowledged: true as const,
  };

  it("needs at least one contact method", () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
    expect(contactSchema.safeParse({ ...base, email: "" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, email: "", phone: "0771234567" }).success).toBe(true);
  });
});

describe("spam signals", () => {
  const now = 1_000_000_000;
  it("classifies submissions", () => {
    expect(checkSpamSignals({ website: "x", startedAt: now - 60_000 }, now)).toBe("honeypot");
    expect(checkSpamSignals({ startedAt: now - 1_000 }, now)).toBe("too-fast");
    expect(checkSpamSignals({ startedAt: now - 2 * 86_400_000 }, now)).toBe("expired");
    expect(checkSpamSignals({ website: "", startedAt: now - 60_000 }, now)).toBe("ok");
  });
});
