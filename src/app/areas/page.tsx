import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Notice, SectionHeading } from "@/components/ui/primitives";
import { getPublishedAreas } from "@/data/areas";
import { business } from "@/data/business";
import { buildMetadata } from "@/lib/seo/metadata";
import { isContentPreview } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Service Areas",
  description: `Where ${business.name} provides water tank and sump cleaning in Sri Lanka, and how to check whether we can serve your location.`,
  path: "/areas",
});

export default function AreasPage() {
  const areas = getPublishedAreas(isContentPreview);
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Service areas", path: "/areas" }]}
        eyebrow="Coverage"
        title="Where we work"
        intro={`${business.name} provides tank and sump cleaning in ${business.countryName}. We only list areas we can reliably serve, and we confirm coverage for every request before arranging a visit.`}
        actions={
          <ButtonLink href="/book" variant="onDark" size="lg">
            Check availability for your location
          </ButtonLink>
        }
      />

      <section aria-labelledby="areas-list-heading" className="container-site section-y">
        <SectionHeading id="areas-list-heading" title="Confirmed service areas" />
        {areas.length > 0 ? (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/areas/${area.slug}`}
                  className="flex h-full flex-col rounded-lg border border-line bg-white p-6 shadow-card hover:border-water-300"
                >
                  <span className="flex items-center gap-2">
                    <MapPin aria-hidden="true" className="size-5 text-water-600" />
                    <span className="font-display text-h3 font-semibold text-navy-950">
                      {area.name}
                    </span>
                    {area.status !== "confirmed" ? <Badge tone="warning">Draft</Badge> : null}
                  </span>
                  <span className="mt-1 text-sm text-muted">
                    {area.district} District, {area.province} Province
                  </span>
                  <span className="mt-4 leading-relaxed text-muted">{area.intro}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Notice className="mt-8 max-w-3xl" title="Our coverage list is being finalised">
            We are confirming the areas we can serve reliably before listing them here. In the
            meantime, include your town and address in your booking request and we will tell you
            whether we can help before anything is arranged.
          </Notice>
        )}
      </section>

      <section aria-labelledby="how-coverage-heading" className="border-t border-line bg-mist">
        <div className="container-site grid gap-10 section-y lg:grid-cols-2">
          <SectionHeading id="how-coverage-heading" title="How we confirm coverage" />
          <ul className="space-y-4 leading-relaxed">
            <li>
              <strong className="text-navy-950">Tell us your location.</strong> The booking form
              asks for your town and address.
            </li>
            <li>
              <strong className="text-navy-950">We check before confirming.</strong> We consider
              travel, equipment and scheduling for your location.
            </li>
            <li>
              <strong className="text-navy-950">You get a straight answer.</strong> If we cannot
              serve your area, we will tell you rather than leave you waiting.
            </li>
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
