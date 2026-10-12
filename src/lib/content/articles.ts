/**
 * Pure article parsing, validation and querying. No filesystem access lives
 * here, so this module is unit-testable and can be reused when articles move
 * to a CMS: a CMS adapter only needs to produce the same `ArticleSource`.
 */
import GithubSlugger from "github-slugger";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import {
  blogAuthorKeys,
  blogAuthors,
  blogCategories,
  blogCategoryKeys,
  RESERVED_ARTICLE_SLUGS,
} from "@/data/blog";
import { todayInSriLanka } from "@/lib/dates";
import { SLUG_PATTERN } from "@/lib/utils";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "Invalid date");

const slug = z.string().regex(SLUG_PATTERN, "Use lowercase letters, numbers and hyphens");

export const frontmatterSchema = z
  .object({
    title: z.string().min(10).max(120),
    slug: slug.refine(
      (value) => !(RESERVED_ARTICLE_SLUGS as readonly string[]).includes(value),
      "This slug is reserved by a blog route",
    ),
    description: z.string().min(50).max(220),
    author: z.enum(blogAuthorKeys),
    publishedAt: isoDate,
    updatedAt: isoDate.optional(),
    category: z.enum(blogCategoryKeys),
    tags: z.array(slug).max(8).default([]),
    cover: z
      .object({
        src: z.string().startsWith("/images/"),
        alt: z.string().min(5),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .strict()
      .optional(),
    draft: z.boolean().default(false),
    seoTitle: z.string().max(70).optional(),
    seoDescription: z.string().max(170).optional(),
    canonicalUrl: z.url({ protocol: /^https$/ }).optional(),
    relatedServices: z.array(slug).default([]),
    relatedArticles: z.array(slug).default([]),
    noindex: z.boolean().default(false),
  })
  .strict()
  .refine((data) => !data.updatedAt || data.updatedAt >= data.publishedAt, {
    message: "updatedAt must not be earlier than publishedAt",
    path: ["updatedAt"],
  });

export type ArticleFrontmatter = z.infer<typeof frontmatterSchema>;

export interface ArticleSource {
  /** File name or CMS identifier, used in error messages. */
  id: string;
  raw: string;
}

export interface TocHeading {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface Article extends ArticleFrontmatter {
  body: string;
  authorName: string;
  categoryName: string;
  wordCount: number;
  readingTimeMinutes: number;
  headings: TocHeading[];
}

export class ContentValidationError extends Error {
  constructor(id: string, details: string) {
    super(`Invalid article "${id}": ${details}`);
    this.name = "ContentValidationError";
  }
}

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function splitFrontmatter(raw: string): { data: unknown; body: string } | null {
  const match = FRONTMATTER_PATTERN.exec(raw.replace(/^﻿/, ""));
  if (!match) return null;
  return { data: parseYaml(match[1] ?? ""), body: (match[2] ?? "").trim() };
}

/** Lines of the body outside fenced code blocks. */
function proseLines(body: string): string[] {
  const lines: string[] = [];
  let inFence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) lines.push(line);
  }
  return lines;
}

/** Strips inline Markdown so heading text matches the rendered text content. */
function plainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .trim();
}

/** Extracts h2/h3 headings with ids identical to those produced by rehype-slug. */
export function extractHeadings(body: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  for (const line of proseLines(body)) {
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    // h1 in article bodies is rendered as h2 (the page title is the only h1).
    const depth = Math.max(2, match[1]!.length);
    const text = plainText(match[2]!);
    const id = slugger.slug(text); // slug every heading so duplicate ids stay in sync
    if (depth === 2 || depth === 3) headings.push({ id, text, depth });
  }
  return headings;
}

export function countWords(body: string): number {
  const text = proseLines(body)
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`[\]()!|-]/g, " ");
  return text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

export function readingTime(wordCount: number, wordsPerMinute = 200): number {
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("; ");
}

export function parseArticle(source: ArticleSource): Article {
  const split = splitFrontmatter(source.raw);
  if (!split) throw new ContentValidationError(source.id, "missing front matter block");
  const result = frontmatterSchema.safeParse(split.data);
  if (!result.success) throw new ContentValidationError(source.id, formatIssues(result.error));
  const data = result.data;
  if (split.body.length === 0) throw new ContentValidationError(source.id, "article body is empty");
  const wordCount = countWords(split.body);
  return {
    ...data,
    body: split.body,
    authorName: blogAuthors[data.author].name,
    categoryName: blogCategories[data.category].name,
    wordCount,
    readingTimeMinutes: readingTime(wordCount),
    headings: extractHeadings(split.body),
  };
}

/** Cross-article checks: unique slugs and references to existing content. */
export function validateCollection(
  articles: Article[],
  knownServiceSlugs: readonly string[],
): void {
  const slugs = new Set<string>();
  for (const article of articles) {
    if (slugs.has(article.slug)) {
      throw new ContentValidationError(article.slug, "duplicate slug");
    }
    slugs.add(article.slug);
  }
  for (const article of articles) {
    for (const service of article.relatedServices) {
      if (!knownServiceSlugs.includes(service)) {
        throw new ContentValidationError(article.slug, `unknown related service "${service}"`);
      }
    }
    for (const related of article.relatedArticles) {
      if (!slugs.has(related) || related === article.slug) {
        throw new ContentValidationError(article.slug, `invalid related article "${related}"`);
      }
    }
  }
}

export interface PublishOptions {
  /** Include drafts and future-dated articles (development preview only). */
  preview?: boolean;
  /** Reference date (YYYY-MM-DD) for scheduled articles. Defaults to today in Sri Lanka. */
  today?: string;
}

export function isPublished(article: Article, options: PublishOptions = {}): boolean {
  if (options.preview) return true;
  const today = options.today ?? todayInSriLanka();
  return !article.draft && article.publishedAt <= today;
}

export function sortByNewest(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title),
  );
}

export function filterPublished(articles: Article[], options: PublishOptions = {}): Article[] {
  return sortByNewest(articles.filter((article) => isPublished(article, options)));
}

export interface Page<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export function paginate<T>(items: T[], page: number, perPage: number): Page<T> | null {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null;
  const start = (page - 1) * perPage;
  return { items: items.slice(start, start + perPage), page, totalPages, totalItems: items.length };
}

export function collectTags(articles: Article[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function tagLabel(tag: string): string {
  const words = tag.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Related articles: explicit `relatedArticles` first, then those sharing the
 * most tags (same category breaks ties), newest first.
 */
export function relatedArticles(article: Article, pool: Article[], limit = 3): Article[] {
  const others = pool.filter((candidate) => candidate.slug !== article.slug);
  const explicit = article.relatedArticles.flatMap((slugValue) => {
    const match = others.find((candidate) => candidate.slug === slugValue);
    return match ? [match] : [];
  });
  const scored = others
    .filter((candidate) => !explicit.includes(candidate))
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => article.tags.includes(tag)).length;
      const sameCategory = candidate.category === article.category ? 1 : 0;
      return { candidate, score: sharedTags * 2 + sameCategory };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) => b.score - a.score || b.candidate.publishedAt.localeCompare(a.candidate.publishedAt),
    )
    .map((entry) => entry.candidate);
  return [...explicit, ...scored].slice(0, limit);
}

function normaliseSearch(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

/** Matches every search term against the title, description and tags. */
export function searchArticles(articles: Article[], query: string): Article[] {
  const terms = normaliseSearch(query).split(/\s+/).filter(Boolean).slice(0, 10);
  if (terms.length === 0) return [];
  return articles.filter((article) => {
    const haystack = normaliseSearch(
      [article.title, article.description, article.tags.join(" ")].join(" "),
    );
    return terms.every((term) => haystack.includes(term));
  });
}
