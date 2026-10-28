/**
 * Responses for the Markdown versions and llms files. Everything served here
 * is public, built from repository content and identical for every visitor
 * (no cookies or request headers are read), so a shared cache may store it.
 */

const ONE_HOUR = 3600;

async function etag(body: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
  const hex = Array.from(new Uint8Array(digest).slice(0, 16), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `"${hex}"`;
}

export interface TextResponseOptions {
  contentType: "text/markdown" | "text/plain";
  status?: 200 | 404;
  /** Canonical HTML page, sent as a Link header. */
  canonicalUrl?: string;
  /** URL of this representation (e.g. the .md URL when reached via /api/md). */
  contentLocation?: string;
}

export async function textResponse(body: string, options: TextResponseOptions): Promise<Response> {
  const status = options.status ?? 200;
  const headers = new Headers({
    "Content-Type": `${options.contentType}; charset=utf-8`,
    // Markdown copies must not compete with the HTML pages in search results.
    "X-Robots-Tag": "noindex, follow",
    "Cache-Control":
      status === 200
        ? `public, max-age=${ONE_HOUR}, stale-while-revalidate=${ONE_HOUR}`
        : "public, max-age=300",
  });
  if (status === 200) headers.set("ETag", await etag(body));
  if (options.canonicalUrl) headers.set("Link", `<${options.canonicalUrl}>; rel="canonical"`);
  if (options.contentLocation) headers.set("Content-Location", options.contentLocation);
  return new Response(body, { status, headers });
}
