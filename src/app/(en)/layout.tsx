import type { Metadata, Viewport } from "next";
import { SiteDocument } from "@/components/layout/SiteDocument";
import { rootMetadata, siteViewport } from "@/lib/seo/metadata";
import { inter, schibsted } from "../fonts";
import "../globals.css";

export const metadata: Metadata = rootMetadata();
export const viewport: Viewport = siteViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <SiteDocument locale="en" fontClassName={`${inter.variable} ${schibsted.variable}`}>
      {children}
    </SiteDocument>
  );
}
