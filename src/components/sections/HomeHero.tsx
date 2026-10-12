import { ArrowRight, Building2, ClipboardCheck, Phone, Waves } from "lucide-react";
import { WhatsAppButton } from "@/components/contact/ContactActions";
import { Illustration } from "@/components/illustrations/Illustration";
import { SlotImage } from "@/components/media/SlotImage";
import { ButtonLink } from "@/components/ui/Button";
import { business } from "@/data/business";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

const assuranceIcons = [ClipboardCheck, Waves, Building2];

/** Concentric ripple rings drawn behind the hero illustration. */
function Ripples() {
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute top-1/2 left-1/2 w-[135%] max-w-none -translate-x-1/2 -translate-y-1/2"
    >
      {[110, 170, 230, 290].map((r, i) => (
        <circle
          key={r}
          cx="300"
          cy="300"
          r={r}
          fill="none"
          stroke="#7fc1e6"
          strokeOpacity={0.16 - i * 0.03}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export function HomeHero({ locale = "en" }: { locale?: Locale }) {
  const { hero, common, whatsapp } = getDictionary(locale);
  return (
    <section
      aria-labelledby="hero-heading"
      data-analytics-placement="hero"
      className="on-dark relative overflow-hidden surface-navy"
    >
      <div className="relative container-site grid items-center gap-12 pt-14 pb-14 lg:min-h-[38rem] lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pt-24 lg:pb-20">
        <div>
          <h1
            id="hero-heading"
            className="font-display text-[clamp(2.5rem,1.6rem+3.6vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-white"
          >
            <span className="mb-5 block font-sans text-xs leading-normal font-semibold tracking-[0.14em] text-water-300 uppercase">
              {hero.kicker}
            </span>
            {hero.line1}
            <br />
            <span className="bg-gradient-to-r from-water-200 to-water-400 bg-clip-text text-transparent">
              {hero.line2}
            </span>
          </h1>
          <p className="mt-7 max-w-lg text-lead text-grey-200">{hero.intro}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/book" variant="onDark" size="lg" className="sm:min-w-52">
              {common.requestBooking}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <WhatsAppButton locale={locale} message={whatsapp.general} />
          </div>
          {business.phone ? (
            <a
              href={`tel:${business.phone.e164}`}
              className="group mt-5 inline-flex min-h-11 items-center gap-3 text-grey-300 hover:text-white"
            >
              <span className="grid size-9 place-items-center rounded-full ring-1 ring-white/20 transition-colors group-hover:ring-water-300">
                <Phone aria-hidden="true" className="size-4 text-water-300" />
              </span>
              <span className="text-sm">
                {common.orCall}{" "}
                <span className="font-semibold tracking-wide text-white">
                  {business.phone.display}
                </span>
              </span>
            </a>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-md lg:max-w-lg">
          <div
            aria-hidden="true"
            className="absolute inset-[12%] rounded-full bg-water-500/25 blur-3xl"
          />
          <Ripples />
          <SlotImage
            slot="homeHero"
            priority
            className="relative"
            fallback={<Illustration kind="tank" tone="dark" priority />}
          />
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-navy-950/40 backdrop-blur-sm">
        <ul className="container-site grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {hero.assurances.map(({ title, description }, index) => {
            const Icon = assuranceIcons[index % assuranceIcons.length]!;
            return (
              <li key={title} className="flex gap-4 py-5 sm:px-6 sm:py-6 sm:first:pl-0 lg:py-8">
                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-water-300" />
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-grey-300">{description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
