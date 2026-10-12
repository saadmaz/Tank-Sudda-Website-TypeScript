import type { Metadata, Viewport } from "next";
import { business } from "@/data/business";
import {
  defaultLocale,
  htmlLang,
  localeHref,
  locales,
  ogLocale,
  translationsReviewed,
  type Locale,
} from "@/lib/i18n/config";
import { absoluteUrl, isIndexingEnabled, siteUrl } from "@/lib/site";

export const DEFAULT_OG_IMAGE_PATH = "/social-card.png";

export interface PageMetadataInput {
  /** Page title without the brand suffix. */
  title: string;
  description: string;
  /** Root-relative path of the page, e.g. "/services". */
  path: string;
  /** Use the title verbatim (no " | Tank Sudda" suffix). */
  absoluteTitle?: boolean;
  noIndex?: boolean;
  /** Overrides the computed canonical (e.g. for syndicated articles). */
  canonicalUrl?: string;
  ogType?: "website" | "article";
  image?: { src: string; alt: string; width: number; height: number };
  article?: { publishedTime: string; modifiedTime?: string; tags?: string[]; authors?: string[] };
  /** Language of the page (default English). */
  locale?: Locale;
}

export function buildMetadata(input: PageMetadataInput, origin: URL | null = siteUrl): Metadata {
  const canonical = input.canonicalUrl ?? absoluteUrl(input.path, origin);
  const imageUrl = absoluteUrl(input.image?.src ?? DEFAULT_OG_IMAGE_PATH, origin);
  const images = imageUrl
    ? [
        {
          url: imageUrl,
          alt: input.image?.alt ?? `${business.name}: water tank and sump cleaning in Sri Lanka`,
          width: input.image?.width ?? 1200,
          height: input.image?.height ?? 630,
        },
      ]
    : undefined;

  const fullTitle = input.absoluteTitle ? input.title : `${input.title} | ${business.name}`;

  const metadata: Metadata = {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    openGraph: {
      type: input.ogType ?? "website",
      siteName: business.name,
      locale: ogLocale[input.locale ?? defaultLocale],
      title: fullTitle,
      description: input.description,
      ...(canonical ? { url: canonical } : {}),
      ...(images ? { images } : {}),
      ...(input.article
        ? {
            publishedTime: input.article.publishedTime,
            modifiedTime: input.article.modifiedTime,
            tags: input.article.tags,
            authors: input.article.authors,
          }
        : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: fullTitle,
      description: input.description,
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
  };

  if (canonical) metadata.alternates = { canonical };
  // Without a verified origin the root layout already blocks indexing site-wide.
  if (input.noIndex && origin && isIndexingEnabled) {
    metadata.robots = { index: false, follow: true };
  }
  return metadata;
}

/**
 * hreflang links for a page that exists in several languages. Only languages
 * whose translations have been reviewed are listed; with English alone there
 * is nothing to declare, so null is returned.
 */
export function languageAlternates(
  basePath: string,
  origin: URL | null = siteUrl,
  reviewed: Record<Locale, boolean> = translationsReviewed,
): Record<string, string> | null {
  const published = locales.filter((locale) => reviewed[locale]);
  if (!origin || published.length < 2) return null;
  const languages: Record<string, string> = {};
  for (const locale of published) {
    languages[htmlLang[locale]] = absoluteUrl(localeHref(locale, basePath), origin)!;
  }
  languages["x-default"] = absoluteUrl(basePath, origin)!;
  return languages;
}

/**
 * Metadata for a page that exists in English, Sinhala and Tamil. `basePath` is
 * the English path. Unreviewed translations are kept out of search results.
 */
export function buildLocalizedMetadata(
  locale: Locale,
  basePath: string,
  input: Omit<PageMetadataInput, "path" | "locale">,
  origin: URL | null = siteUrl,
): Metadata {
  const metadata = buildMetadata(
    {
      ...input,
      path: localeHref(locale, basePath),
      locale,
      noIndex: input.noIndex || !translationsReviewed[locale],
    },
    origin,
  );
  const languages = translationsReviewed[locale] ? languageAlternates(basePath, origin) : null;
  if (languages) metadata.alternates = { ...metadata.alternates, languages };
  return metadata;
}

export const siteViewport: Viewport = {
  themeColor: "#061c36",
  width: "device-width",
  initialScale: 1,
};

/** Site-wide metadata defaults applied by the root layouts. */
export function rootMetadata(): Metadata {
  const verification = process.env.GOOGLE_SITE_VERIFICATION;
  return {
    ...(siteUrl ? { metadataBase: siteUrl } : {}),
    title: {
      default: `${business.name} | Water Tank & Sump Cleaning in Sri Lanka`,
      template: `%s | ${business.name}`,
    },
    description: business.description,
    applicationName: business.name,
    formatDetection: { telephone: false, email: false, address: false },
    robots: isIndexingEnabled
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    ...(verification ? { verification: { google: verification } } : {}),
  };
}
