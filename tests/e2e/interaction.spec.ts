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
  test("three steps: validates, summarises and hands over the request", async ({ page }) => {
    // Walks through all three steps with validation, so it needs longer under parallel load.
    test.setTimeout(90_000);
    await page.goto("/book?service=sump-cleaning");
    await expect(page.getByText("Step 1 of 3")).toBeVisible();
    // A link from the sump cleaning page preselects that service.
    await expect(page.getByRole("radio", { name: "Sump cleaning" })).toBeChecked();

    // Step 1: Your tank
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Choose a property type")).toBeVisible();
    await expect(page.getByText("Choose the approximate tank size")).toBeVisible();
    await page.getByLabel("Property type").selectOption("house");
    await page.getByLabel(/Tank size/).selectOption("1000-2500");
    await page.getByLabel("Number of tanks and sumps").fill("2");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: Where & when (address is optional, town and date are required)
    await expect(page.getByRole("heading", { level: 2, name: "Where & when" })).toBeFocused();
    await expect(page.getByText(/can vary depending on availability/)).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter your town or area")).toBeVisible();
    await expect(page.getByText("Choose a preferred date")).toBeVisible();
    await page.getByLabel("Town or area").fill("Kandy");
    const min = await page.getByLabel("Preferred date").getAttribute("min");
    expect(min).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    await page.getByLabel("Preferred date").fill(min!);
    await page.getByLabel(/Anything we should know/).fill("Tank is on the roof");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: Your details, with a summary of the earlier steps
    await expect(page.getByText("Step 3 of 3")).toBeVisible();
    await page.getByLabel("Your name").fill("Test Customer");
    await page.getByLabel("Mobile number").fill("077 123 4567");
    // Any combination of contact methods can be chosen.
    await page.getByRole("checkbox", { name: "Phone call" }).check();
    await page.getByRole("checkbox", { name: "WhatsApp" }).check();
    await expect(page.getByRole("checkbox", { name: "Phone call" })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: "WhatsApp" })).toBeChecked();
    const summary = page.getByRole("region", { name: "Your request" });
    await expect(summary.getByText("Sump cleaning")).toBeVisible();
    await expect(summary.getByText("1,000 – 2,500 litres")).toBeVisible();
    await expect(summary.getByText("Tank is on the roof")).toBeVisible();
    await expect(page.getByText("Sending this form does not confirm an appointment")).toBeVisible();

    // Edit returns to the step with values preserved
    await page.getByRole("button", { name: "Edit Your tank" }).click();
    await expect(page.getByLabel("Number of tanks and sumps")).toHaveValue("2");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByLabel("Your name")).toHaveValue("Test Customer");

    // No delivery channel is configured in this build, so the request goes via WhatsApp.
    await expect(page.getByText("Your request is sent to us on WhatsApp")).toBeVisible();
    const whatsappHref = await page
      .getByRole("link", { name: /Send request on WhatsApp/ })
      .getAttribute("href");
    const message = new URL(whatsappHref!).searchParams.get("text") ?? "";
    expect(message).toContain("Service: Sump cleaning");
    expect(message).toContain("Tank size: 1,000 – 2,500 litres");
    expect(message).toContain("Number of tanks: 2");
    expect(message).toContain("Town / area: Kandy");
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
        // Sinhala and Tamil fonts load with `display: swap`, so measure the settled
        // layout rather than the brief fallback-font render (which differs by OS).
        const { overflow, offenders } = await page.evaluate(async () => {
          await document.fonts.ready;
          const vw = document.documentElement.clientWidth;
          // Name the elements that stick out so a failure says what to fix.
          const offenders = Array.from(document.querySelectorAll("body *"))
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.right > vw + 0.5 && getComputedStyle(el).position !== "fixed";
            })
            .slice(-5)
            .map((el) => {
              const r = el.getBoundingClientRect();
              const text = (el.textContent ?? "").trim().slice(0, 40);
              return `<${el.tagName.toLowerCase()} class="${el.getAttribute("class") ?? ""}"> right=${Math.round(r.right)} "${text}"`;
            });
          return { overflow: document.documentElement.scrollWidth - window.innerWidth, offenders };
        });
        expect(
          overflow,
          `${route} overflows at ${width}px:\n${offenders.join("\n")}`,
        ).toBeLessThanOrEqual(0);
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
