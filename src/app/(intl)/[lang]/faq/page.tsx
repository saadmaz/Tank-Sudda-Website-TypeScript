import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqPageView, faqMetadata } from "@/components/pages/FaqPageView";
import { isPrefixedLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLocale(lang) ? faqMetadata(lang) : {};
}

export default async function LocaleFaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <FaqPageView locale={lang} />;
}
