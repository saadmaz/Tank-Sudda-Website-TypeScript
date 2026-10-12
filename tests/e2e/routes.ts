/** Sinhala and Tamil versions of the main pages. */
export const TRANSLATED_ROUTES = ["si", "ta"].flatMap((lang) => [
  `/${lang}`,
  `/${lang}/services`,
  `/${lang}/services/water-tank-deep-cleaning`,
  `/${lang}/services/sump-cleaning`,
  `/${lang}/services/commercial-tank-cleaning`,
  `/${lang}/pricing`,
  `/${lang}/about`,
  `/${lang}/contact`,
  `/${lang}/faq`,
]);

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
  ...TRANSLATED_ROUTES,
];

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
  // Only listed languages exist, and only for the translated pages.
  "/fr",
  "/si/book",
  "/ta/blog",
  "/si/services/window-cleaning",
] as const;
