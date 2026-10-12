import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { faqCategories, type FaqCategory } from "@/data/faqs";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary, getLocalizedFaqs } from "@/lib/i18n/dictionary";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { faqPageSchema } from "@/lib/seo/schema";

export function faqMetadata(locale: Locale): Metadata {
  return buildLocalizedMetadata(locale, "/faq", getDictionary(locale).faqPage.meta);
}

export function FaqPageView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.faqPage;
  const faqs = getLocalizedFaqs(locale);
  const categoryNames = t.content.faqCategories;
  const categories = Object.keys(faqCategories) as FaqCategory[];
  return (
    <>
      <PageHeader
        locale={locale}
        breadcrumbs={[{ name: page.breadcrumb, path: localeHref(locale, "/faq") }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
      />
      <div className="container-site grid gap-12 section-y lg:grid-cols-[14rem_1fr]">
        <nav aria-label={page.topics} className="lg:sticky lg:top-36 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href={`#${category}`}
                  className="inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm font-medium text-navy-950 hover:border-water-500 lg:border-0 lg:px-0 lg:hover:text-water-700"
                >
                  {categoryNames[category]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-14">
          {categories.map((category) => {
            const items = faqs.filter((faq) => faq.category === category);
            if (items.length === 0) return null;
            return (
              <section key={category} id={category} aria-labelledby={`${category}-heading`}>
                <h2 id={`${category}-heading`} className="text-h2">
                  {categoryNames[category]}
                </h2>
                <Accordion
                  className="mt-6"
                  items={items.map((faq) => ({
                    id: `faq-${faq.id}`,
                    title: faq.question,
                    content: <p>{faq.answer}</p>,
                  }))}
                />
              </section>
            );
          })}
        </div>
      </div>
      <CtaBand locale={locale} />
      <JsonLd data={faqPageSchema(faqs)} />
    </>
  );
}
