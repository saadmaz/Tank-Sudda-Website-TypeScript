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

    // Edit returns to the step with values preserved
    await page.getByRole("button", { name: "Edit Tanks" }).click();
    await expect(page.getByLabel("Number of tanks and sumps")).toHaveValue("3");

    // No delivery channel is configured in this build, so sending is disabled honestly.
    await expect(page.getByText("Online requests are temporarily unavailable")).toBeVisible();
  });
});

test.describe("contact form", () => {
  test("shows accessible inline errors", async ({ page }) => {
    await page.goto("/contact");
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
