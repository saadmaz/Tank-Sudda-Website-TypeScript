import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { ServiceGrid } from "@/components/services/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/primitives";
import { getAreaBySlug, getPublishedAreas } from "@/data/areas";
import { business } from "@/data/business";
import { getServicesBySlugs } from "@/data/services";
import { buildMetadata } from "@/lib/seo/metadata";
import { isContentPreview } from "@/lib/site";

export const dynamicParams = false;

/** Only confirmed areas are generated; unverified drafts return 404 in production. */
export function generateStaticParams() {
  return getPublishedAreas(isContentPreview).map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps<"/areas/[slug]">): Promise<Metadata> {
  const area = getAreaBySlug((await params).slug, isContentPreview);
  if (!area) return {};
  return buildMetadata({
    title: `Water Tank Cleaning in ${area.name}`,
    description: area.metaDescription,
    path: `/areas/${area.slug}`,
    noIndex: area.status !== "confirmed",
  });
}

export default async function AreaPage({ params }: PageProps<"/areas/[slug]">) {
  const area = getAreaBySlug((await params).slug, isContentPreview);
  if (!area) notFound();
  const areaServices = getServicesBySlugs(area.serviceSlugs);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { name: "Service areas", path: "/areas" },
          { name: area.name, path: `/areas/${area.slug}` },
        ]}
        eyebrow={`${area.district} District · ${area.province} Province`}
        title={`Water tank and sump cleaning in ${area.name}`}
        intro={area.intro}
        actions={<ButtonLink href="/book">Request a booking in {area.name}</ButtonLink>}
      />

      {area.status !== "confirmed" ? (
        <div className="container-site pt-8">
          <Notice tone="warning" title="Draft area — not published">
            This area is unverified and only visible in development. Set its status to “confirmed”
            in src/data/areas.ts once coverage is verified.
          </Notice>
        </div>
      ) : null}

      <section aria-labelledby="local-heading" className="container-site section-y">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <h2 id="local-heading" className="text-h2">
            What to know in {area.name}
          </h2>
          <div className="space-y-8">
            {area.localNotes.map((note) => (
              <div key={note.heading}>
                <h3 className="text-h3">{note.heading}</h3>
                <p className="mt-2 leading-relaxed text-muted">{note.body}</p>
              </div>
            ))}
            {area.placesCovered.length > 0 ? (
              <div>
                <h3 className="text-h3">Places we cover</h3>
                <p className="mt-2 leading-relaxed text-muted">{area.placesCovered.join(", ")}.</p>
              </div>
            ) : null}
            <p className="leading-relaxed text-muted">
              Not sure whether your address is covered? Include it in your{" "}
              <Link href="/book" className="text-water-700 underline underline-offset-4">
                booking request
              </Link>{" "}
              and {business.name} will confirm before arranging anything.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="area-services-heading" className="border-t border-line bg-mist">
        <div className="container-site section-y">
          <h2 id="area-services-heading" className="text-h2">
            Services in {area.name}
          </h2>
          <div className="mt-10">
            <ServiceGrid services={areaServices} />
          </div>
        </div>
      </section>

      <CtaBand title={`Book a tank cleaning in ${area.name}`} />
    </>
  );
}
