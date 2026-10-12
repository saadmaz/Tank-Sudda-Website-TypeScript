import { expect, test } from "@playwright/test";
import { MISSING_ROUTES, PUBLIC_ROUTES } from "./routes";

test.describe("routing", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} renders with one h1 and a title`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.title()).toMatch(/Tank Sudda|received/);
      expect(errors).toEqual([]);
    });
  }

  for (const route of MISSING_ROUTES) {
    test(`${route} returns 404`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status()).toBe(404);
    });
  }

  test("old /knowledge route redirects permanently to /guides", async ({ request }) => {
    const response = await request.get("/knowledge", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers()["location"]).toBe("/guides");
  });

  test("discontinued vacuum cleaning page redirects to deep cleaning", async ({ request }) => {
    const response = await request.get("/services/water-tank-vacuum-cleaning", {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(308);
    expect(response.headers()["location"]).toBe("/services/water-tank-deep-cleaning");
  });

  test("page titles are unique", async ({ page }) => {
    test.setTimeout(120_000);
    const titles = new Map<string, string>();
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route);
      const title = await page.title();
      expect(titles.get(title), `${route} duplicates ${titles.get(title)}`).toBeUndefined();
      titles.set(title, route);
    }
  });
});

test.describe("internal links", () => {
  test("no internal link is broken", async ({ page, request }) => {
    test.setTimeout(120_000);
    const seen = new Set<string>();
    const targets = new Set<string>();
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route);
      const hrefs = await page.$$eval("a[href]", (anchors) =>
        anchors.map((a) => a.getAttribute("href") ?? ""),
      );
      for (const href of hrefs) {
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        targets.add(href.split("#")[0]!);
      }
    }
    for (const target of targets) {
      if (seen.has(target) || target === "") continue;
      seen.add(target);
      const response = await request.get(target);
      expect(response.status(), `broken link: ${target}`).toBeLessThan(400);
    }
    expect(seen.size).toBeGreaterThan(30);
  });
});

test.describe("indexing without a configured domain", () => {
  test("robots.txt blocks crawling and sitemap is empty", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \/\s*$/m);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("<url>");
  });

  test("pages are noindex and emit no canonical URL", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test("only verified contact details are rendered", async ({ page }) => {
    for (const route of ["/", "/contact", "/book"]) {
      await page.goto(route);
      const html = await page.content();
      expect(html).not.toMatch(/123\s?4567|hello@tanksudda|Owner to confirm/);
      const telLinks = await page
        .locator('a[href^="tel:"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      expect(telLinks.length).toBeGreaterThan(0);
      for (const href of telLinks) expect(href).toBe("tel:+94741004296");
      await expect(
        page
          .locator('a[href="mailto:tanksuddaglobal@gmail.com"]')
          .filter({ visible: true })
          .first(),
      ).toBeVisible();
      const whatsappLinks = await page
        .locator('a[href^="https://wa.me/"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
      expect(whatsappLinks.length).toBeGreaterThan(0);
      for (const href of whatsappLinks) {
        expect(new URL(href).pathname).toBe("/94741004296");
        expect(new URL(href).searchParams.get("text")).toMatch(/^Hello Tank Sudda/);
      }
    }
  });

  test("service pages pre-fill a WhatsApp message about that service", async ({ page }) => {
    await page.goto("/services/sump-cleaning");
    const href = await page.getByRole("link", { name: /Ask on WhatsApp/ }).getAttribute("href");
    expect(new URL(href!).searchParams.get("text")).toContain("Sump Cleaning");
  });
});

test.describe("blog", () => {
  test("article has a working table of contents and related services", async ({ page }) => {
    await page.goto("/blog/how-often-should-you-clean-your-water-tank");
    // On small screens the contents start collapsed; open them first.
    const summary = page.locator("summary", { hasText: "On this page" });
    if (await summary.isVisible()) await summary.click();
    const toc = page.getByRole("navigation", { name: "On this page" }).filter({ visible: true });
    const links = toc.getByRole("link");
    expect(await links.count()).toBeGreaterThanOrEqual(3);
    for (const href of await links.evaluateAll((els) => els.map((el) => el.getAttribute("href")))) {
      await expect(page.locator(href!)).toHaveCount(1);
    }
    await expect(
      page.getByRole("complementary").getByRole("link", { name: "Water Tank Deep Cleaning" }),
    ).toBeVisible();
    await expect(page.getByText(/min read/).first()).toBeVisible();
  });

  test("search form finds articles", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("searchbox", { name: "Search articles" }).fill("sump");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/blog\/search\?q=sump/);
    await expect(page.getByRole("status")).toContainText(/article/);
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });
});

test.describe("Sinhala and Tamil pages", () => {
  test("declare their language and say the translation is under review", async ({ page }) => {
    await page.goto("/si");
    await expect(page.locator("html")).toHaveAttribute("lang", "si-LK");
    await expect(page.getByText(/සමාලෝචනය වෙමින් පවතී/)).toBeVisible();
    await page.goto("/ta/faq");
    await expect(page.locator("html")).toHaveAttribute("lang", "ta-LK");
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en-LK");
  });

  test("the language switcher keeps you on the same page", async ({ page }) => {
    await page.goto("/services/sump-cleaning");
    const footer = page.getByRole("contentinfo");
    await footer.getByRole("link", { name: "தமிழ்" }).click();
    await expect(page).toHaveURL(/\/ta\/services\/sump-cleaning$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ta-LK");
    await page.getByRole("contentinfo").getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/services\/sump-cleaning$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en-LK");
  });

  test("internal links stay in the same language where a translation exists", async ({ page }) => {
    await page.goto("/si/services");
    const hrefs = await page
      .getByRole("main")
      .locator("a[href^='/services']")
      .evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual([]);
    // Booking stays on the English form.
    await expect(page.getByRole("main").locator("a[href='/book']").first()).toBeVisible();
  });

  test("WhatsApp messages are written in the page language", async ({ page }) => {
    await page.goto("/si/contact");
    const href = await page
      .getByRole("main")
      .locator("a[href^='https://wa.me/']")
      .first()
      .getAttribute("href");
    const message = new URL(href ?? "").searchParams.get("text");
    expect(message).toContain("ආයුබෝවන් Tank Sudda");
  });

  test("are kept out of the sitemap until reviewed", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toMatch(/\/(si|ta)(\/|<)/);
  });
});
