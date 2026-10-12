import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIllustrationView } from "@/components/illustrations/TechnicalIllustrations";
import { describePrice, getPriceEntry } from "@/data/pricing";
import type { Service } from "@/data/services";

export function ServiceCard({
  service,
  headingLevel = 3,
}: {
  service: Service;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-line bg-white shadow-card transition-colors hover:border-water-300">
      <div className="border-b border-line bg-mist px-6 pt-6">
        <ServiceIllustrationView
          kind={service.illustration}
          annotated={false}
          className="mx-auto max-h-44"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Heading className="text-h3">
          <Link
            href={`/services/${service.slug}`}
            className="group-hover:text-water-700 after:absolute after:inset-0 after:content-['']"
          >
            {service.name}
          </Link>
        </Heading>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{service.summary}</p>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4 text-sm">
          <span className="text-muted">{describePrice(getPriceEntry(service.slug))}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-water-700">
            Learn more
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
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
}: {
  services: Service[];
  headingLevel?: 2 | 3;
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {services.map((service) => (
        <li key={service.slug}>
          <ServiceCard service={service} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
