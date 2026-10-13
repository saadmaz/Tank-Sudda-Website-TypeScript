import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SiteDocument } from "@/components/layout/SiteDocument";
import { isPrefixedLocale, prefixedLocales } from "@/lib/i18n/config";
import { rootMetadata, siteViewport } from "@/lib/seo/metadata";
import { inter, schibsted } from "../../fonts";
import { notoSinhala, notoTamil } from "../fonts";
import "../../globals.css";

/** Root layout for the Sinhala (/si) and Tamil (/ta) pages. */
export const dynamicParams = false;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

export const metadata: Metadata = rootMetadata();
export const viewport: Viewport = siteViewport;

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  const script = lang === "si" ? notoSinhala : notoTamil;
  return (
    <SiteDocument
      locale={lang}
      fontClassName={`${inter.variable} ${schibsted.variable} ${script.variable}`}
    >
      {children}
    </SiteDocument>
  );
}
