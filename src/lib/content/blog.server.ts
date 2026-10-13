import "server-only";
import { cache } from "react";
import { articleSources } from "@/content/blog/articles.generated";
import { services } from "@/data/services";
import { isContentPreview } from "@/lib/site";
import {
  collectTags,
  ContentValidationError,
  filterPublished,
  parseArticle,
  validateCollection,
  type Article,
} from "./articles";

/**
 * Parses and validates every article. Invalid content fails the build.
 * Articles come from a generated module (`bun run content`), not the file
 * system, so this also works on Cloudflare Workers.
 */
export const loadAllArticles = cache((): Article[] => {
  const articles = articleSources.map(({ id, raw }) => {
    const article = parseArticle({ id, raw });
    if (`${article.slug}.mdx` !== id) {
      throw new ContentValidationError(id, `file name must be "${article.slug}.mdx"`);
    }
    return article;
  });
  validateCollection(
    articles,
    services.map((service) => service.slug),
  );
  return articles;
});

export function getPublishedArticles(): Article[] {
  return filterPublished(loadAllArticles(), { preview: isContentPreview });
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return getPublishedArticles().filter((article) => article.category === category);
}

export function getArticlesByTag(tag: string): Article[] {
  return getPublishedArticles().filter((article) => article.tags.includes(tag));
}

export function getAllTags(): { tag: string; count: number }[] {
  return collectTags(getPublishedArticles());
}

export function getArticlesBySlugs(slugs: readonly string[]): Article[] {
  const published = getPublishedArticles();
  return slugs.flatMap((slug) => {
    const article = published.find((item) => item.slug === slug);
    return article ? [article] : [];
  });
}
