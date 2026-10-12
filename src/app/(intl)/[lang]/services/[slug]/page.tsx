import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageView, serviceMetadata } from "@/components/pages/ServicePageView";
import { getServiceBySlug, services } from "@/data/services";
import { isPrefixedLocale } from "@/lib/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const service = getServiceBySlug(slug);
  return service && isPrefixedLocale(lang) ? serviceMetadata(lang, service) : {};
}

export default async function LocaleServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service || !isPrefixedLocale(lang)) notFound();
  return <ServicePageView locale={lang} baseService={service} />;
}
