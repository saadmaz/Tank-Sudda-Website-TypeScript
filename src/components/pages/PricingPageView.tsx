import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { Notice, SectionHeading } from "@/components/ui/primitives";
import { getPriceEntry, isDisplayablePrice } from "@/data/pricing";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { describeServicePrice, getDictionary, getLocalizedServices } from "@/lib/i18n/dictionary";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";

export function pricingMetadata(locale: Locale): Metadata {
  return buildLocalizedMetadata(locale, "/pricing", getDictionary(locale).pricingPage.meta);
}

export function PricingPageView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.pricingPage;
  const services = getLocalizedServices(locale);
  const anyPublishedPrice = services.some((service) =>
    isDisplayablePrice(getPriceEntry(service.slug)),
  );
  return (
    <>
      <PageHeader
        locale={locale}
        breadcrumbs={[{ name: page.breadcrumb, path: localeHref(locale, "/pricing") }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        actions={
          <ButtonLink href="/book" variant="onDark" size="lg">
            {t.common.requestQuotation}
          </ButtonLink>
        }
      />

      <section aria-labelledby="prices-heading" className="container-site section-y">
        <SectionHeading id="prices-heading" title={page.pricesTitle} />
        {!anyPublishedPrice ? (
          <Notice className="mt-6 max-w-3xl" title={page.noticeTitle}>
            {page.noticeBody}
          </Notice>
        ) : null}
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {services.map((service) => {
            const entry = getPriceEntry(service.slug);
            // Price notes are entered in English only.
            const note = locale === "en" ? entry?.notes : null;
            return (
              <li
                key={service.slug}
                className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8"
              >
                <div>
                  <h3 className="text-h3">
                    <Link
                      href={localeHref(locale, `/services/${service.slug}`)}
                      className="inline-flex min-h-11 items-center hover:text-water-700 hover:underline hover:underline-offset-4"
                    >
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-muted">{note ?? service.summary}</p>
                </div>
                <p className="font-display text-lg font-semibold text-navy-950 sm:text-right">
                  {describeServicePrice(locale, service.slug)}
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
            title={page.factorsTitle}
            intro={page.factorsIntro}
          />
          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.content.pricingFactors.map((factor) => (
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
          <SectionHeading id="quote-heading" title={page.quoteTitle} />
          <ProcessSteps steps={t.content.quotationSteps} layout="column" />
        </div>
      </section>

      <CtaBand locale={locale} title={page.ctaTitle} />
    </>
  );
}
