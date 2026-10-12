import { describe, expect, it } from "vitest";
import { business } from "@/data/business";
import { faqs } from "@/data/faqs";
import { en, type Dictionary } from "@/data/i18n/en";
import { si } from "@/data/i18n/si";
import { ta } from "@/data/i18n/ta";
import { footerNav, legalNav, primaryNav } from "@/data/navigation";
import { services } from "@/data/services";
import { isActivePath } from "@/components/layout/NavLinks";
import {
  isTranslatedPath,
  localeHref,
  splitLocalePath,
  switchLocalePath,
  translationsReviewed,
} from "@/lib/i18n/config";
import {
  describeServicePrice,
  getLocalizedFaqs,
  getLocalizedServices,
  localizeNav,
} from "@/lib/i18n/dictionary";
import { buildLocalizedMetadata, languageAlternates } from "@/lib/seo/metadata";
import { buildSitemapEntries } from "@/lib/seo/sitemap";

const origin = new URL("https://www.example-tank.test");
const translations: [string, Dictionary][] = [
  ["si", si],
  ["ta", ta],
];

/** Every string inside a value, however deeply nested. Functions are called with a sample. */
function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value === "function") return collectStrings(value("Sample"));
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

describe("language paths", () => {
  it("leaves English paths unchanged", () => {
    expect(localeHref("en", "/services")).toBe("/services");
    expect(localeHref("en", "/")).toBe("/");
  });

  it("prefixes translated pages", () => {
    expect(localeHref("si", "/")).toBe("/si");
    expect(localeHref("ta", "/services/sump-cleaning")).toBe("/ta/services/sump-cleaning");
    expect(localeHref("si", "/faq")).toBe("/si/faq");
  });

  it("keeps English-only pages in English", () => {
    expect(localeHref("si", "/book")).toBe("/book");
    expect(localeHref("ta", "/book?service=sump-cleaning")).toBe("/book?service=sump-cleaning");
    expect(localeHref("si", "/blog/understanding-sediment-in-water-tanks")).toBe(
      "/blog/understanding-sediment-in-water-tanks",
    );
    expect(isTranslatedPath("/privacy")).toBe(false);
  });

  it("splits a path into language and English path", () => {
    expect(splitLocalePath("/si/services")).toEqual({ locale: "si", basePath: "/services" });
    expect(splitLocalePath("/ta")).toEqual({ locale: "ta", basePath: "/" });
    expect(splitLocalePath("/services")).toEqual({ locale: "en", basePath: "/services" });
    // A path that merely starts with the letters is not a language prefix.
    expect(splitLocalePath("/simple")).toEqual({ locale: "en", basePath: "/simple" });
  });

  it("switches to the same page in another language, or that language's home page", () => {
    expect(switchLocalePath("/services/sump-cleaning", "si")).toBe("/si/services/sump-cleaning");
    expect(switchLocalePath("/si/pricing", "ta")).toBe("/ta/pricing");
    expect(switchLocalePath("/ta/about", "en")).toBe("/about");
    expect(switchLocalePath("/blog/some-article", "si")).toBe("/si");
    expect(switchLocalePath("/book", "en")).toBe("/");
  });

  it("marks a language home page active only on itself", () => {
    expect(isActivePath("/si", "/si")).toBe(true);
    expect(isActivePath("/si/services", "/si")).toBe(false);
    expect(isActivePath("/si/services/sump-cleaning", "/si/services")).toBe(true);
    expect(isActivePath("/services", "/")).toBe(false);
  });
});

describe("translations", () => {
  it.each(translations)("%s covers every service with matching list lengths", (_, dict) => {
    for (const service of services) {
      const text = dict.content.services[service.slug];
      expect(text, service.slug).toBeDefined();
      expect(text?.suitableFor).toHaveLength(service.suitableFor.length);
      expect(text?.whatItInvolves).toHaveLength(service.whatItInvolves.length);
      expect(text?.process).toHaveLength(service.process.length);
      expect(text?.beforeYouBook).toHaveLength(service.beforeYouBook.length);
      expect(text?.sections).toHaveLength(service.sections.length);
      text?.sections.forEach((section, index) => {
        expect(section.paragraphs).toHaveLength(service.sections[index]?.paragraphs.length ?? 0);
      });
    }
  });

  it.each(translations)("%s covers every FAQ", (_, dict) => {
    for (const faq of faqs) expect(dict.content.faqs[faq.id], faq.id).toBeDefined();
  });

  it.each(translations)("%s keeps list lengths in step with English", (_, dict) => {
    expect(dict.content.customerJourney).toHaveLength(en.content.customerJourney.length);
    expect(dict.content.commitments).toHaveLength(en.content.commitments.length);
    expect(dict.content.pricingFactors).toHaveLength(en.content.pricingFactors.length);
    expect(dict.content.quotationSteps).toHaveLength(en.content.quotationSteps.length);
    expect(dict.hero.assurances).toHaveLength(en.hero.assurances.length);
    expect(dict.why.points).toHaveLength(en.why.points.length);
    expect(dict.aboutPage.storyParagraphs).toHaveLength(en.aboutPage.storyParagraphs.length);
  });

  it.each(translations)("%s labels every navigation link", (_, dict) => {
    const labels: Record<string, string> = dict.nav;
    const links = [...primaryNav, ...footerNav.flatMap((group) => group.links), ...legalNav];
    for (const link of links) expect(labels[link.href], link.href).toBeTruthy();
  });

  it.each(translations)("%s has no em dashes and keeps the business name in Latin", (_, dict) => {
    const strings = collectStrings(dict);
    expect(strings.filter((text) => text.includes("—"))).toEqual([]);
    expect(strings.some((text) => text.includes(business.name))).toBe(true);
  });

  it("are not published to search engines until reviewed", () => {
    expect(translationsReviewed.en).toBe(true);
    expect(translationsReviewed.si).toBe(false);
    expect(translationsReviewed.ta).toBe(false);
  });
});

describe("localized data", () => {
  it("returns English data unchanged", () => {
    expect(getLocalizedServices("en")).toEqual(services);
    expect(getLocalizedFaqs("en")).toEqual(faqs);
    expect(localizeNav("en", primaryNav)).toEqual(primaryNav);
  });

  it("swaps in translated text and keeps the structure", () => {
    const [deep] = getLocalizedServices("si");
    expect(deep?.slug).toBe("water-tank-deep-cleaning");
    expect(deep?.name).toBe(si.content.services["water-tank-deep-cleaning"]?.name);
    expect(deep?.faqIds).toEqual(services[0]?.faqIds);
  });

  it("points translated navigation at the same language", () => {
    const nav = localizeNav("ta", primaryNav);
    const services = nav.find((link) => link.label === ta.nav["/services"]);
    expect(services?.href).toBe("/ta/services");
    // Guides are English-only, so the link stays on the English page.
    expect(nav.some((link) => link.href === "/guides")).toBe(true);
  });

  it("describes unpublished prices in each language", () => {
    expect(describeServicePrice("en", "sump-cleaning")).toBe("Quoted after assessment");
    expect(describeServicePrice("si", "sump-cleaning")).toBe(si.common.quotedAfterAssessment);
  });
});

describe("language SEO", () => {
  it("declares no hreflang links while English is the only reviewed language", () => {
    expect(languageAlternates("/services", origin)).toBeNull();
  });

  it("lists reviewed languages with an x-default", () => {
    expect(languageAlternates("/services", origin, { en: true, si: true, ta: false })).toEqual({
      "en-LK": "https://www.example-tank.test/services",
      "si-LK": "https://www.example-tank.test/si/services",
      "x-default": "https://www.example-tank.test/services",
    });
  });

  it("uses the translated path as canonical", () => {
    const metadata = buildLocalizedMetadata("si", "/pricing", si.pricingPage.meta, origin);
    expect(metadata.alternates?.canonical).toBe("https://www.example-tank.test/si/pricing");
    expect(metadata.openGraph?.locale).toBe("si_LK");
  });

  it("adds translated pages to the sitemap only when asked", () => {
    const base = {
      origin,
      indexingEnabled: true,
      services,
      articles: [],
      areas: [],
      hasGallery: false,
      hasTestimonials: false,
    };
    const without = buildSitemapEntries(base).map((entry) => entry.url);
    expect(without.some((url) => url.includes("/si"))).toBe(false);
    const withSinhala = buildSitemapEntries({ ...base, translatedLocales: ["si"] }).map(
      (entry) => entry.url,
    );
    expect(withSinhala).toContain("https://www.example-tank.test/si");
    expect(withSinhala).toContain("https://www.example-tank.test/si/services/sump-cleaning");
    expect(withSinhala.some((url) => url.includes("/ta"))).toBe(false);
  });
});
