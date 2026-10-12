import { describe, expect, it } from "vitest";
import { areas, getAreaBySlug, getPublishedAreas } from "@/data/areas";
import { business } from "@/data/business";
import { faqs } from "@/data/faqs";
import { describePrice, isDisplayablePrice, pricing, type PriceEntry } from "@/data/pricing";
import { services } from "@/data/services";
import { getPublishableTestimonials, testimonials } from "@/data/testimonials";
import { isValidSlug } from "@/lib/utils";
import {
  bookingEnquiryMessage,
  buildWhatsAppUrl,
  serviceEnquiryMessage,
  toWhatsAppId,
} from "@/lib/whatsapp";

const entry = (overrides: Partial<PriceEntry>): PriceEntry => ({
  serviceSlug: "x",
  model: "from",
  amountLkr: 10000,
  unit: null,
  verified: true,
  notes: null,
  ...overrides,
});

describe("pricing", () => {
  it("never shows unverified or quote-only prices", () => {
    expect(describePrice(undefined)).toBe("Quoted after assessment");
    expect(describePrice(entry({ verified: false }))).toBe("Quoted after assessment");
    expect(describePrice(entry({ model: "quote" }))).toBe("Quoted after assessment");
    expect(describePrice(entry({ amountLkr: null }))).toBe("Quoted after assessment");
    expect(describePrice(entry({ amountLkr: 0 }))).toBe("Quoted after assessment");
  });

  it("formats verified prices in LKR", () => {
    expect(describePrice(entry({ amountLkr: 12500 }))).toBe("From LKR 12,500");
    expect(describePrice(entry({ model: "fixed", amountLkr: 8000, unit: "per tank" }))).toBe(
      "LKR 8,000 per tank",
    );
    expect(isDisplayablePrice(entry({}))).toBe(true);
  });

  it("has a pricing entry for every service and none for unknown services", () => {
    const slugs = services.map((s) => s.slug).sort();
    expect(pricing.map((p) => p.serviceSlug).sort()).toEqual(slugs);
  });
});

describe("whatsapp", () => {
  const phone = { display: "077 000 0000", e164: "+94770000000" };

  it("returns null without a verified number", () => {
    expect(buildWhatsAppUrl(null, "hi")).toBeNull();
    expect(toWhatsAppId({ display: "x", e164: "+12" })).toBeNull();
  });

  it("builds an encoded wa.me link", () => {
    const url = buildWhatsAppUrl(phone, "Hello & welcome\nLine 2");
    expect(url).toBe("https://wa.me/94770000000?text=Hello+%26+welcome%0ALine+2");
    expect(buildWhatsAppUrl(phone)).toBe("https://wa.me/94770000000");
  });

  it("truncates very long messages", () => {
    const url = new URL(buildWhatsAppUrl(phone, "a".repeat(5000))!);
    expect(url.searchParams.get("text")).toHaveLength(1500);
  });

  it("builds context-aware messages", () => {
    expect(serviceEnquiryMessage("Sump Cleaning")).toContain("Sump Cleaning");
    const message = bookingEnquiryMessage({
      serviceName: "Sump Cleaning",
      town: "Kandy",
      tankCount: 2,
      name: "",
    });
    expect(message.split("\n")).toEqual([
      "Hello Tank Sudda, I would like to request a tank cleaning.",
      "Service: Sump Cleaning",
      "Number of tanks: 2",
      "Town / area: Kandy",
    ]);
  });
});

describe("verified business data", () => {
  it("contains no placeholder contact details", () => {
    const serialised = JSON.stringify(business);
    expect(serialised).not.toMatch(/1234567|example\.(com|lk)|xxx/i);
    expect(business.phone?.e164 ?? "+94").toMatch(/^\+\d+$/);
  });

  it("publishes only confirmed areas", () => {
    for (const area of getPublishedAreas()) expect(area.status).toBe("confirmed");
    const unverified = areas.find((a) => a.status === "unverified");
    if (unverified) {
      expect(getAreaBySlug(unverified.slug)).toBeUndefined();
      expect(getAreaBySlug(unverified.slug, true)).toBeDefined();
    }
  });

  it("only publishes consented testimonials", () => {
    expect(getPublishableTestimonials()).toHaveLength(testimonials.length);
  });

  it("uses unique, valid slugs and resolvable references", () => {
    const serviceSlugs = services.map((s) => s.slug);
    expect(new Set(serviceSlugs).size).toBe(serviceSlugs.length);
    const faqIds = new Set(faqs.map((f) => f.id));
    for (const service of services) {
      expect(isValidSlug(service.slug)).toBe(true);
      service.faqIds.forEach((id) => expect(faqIds.has(id), id).toBe(true));
      service.relatedServiceSlugs.forEach((slug) => expect(serviceSlugs).toContain(slug));
      expect(service.metaDescription.length).toBeLessThanOrEqual(160);
    }
    for (const area of areas) {
      expect(isValidSlug(area.slug)).toBe(true);
      area.serviceSlugs.forEach((slug) => expect(serviceSlugs).toContain(slug));
    }
  });
});

describe("class merging", () => {
  it("keeps custom font sizes when combined with text colours", async () => {
    const { cn } = await import("@/lib/utils");
    expect(cn("text-h1 max-w-3xl", "text-white")).toBe("text-h1 max-w-3xl text-white");
    expect(cn("text-h1", "text-h2")).toBe("text-h2");
  });
});

describe("social and Google profiles", () => {
  it("only lists configured profiles, in display order, and feeds structured data", async () => {
    const { business, getProfileUrls, getSocialProfiles } = await import("@/data/business");
    const sample = {
      ...business,
      social: { youtube: "https://www.youtube.com/@x", facebook: "https://www.facebook.com/x" },
      google: { profileUrl: "https://maps.app.goo.gl/x", reviewUrl: null },
    };
    expect(getSocialProfiles(sample).map((p) => p.id)).toEqual(["facebook", "youtube"]);
    expect(getProfileUrls(sample)).toEqual([
      "https://www.facebook.com/x",
      "https://www.youtube.com/@x",
      "https://maps.app.goo.gl/x",
    ]);
  });

  it("configured URLs are https links on the right platform", async () => {
    const { business } = await import("@/data/business");
    const hosts: Record<string, RegExp> = {
      facebook: /(^|\.)facebook\.com$/,
      instagram: /(^|\.)instagram\.com$/,
      tiktok: /(^|\.)tiktok\.com$/,
      youtube: /(^|\.)youtube\.com$/,
      x: /^(www\.)?(x|twitter)\.com$/,
      threads: /(^|\.)threads\.(net|com)$/,
      linkedin: /(^|\.)linkedin\.com$/,
    };
    for (const [platform, url] of Object.entries(business.social)) {
      const parsed = new URL(url);
      expect(parsed.protocol, platform).toBe("https:");
      expect(parsed.hostname, platform).toMatch(hosts[platform]!);
    }
    for (const url of [business.google.profileUrl, business.google.reviewUrl]) {
      if (url) expect(new URL(url).protocol).toBe("https:");
    }
  });
});
