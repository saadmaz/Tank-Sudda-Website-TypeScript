import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ArticleGrid } from "@/components/blog/ArticleCard";
import { WhatsAppButton } from "@/components/contact/ContactActions";
import { ServiceIllustrationView } from "@/components/illustrations/TechnicalIllustrations";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { CheckList, Panel } from "@/components/ui/primitives";
import { getFaqsByIds } from "@/data/faqs";
import { describePrice, getPriceEntry } from "@/data/pricing";
import { getServiceBySlug, getServicesBySlugs, services } from "@/data/services";
import { getArticlesBySlugs } from "@/lib/content/blog.server";
import { buildMetadata } from "@/lib/seo/metadata";
import { serviceSchema } from "@/lib/seo/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.name,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const faqs = getFaqsByIds(service.faqIds);
  const relatedServices = getServicesBySlugs(service.relatedServiceSlugs);
  const articles = getArticlesBySlugs(service.relatedArticleSlugs);
  const bookingHref = `/book?service=${service.slug}` as const;

  return (
    <>
      <PageHeader
        tone="navy"
        breadcrumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        eyebrow="Service"
        title={service.name}
        intro={service.intro}
        actions={
          <>
            <ButtonLink href={bookingHref} variant="onDark" size="lg">
              Book this service
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <WhatsAppButton serviceName={service.name} label="Ask on WhatsApp" />
          </>
        }
        aside={<ServiceIllustrationView kind={service.illustration} tone="dark" />}
      />

      <div className="container-site grid gap-12 section-y lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0 space-y-16">
          <section aria-labelledby="involves-heading">
            <h2 id="involves-heading" className="text-h2">
              What the service involves
            </h2>
            <CheckList items={service.whatItInvolves} className="mt-6 text-body" />
          </section>

          <section aria-labelledby="process-heading">
            <h2 id="process-heading" className="text-h2">
              Our process
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
              Before you book
            </h2>
            <CheckList items={service.beforeYouBook} className="mt-6" />
            <p className="mt-6">
              Read our{" "}
              <Link
                href="/blog/how-to-prepare-for-water-tank-cleaning"
                className="font-medium text-water-700 underline underline-offset-4"
              >
                preparation guide
              </Link>{" "}
              for more detail.
            </p>
          </section>

          {faqs.length > 0 ? (
            <section aria-labelledby="service-faq-heading">
              <h2 id="service-faq-heading" className="text-h2">
                Questions about {service.shortName.toLowerCase()}
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

        <aside aria-label="Service summary" className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Panel>
            <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase">
              Price
            </h2>
            <p className="mt-2 font-display text-xl font-semibold text-navy-950">
              {describePrice(getPriceEntry(service.slug))}
            </p>
            <p className="mt-2 text-sm text-muted">
              Depends on capacity, access and condition.{" "}
              <Link href="/pricing" className="text-water-700 underline underline-offset-4">
                How pricing works
              </Link>
            </p>
            <ButtonLink href={bookingHref} className="mt-6 w-full">
              Request a booking
            </ButtonLink>
          </Panel>
          <Panel>
            <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase">
              Suitable for
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
                Related services
              </h2>
              <ul className="mt-3 space-y-1">
                {relatedServices.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/services/${related.slug}`}
                      className="inline-flex min-h-10 items-center gap-1 font-medium text-water-700 underline-offset-4 hover:underline"
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
              Helpful guides
            </h2>
            <div className="mt-10">
              <ArticleGrid articles={articles} />
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand title={`Book ${service.shortName.toLowerCase()}`} serviceName={service.name} />
      <JsonLd data={serviceSchema(service)} />
    </>
  );
}
