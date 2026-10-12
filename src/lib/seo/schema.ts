/**
 * JSON-LD builders. Every value comes from verified data; optional facts
 * (phone, address, prices, ratings) are omitted when unknown. Review ratings
 * are never emitted.
 */
import { getPublishedAreas } from "@/data/areas";
import { business, getProfileUrls, type Business } from "@/data/business";
import type { Faq } from "@/data/faqs";
import { describePrice, getPriceEntry, isDisplayablePrice } from "@/data/pricing";
import type { Service } from "@/data/services";
import type { Article } from "@/lib/content/articles";
import { DEFAULT_OG_IMAGE_PATH } from "@/lib/seo/metadata";
import { absoluteUrl, siteUrl } from "@/lib/site";

export type JsonLdObject = Record<string, unknown> & { "@type": string };

const CONTEXT = "https://schema.org";

function organizationRef(origin: URL | null): Record<string, string> {
  const url = absoluteUrl("/", origin);
  return url ? { "@id": `${url}#organization` } : { "@type": "Organization", name: business.name };
}

function areaServed(): unknown {
  const areas = getPublishedAreas();
  return areas.length > 0
    ? areas.map((area) => ({ "@type": "AdministrativeArea", name: `${area.name}, Sri Lanka` }))
    : { "@type": "Country", name: business.countryName };
}

/** Organization, upgraded to LocalBusiness only once a verified address exists. */
export function organizationSchema(
  b: Business = business,
  origin: URL | null = siteUrl,
): JsonLdObject {
  const url = absoluteUrl("/", origin);
  const schema: JsonLdObject = {
    "@context": CONTEXT,
    "@type": b.address ? "LocalBusiness" : "Organization",
    name: b.name,
    description: b.description,
    areaServed: areaServed(),
  };
  if (url) {
    schema["@id"] = `${url}#organization`;
    schema.url = url;
  }
  if (b.legalName) schema.legalName = b.legalName;
  if (b.phone) schema.telephone = b.phone.e164;
  if (b.email) schema.email = b.email;
  if (b.foundingYear) schema.foundingDate = String(b.foundingYear);
  const profiles = getProfileUrls(b);
  if (profiles.length > 0) schema.sameAs = profiles;
  if (b.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: b.address.streetAddress,
      addressLocality: b.address.locality,
      addressRegion: b.address.region,
      ...(b.address.postalCode ? { postalCode: b.address.postalCode } : {}),
      addressCountry: b.address.country,
    };
  }
  if (b.openingHours.length > 0) {
    schema.openingHoursSpecification = b.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.days,
      opens: hours.opens,
      closes: hours.closes,
    }));
  }
  return schema;
}

export function websiteSchema(origin: URL | null = siteUrl): JsonLdObject | null {
  const url = absoluteUrl("/", origin);
  if (!url) return null;
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    name: business.name,
    url,
    inLanguage: "en-LK",
    publisher: organizationRef(origin),
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(
  items: BreadcrumbItem[],
  origin: URL | null = siteUrl,
): JsonLdObject | null {
  if (!origin || items.length === 0) return null;
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, origin),
    })),
  };
}

export function serviceSchema(service: Service, origin: URL | null = siteUrl): JsonLdObject {
  const price = getPriceEntry(service.slug);
  const url = absoluteUrl(`/services/${service.slug}`, origin);
  const schema: JsonLdObject = {
    "@context": CONTEXT,
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    provider: organizationRef(origin),
    areaServed: areaServed(),
  };
  if (url) schema.url = url;
  if (isDisplayablePrice(price)) {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "LKR",
      description: describePrice(price),
      ...(price.model === "from"
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: price.amountLkr,
              priceCurrency: "LKR",
            },
          }
        : { price: price.amountLkr }),
    };
  }
  return schema;
}

export function articleSchema(article: Article, origin: URL | null = siteUrl): JsonLdObject | null {
  const url = article.canonicalUrl ?? absoluteUrl(`/blog/${article.slug}`, origin);
  if (!url || !origin) return null;
  const image = absoluteUrl(article.cover?.src ?? DEFAULT_OG_IMAGE_PATH, origin);
  return {
    "@context": CONTEXT,
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(image ? { image: [image] } : {}),
    author: { "@type": "Organization", name: article.authorName },
    publisher: organizationRef(origin),
    articleSection: article.categoryName,
    ...(article.tags.length > 0 ? { keywords: article.tags.join(", ") } : {}),
    wordCount: article.wordCount,
    inLanguage: "en-LK",
  };
}

export function faqPageSchema(items: Faq[]): JsonLdObject | null {
  if (items.length === 0) return null;
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * Serialises JSON-LD safely for embedding in a <script> element: escaping
 * <, > and & prevents content from closing the script tag.
 */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
