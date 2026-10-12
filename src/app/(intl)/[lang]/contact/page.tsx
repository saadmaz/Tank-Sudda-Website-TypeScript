import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactPageView, contactMetadata } from "@/components/pages/ContactPageView";
import { isPrefixedLocale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLocale(lang) ? contactMetadata(lang) : {};
}

export default async function LocaleContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <ContactPageView locale={lang} />;
}
