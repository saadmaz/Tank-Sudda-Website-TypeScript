import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { describe, expect, it } from "vitest";
import { services } from "@/data/services";
import {
  collectTags,
  ContentValidationError,
  countWords,
  extractHeadings,
  filterPublished,
  isPublished,
  paginate,
  parseArticle,
  readingTime,
  relatedArticles,
  searchArticles,
  splitFrontmatter,
  validateCollection,
  type Article,
} from "@/lib/content/articles";

function source(
  frontmatter: Record<string, string>,
  body = "## First heading\n\nSome body text here.",
) {
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  return `---\n${yaml}\n---\n${body}\n`;
}

const valid = {
  title: "A valid article title",
  slug: "a-valid-article",
  description: "A description that is long enough to satisfy the fifty character minimum.",
  author: "tank-sudda-team",
  publishedAt: "2026-01-10",
  category: "maintenance",
};

function article(overrides: Partial<Article> = {}): Article {
  return { ...parseArticle({ id: "test", raw: source(valid) }), ...overrides };
}

describe("frontmatter parsing", () => {
  it("splits front matter from the body", () => {
    const result = splitFrontmatter("---\ntitle: Hello\n---\nBody");
    expect(result).toEqual({ data: { title: "Hello" }, body: "Body" });
  });

  it("returns null without a front matter block", () => {
    expect(splitFrontmatter("# Just markdown")).toBeNull();
  });

  it("parses a valid article and fills defaults", () => {
    const parsed = article();
    expect(parsed.slug).toBe("a-valid-article");
    expect(parsed.draft).toBe(false);
    expect(parsed.tags).toEqual([]);
    expect(parsed.categoryName).toBe("Tank maintenance");
    expect(parsed.authorName).toBe("Tank Sudda Team");
    expect(parsed.readingTimeMinutes).toBe(1);
  });

  it.each([
    ["missing title", { ...valid, title: undefined }],
    ["unknown category", { ...valid, category: "plumbing" }],
    ["unknown author", { ...valid, author: "someone" }],
    ["invalid slug", { ...valid, slug: "Not A Slug" }],
    ["reserved slug", { ...valid, slug: "category" }],
    ["invalid date", { ...valid, publishedAt: "12/01/2026" }],
    ["updated before published", { ...valid, updatedAt: "2025-12-31" }],
    ["unknown field", { ...valid, rating: "5" }],
    ["http canonical", { ...valid, canonicalUrl: "http://example.com/a" }],
  ])("rejects %s", (_label, frontmatter) => {
    const entries = Object.entries(frontmatter).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    );
    expect(() => parseArticle({ id: "bad", raw: source(Object.fromEntries(entries)) })).toThrow(
      ContentValidationError,
    );
  });

  it("rejects an empty body", () => {
    expect(() => parseArticle({ id: "empty", raw: source(valid, "") })).toThrow(/body is empty/);
  });
});

describe("headings and reading time", () => {
  const body = [
    "## Why it matters",
    "Text",
    "### Don't forget the sump",
    "```",
    "## Not a heading (inside code)",
    "```",
    "## [Linked](/x) **bold** heading",
    "## Why it matters",
    "#### Too deep for the table of contents",
  ].join("\n");

  it("extracts h2/h3 outside code fences with rehype-slug compatible ids", () => {
    const headings = extractHeadings(body);
    expect(headings.map((h) => h.id)).toEqual([
      "why-it-matters",
      "dont-forget-the-sump",
      "linked-bold-heading",
      "why-it-matters-1",
    ]);
    expect(headings[1]).toMatchObject({ depth: 3, text: "Don't forget the sump" });
  });

  it("matches github-slugger output for each heading text", () => {
    const slugger = new GithubSlugger();
    expect(extractHeadings("## Hello World")[0]?.id).toBe(slugger.slug("Hello World"));
  });

  it("counts words and estimates reading time", () => {
    expect(countWords("One two three\n\n```\nignored code\n```\nfour")).toBe(4);
    expect(readingTime(0)).toBe(1);
    expect(readingTime(1000)).toBe(5);
  });
});

describe("publishing rules", () => {
  it("hides drafts and future-dated articles unless previewing", () => {
    const draft = article({ draft: true });
    const future = article({ publishedAt: "2099-01-01" });
    expect(isPublished(draft, { today: "2026-10-12" })).toBe(false);
    expect(isPublished(future, { today: "2026-10-12" })).toBe(false);
    expect(isPublished(draft, { preview: true })).toBe(true);
    expect(isPublished(article(), { today: "2026-10-12" })).toBe(true);
  });

  it("sorts published articles newest first", () => {
    const older = article({ slug: "older", publishedAt: "2026-01-01" });
    const newer = article({ slug: "newer", publishedAt: "2026-05-01" });
    expect(filterPublished([older, newer], { today: "2026-10-12" }).map((a) => a.slug)).toEqual([
      "newer",
      "older",
    ]);
  });
});

describe("collections", () => {
  it("rejects duplicate slugs and unknown references", () => {
    expect(() => validateCollection([article(), article()], [])).toThrow(/duplicate/);
    expect(() => validateCollection([article({ relatedServices: ["nope"] })], [])).toThrow(
      /unknown related service/,
    );
    expect(() => validateCollection([article({ relatedArticles: ["missing"] })], [])).toThrow(
      /invalid related article/,
    );
  });

  it("paginates and rejects out-of-range pages", () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    expect(paginate(items, 2, 4)).toEqual({
      items: [4, 5, 6, 7],
      page: 2,
      totalPages: 3,
      totalItems: 10,
    });
    expect(paginate(items, 4, 4)).toBeNull();
    expect(paginate(items, 0, 4)).toBeNull();
    expect(paginate([], 1, 4)?.totalPages).toBe(1);
  });

  it("finds related articles: explicit first, then shared tags", () => {
    const a = article({ slug: "a", tags: ["sediment", "maintenance"], relatedArticles: ["c"] });
    const b = article({ slug: "b", tags: ["sediment"] });
    const c = article({ slug: "c", tags: [], category: "choosing-a-service" });
    const d = article({ slug: "d", tags: [], category: "choosing-a-service" });
    expect(relatedArticles(a, [a, b, c, d]).map((x) => x.slug)).toEqual(["c", "b"]);
  });

  it("searches titles, descriptions and tags with every term", () => {
    const a = article({ slug: "a", title: "Sediment in tanks", tags: ["sumps"] });
    const b = article({ slug: "b", title: "Choosing a cleaner" });
    expect(searchArticles([a, b], "sediment").map((x) => x.slug)).toEqual(["a"]);
    expect(searchArticles([a, b], "SEDIMENT sumps").map((x) => x.slug)).toEqual(["a"]);
    expect(searchArticles([a, b], "sediment cleaner")).toEqual([]);
    expect(searchArticles([a, b], "   ")).toEqual([]);
  });

  it("counts tags", () => {
    const tags = collectTags([article({ tags: ["x", "y"] }), article({ tags: ["x"] })]);
    expect(tags).toEqual([
      { tag: "x", count: 2 },
      { tag: "y", count: 1 },
    ]);
  });
});

describe("repository content", () => {
  const dir = path.join(process.cwd(), "src", "content", "blog");
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
  const articles = files.map((file) =>
    parseArticle({ id: file, raw: fs.readFileSync(path.join(dir, file), "utf8") }),
  );

  it("every article file is valid and named after its slug", () => {
    expect(files.length).toBeGreaterThan(0);
    articles.forEach((a, i) => expect(`${a.slug}.mdx`).toBe(files[i]));
    expect(() =>
      validateCollection(
        articles,
        services.map((s) => s.slug),
      ),
    ).not.toThrow();
  });

  it("service pages only link to existing articles", () => {
    const slugs = new Set(articles.map((a) => a.slug));
    for (const service of services) {
      for (const slug of service.relatedArticleSlugs)
        expect(slugs.has(slug), `${service.slug} → ${slug}`).toBe(true);
    }
  });

  it("internal links in articles point at known routes", () => {
    const serviceSlugs = new Set(services.map((s) => s.slug));
    const articleSlugs = new Set(articles.map((a) => a.slug));
    const staticRoutes = new Set([
      "/book",
      "/contact",
      "/faq",
      "/guides",
      "/blog",
      "/services",
      "/pricing",
      "/about",
    ]);
    for (const a of articles) {
      for (const [, href] of a.body.matchAll(/\]\((\/[^)\s#]*)/g)) {
        const target = href!;
        const ok =
          staticRoutes.has(target) ||
          (target.startsWith("/services/") && serviceSlugs.has(target.slice(10))) ||
          (target.startsWith("/blog/") && articleSlugs.has(target.slice(6)));
        expect(ok, `${a.slug} links to ${target}`).toBe(true);
      }
    }
  });
});
