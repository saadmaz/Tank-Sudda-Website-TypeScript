import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicesPageView, servicesMetadata } from "@/components/pages/ServicesPageView";
import { isPrefixedLocale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLocale(lang) ? servicesMetadata(lang) : {};
}

export default async function LocaleServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <ServicesPageView locale={lang} />;
}
