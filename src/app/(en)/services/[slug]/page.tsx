import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageView, serviceMetadata } from "@/components/pages/ServicePageView";
import { getServiceBySlug, services } from "@/data/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  return service ? serviceMetadata("en", service) : {};
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return <ServicePageView locale="en" baseService={service} />;
}
