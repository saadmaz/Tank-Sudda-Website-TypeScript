import Link from "next/link";
import { CommercialDiagram } from "@/components/illustrations/TechnicalIllustrations";
import { PageHeader } from "@/components/layout/PageHeader";
import { SlotImage } from "@/components/media/SlotImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceGrid } from "@/components/services/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/primitives";
import { describePrice, getPriceEntry } from "@/data/pricing";
import { services } from "@/data/services";
import { customerJourney } from "@/data/site-content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Water Tank & Sump Cleaning Services",
  description:
    "Compare Tank Sudda's services: water tank deep cleaning, vacuum cleaning, sump cleaning, and commercial and institutional tank cleaning in Sri Lanka.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Services"
        title="Cleaning services for tanks and sumps"
        intro="Four services covering domestic tanks, underground sumps and larger buildings. Not sure which you need? Describe your tank when you book and we will recommend the right option."
        actions={
          <ButtonLink href="/book" variant="onDark" size="lg">
            Request a booking
          </ButtonLink>
        }
        aside={<SlotImage slot="servicesOverview" fallback={<CommercialDiagram tone="dark" />} />}
      />

      <section aria-labelledby="all-services" className="container-site section-y">
        <h2 id="all-services" className="sr-only">
          All services
        </h2>
        <ServiceGrid services={services} />
      </section>

      <section aria-labelledby="compare-heading" className="border-t border-line bg-mist">
        <div className="container-site section-y">
          <SectionHeading
            id="compare-heading"
            title="Which service is right for you?"
            intro="A quick comparison. Final recommendations are made after we understand your tank."
          />
          <div className="mt-10 overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full min-w-[44rem] text-left text-[0.9375rem]">
              <caption className="sr-only">Comparison of Tank Sudda services</caption>
              <thead className="border-b border-line bg-grey-50 text-sm text-navy-950">
                <tr>
                  <th scope="col" className="p-4 font-semibold">
                    Service
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Best for
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {services.map((service) => (
                  <tr key={service.slug} className="align-top">
                    <th scope="row" className="p-4 font-semibold text-navy-950">
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-water-700 underline-offset-4 hover:underline"
                      >
                        {service.name}
                      </Link>
                    </th>
                    <td className="p-4 text-muted">{service.suitableFor[0]}</td>
                    <td className="p-4 text-muted">{describePrice(getPriceEntry(service.slug))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="journey-heading" className="container-site section-y">
        <SectionHeading
          id="journey-heading"
          eyebrow="How booking works"
          title="What happens after you request a booking"
        />
        <div className="mt-12">
          <ProcessSteps steps={customerJourney} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
