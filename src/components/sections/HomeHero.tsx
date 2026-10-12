import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, ClipboardCheck, Phone, Waves } from "lucide-react";
import { WhatsAppButton } from "@/components/contact/ContactActions";
import { TankCrossSection } from "@/components/illustrations/TechnicalIllustrations";
import { SlotImage } from "@/components/media/SlotImage";
import { ButtonLink } from "@/components/ui/Button";
import { business } from "@/data/business";
import { services } from "@/data/services";

const assurances = [
  { icon: ClipboardCheck, text: "Clear quotation before any work starts" },
  { icon: Waves, text: "Sediment removed from the tank, not flushed into your pipes" },
  { icon: Building2, text: "Homes, apartment buildings and organisations" },
];

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="on-dark relative overflow-hidden surface-navy"
    >
      <div className="relative container-site grid items-center gap-14 pt-12 pb-16 lg:grid-cols-[1.15fr_1fr] lg:pt-20 lg:pb-24">
        <div>
          <p className="pill border border-white/15 bg-white/5 text-water-200">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-water-400" />
            Homes · Apartments · Offices · Hotels
          </p>
          <h1 id="hero-heading" className="mt-6 text-display text-white">
            Professional <span className="text-water-300">water tank &amp; sump cleaning</span> in
            Sri Lanka
          </h1>
          <p className="mt-6 max-w-xl text-lead text-grey-200">
            We remove the sediment and build-up that collect inside overhead tanks and underground
            sumps, for homes, apartment buildings, offices, schools and hotels.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/book" variant="onDark" size="lg" className="w-full sm:w-auto">
              Request a booking
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <WhatsAppButton className="w-full sm:w-auto" />
          </div>
          {business.phone ? (
            <p className="mt-5 text-sm text-grey-300">
              Prefer to talk?{" "}
              <a
                href={`tel:${business.phone.e164}`}
                className="inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline"
              >
                <Phone aria-hidden="true" className="size-4 text-water-300" />
                {business.phone.display}
              </a>
            </p>
          ) : null}

          <ul className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            {assurances.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3 text-sm leading-snug text-grey-200">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white/8 ring-1 ring-white/10">
                  <Icon aria-hidden="true" className="size-4.5 text-water-300" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="rounded-xl border border-white/10 bg-navy-900/70 p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3 text-xs">
              <span className="font-semibold tracking-[0.12em] text-water-200 uppercase">
                Inside a water tank
              </span>
              <span className="text-grey-400">Cross-section</span>
            </div>
            <div className="rounded-lg bg-navy-950/80 px-4 pt-4 pb-2 ring-1 ring-white/5">
              <SlotImage slot="homeHero" priority fallback={<TankCrossSection tone="dark" />} />
            </div>
            <ul className="grid grid-cols-2 gap-2 p-2 pt-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex min-h-12 items-center justify-between gap-2 rounded-md bg-white/5 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
                  >
                    {service.shortName}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-water-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
