/**
 * Site-wide configuration derived from environment variables.
 *
 * The canonical origin is never guessed. Until NEXT_PUBLIC_SITE_URL is set to the
 * verified production domain, the site emits no canonical URLs, an empty sitemap,
 * and asks search engines not to index it.
 */

function parseSiteUrl(raw: string | undefined): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.pathname !== "/" || url.search || url.hash) return null;
    return url;
  } catch {
    return null;
  }
}

export const siteUrl: URL | null = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

/** Indexing requires a verified origin and can be switched off for staging builds. */
export const isIndexingEnabled: boolean = siteUrl !== null && process.env.SITE_NOINDEX !== "1";

/** Returns an absolute URL for a site path, or null when no origin is configured. */
export function absoluteUrl(path: string, origin: URL | null = siteUrl): string | null {
  if (!origin) return null;
  if (!path.startsWith("/")) throw new Error(`Expected a root-relative path, got "${path}"`);
  return new URL(path, origin).toString();
}

/** Whether unpublished content (drafts, unverified areas) may be previewed. */
export const isContentPreview: boolean = process.env.NODE_ENV === "development";
