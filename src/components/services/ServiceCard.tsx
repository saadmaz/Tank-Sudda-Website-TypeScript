import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ServiceIllustrationView } from "@/components/illustrations/TechnicalIllustrations";
import { describePrice, getPriceEntry } from "@/data/pricing";
import type { Service } from "@/data/services";

/** Wide feature card: illustration panel beside the service summary. */
export function ServiceCard({
  service,
  index,
  headingLevel = 3,
}: {
  service: Service;
  index?: number;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article className="group relative grid h-full overflow-hidden rounded-xl border border-line bg-white shadow-card transition-[border-color,box-shadow] duration-200 hover:border-water-300 hover:shadow-raised sm:grid-cols-[12rem_1fr] lg:grid-cols-[13rem_1fr]">
      <div className="relative flex items-center justify-center border-b border-line bg-mist p-5 sm:border-r sm:border-b-0">
        {index !== undefined ? (
          <span className="absolute top-4 left-4 font-display text-sm font-bold text-water-600 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        <ServiceIllustrationView
          kind={service.illustration}
          annotated={false}
          className="max-h-28 transition-transform duration-300 group-hover:scale-[1.03] sm:max-h-40"
        />
      </div>
      <div className="flex flex-col p-6 lg:p-7">
        <Heading className="text-h3">
          <Link
            href={`/services/${service.slug}`}
            className="group-hover:text-water-700 after:absolute after:inset-0 after:content-['']"
          >
            {service.name}
          </Link>
        </Heading>
        <p className="mt-2.5 leading-relaxed text-muted">{service.summary}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-body">
          {service.suitableFor.slice(0, 2).map((item) => (
            <li key={item} className="flex gap-2">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-water-600" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm">
          <span className="text-muted">{describePrice(getPriceEntry(service.slug))}</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-water-700">
            View service
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </article>
  );
}

export function ServiceGrid({
  services,
  headingLevel,
  numbered = false,
}: {
  services: Service[];
  headingLevel?: 2 | 3;
  numbered?: boolean;
}) {
  return (
    <ul className="grid gap-6 lg:grid-cols-2">
      {services.map((service, index) => (
        <li key={service.slug}>
          <ServiceCard
            service={service}
            headingLevel={headingLevel}
            index={numbered ? index : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
