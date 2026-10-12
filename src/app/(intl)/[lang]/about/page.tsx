import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutPageView, aboutMetadata } from "@/components/pages/AboutPageView";
import { isPrefixedLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLocale(lang) ? aboutMetadata(lang) : {};
}

export default async function LocaleAboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <AboutPageView locale={lang} />;
}
