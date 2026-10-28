import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { areas, getPublishedAreas, type ServiceArea } from "@/data/areas";
import { gallery } from "@/data/gallery";
import { getPublishableTestimonials } from "@/data/testimonials";
import { filterPublished, parseArticle, type Article } from "@/lib/content/articles";
import { loadAllArticles } from "@/lib/content/blog.server";
import { absolutizeLinks, escapeText, frontMatter, link } from "@/lib/markdown/format";
import { renderLlmsFullTxt, renderLlmsTxt } from "@/lib/markdown/llms";
import {
  buildMarkdownPages,
  htmlPathFromSegments,
  markdownPath,
  renderMarkdownDocument,
  type MarkdownContext,
} from "@/lib/markdown/pages";
import { textResponse } from "@/lib/markdown/response";

const origin = new URL("https://www.example-tank.test");
const allArticles = loadAllArticles();
const drafts = allArticles.filter((article) => article.draft);
const unverifiedAreas = areas.filter((area) => area.status !== "confirmed");

function context(overrides: Partial<MarkdownContext> = {}): MarkdownContext {
  return {
    origin,
    articles: filterPublished(allArticles),
    areas: getPublishedAreas(false),
    testimonials: getPublishableTestimonials(),
    gallery,
    locales: ["en"],
    ...overrides,
  };
}

function makeArticle(slug: string, overrides: Partial<Article> = {}): Article {
  const raw = `---\ntitle: Article ${slug} title\nslug: ${slug}\ndescription: A description that is long enough to pass the minimum length rule.\nauthor: tank-sudda-team\npublishedAt: 2026-01-01\ncategory: maintenance\n---\n## Heading\n\nSee [deep cleaning](/services/water-tank-deep-cleaning).\n\n\`\`\`\n[keep](/relative)\n\`\`\``;
  return { ...parseArticle({ id: slug, raw }), ...overrides };
}

const paths = (ctx: MarkdownContext) => buildMarkdownPages(ctx).map((page) => page.path);

describe("markdown formatting", () => {
  it("escapes Markdown syntax in data values", () => {
    expect(escapeText("*bold* [x](javascript:alert(1)) <b>|")).toBe(
      "\\*bold\\* \\[x\\](javascript:alert(1)) \\<b\\>\\|",
    );
    expect(escapeText("# not a heading")).toBe("\\# not a heading");
    expect(escapeText("1. not a list")).toBe("1\\. not a list");
    expect(escapeText("line\n\n## break")).toBe("line ## break");
  });

  it("only links to absolute http(s), mailto and tel URLs", () => {
    expect(link("Pricing", "https://x.test/pricing")).toBe("[Pricing](https://x.test/pricing)");
    expect(link("Mail", "mailto:a@b.test")).toBe("[Mail](mailto:a@b.test)");
    expect(() => link("x", "javascript:alert(1)")).toThrow();
    expect(() => link("x", "/relative")).toThrow();
    expect(link("x", "https://x.test/a b)")).toBe("[x](https://x.test/a%20b%29)");
  });

  it("makes article links absolute but leaves code blocks alone", () => {
    const body = "A [link](/faq) and [ext](https://e.test).\n```\n[code](/faq)\n```";
    expect(absolutizeLinks(body, origin)).toBe(
      "A [link](https://www.example-tank.test/faq) and [ext](https://e.test).\n```\n[code](/faq)\n```",
    );
  });

  it("quotes front matter values", () => {
    expect(frontMatter({ title: "a: b", updated: undefined })).toBe('---\ntitle: "a: b"\n---');
  });

  it("maps HTML paths to Markdown paths and back", () => {
    expect(markdownPath("/")).toBe("/index.md");
    expect(markdownPath("/blog/x")).toBe("/blog/x.md");
    expect(htmlPathFromSegments(["index"])).toBe("/");
    expect(htmlPathFromSegments(["blog", "x"])).toBe("/blog/x");
  });
});

describe("markdown page list", () => {
  const list = paths(context());

  it("covers the approved public pages", () => {
    for (const expected of [
      "/",
      "/about",
      "/services",
      "/services/water-tank-deep-cleaning",
      "/services/sump-cleaning",
      "/services/commercial-tank-cleaning",
      "/pricing",
      "/faq",
      "/contact",
      "/guides",
      "/areas",
      "/blog",
      "/blog/how-often-should-you-clean-your-water-tank",
      "/blog/category/maintenance",
    ]) {
      expect(list).toContain(expected);
    }
    expect(new Set(list).size).toBe(list.length);
  });

  it("never includes drafts, unverified areas or excluded routes", () => {
    expect(drafts.length).toBeGreaterThan(0);
    for (const draft of drafts) expect(list).not.toContain(`/blog/${draft.slug}`);
    for (const area of unverifiedAreas) expect(list).not.toContain(`/areas/${area.slug}`);
    for (const route of list) {
      expect(route).not.toMatch(/^\/(book|privacy|terms|cookies|si|ta)(\/|$)|\/tag\/|\/search/);
    }
    // Empty gallery and testimonials pages are noindex, so they have no Markdown version.
    if (gallery.length === 0) expect(list).not.toContain("/gallery");
    if (getPublishableTestimonials().length === 0) expect(list).not.toContain("/testimonials");
  });

  it("leaves out noindex and syndicated articles and empty categories", () => {
    const ctx = context({
      articles: [
        makeArticle("kept-article"),
        makeArticle("hidden-article", { noindex: true }),
        makeArticle("syndicated-article", { canonicalUrl: "https://elsewhere.test/a" }),
      ],
    });
    const list = paths(ctx);
    expect(list).toContain("/blog/kept-article");
    expect(list).not.toContain("/blog/hidden-article");
    expect(list).not.toContain("/blog/syndicated-article");
    expect(list).toContain("/blog/category/maintenance");
    expect(list).not.toContain("/blog/category/choosing-a-service");
  });

  it("paginates blog listings like the HTML pages", () => {
    const articles = Array.from({ length: 10 }, (_, i) => makeArticle(`article-number-${i}`));
    const list = paths(context({ articles }));
    expect(list).toContain("/blog/page/2");
    expect(list).not.toContain("/blog/page/3");
  });

  it("adds translations and confirmed areas only when they are published", () => {
    const area: ServiceArea = { ...areas[0]!, status: "confirmed" };
    const list = paths(context({ locales: ["en", "si"], areas: [area] }));
    expect(list).toContain("/si");
    expect(list).toContain("/si/services/sump-cleaning");
    expect(list).not.toContain("/ta");
    expect(list).toContain(`/areas/${area.slug}`);
  });
});

describe("markdown documents", () => {
  const ctx = context();
  const pages = buildMarkdownPages(ctx);
  const doc = (route: string) =>
    renderMarkdownDocument(
      pages.find((p) => p.path === route)!,
      origin,
    );

  it("every page renders with front matter, one h1 and only absolute links", () => {
    for (const page of pages) {
      const markdown = renderMarkdownDocument(page, origin);
      expect(markdown.startsWith("---\ntitle:")).toBe(true);
      expect(markdown).toContain(`url: ${new URL(page.path, origin).toString()}`);
      expect(markdown.match(/^# /gm)?.length, page.path).toBe(1);
      // Root-relative links outside code would break when read out of context.
      expect(markdown.replace(/```[\s\S]*?```/g, ""), page.path).not.toMatch(/\]\(\//);
    }
  });

  it("pricing shows only verified prices and the quotation process", () => {
    const pricing = doc("/pricing");
    expect(pricing).toContain("# Clear quotations, agreed before work begins");
    expect(pricing).toContain("Quoted after assessment");
    expect(pricing).toContain("**Tank capacity**");
    expect(pricing).not.toMatch(/LKR\s?\d/);
  });

  it("service pages include their FAQs and process", () => {
    const service = doc("/services/sump-cleaning");
    expect(service).toContain("## Our process");
    expect(service).toMatch(/## Questions about /);
    expect(service).toContain("https://www.example-tank.test/book?service=sump-cleaning");
  });

  it("contact lists only verified contact details", () => {
    const contact = doc("/contact");
    expect(contact).toContain("tel:+94741004296");
    expect(contact).toContain("mailto:info@tanksudda.com");
    expect(contact).not.toContain("Opening hours");
  });

  it("articles carry their dates, body and absolute links", () => {
    const article = allArticles.find(
      (a) => a.slug === "how-often-should-you-clean-your-water-tank",
    )!;
    const markdown = doc(`/blog/${article.slug}`);
    expect(markdown).toContain(`updated: ${article.updatedAt ?? article.publishedAt}`);
    expect(markdown).toContain("## Why there is no single answer");
    expect(markdown).toContain(
      "](https://www.example-tank.test/services/water-tank-deep-cleaning)",
    );
  });

  it("never mentions drafts or unverified areas anywhere", () => {
    const everything = pages.map((page) => renderMarkdownDocument(page, origin)).join("\n");
    for (const draft of drafts) expect(everything).not.toContain(draft.slug);
    for (const area of unverifiedAreas) expect(everything).not.toContain(`/areas/${area.slug}`);
    expect(everything).not.toMatch(/RESEND|LEAD_|WEBHOOK|process\.env/);
  });

  it("escapes untrusted-looking data", () => {
    const area: ServiceArea = {
      ...areas[0]!,
      status: "confirmed",
      name: "Evil *[x](javascript:alert(1))*",
    };
    const page = buildMarkdownPages(context({ areas: [area] })).find((p) =>
      p.path.startsWith("/areas/colombo"),
    )!;
    // Front matter values are YAML strings (quoted when needed), not Markdown.
    const markdown = renderMarkdownDocument(page, origin).split("\n---\n")[1]!;
    // The brackets are escaped, so no live link to javascript: is produced.
    expect(markdown).not.toMatch(/(?<!\\)\]\(javascript:/);
    expect(markdown).toContain("Evil \\*\\[x\\]");
  });

  it("does not depend on server code that handles leads", () => {
    const dir = path.join(process.cwd(), "src", "lib", "markdown");
    for (const file of fs.readdirSync(dir)) {
      const source = fs.readFileSync(path.join(dir, file), "utf8");
      expect(source, file).not.toMatch(/@\/server|process\.env\.(?!CONTENT_BUILD_DATE)/);
    }
  });
});

describe("llms files", () => {
  const pages = buildMarkdownPages(context());

  it("llms.txt lists every page by its absolute Markdown URL", () => {
    const text = renderLlmsTxt(pages, origin);
    expect(text.startsWith("# Tank Sudda\n\n> ")).toBe(true);
    for (const page of pages) {
      expect(text).toContain(`](${new URL(markdownPath(page.path), origin).toString()})`);
    }
    expect(text).toContain("](https://www.example-tank.test/llms-full.txt)");
    expect(text).toContain("](https://www.example-tank.test/sitemap.xml)");
    expect(text).not.toMatch(/\]\(\//);
  });

  it("llms-full.txt contains every page with its source URL", () => {
    const text = renderLlmsFullTxt(pages, origin);
    expect(text.match(/^---\ntitle:/gm)?.length).toBe(pages.length);
    expect(text).not.toContain("Pages not included");
    expect(new TextEncoder().encode(text).length).toBeLessThan(1_000_000);
  });

  it("llms-full.txt respects page and size limits", () => {
    const byPages = renderLlmsFullTxt(pages, origin, { maxPages: 2, maxBytes: 1_000_000 });
    expect(byPages.match(/^---\ntitle:/gm)?.length).toBe(2);
    expect(byPages).toContain(`The remaining ${pages.length - 2} pages`);
    const third = new URL(markdownPath(pages[2]!.path), origin).toString();
    expect(byPages).toContain(`](${third})`);

    const bySize = renderLlmsFullTxt(pages, origin, { maxPages: 1000, maxBytes: 4000 });
    const content = bySize.split("\n# Pages not included")[0]!;
    expect(new TextEncoder().encode(content).length).toBeLessThanOrEqual(4000);
    expect(bySize).toContain("# Pages not included");
  });
});

describe("markdown responses", () => {
  it("send Markdown headers, a canonical link and a content-based ETag", async () => {
    const response = await textResponse("# Hi\n", {
      contentType: "text/markdown",
      canonicalUrl: "https://x.test/hi",
      contentLocation: "https://x.test/hi.md",
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, follow");
    expect(response.headers.get("link")).toBe('<https://x.test/hi>; rel="canonical"');
    expect(response.headers.get("content-location")).toBe("https://x.test/hi.md");
    expect(response.headers.get("etag")).toMatch(/^"[0-9a-f]{32}"$/);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    expect(response.headers.get("vary")).toBeNull();
  });

  it("send 404s without an ETag", async () => {
    const response = await textResponse("# Not found\n", {
      contentType: "text/markdown",
      status: 404,
    });
    expect(response.status).toBe(404);
    expect(response.headers.get("etag")).toBeNull();
  });
});

describe("markdown registry", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  async function load(env: Record<string, string>) {
    vi.resetModules();
    for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
    return {
      registry: await import("@/lib/markdown/index.server"),
      metadata: await import("@/lib/seo/metadata"),
    };
  }

  it("is empty without a verified origin or with indexing switched off", async () => {
    expect((await load({ NEXT_PUBLIC_SITE_URL: "" })).registry.getMarkdownPages()).toEqual([]);
    const staging = await load({ NEXT_PUBLIC_SITE_URL: "https://x.test", SITE_NOINDEX: "1" });
    expect(staging.registry.getMarkdownPages()).toEqual([]);
  });

  it("never uses development previews", async () => {
    const { registry } = await load({
      NEXT_PUBLIC_SITE_URL: "https://x.test",
      NODE_ENV: "development",
    });
    const list = registry.getMarkdownPages().map((page) => page.path);
    expect(list).toContain("/pricing");
    for (const draft of drafts) expect(list).not.toContain(`/blog/${draft.slug}`);
    for (const area of unverifiedAreas) expect(list).not.toContain(`/areas/${area.slug}`);
  });

  it("judges scheduled articles against the build date", async () => {
    const { registry } = await load({
      NEXT_PUBLIC_SITE_URL: "https://x.test",
      CONTENT_BUILD_DATE: "2000-01-01",
    });
    expect(registry.getMarkdownPages().some((page) => page.group === "articles")).toBe(false);
  });

  it("adds a Markdown alternate link only to pages that have a Markdown version", async () => {
    const { metadata } = await load({ NEXT_PUBLIC_SITE_URL: "https://x.test" });
    const pricing = metadata.buildMetadata({ title: "P", description: "d", path: "/pricing" });
    expect(pricing.alternates?.types).toEqual({ "text/markdown": "https://x.test/pricing.md" });
    const home = metadata.buildMetadata({ title: "H", description: "d", path: "/" });
    expect(home.alternates?.types).toEqual({ "text/markdown": "https://x.test/index.md" });
    for (const route of ["/book", "/privacy", "/blog/tag/sediment", "/si/pricing"]) {
      const result = metadata.buildMetadata({ title: "X", description: "d", path: route });
      expect(result.alternates?.types, route).toBeUndefined();
    }
  });
});
