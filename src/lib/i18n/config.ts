/**
 * Locale configuration. English is the main language and lives at the root
 * routes. Sinhala ("si") and Tamil ("ta") versions of the main pages live
 * under /si and /ta. See docs/ARCHITECTURE.md → "Sinhala and Tamil pages".
 */
import type { Route } from "next";

export const locales = ["en", "si", "ta"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Locales served under a path prefix (/si, /ta). */
export const prefixedLocales = ["si", "ta"] as const satisfies readonly Locale[];
export type PrefixedLocale = (typeof prefixedLocales)[number];

export const htmlLang: Record<Locale, string> = { en: "en-LK", si: "si-LK", ta: "ta-LK" };
export const ogLocale: Record<Locale, string> = { en: "en_LK", si: "si_LK", ta: "ta_LK" };

/** Each language's own name, used by the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  si: "සිංහල",
  ta: "தமிழ்",
};

/**
 * Set to true only after a native speaker has checked that language's text.
 * Until then its pages are `noindex`, left out of the sitemap and of hreflang
 * links, and show a short "translation under review" note.
 */
export const translationsReviewed: Record<Locale, boolean> = {
  en: true,
  si: false,
  ta: false,
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isPrefixedLocale(value: string): value is PrefixedLocale {
  return (prefixedLocales as readonly string[]).includes(value);
}

/** Static pages that exist in every language (service pages are added below). */
export const TRANSLATED_STATIC_PATHS = [
  "/",
  "/services",
  "/pricing",
  "/about",
  "/contact",
  "/faq",
] as const;

/** Whether an English path has Sinhala and Tamil versions. */
export function isTranslatedPath(path: string): boolean {
  return (
    (TRANSLATED_STATIC_PATHS as readonly string[]).includes(path) ||
    /^\/services\/[a-z0-9-]+$/.test(path)
  );
}

/**
 * Link target for a page in the given language. Pages that are not translated
 * (booking, articles, legal pages) always link to the English version.
 */
export function localeHref(locale: Locale, path: string): Route {
  const [pathname = "/", query] = path.split("?", 2);
  if (locale === defaultLocale || !isTranslatedPath(pathname)) return path as Route;
  const localized = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return (query ? `${localized}?${query}` : localized) as Route;
}

/** Splits a URL path into its language and the English path it corresponds to. */
export function splitLocalePath(pathname: string): { locale: Locale; basePath: string } {
  const match = /^\/(si|ta)(?=\/|$)/.exec(pathname);
  const candidate = match?.[1];
  if (!match || !candidate || !isPrefixedLocale(candidate)) {
    return { locale: defaultLocale, basePath: pathname };
  }
  return { locale: candidate, basePath: pathname.slice(match[0].length) || "/" };
}

/** The same page in another language, or that language's home page if it is not translated. */
export function switchLocalePath(pathname: string, target: Locale): Route {
  const { basePath } = splitLocalePath(pathname);
  return isTranslatedPath(basePath) ? localeHref(target, basePath) : localeHref(target, "/");
}
