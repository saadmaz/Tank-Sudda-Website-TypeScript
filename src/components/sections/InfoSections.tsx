import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/primitives";
import { getPublishedAreas } from "@/data/areas";
import { business } from "@/data/business";
import { pricingFactors } from "@/data/pricing";
import { commitments } from "@/data/site-content";
import { isContentPreview } from "@/lib/site";

export function CommitmentsSection({ headingId = "commitments-heading" }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="bg-mist">
      <div className="container-site section-y">
        <SectionHeading
          id={headingId}
          eyebrow={`Why ${business.name}`}
          title="How we work"
          intro="Straightforward commitments that apply to every job, large or small."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {commitments.map((item, index) => (
            <li key={item.title} className="bg-white p-6 lg:p-8">
              <span className="font-display text-sm font-semibold text-water-600 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-h3">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AreasTeaser() {
  const areas = getPublishedAreas(isContentPreview);
  return (
    <section aria-labelledby="areas-heading" className="container-site section-y">
      <div className="grid gap-10 rounded-lg border border-line p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            id="areas-heading"
            eyebrow="Service areas"
            title="Where we work"
            intro={
              areas.length > 0
                ? "We currently serve the areas below. If your location isn't listed, ask us and we will tell you honestly whether we can help."
                : "We work in Sri Lanka. Include your town and address when you request a booking and we will confirm whether we can serve your location before arranging anything."
            }
          />
        </div>
        <div>
          {areas.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/areas/${area.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-4 font-medium text-navy-950 hover:border-water-500 hover:text-water-700"
                  >
                    <MapPin aria-hidden="true" className="size-4 text-water-600" />
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <Link
            href="/areas"
            className="mt-6 inline-flex items-center gap-1 font-semibold text-water-700 underline-offset-4 hover:underline"
          >
            About our service coverage
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PricingTeaser() {
  return (
    <section aria-labelledby="pricing-heading" className="border-y border-line bg-white">
      <div className="container-site grid gap-10 section-y lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading
            id="pricing-heading"
            eyebrow="Pricing"
            title="A clear quotation before any work starts"
            intro="Every tank is different, so we quote based on your tank rather than a one-size price. You will know the cost before you agree to anything."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/book">Request a quotation</ButtonLink>
            <ButtonLink href="/pricing" variant="secondary">
              How pricing works
            </ButtonLink>
          </div>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase">
            What affects the price
          </h3>
          <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {pricingFactors.map((factor) => (
              <div key={factor.title} className="border-t border-line pt-4">
                <dt className="font-semibold text-navy-950">{factor.title}</dt>
                <dd className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
                  {factor.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
