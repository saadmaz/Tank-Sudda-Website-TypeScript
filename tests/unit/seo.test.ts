import { describe, expect, it } from "vitest";
import { areas, type ServiceArea } from "@/data/areas";
import { business } from "@/data/business";
import { services } from "@/data/services";
import { parseArticle, type Article } from "@/lib/content/articles";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  organizationSchema,
  serializeJsonLd,
  serviceSchema,
} from "@/lib/seo/schema";
import { buildSitemapEntries, STATIC_ROUTES } from "@/lib/seo/sitemap";
import { absoluteUrl } from "@/lib/site";

const origin = new URL("https://www.example-tank.test");

function makeArticle(slug: string, overrides: Partial<Article> = {}): Article {
  const raw = `---\ntitle: Article ${slug} title\nslug: ${slug}\ndescription: A description that is long enough to pass the minimum length rule.\nauthor: tank-sudda-team\npublishedAt: 2026-01-01\ncategory: maintenance\n---\n## Heading\n\nBody.`;
  return { ...parseArticle({ id: slug, raw }), ...overrides };
}

describe("absolute URLs", () => {
  it("are null without a configured origin", () => {
    expect(absoluteUrl("/services", null)).toBeNull();
  });

  it("join paths onto the origin", () => {
    expect(absoluteUrl("/services/sump-cleaning", origin)).toBe(
      "https://www.example-tank.test/services/sump-cleaning",
    );
    expect(() => absoluteUrl("relative", origin)).toThrow();
  });
});

describe("metadata", () => {
  it("omits canonical and OG URLs when no origin is configured", () => {
    const metadata = buildMetadata({ title: "Pricing", description: "d", path: "/pricing" }, null);
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph?.url).toBeUndefined();
    expect(metadata.title).toBe("Pricing");
  });

  it("emits absolute canonical and OG image URLs with an origin", () => {
    const metadata = buildMetadata(
      { title: "Pricing", description: "d", path: "/pricing" },
      origin,
    );
    expect(metadata.alternates?.canonical).toBe("https://www.example-tank.test/pricing");
    expect(JSON.stringify(metadata.openGraph)).toContain(
      "https://www.example-tank.test/social-card.png",
    );
  });

  it("supports absolute titles and canonical overrides", () => {
    const metadata = buildMetadata(
      {
        title: "Home",
        absoluteTitle: true,
        description: "d",
        path: "/",
        canonicalUrl: "https://other.test/a",
      },
      origin,
    );
    expect(metadata.title).toEqual({ absolute: "Home" });
    expect(metadata.alternates?.canonical).toBe("https://other.test/a");
  });
});

describe("structured data", () => {
  it("uses only verified business facts and never ratings", () => {
    const schema = organizationSchema(
      { ...business, phone: null, email: null, address: null },
      origin,
    );
    expect(schema["@type"]).toBe("Organization");
    expect(schema).not.toHaveProperty("telephone");
    expect(schema).not.toHaveProperty("address");
    expect(JSON.stringify(schema)).not.toMatch(/aggregateRating|review/i);
  });

  it("becomes LocalBusiness only with a verified address", () => {
    const schema = organizationSchema(
      {
        ...business,
        address: {
          streetAddress: "1 Road",
          locality: "Kandy",
          region: "Central",
          postalCode: null,
          country: "LK",
        },
      },
      origin,
    );
    expect(schema["@type"]).toBe("LocalBusiness");
  });

  it("omits offers for unverified prices", () => {
    for (const service of services)
      expect(serviceSchema(service, origin)).not.toHaveProperty("offers");
  });

  it("builds breadcrumbs only with an origin", () => {
    expect(breadcrumbSchema([{ name: "Home", path: "/" }], null)).toBeNull();
    expect(JSON.stringify(breadcrumbSchema([{ name: "Home", path: "/" }], origin))).toContain(
      "https://www.example-tank.test/",
    );
  });

  it("escapes characters that could close the script tag", () => {
    const output = serializeJsonLd({ "@type": "Thing", name: "</script><b>&" });
    expect(output).not.toContain("<");
    expect(output).not.toContain(">");
    expect(JSON.parse(output).name).toBe("</script><b>&");
  });
});

describe("sitemap", () => {
  const confirmed: ServiceArea = { ...areas[0]!, slug: "kandy", status: "confirmed" };
  const base = {
    origin,
    indexingEnabled: true,
    services,
    articles: [
      makeArticle("published"),
      makeArticle("hidden", { noindex: true }),
      makeArticle("syndicated", { canonicalUrl: "https://x.test/a" }),
    ],
    areas: [confirmed],
    hasGallery: false,
    hasTestimonials: false,
  };

  it("is empty without an origin or when indexing is disabled", () => {
    expect(buildSitemapEntries({ ...base, origin: null })).toEqual([]);
    expect(buildSitemapEntries({ ...base, indexingEnabled: false })).toEqual([]);
  });

  it("lists only public, indexable routes", () => {
    const urls = buildSitemapEntries(base).map((entry) => entry.url.replace(origin.origin, ""));
    for (const route of STATIC_ROUTES) expect(urls).toContain(route);
    for (const service of services) expect(urls).toContain(`/services/${service.slug}`);
    expect(urls).toContain("/blog/published");
    expect(urls).toContain("/areas/kandy");
    expect(urls).toContain("/blog/category/maintenance");
    expect(urls).not.toContain("/blog/hidden");
    expect(urls).not.toContain("/blog/syndicated");
    expect(urls).not.toContain("/gallery");
    expect(urls).not.toContain("/testimonials");
    expect(urls).not.toContain("/blog/category/choosing-a-service");
    expect(
      urls.some(
        (url) => url.includes("thank-you") || url.includes("search") || url.includes("/tag/"),
      ),
    ).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("includes gallery and testimonials once they have content", () => {
    const urls = buildSitemapEntries({ ...base, hasGallery: true, hasTestimonials: true }).map(
      (e) => e.url,
    );
    expect(urls).toContain("https://www.example-tank.test/gallery");
    expect(urls).toContain("https://www.example-tank.test/testimonials");
  });
});
