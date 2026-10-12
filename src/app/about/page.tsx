import Link from "next/link";
import { SumpDiagram } from "@/components/illustrations/TechnicalIllustrations";
import { PageHeader } from "@/components/layout/PageHeader";
import { SlotImage } from "@/components/media/SlotImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { CommitmentsSection } from "@/components/sections/InfoSections";
import { business } from "@/data/business";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "About Tank Sudda",
  description:
    "Tank Sudda is a water tank and sump cleaning service in Sri Lanka. Learn what we do, how we work and what you can expect from us.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About us"
        title="Looking after the water you store"
        intro={`${business.name} is a water tank and sump cleaning service in ${business.countryName}. We clean the tanks that homes, apartment buildings and organisations depend on every day.`}
      />

      <section aria-labelledby="story-heading" className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-5 text-lead leading-relaxed">
            <h2 id="story-heading" className="text-h2">
              Why tank cleaning matters
            </h2>
            <p>
              In many Sri Lankan homes and buildings, water passes through an underground sump and
              an overhead tank before it reaches the tap. Both quietly collect sediment and debris
              over time, and because they are out of sight, they are easy to overlook.
            </p>
            <p>
              Our work is simple to describe: we remove what has built up, clean the surfaces, and
              return the tank to service, keeping you informed about how long your water will be off
              and anything we notice along the way.
            </p>
            <p>
              Our services cover{" "}
              {services.map((service, index) => (
                <span key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-water-700 underline underline-offset-4"
                  >
                    {service.shortName.toLowerCase()}
                  </Link>
                  {index < services.length - 2
                    ? ", "
                    : index === services.length - 2
                      ? " and "
                      : "."}
                </span>
              ))}
            </p>
          </div>
          <SlotImage
            slot="aboutStory"
            fallback={<SumpDiagram />}
            className="rounded-lg border border-line bg-mist p-6"
          />
        </div>
      </section>

      <CommitmentsSection showAboutLink={false} />

      <section aria-labelledby="learn-heading" className="container-site section-y">
        <div className="max-w-3xl">
          <h2 id="learn-heading" className="text-h2">
            Sharing what we know
          </h2>
          <p className="mt-4 text-lead text-muted">
            We publish practical guides to help property owners understand their tanks: how sediment
            builds up, how often to clean, and how to prepare. Start with our{" "}
            <Link href="/guides" className="text-water-700 underline underline-offset-4">
              guides
            </Link>{" "}
            or browse the{" "}
            <Link href="/blog" className="text-water-700 underline underline-offset-4">
              blog
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
