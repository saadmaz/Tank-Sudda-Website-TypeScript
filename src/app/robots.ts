import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexingEnabled } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingEnabled) {
    // No verified production origin (or indexing switched off): keep crawlers out.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/book/thank-you", "/blog/search"],
    },
    sitemap: absoluteUrl("/sitemap.xml") ?? undefined,
  };
}
