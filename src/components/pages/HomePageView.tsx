import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ArticleGrid } from "@/components/blog/ArticleCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { HomeHero } from "@/components/sections/HomeHero";
import {
  AreasTeaser,
  CommitmentsSection,
  PricingTeaser,
  WhyItMattersSection,
} from "@/components/sections/InfoSections";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import {
  BeforeAfterSection,
  HomeGallerySection,
  HomeTestimonialsSection,
} from "@/components/sections/ProofSections";
import { ServiceGrid } from "@/components/services/ServiceCard";
import { SectionHeading } from "@/components/ui/primitives";
import { featuredFaqs } from "@/data/faqs";
import { getPublishedArticles } from "@/lib/content/blog.server";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary, getLocalizedFaqs, getLocalizedServices } from "@/lib/i18n/dictionary";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";

export function homeMetadata(locale: Locale): Metadata {
  const { meta } = getDictionary(locale).home;
  return buildLocalizedMetadata(locale, "/", { ...meta, absoluteTitle: true });
}

export function HomePageView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // Articles are written in English only, so they are listed on the English home page.
  const articles = locale === "en" ? getPublishedArticles().slice(0, 3) : [];
  return (
    <>
      <HomeHero locale={locale} />

      <section aria-labelledby="services-heading" className="container-site section-y">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="services-heading"
            eyebrow={t.home.servicesEyebrow}
            title={t.home.servicesTitle}
            intro={t.home.servicesIntro}
          />
          <Link
            href={localeHref(locale, "/services")}
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-water-700 underline-offset-4 hover:underline"
          >
            {t.home.compareAll}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="mt-12">
          <ServiceGrid services={getLocalizedServices(locale)} numbered locale={locale} />
        </div>
      </section>

      <WhyItMattersSection locale={locale} />

      <section aria-labelledby="process-heading" className="container-site section-y">
        <SectionHeading
          id="process-heading"
          eyebrow={t.home.processEyebrow}
          title={t.home.processTitle}
          intro={t.home.processIntro}
        />
        <div className="mt-14">
          <ProcessSteps steps={t.content.customerJourney} />
        </div>
      </section>

      <CommitmentsSection locale={locale} />
      <HomeGallerySection locale={locale} />
      <BeforeAfterSection locale={locale} />
      <PricingTeaser locale={locale} />
      <AreasTeaser locale={locale} />
      <HomeTestimonialsSection locale={locale} />

      {articles.length > 0 ? (
        <section aria-labelledby="articles-heading" className="border-y border-line bg-mist">
          <div className="container-site section-y">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                id="articles-heading"
                eyebrow={t.home.articlesEyebrow}
                title={t.home.articlesTitle}
                intro={t.home.articlesIntro}
              />
              <Link
                href="/guides"
                className="inline-flex min-h-11 items-center font-semibold text-water-700 underline-offset-4 hover:underline"
              >
                {t.home.browseGuides}
              </Link>
            </div>
            <div className="mt-10">
              <ArticleGrid articles={articles} />
            </div>
          </div>
        </section>
      ) : null}

      <FaqSection faqs={getLocalizedFaqs(locale, featuredFaqs)} locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
