import Link from "next/link";
import type { Metadata } from "next";
import { Illustration } from "@/components/illustrations/Illustration";
import { PageHeader } from "@/components/layout/PageHeader";
import { SlotImage } from "@/components/media/SlotImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { CommitmentsSection } from "@/components/sections/InfoSections";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary, getLocalizedServices } from "@/lib/i18n/dictionary";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";

export function aboutMetadata(locale: Locale): Metadata {
  return buildLocalizedMetadata(locale, "/about", getDictionary(locale).aboutPage.meta);
}

export function AboutPageView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.aboutPage;
  const services = getLocalizedServices(locale);
  return (
    <>
      <PageHeader
        locale={locale}
        breadcrumbs={[{ name: page.breadcrumb, path: localeHref(locale, "/about") }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
      />

      <section aria-labelledby="story-heading" className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-5 text-lead leading-relaxed">
            <h2 id="story-heading" className="text-h2">
              {page.storyTitle}
            </h2>
            {page.storyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              {page.servicesLead}
              {services.map((service, index) => (
                <span key={service.slug}>
                  <Link
                    href={localeHref(locale, `/services/${service.slug}`)}
                    className="text-water-700 underline underline-offset-4"
                  >
                    {page.lowercaseServiceNames
                      ? service.shortName.toLowerCase()
                      : service.shortName}
                  </Link>
                  {index < services.length - 2
                    ? page.listSeparator
                    : index === services.length - 2
                      ? page.listAnd
                      : page.listEnd}
                </span>
              ))}
            </p>
          </div>
          <SlotImage
            slot="aboutStory"
            fallback={<Illustration kind="sump" />}
            className="rounded-lg border border-line bg-mist p-6"
          />
        </div>
      </section>

      <CommitmentsSection showAboutLink={false} locale={locale} />

      <section aria-labelledby="learn-heading" className="container-site section-y">
        <div className="max-w-3xl">
          <h2 id="learn-heading" className="text-h2">
            {page.learnTitle}
          </h2>
          <p className="mt-4 text-lead text-muted">
            {page.learnBefore}
            <Link href="/guides" className="text-water-700 underline underline-offset-4">
              {page.learnGuides}
            </Link>
            {page.learnMiddle}
            <Link href="/blog" className="text-water-700 underline underline-offset-4">
              {page.learnBlog}
            </Link>
            {page.learnAfter}
          </p>
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
