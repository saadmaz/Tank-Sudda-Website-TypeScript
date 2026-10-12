import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
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

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

/** Reads and validates every article file. Invalid content fails the build. */
export const loadAllArticles = cache((): Article[] => {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .sort();
  const articles = files.map((file) => {
    const article = parseArticle({
      id: file,
      raw: fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"),
    });
    if (`${article.slug}.mdx` !== file) {
      throw new ContentValidationError(file, `file name must be "${article.slug}.mdx"`);
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
