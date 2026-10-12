import Link from "next/link";
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
import { services } from "@/data/services";
import { customerJourney } from "@/data/site-content";
import { getPublishedArticles } from "@/lib/content/blog.server";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Tank Sudda | Water Tank & Sump Cleaning in Sri Lanka",
  absoluteTitle: true,
  description:
    "Water tank deep cleaning and sump cleaning for homes, apartments and organisations in Sri Lanka. Request a booking with Tank Sudda.",
  path: "/",
});

export default function HomePage() {
  const articles = getPublishedArticles().slice(0, 3);
  return (
    <>
      <HomeHero />

      <section aria-labelledby="services-heading" className="container-site section-y">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="services-heading"
            eyebrow="Our services"
            title="The right clean for every tank"
            intro="From a single rooftop tank to every tank and sump in a building, we drain, clean and restore water storage properly."
          />
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-water-700 underline-offset-4 hover:underline"
          >
            Compare all services
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="mt-12">
          <ServiceGrid services={services} numbered />
        </div>
      </section>

      <WhyItMattersSection />

      <section aria-labelledby="process-heading" className="container-site section-y">
        <SectionHeading
          id="process-heading"
          eyebrow="How it works"
          title="From request to a clean tank"
          intro="Booking is simple, and nothing is confirmed until we have spoken with you."
        />
        <div className="mt-14">
          <ProcessSteps steps={customerJourney} />
        </div>
      </section>

      <CommitmentsSection />
      <HomeGallerySection />
      <BeforeAfterSection />
      <PricingTeaser />
      <AreasTeaser />
      <HomeTestimonialsSection />

      {articles.length > 0 ? (
        <section aria-labelledby="articles-heading" className="border-y border-line bg-mist">
          <div className="container-site section-y">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                id="articles-heading"
                eyebrow="Guides"
                title="Learn about tank care"
                intro="Practical, plain-language advice on keeping water tanks and sumps in good condition."
              />
              <Link
                href="/guides"
                className="inline-flex min-h-11 items-center font-semibold text-water-700 underline-offset-4 hover:underline"
              >
                Browse all guides
              </Link>
            </div>
            <div className="mt-10">
              <ArticleGrid articles={articles} />
            </div>
          </div>
        </section>
      ) : null}

      <FaqSection faqs={featuredFaqs} />
      <CtaBand />
    </>
  );
}
