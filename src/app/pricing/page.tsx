import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { Notice, SectionHeading } from "@/components/ui/primitives";
import { describePrice, getPriceEntry, isDisplayablePrice, pricingFactors } from "@/data/pricing";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Pricing & Quotations",
  description:
    "How Tank Sudda prices water tank and sump cleaning in Sri Lanka: what affects the cost, how quotations work, and how to request one.",
  path: "/pricing",
});

const quotationSteps = [
  {
    title: "Send your details",
    description: "Use the booking form to describe your property, tanks and preferred timing.",
  },
  {
    title: "Receive a quotation",
    description:
      "We review the details and contact you with a quotation, or arrange a site assessment for larger jobs.",
  },
  {
    title: "Confirm the booking",
    description:
      "Once you accept the quotation, we agree a date. Your booking is only confirmed at this point.",
  },
];

export default function PricingPage() {
  const anyPublishedPrice = services.some((service) =>
    isDisplayablePrice(getPriceEntry(service.slug)),
  );
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Pricing", path: "/pricing" }]}
        eyebrow="Pricing"
        title="Clear quotations, agreed before work begins"
        intro="Tanks vary widely in size, access and condition, so we price each job on what it actually involves. You receive a quotation before anything is booked, and nothing is charged that you have not agreed."
        actions={
          <ButtonLink href="/book" variant="onDark" size="lg">
            Request a quotation
          </ButtonLink>
        }
      />

      <section aria-labelledby="prices-heading" className="container-site section-y">
        <SectionHeading id="prices-heading" title="Prices by service" />
        {!anyPublishedPrice ? (
          <Notice className="mt-6 max-w-3xl" title="All services are currently quoted individually">
            Send us your tank details through the booking form and we will reply with a quotation.
            For larger or multi-tank sites, we may need to assess the site first.
          </Notice>
        ) : null}
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {services.map((service) => {
            const entry = getPriceEntry(service.slug);
            return (
              <li
                key={service.slug}
                className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8"
              >
                <div>
                  <h3 className="text-h3">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex min-h-11 items-center hover:text-water-700 hover:underline hover:underline-offset-4"
                    >
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-muted">{entry?.notes ?? service.summary}</p>
                </div>
                <p className="font-display text-lg font-semibold text-navy-950 sm:text-right">
                  {describePrice(entry)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="factors-heading" className="bg-mist">
        <div className="container-site section-y">
          <SectionHeading
            id="factors-heading"
            title="What affects the price"
            intro="Giving us accurate details in your booking request helps us quote quickly and accurately."
          />
          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pricingFactors.map((factor) => (
              <div key={factor.title} className="rounded-lg border border-line bg-white p-6">
                <dt className="font-semibold text-navy-950">{factor.title}</dt>
                <dd className="mt-2 leading-relaxed text-muted">{factor.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="quote-heading" className="container-site section-y">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeading id="quote-heading" title="How quotations work" />
          <ProcessSteps steps={quotationSteps} layout="column" />
        </div>
      </section>

      <CtaBand title="Get a quotation for your tank" />
    </>
  );
}
