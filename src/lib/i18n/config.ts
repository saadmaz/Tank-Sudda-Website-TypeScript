/**
 * Locale configuration. English is the only published language today.
 * Sinhala ("si") and Tamil ("ta") can be enabled by adding them here, moving
 * routes under `app/[locale]/`, and supplying translated data and content.
 * See docs/ARCHITECTURE.md → "Adding Sinhala and Tamil".
 */
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const htmlLang: Record<Locale, string> = { en: "en-LK" };
export const ogLocale: Record<Locale, string> = { en: "en_LK" };
