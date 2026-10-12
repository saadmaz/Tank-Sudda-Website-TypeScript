import Link from "next/link";
import { ArrowRight, ClipboardCheck, Clock, Eye, MapPin, Waves } from "lucide-react";
import { Illustration } from "@/components/illustrations/Illustration";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/primitives";
import { getPublishedAreas } from "@/data/areas";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isContentPreview } from "@/lib/site";

const commitmentIcons = [ClipboardCheck, Waves, Clock, Eye];

export function CommitmentsSection({
  headingId = "commitments-heading",
  showAboutLink = true,
  locale = "en",
}: {
  headingId?: string;
  /** Hidden on the About page itself. */
  showAboutLink?: boolean;
  locale?: Locale;
}) {
  const t = getDictionary(locale);
  return (
    <section aria-labelledby={headingId} className="bg-mist">
      <div className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <SectionHeading
              id={headingId}
              eyebrow={t.commitments.eyebrow}
              title={t.commitments.title}
              intro={t.commitments.intro}
            />
            {showAboutLink ? (
              <ButtonLink
                href={localeHref(locale, "/about")}
                variant="secondary"
                className="mt-8 w-full sm:w-auto"
              >
                {t.commitments.aboutUs}
              </ButtonLink>
            ) : null}
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {t.content.commitments.map((item, index) => {
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

/** Dark editorial band explaining why tank cleaning matters. */
export function WhyItMattersSection({ locale = "en" }: { locale?: Locale }) {
  const { why } = getDictionary(locale);
  return (
    <section
      aria-labelledby="why-heading"
      className="on-dark relative overflow-hidden surface-navy"
    >
      <div className="relative container-site grid items-center gap-12 section-y lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="order-2 rounded-xl border border-white/10 bg-navy-900/60 p-4 lg:order-1">
          <Illustration kind="sump" tone="dark" />
        </div>
        <div className="order-1 lg:order-2">
          <p className="eyebrow text-water-300">{why.eyebrow}</p>
          <h2 id="why-heading" className="mt-3 text-h1 text-white">
            {why.title}
          </h2>
          <p className="mt-5 text-lead text-grey-200">{why.intro}</p>
          <ul className="mt-8 space-y-5">
            {why.points.map((point, index) => (
              <li key={point.title} className="flex gap-4">
                <span className="font-display text-sm font-bold text-water-300 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold text-white">{point.title}</h3>
                  <p className="mt-1 leading-relaxed text-grey-300">{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/blog/understanding-sediment-in-water-tanks"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-water-200 underline-offset-4 hover:text-white hover:underline"
          >
            {why.readMore}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AreasTeaser({ locale = "en" }: { locale?: Locale }) {
  const { areas: text } = getDictionary(locale);
  const areas = getPublishedAreas(isContentPreview);
  return (
    <section aria-labelledby="areas-heading" className="container-site section-y">
      <div className="grid gap-8 sm:gap-10 sm:rounded-lg sm:border sm:border-line sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <SectionHeading
            id="areas-heading"
            eyebrow={text.eyebrow}
            title={text.title}
            intro={areas.length > 0 ? text.introWithAreas : text.introNoAreas}
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
            {text.coverageLink}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PricingTeaser({ locale = "en" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  return (
    <section aria-labelledby="pricing-heading" className="border-y border-line bg-white">
      <div className="container-site grid gap-10 section-y lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading
            id="pricing-heading"
            eyebrow={t.pricingTeaser.eyebrow}
            title={t.pricingTeaser.title}
            intro={t.pricingTeaser.intro}
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/book">{t.common.requestQuotation}</ButtonLink>
            <ButtonLink href={localeHref(locale, "/pricing")} variant="secondary">
              {t.common.howPricingWorks}
            </ButtonLink>
          </div>
        </div>
        <div>
          <h3 className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase">
            {t.pricingTeaser.factorsHeading}
          </h3>
          <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {t.content.pricingFactors.map((factor) => (
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
