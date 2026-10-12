/** Public routes expected to render (HTTP 200) in a default production build. */
export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/water-tank-deep-cleaning",
  "/services/sump-cleaning",
  "/services/commercial-tank-cleaning",
  "/pricing",
  "/book",
  "/book/thank-you",
  "/gallery",
  "/testimonials",
  "/areas",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/cookies",
  "/blog",
  "/blog/how-often-should-you-clean-your-water-tank",
  "/blog/category/maintenance",
  "/blog/tag/sediment",
  "/blog/search?q=sediment",
  "/guides",
] as const;

/** Routes that must return HTTP 404. */
export const MISSING_ROUTES = [
  "/this-page-does-not-exist",
  "/services/window-cleaning",
  "/blog/not-a-real-article",
  "/blog/category/plumbing",
  "/blog/tag/not-a-tag",
  "/blog/page/1",
  "/blog/page/2",
  // Unverified draft service area: never published.
  "/areas/colombo",
] as const;
