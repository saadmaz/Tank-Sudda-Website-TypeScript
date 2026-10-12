import type { MetadataRoute } from "next";
import { getPublishedAreas } from "@/data/areas";
import { gallery } from "@/data/gallery";
import { services } from "@/data/services";
import { getPublishableTestimonials } from "@/data/testimonials";
import { filterPublished } from "@/lib/content/articles";
import { loadAllArticles } from "@/lib/content/blog.server";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { isIndexingEnabled, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries({
    origin: siteUrl,
    indexingEnabled: isIndexingEnabled,
    services,
    // Never include drafts, even in development.
    articles: filterPublished(loadAllArticles()),
    areas: getPublishedAreas(),
    hasGallery: gallery.length > 0,
    hasTestimonials: getPublishableTestimonials().length > 0,
  });
}
