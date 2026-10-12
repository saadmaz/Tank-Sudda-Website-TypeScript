import type { MetadataRoute } from "next";
import type { ServiceArea } from "@/data/areas";
import { ARTICLES_PER_PAGE, blogCategoryKeys } from "@/data/blog";
import type { Service } from "@/data/services";
import type { Article } from "@/lib/content/articles";
import { localeHref, TRANSLATED_STATIC_PATHS, type PrefixedLocale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/site";

export interface SitemapInput {
  origin: URL | null;
  indexingEnabled: boolean;
  services: Service[];
  /** Published articles only. */
  articles: Article[];
  /** Confirmed areas only. */
  areas: ServiceArea[];
  hasGallery: boolean;
  hasTestimonials: boolean;
  /** Sinhala/Tamil versions to list. Only languages whose translations have been reviewed. */
  translatedLocales?: readonly PrefixedLocale[];
}

/** Static, indexable routes. Utility pages (search, thank-you) are excluded. */
export const STATIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/pricing",
  "/book",
  "/areas",
  "/contact",
  "/faq",
  "/blog",
  "/guides",
  "/privacy",
  "/terms",
  "/cookies",
] as const;

/**
 * Builds sitemap entries for public, indexable pages only. Returns an empty
 * list when no verified origin is configured or indexing is disabled.
 */
export function buildSitemapEntries(input: SitemapInput): MetadataRoute.Sitemap {
  const { origin } = input;
  if (!origin || !input.indexingEnabled) return [];
  const url = (path: string) => absoluteUrl(path, origin)!;

  const paths: { path: string; lastModified?: string }[] = STATIC_ROUTES.map((path) => ({ path }));
  if (input.hasGallery) paths.push({ path: "/gallery" });
  if (input.hasTestimonials) paths.push({ path: "/testimonials" });

  for (const service of input.services) paths.push({ path: `/services/${service.slug}` });

  for (const locale of input.translatedLocales ?? []) {
    for (const path of TRANSLATED_STATIC_PATHS) paths.push({ path: localeHref(locale, path) });
    for (const service of input.services) {
      paths.push({ path: localeHref(locale, `/services/${service.slug}`) });
    }
  }
  for (const area of input.areas) paths.push({ path: `/areas/${area.slug}` });

  const indexableArticles = input.articles.filter(
    (article) => !article.draft && !article.noindex && !article.canonicalUrl,
  );
  for (const article of indexableArticles) {
    paths.push({
      path: `/blog/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt,
    });
  }
  for (const category of blogCategoryKeys) {
    if (input.articles.some((article) => article.category === category)) {
      paths.push({ path: `/blog/category/${category}` });
    }
  }
  const totalPages = Math.ceil(input.articles.length / ARTICLES_PER_PAGE);
  for (let page = 2; page <= totalPages; page++) paths.push({ path: `/blog/page/${page}` });

  return paths.map(({ path, lastModified }) => ({
    url: url(path),
    ...(lastModified ? { lastModified } : {}),
  }));
}
