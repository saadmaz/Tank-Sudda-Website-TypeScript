import type { ReactNode } from "react";
import { Analytics } from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { parseGaMeasurementId } from "@/lib/analytics";
import { htmlLang, translationsReviewed, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { TopBar } from "./TopBar";

/** The <html> document shared by the English and the Sinhala/Tamil root layouts. */
export function SiteDocument({
  locale,
  fontClassName,
  children,
}: {
  locale: Locale;
  fontClassName: string;
  children: ReactNode;
}) {
  const t = getDictionary(locale);
  return (
    <html lang={htmlLang[locale]} className={fontClassName}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-navy-950 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t.common.skipLink}
        </a>
        {/* Contact bar (desktop) and menu bar stay pinned to the top together. */}
        <div className="sticky top-0 z-40">
          <TopBar locale={locale} />
          <SiteHeader locale={locale} />
        </div>
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {!translationsReviewed[locale] && t.common.reviewNotice ? (
            <p className="border-b border-water-100 bg-water-50 py-2.5 text-[0.8125rem] leading-snug text-navy-900 sm:text-sm">
              <span className="container-site block">{t.common.reviewNotice}</span>
            </p>
          ) : null}
          {children}
        </main>
        <SiteFooter locale={locale} />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Analytics
          plausibleDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || null}
          gaMeasurementId={parseGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)}
          consentLabels={t.consent}
        />
      </body>
    </html>
  );
}
