import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageView, homeMetadata } from "@/components/pages/HomePageView";
import { isPrefixedLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLocale(lang) ? homeMetadata(lang) : {};
}

export default async function LocaleHomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <HomePageView locale={lang} />;
}
