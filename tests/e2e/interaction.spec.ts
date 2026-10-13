import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("mobile menu opens as a dialog, closes with Escape, and navigates", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: "Open menu" });
    await menuButton.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(menuButton).toBeFocused();
    await menuButton.click();
    await dialog.getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("quotations");
  });

  test("desktop navigation marks the current page", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/services/sump-cleaning");
    await expect(
      page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Services" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("contact bar and menu stay pinned to the top while scrolling", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "the contact bar is desktop only");
    await page.goto("/services/sump-cleaning");
    await page.evaluate(() => window.scrollTo(0, 2000));
    const bar = page.getByRole("complementary", { name: "Contact details" });
    await expect.poll(async () => (await bar.boundingBox())?.y).toBe(0);
    await expect(page.getByRole("navigation", { name: "Main" })).toBeInViewport();
  });

  test("skip link moves focus to the main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard test");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("analytics", () => {
  test("WhatsApp clicks are reported with their placement", async ({ page, isMobile }) => {
    test.skip(isMobile, "uses the desktop hero layout");
    // Stand-in provider; also stop the click from opening WhatsApp.
    await page.addInitScript(() => {
      const events: unknown[] = [];
      Object.assign(window, {
        __events: events,
        plausible: (name: string, options: unknown) => events.push({ name, options }),
      });
      document.addEventListener("click", (event) => event.preventDefault());
    });
    await page.goto("/");
    await page
      .locator("[data-analytics-placement='hero']")
      .getByRole("link", { name: /WhatsApp/ })
      .click();
    const events: unknown = await page.evaluate(() => Reflect.get(window, "__events"));
    expect(events).toContainEqual({
      name: "contact_click",
      options: { props: { channel: "whatsapp", page: "/", placement: "hero" } },
    });
  });
});

test.describe("booking wizard", () => {
  test("validates each step and reaches the review", async ({ page }) => {
    await page.goto("/book?service=sump-cleaning");
    await expect(page.getByRole("radio", { name: "Sump Cleaning" })).toBeChecked();

    // Step 1 validation
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Choose a property type")).toBeVisible();
    await page.getByLabel("Property type").selectOption("apartment-building");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2
    await expect(page.getByRole("heading", { level: 2, name: "Tanks" })).toBeFocused();
    await page.getByLabel("Tank type").selectOption("sump");
    await page.getByLabel(/Approximate capacity/).selectOption("5000-10000");
    await page.getByLabel("Number of tanks and sumps").fill("3");
    await page.getByRole("button", { name: "Continue" }).click();

    // Conditional site step for apartment buildings
    await expect(page.getByRole("heading", { level: 2, name: "Site" })).toBeVisible();
    await page.getByLabel(/Organisation or building name/).fill("Test Residencies");
    await page.getByRole("button", { name: "Continue" }).click();

    // Location & timing
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter your town or area")).toBeVisible();
    await page.getByLabel("Town or area").fill("Kandy");
    await page.getByLabel("Property address").fill("12 Example Road, Kandy");
    const min = await page.getByLabel("Preferred date").getAttribute("min");
    expect(min).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    await page.getByLabel("Preferred date").fill(min!);
    await page.getByText("Afternoon", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    // Contact
    await page.getByLabel("Your name").fill("Test Customer");
    await page.getByLabel("Phone number").fill("12");
    await page.getByText("Email", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText(/Enter a valid phone number/)).toBeVisible();
    await expect(page.getByText(/Enter an email address so we can reply/)).toBeVisible();
    await expect(page.getByText(/Please confirm you have read the privacy notice/)).toBeVisible();
    await page.getByLabel("Phone number").fill("077 123 4567");
    await page.getByLabel(/Email address/).fill("customer@example.org");
    await page.getByLabel(/I have read the privacy notice/).check();
    await page.getByRole("button", { name: "Continue" }).click();

    // Review
    await expect(page.getByRole("heading", { level: 2, name: "Review" })).toBeVisible();
    await expect(page.getByText("Test Residencies")).toBeVisible();
    await expect(page.getByText("Sending this form does not confirm an appointment")).toBeVisible();

    // Without online delivery, the request is handed over on WhatsApp with its details.
    const whatsappHref = await page
      .getByRole("link", { name: /Send request on WhatsApp/ })
      .getAttribute("href");
    const message = new URL(whatsappHref!).searchParams.get("text") ?? "";
    expect(message).toContain("Service: Sump Cleaning");
    expect(message).toContain("Town / area: Kandy");
    expect(message).toContain("Number of tanks: 3");

    // Edit returns to the step with values preserved
    await page.getByRole("button", { name: "Edit Tanks" }).click();
    await expect(page.getByLabel("Number of tanks and sumps")).toHaveValue("3");

    // No delivery channel is configured in this build, so requests go via WhatsApp.
    await expect(page.getByText("Your request is sent to us on WhatsApp")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send booking request" })).toHaveCount(0);
  });
});

test.describe("contact page", () => {
  test("leads with direct contact options", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator('main a[href="tel:+94741004296"]')).toBeVisible();
    await expect(page.locator('main a[href^="https://wa.me/94741004296"]').first()).toBeVisible();
    await expect(page.locator('main a[href="mailto:info@tanksudda.com"]')).toBeVisible();
  });

  test("form shows accessible inline errors when delivery is configured", async ({ page }) => {
    await page.goto("/contact");
    // Without a delivery channel the form is replaced by a booking prompt.
    if ((await page.getByRole("textbox", { name: "Message" }).count()) === 0) {
      await expect(page.getByRole("link", { name: "Request a booking" }).first()).toBeVisible();
      return;
    }
    await page.getByLabel("Your name").fill("A");
    await page.getByRole("textbox", { name: "Message" }).fill("short");
    await page.getByRole("textbox", { name: "Message" }).blur();
    await expect(page.getByRole("textbox", { name: "Message" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.getByText(/at least 10 characters/)).toBeVisible();
  });
});

test.describe("layout", () => {
  // Each test loads every route below (English, Sinhala and Tamil) at one width.
  test.describe.configure({ timeout: 90_000 });
  for (const width of [360, 390, 768, 1024, 1440]) {
    test(`no horizontal scrolling at ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile, "viewport set explicitly");
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        "/",
        "/services/commercial-tank-cleaning",
        "/book",
        "/blog",
        "/blog/understanding-sediment-in-water-tanks",
        "/pricing",
        "/faq",
        "/si",
        "/ta",
        "/ta/services/commercial-tank-cleaning",
        "/si/pricing",
      ]) {
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `${route} overflows at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe("accessibility (axe, WCAG 2.2 AA rules)", () => {
  // Full-page axe scans of long pages can exceed 30 s when all workers run in parallel.
  test.describe.configure({ timeout: 90_000 });
  for (const route of [
    "/",
    "/services",
    "/services/sump-cleaning",
    "/pricing",
    "/book",
    "/contact",
    "/faq",
    "/blog",
    "/blog/how-to-prepare-for-water-tank-cleaning",
    "/guides",
    "/areas",
    "/privacy",
    "/this-page-does-not-exist",
    "/si",
    "/ta/services/sump-cleaning",
    "/si/contact",
    "/ta/faq",
  ]) {
    test(`${route} has no detectable violations`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      );
      expect(summary).toEqual([]);
    });
  }
});
