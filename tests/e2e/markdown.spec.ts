import { expect, test, type APIRequestContext } from "@playwright/test";

/**
 * Markdown versions (/pricing.md), /api/md and the llms files.
 *
 * The default e2e build has no site URL, so everything here must be a 404.
 * To test the content, build and run with the production origin:
 *   NEXT_PUBLIC_SITE_URL=https://tanksudda.com bun run build
 *   E2E_SITE_URL=https://tanksudda.com bunx playwright test tests/e2e/markdown.spec.ts
 */
const siteUrl = process.env.E2E_SITE_URL;

const MARKDOWN_TYPE = "text/markdown; charset=utf-8";

/** Pages that must never have a Markdown version. */
const EXCLUDED = [
  "/book.md",
  "/book/thank-you.md",
  "/blog/search.md",
  "/blog/tag/sediment.md",
  "/privacy.md",
  "/terms.md",
  "/cookies.md",
  "/gallery.md",
  "/testimonials.md",
  // Drafts and unverified areas.
  "/blog/plastic-vs-concrete-water-tanks.md",
  "/blog/signs-your-sump-needs-cleaning.md",
  "/blog/water-tank-care-after-flooding.md",
  "/areas/colombo.md",
  "/areas/gampaha.md",
  // Translations are not reviewed yet.
  "/si.md",
  "/ta/pricing.md",
  "/this-page-does-not-exist.md",
  "/api/md/blog/plastic-vs-concrete-water-tanks",
];

async function expectMarkdown404(request: APIRequestContext, path: string) {
  const response = await request.get(path);
  expect(response.status(), path).toBe(404);
  expect(response.headers()["content-type"], path).toBe(MARKDOWN_TYPE);
  expect(await response.text(), path).toMatch(/^# Page not found/);
}

test.describe("markdown endpoints", () => {
  test("browsers still get HTML, whatever they accept", async ({ request }) => {
    for (const accept of [undefined, "*/*", "text/html", "text/markdown", "text/markdown;q=1"]) {
      const response = await request.get("/pricing", {
        headers: accept ? { accept } : {},
      });
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("text/html");
    }
  });

  test("assets, framework files and redirects are untouched", async ({ request }) => {
    expect((await request.get("/favicon.ico")).headers()["content-type"]).toContain("image/");
    expect((await request.get("/sitemap.xml")).status()).toBe(200);
    const api = await request.get("/api/x.md");
    expect(api.status()).toBe(404);
    expect(api.headers()["content-type"]).toContain("text/html");
    const next = await request.get("/_next/x.md");
    expect(next.status()).toBe(404);
    expect(next.headers()["content-type"]).not.toContain("markdown");
    const redirect = await request.get("/knowledge", { maxRedirects: 0 });
    expect(redirect.status()).toBe(308);
  });

  test("excluded and unknown pages return a Markdown 404", async ({ request }) => {
    for (const path of EXCLUDED) await expectMarkdown404(request, path);
  });

  if (!siteUrl) {
    test("without a site URL nothing is published", async ({ request, page }) => {
      for (const path of ["/pricing.md", "/index.md", "/api/md/pricing"]) {
        await expectMarkdown404(request, path);
      }
      expect((await request.get("/llms.txt")).status()).toBe(404);
      expect((await request.get("/llms-full.txt")).status()).toBe(404);
      await page.goto("/pricing");
      await expect(page.locator('link[type="text/markdown"]')).toHaveCount(0);
    });
    return;
  }

  test("a static page is served as Markdown with the right headers", async ({ request }) => {
    for (const path of ["/pricing.md", "/api/md/pricing"]) {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      const headers = response.headers();
      expect(headers["content-type"]).toBe(MARKDOWN_TYPE);
      expect(headers["x-robots-tag"]).toBe("noindex, follow");
      expect(headers["link"]).toBe(`<${siteUrl}/pricing>; rel="canonical"`);
      expect(headers["content-location"]).toBe(`${siteUrl}/pricing.md`);
      expect(headers["cache-control"]).toMatch(/^public, max-age=3600/);
      expect(headers["etag"]).toMatch(/^"[0-9a-f]{32}"$/);
      expect(headers["access-control-allow-origin"]).toBeUndefined();
      expect(headers["set-cookie"]).toBeUndefined();
      const body = await response.text();
      expect(body).toContain(`url: ${siteUrl}/pricing\n`);
      expect(body).toContain("# Clear quotations, agreed before work begins");
    }
  });

  test("dynamic pages serve the published record", async ({ request }) => {
    const article = await request.get("/blog/how-often-should-you-clean-your-water-tank.md");
    expect(article.status()).toBe(200);
    expect(await article.text()).toContain("# How often should you clean your water tank?");
    const service = await request.get("/services/sump-cleaning.md");
    expect(await service.text()).toContain("# Sump Cleaning");
    const category = await request.get("/blog/category/maintenance.md");
    expect(await category.text()).toContain("# Tank maintenance");
    const home = await request.get("/index.md");
    expect(home.headers()["link"]).toBe(`<${siteUrl}/>; rel="canonical"`);
  });

  test("HEAD returns headers without a body", async ({ request }) => {
    const response = await request.head("/pricing.md");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe(MARKDOWN_TYPE);
    expect(await response.body()).toHaveLength(0);
  });

  test("approved HTML pages link to their Markdown version, others do not", async ({ page }) => {
    test.setTimeout(60_000);
    const alternate = page.locator('link[rel="alternate"][type="text/markdown"]');
    for (const [path, markdown] of [
      ["/", "/index.md"],
      ["/pricing", "/pricing.md"],
      [
        "/blog/how-often-should-you-clean-your-water-tank",
        "/blog/how-often-should-you-clean-your-water-tank.md",
      ],
    ]) {
      await page.goto(path!, { waitUntil: "domcontentloaded" });
      await expect(alternate).toHaveAttribute("href", `${siteUrl}${markdown}`);
    }
    for (const path of ["/book", "/privacy", "/blog/tag/sediment", "/si/pricing", "/gallery"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(alternate, path).toHaveCount(0);
    }
  });

  test("llms.txt lists only Markdown pages that exist", async ({ request }) => {
    const response = await request.get("/llms.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("text/plain; charset=utf-8");
    const text = await response.text();
    expect(text).toMatch(/^# Tank Sudda\n\n> /);
    const links = [...text.matchAll(/\]\((https?:\/\/[^)]+\.md)\)/g)].map((match) => match[1]!);
    expect(links.length).toBeGreaterThan(15);
    for (const url of links) {
      expect(url.startsWith(siteUrl)).toBe(true);
      const path = url.slice(siteUrl.length);
      expect(EXCLUDED).not.toContain(path);
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });

  test("llms-full.txt contains every listed page", async ({ request }) => {
    const index = await (await request.get("/llms.txt")).text();
    const full = await (await request.get("/llms-full.txt")).text();
    const listed = [...index.matchAll(/\]\((https?:\/\/[^)]+)\.md\)/g)].map((m) => m[1]!);
    for (const url of listed) {
      const canonical = url.endsWith("/index") ? url.slice(0, -"index".length) : url;
      expect(full).toContain(`url: ${canonical}\n`);
    }
    expect(full).not.toContain("Pages not included");
    expect(full).not.toMatch(/plastic-vs-concrete|signs-your-sump|care-after-flooding/);
    expect(full).not.toMatch(/RESEND|LEAD_|WEBHOOK/);
  });

  test("Markdown headings match the HTML page", async ({ page, request }) => {
    test.setTimeout(180_000);
    const index = await (await request.get("/llms.txt")).text();
    const urls = [...index.matchAll(/\]\((https?:\/\/[^)]+\.md)\)/g)].map((m) => m[1]!);
    // Compare letters and digits only, so Markdown syntax and punctuation do not matter.
    const squash = (value: string) => value.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
    for (const url of urls) {
      const mdPath = url.slice(siteUrl.length);
      const htmlPath = mdPath === "/index.md" ? "/" : mdPath.slice(0, -3);
      const markdown = squash(await (await request.get(mdPath)).text());
      await page.goto(htmlPath, { waitUntil: "domcontentloaded" });
      const headings = await page.$$eval("main h1, main h2, main h3", (nodes) =>
        nodes
          // Navigation boxes and the article table of contents are page chrome.
          .filter((node) => !node.closest("nav, [aria-label='Article tools']"))
          .map((node) => node.textContent ?? ""),
      );
      for (const text of headings) {
        expect.soft(markdown, `${htmlPath}: "${text}"`).toContain(squash(text));
      }
    }
  });
});
