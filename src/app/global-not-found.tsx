import type { Metadata } from "next";
import { SiteDocument } from "@/components/layout/SiteDocument";
import { NotFoundContent } from "@/components/pages/NotFoundContent";
import { rootMetadata } from "@/lib/seo/metadata";
import { inter, schibsted } from "./fonts";
import "./globals.css";

/**
 * 404 for URLs that match no route. With separate root layouts for English and
 * for Sinhala/Tamil there is no single layout to render it in, so this page
 * brings its own document (see experimental.globalNotFound in next.config.ts).
 */
export const metadata: Metadata = {
  ...rootMetadata(),
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <SiteDocument locale="en" fontClassName={`${inter.variable} ${schibsted.variable}`}>
      <NotFoundContent />
    </SiteDocument>
  );
}
