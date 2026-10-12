import Link from "next/link";
import { ArrowRight, ClipboardCheck, Clock, Eye, MapPin, Waves } from "lucide-react";
import { SumpDiagram } from "@/components/illustrations/TechnicalIllustrations";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/primitives";
import { getPublishedAreas } from "@/data/areas";
import { business } from "@/data/business";
import { pricingFactors } from "@/data/pricing";
import { commitments } from "@/data/site-content";
import { isContentPreview } from "@/lib/site";

const commitmentIcons = [ClipboardCheck, Waves, Clock, Eye];

export function CommitmentsSection({
  headingId = "commitments-heading",
  showAboutLink = true,
}: {
  headingId?: string;
  /** Hidden on the About page itself. */
  showAboutLink?: boolean;
}) {
  return (
    <section aria-labelledby={headingId} className="bg-mist">
      <div className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id={headingId}
              eyebrow={`Why ${business.name}`}
              title="How we work"
              intro="Straightforward commitments that apply to every job, from a single home tank to a whole building."
            />
            {showAboutLink ? (
              <ButtonLink href="/about" variant="secondary" className="mt-8 w-full sm:w-auto">
                About us
              </ButtonLink>
            ) : null}
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {commitments.map((item, index) => {
              const Icon = commitmentIcons[index % commitmentIcons.length]!;
              return (
                <li
                  key={item.title}
                  className="rounded-xl border border-line bg-white p-6 shadow-card lg:p-7"
                >
                  <span className="grid size-11 place-items-center rounded-lg bg-water-50 text-water-700 ring-1 ring-water-100">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-5 text-h3">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{item.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

const sedimentPoints = [
  {
    title: "It builds up gradually",
    body: "Fine particles carried in by the supply settle on the tank floor every time it refills.",
  },
  {
    title: "It can be stirred up",
    body: "Incoming water can disturb the layer, which is one reason for cloudy water or grit at the tap.",
  },
  {
    title: "It hides the tank floor",
    body: "A thick layer makes cracks, damage and other problems harder to spot.",
  },
];

/** Dark editorial band explaining why tank cleaning matters. */
export function WhyItMattersSection() {
  return (
    <section
      aria-labelledby="why-heading"
      className="on-dark relative overflow-hidden surface-navy"
    >
      <div className="relative container-site grid items-center gap-12 section-y lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="order-2 rounded-xl border border-white/10 bg-navy-900/60 p-4 lg:order-1">
          <SumpDiagram tone="dark" />
        </div>
        <div className="order-1 lg:order-2">
          <p className="eyebrow text-water-300">Why it matters</p>
          <h2 id="why-heading" className="mt-3 text-h1 text-white">
            What collects in your tank doesn’t stay there
          </h2>
          <p className="mt-5 text-lead text-grey-200">
            Most homes and buildings store water in a sump and an overhead tank. Both are out of
            sight, so sediment and build-up can go unnoticed for years.
          </p>
          <ul className="mt-8 space-y-5">
            {sedimentPoints.map((point, index) => (
              <li key={point.title} className="flex gap-4">
                <span className="font-display text-sm font-bold text-water-300 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold text-white">{point.title}</h3>
                  <p className="mt-1 leading-relaxed text-grey-300">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/blog/understanding-sediment-in-water-tanks"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-water-200 underline-offset-4 hover:text-white hover:underline"
          >
            Read: understanding sediment in water tanks
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AreasTeaser() {
  const areas = getPublishedAreas(isContentPreview);
  return (
    <section aria-labelledby="areas-heading" className="container-site section-y">
      <div className="grid gap-8 sm:gap-10 sm:rounded-lg sm:border sm:border-line sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
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
            className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold text-water-700 underline-offset-4 hover:underline"
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
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
