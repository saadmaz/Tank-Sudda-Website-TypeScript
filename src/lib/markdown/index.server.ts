import "server-only";
import { getPublishedAreas } from "@/data/areas";
import { gallery } from "@/data/gallery";
import { getPublishableTestimonials } from "@/data/testimonials";
import { filterPublished } from "@/lib/content/articles";
import { loadAllArticles } from "@/lib/content/blog.server";
import { locales, translationsReviewed } from "@/lib/i18n/config";
import { absoluteUrl, isIndexingEnabled, siteUrl } from "@/lib/site";
import { buildMarkdownPages, markdownPath, type MarkdownContext, type MarkdownPage } from "./pages";

/**
 * The publication context for Markdown versions and llms.txt.
 *
 * Unlike the page loaders, this never uses development previews, so drafts
 * and unverified areas cannot appear even in `next dev`. Scheduled articles
 * are judged against the build date (CONTENT_BUILD_DATE, set in
 * next.config.ts), matching the prebuilt HTML pages: a Markdown request
 * served at runtime never publishes an article earlier than its page.
 *
 * Returns null without a verified origin or with indexing switched off, the
 * same conditions under which robots.txt blocks all crawling.
 */
export function getMarkdownContext(): MarkdownContext | null {
  if (!siteUrl || !isIndexingEnabled) return null;
  return {
    origin: siteUrl,
    articles: filterPublished(loadAllArticles(), {
      today: process.env.CONTENT_BUILD_DATE || undefined,
    }),
    areas: getPublishedAreas(false),
    testimonials: getPublishableTestimonials(),
    gallery,
    locales: locales.filter((locale) => translationsReviewed[locale]),
  };
}

let pagesCache: MarkdownPage[] | undefined;

/** Every page with a Markdown version (empty when indexing is disabled). */
export function getMarkdownPages(): MarkdownPage[] {
  if (!pagesCache) {
    const ctx = getMarkdownContext();
    pagesCache = ctx ? buildMarkdownPages(ctx) : [];
  }
  return pagesCache;
}

export function findMarkdownPage(path: string): MarkdownPage | undefined {
  return getMarkdownPages().find((page) => page.path === path);
}

/** Absolute URL of a page's Markdown version, or null if it has none. */
export function markdownAlternateUrl(path: string, origin: URL | null = siteUrl): string | null {
  return findMarkdownPage(path) ? absoluteUrl(markdownPath(path), origin) : null;
}
