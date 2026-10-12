"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { htmlLang, localeNames, locales, switchLocalePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Links to the current page in English, Sinhala and Tamil. Pages that are only
 * available in English lead to the home page of the chosen language.
 */
export function LanguageSwitcher({
  locale,
  label,
  tone = "light",
  compact = false,
  landmark = false,
  className,
}: {
  locale: Locale;
  /** Accessible name, e.g. "Language", in the current language. */
  label: string;
  tone?: "light" | "dark";
  /** Shorter links for the 2.5rem desktop contact bar. */
  compact?: boolean;
  /** Render as a navigation landmark. Only one copy per page should be, so names stay unique. */
  landmark?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const dark = tone === "dark";
  const Wrapper = landmark ? "nav" : "div";
  return (
    <Wrapper aria-label={label} role={landmark ? undefined : "group"} className={className}>
      <ul className={cn("flex items-center gap-1", compact ? "flex-nowrap" : "flex-wrap")}>
        {locales.map((target) => {
          const current = target === locale;
          return (
            <li key={target}>
              <Link
                href={switchLocalePath(pathname, target)}
                hrefLang={htmlLang[target]}
                lang={htmlLang[target]}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "inline-flex items-center rounded-md px-2.5 font-medium whitespace-nowrap",
                  compact ? "min-h-8" : "min-h-11",
                  dark
                    ? current
                      ? "text-white underline underline-offset-4"
                      : "text-grey-300 hover:text-white"
                    : current
                      ? "bg-water-50 text-water-800"
                      : "text-navy-900 hover:bg-grey-100 hover:text-water-700",
                )}
              >
                {localeNames[target]}
              </Link>
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
}
