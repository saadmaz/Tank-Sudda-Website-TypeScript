import Link from "next/link";
import type { Metadata } from "next";
import { Illustration } from "@/components/illustrations/Illustration";
import { PageHeader } from "@/components/layout/PageHeader";
import { SlotImage } from "@/components/media/SlotImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceGrid } from "@/components/services/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/primitives";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { describeServicePrice, getDictionary, getLocalizedServices } from "@/lib/i18n/dictionary";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";

export function servicesMetadata(locale: Locale): Metadata {
  return buildLocalizedMetadata(locale, "/services", getDictionary(locale).servicesPage.meta);
}

export function ServicesPageView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.servicesPage;
  const services = getLocalizedServices(locale);
  return (
    <>
      <PageHeader
        locale={locale}
        breadcrumbs={[{ name: page.breadcrumb, path: localeHref(locale, "/services") }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        actions={
          <ButtonLink href="/book" variant="onDark" size="lg">
            {t.common.requestBooking}
          </ButtonLink>
        }
        aside={
          <SlotImage
            slot="servicesOverview"
            fallback={<Illustration kind="commercial" tone="dark" priority />}
          />
        }
      />

      <section aria-labelledby="all-services" className="container-site section-y">
        <h2 id="all-services" className="sr-only">
          {page.allServices}
        </h2>
        <ServiceGrid services={services} locale={locale} />
      </section>

      <section aria-labelledby="compare-heading" className="border-t border-line bg-mist">
        <div className="container-site section-y">
          <SectionHeading
            id="compare-heading"
            title={page.compareTitle}
            intro={page.compareIntro}
          />
          {/* Small screens: stacked cards instead of a sideways-scrolling table. */}
          <ul className="mt-10 space-y-3 md:hidden">
            {services.map((service) => (
              <li
                key={service.slug}
                className="rounded-xl border border-line bg-white p-5 shadow-card"
              >
                <Link
                  href={localeHref(locale, `/services/${service.slug}`)}
                  className="inline-flex min-h-11 items-center font-display text-lg font-bold text-navy-950 hover:text-water-700"
                >
                  {service.name}
                </Link>
                <dl className="mt-2 space-y-2 text-[0.9375rem]">
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                      {page.bestFor}
                    </dt>
                    <dd className="mt-0.5 text-body">{service.suitableFor[0]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">
                      {page.price}
                    </dt>
                    <dd className="mt-0.5 text-body">
                      {describeServicePrice(locale, service.slug)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
          <div className="mt-10 hidden overflow-x-auto rounded-lg border border-line bg-white md:block">
            <table className="w-full min-w-[40rem] text-left text-[0.9375rem]">
              <caption className="sr-only">{page.tableCaption}</caption>
              <thead className="border-b border-line bg-grey-50 text-sm text-navy-950">
                <tr>
                  <th scope="col" className="p-4 font-semibold">
                    {page.service}
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    {page.bestFor}
                  </th>
                  <th scope="col" className="p-4 font-semibold">
                    {page.price}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {services.map((service) => (
                  <tr key={service.slug} className="align-top">
                    <th scope="row" className="p-4 font-semibold text-navy-950">
                      <Link
                        href={localeHref(locale, `/services/${service.slug}`)}
                        className="inline-flex min-h-11 items-center text-water-700 underline-offset-4 hover:underline"
                      >
                        {service.name}
                      </Link>
                    </th>
                    <td className="p-4 text-muted">{service.suitableFor[0]}</td>
                    <td className="p-4 text-muted">{describeServicePrice(locale, service.slug)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="journey-heading" className="container-site section-y">
        <SectionHeading
          id="journey-heading"
          eyebrow={page.journeyEyebrow}
          title={page.journeyTitle}
        />
        <div className="mt-12">
          <ProcessSteps steps={t.content.customerJourney} />
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
