import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ArticleGrid } from "@/components/blog/ArticleCard";
import { WhatsAppButton } from "@/components/contact/ContactActions";
import { Illustration } from "@/components/illustrations/Illustration";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { CheckList, Panel } from "@/components/ui/primitives";
import { getFaqsByIds } from "@/data/faqs";
import { getServicesBySlugs, type Service } from "@/data/services";
import { getArticlesBySlugs } from "@/lib/content/blog.server";
import { localeHref, type Locale } from "@/lib/i18n/config";
import {
  describeServicePrice,
  getDictionary,
  getLocalizedFaqs,
  localizeService,
} from "@/lib/i18n/dictionary";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { serviceSchema } from "@/lib/seo/schema";

export function serviceMetadata(locale: Locale, service: Service): Metadata {
  const localized = localizeService(service, locale);
  return buildLocalizedMetadata(locale, `/services/${service.slug}`, {
    title: localized.name,
    description: localized.metaDescription,
  });
}

/** A service detail page. `baseService` is the English entry from src/data/services. */
export function ServicePageView({ locale, baseService }: { locale: Locale; baseService: Service }) {
  const t = getDictionary(locale);
  const page = t.servicePage;
  const service = localizeService(baseService, locale);
  const path = localeHref(locale, `/services/${service.slug}`);
  const faqs = getLocalizedFaqs(locale, getFaqsByIds(service.faqIds));
  const relatedServices = getServicesBySlugs(service.relatedServiceSlugs).map((related) =>
    localizeService(related, locale),
  );
  // Articles are in English, so they are suggested on English pages only.
  const articles = locale === "en" ? getArticlesBySlugs(service.relatedArticleSlugs) : [];
  const bookingHref = `/book?service=${service.slug}` as const;

  return (
    <>
      <PageHeader
        locale={locale}
        tone="navy"
        breadcrumbs={[
          { name: t.servicesPage.breadcrumb, path: localeHref(locale, "/services") },
          { name: service.name, path },
        ]}
        eyebrow={page.eyebrow}
        title={service.name}
        intro={service.intro}
        actions={
          <>
            <ButtonLink href={bookingHref} variant="onDark" size="lg">
              {page.bookThis}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <WhatsAppButton
              locale={locale}
              serviceName={service.name}
              label={t.common.askOnWhatsApp}
            />
          </>
        }
        aside={<Illustration kind={service.illustration} tone="dark" priority />}
      />

      <div className="container-site grid gap-12 section-y lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0 space-y-16">
          <section aria-labelledby="involves-heading">
            <h2 id="involves-heading" className="text-h2">
              {page.involves}
            </h2>
            <CheckList items={service.whatItInvolves} className="mt-6 text-body" />
          </section>

          <section aria-labelledby="process-heading">
            <h2 id="process-heading" className="text-h2">
              {page.process}
            </h2>
            <div className="mt-8">
              <ProcessSteps steps={service.process} layout="column" />
            </div>
          </section>

          {service.sections.map((section, index) => (
            <section key={section.heading} aria-labelledby={`section-${index}`}>
              <h2 id={`section-${index}`} className="text-h2">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="prepare-heading">
            <h2 id="prepare-heading" className="text-h2">
              {page.beforeYouBook}
            </h2>
            <CheckList items={service.beforeYouBook} className="mt-6" />
            <p className="mt-6">
              {page.prepBefore}
              <Link
                href="/blog/how-to-prepare-for-water-tank-cleaning"
                className="font-medium text-water-700 underline underline-offset-4"
              >
                {page.prepLink}
              </Link>
              {t.common.inEnglish}
              {page.prepAfter}
            </p>
          </section>

          {faqs.length > 0 ? (
            <section aria-labelledby="service-faq-heading">
              <h2 id="service-faq-heading" className="text-h2">
                {page.faqHeading(service.shortName)}
              </h2>
              <Accordion
                className="mt-6"
                items={faqs.map((faq) => ({
                  id: `faq-${faq.id}`,
                  title: faq.question,
                  content: <p>{faq.answer}</p>,
                }))}
              />
            </section>
          ) : null}
        </div>

        <aside
          aria-label={page.summaryLabel}
          className="space-y-6 lg:sticky lg:top-36 lg:self-start"
        >
          <Panel>
            <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase">
              {page.price}
            </h2>
            <p className="mt-2 font-display text-xl font-semibold text-navy-950">
              {describeServicePrice(locale, service.slug)}
            </p>
            <p className="mt-2 text-sm text-muted">
              {page.priceNote}{" "}
              <Link
                href={localeHref(locale, "/pricing")}
                className="text-water-700 underline underline-offset-4"
              >
                {t.common.howPricingWorks}
              </Link>
            </p>
            <ButtonLink href={bookingHref} className="mt-6 w-full">
              {t.common.requestBooking}
            </ButtonLink>
          </Panel>
          <Panel>
            <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase">
              {page.suitableFor}
            </h2>
            <ul className="mt-3 space-y-2 text-[0.9375rem]">
              {service.suitableFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-water-500"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
          {relatedServices.length > 0 ? (
            <nav
              aria-labelledby="related-services-heading"
              className="rounded-lg border border-line p-6"
            >
              <h2
                id="related-services-heading"
                className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase"
              >
                {page.relatedServices}
              </h2>
              <ul className="mt-3 space-y-1">
                {relatedServices.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={localeHref(locale, `/services/${related.slug}`)}
                      className="inline-flex min-h-11 items-center gap-1 font-medium text-water-700 underline-offset-4 hover:underline"
                    >
                      {related.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
      </div>

      {articles.length > 0 ? (
        <section
          aria-labelledby="related-articles-heading"
          className="border-t border-line bg-mist"
        >
          <div className="container-site section-y">
            <h2 id="related-articles-heading" className="text-h2">
              {page.helpfulGuides}
            </h2>
            <div className="mt-10">
              <ArticleGrid articles={articles} />
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand locale={locale} title={page.ctaTitle(service.shortName)} />
      <JsonLd data={serviceSchema(service, undefined, path)} />
    </>
  );
}
