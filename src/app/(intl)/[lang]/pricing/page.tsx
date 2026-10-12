import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PricingPageView, pricingMetadata } from "@/components/pages/PricingPageView";
import { isPrefixedLocale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLocale(lang) ? pricingMetadata(lang) : {};
}

export default async function LocalePricingPage({ params }: PageProps<"/[lang]/pricing">) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <PricingPageView locale={lang} />;
}
