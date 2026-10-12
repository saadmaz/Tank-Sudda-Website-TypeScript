import { ArrowRight } from "lucide-react";
import { WhatsAppButton } from "@/components/contact/ContactActions";
import { TankCrossSection } from "@/components/illustrations/TechnicalIllustrations";
import { SlotImage } from "@/components/media/SlotImage";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/data/services";

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="on-dark relative overflow-hidden bg-navy-950"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div className="relative container-site grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div>
          <p className="eyebrow text-water-300">Water tank &amp; sump cleaning · Sri Lanka</p>
          <h1 id="hero-heading" className="mt-4 text-display text-white">
            Clean water storage starts with a clean tank.
          </h1>
          <p className="mt-6 max-w-xl text-lead text-grey-200">
            Tank Sudda cleans overhead tanks and underground sumps for homes, apartment buildings
            and organisations — removing the sediment and build-up that collect where you cannot see
            them.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/book" variant="onDark" size="lg">
              Request a booking
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <WhatsAppButton />
            <ButtonLink href="/services" variant="onDarkOutline" size="lg">
              Explore services
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-grey-300">
            {services.map((service) => (
              <li key={service.slug} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-water-400" />
                {service.shortName}
              </li>
            ))}
          </ul>
        </div>
        <SlotImage
          slot="homeHero"
          priority
          className="mx-auto w-full max-w-lg"
          fallback={<TankCrossSection tone="dark" />}
        />
      </div>
    </section>
  );
}
