import Link from "next/link";
import { ArticleGrid } from "@/components/blog/ArticleCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { HomeHero } from "@/components/sections/HomeHero";
import { AreasTeaser, CommitmentsSection, PricingTeaser } from "@/components/sections/InfoSections";
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
    "Water tank deep cleaning, vacuum cleaning and sump cleaning for homes, apartments and organisations in Sri Lanka. Request a booking with Tank Sudda.",
  path: "/",
});

export default function HomePage() {
  const articles = getPublishedArticles().slice(0, 3);
  return (
    <>
      <HomeHero />

      <section aria-labelledby="intro-heading" className="container-site section-y">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            id="intro-heading"
            eyebrow="What we do"
            title="Tank and sump cleaning, done properly"
          />
          <div className="space-y-4 text-lead text-muted">
            <p>
              Water tanks and sumps quietly collect sediment, debris and build-up. Because they are
              out of sight, they are easy to forget until cloudy water or grit at the tap is a
              reminder.
            </p>
            <p>
              We drain and clean overhead tanks, lift settled sediment with vacuum equipment, clean
              underground sumps, and plan larger jobs for apartment buildings, offices, schools and
              hotels.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="services-heading" className="container-site pb-16 lg:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="services-heading"
            eyebrow="Services"
            title="Choose the right clean for your tank"
          />
          <Link
            href="/services"
            className="font-semibold text-water-700 underline-offset-4 hover:underline"
          >
            Compare all services
          </Link>
        </div>
        <div className="mt-10">
          <ServiceGrid services={services} />
        </div>
      </section>

      <section aria-labelledby="process-heading" className="border-t border-line">
        <div className="container-site section-y">
          <SectionHeading
            id="process-heading"
            eyebrow="How it works"
            title="From request to clean water"
            intro="Booking a cleaning is simple. Nothing is confirmed until we have spoken with you."
          />
          <div className="mt-12">
            <ProcessSteps steps={customerJourney} />
          </div>
        </div>
      </section>

      <CommitmentsSection />
      <HomeGallerySection />
      <BeforeAfterSection />
      <AreasTeaser />
      <PricingTeaser />
      <HomeTestimonialsSection />

      {articles.length > 0 ? (
        <section aria-labelledby="articles-heading" className="container-site section-y">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              id="articles-heading"
              eyebrow="Guides"
              title="Learn about tank care"
              intro="Practical, plain-language advice on keeping water tanks and sumps in good condition."
            />
            <Link
              href="/guides"
              className="font-semibold text-water-700 underline-offset-4 hover:underline"
            >
              Browse all guides
            </Link>
          </div>
          <div className="mt-10">
            <ArticleGrid articles={articles} />
          </div>
        </section>
      ) : null}

      <div className="border-t border-line">
        <FaqSection faqs={featuredFaqs} />
      </div>
      <CtaBand />
    </>
  );
}
