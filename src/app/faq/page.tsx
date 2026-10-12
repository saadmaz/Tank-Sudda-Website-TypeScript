import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { faqCategories, faqs, type FaqCategory } from "@/data/faqs";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqPageSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about water tank and sump cleaning: how often to clean, how long water is off, how to prepare, and how pricing works.",
  path: "/faq",
});

export default function FaqPage() {
  const categories = Object.keys(faqCategories) as FaqCategory[];
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
        eyebrow="FAQ"
        title="Frequently asked questions"
        intro="Can’t find what you need? Call, WhatsApp or email us and we will get back to you."
      />
      <div className="container-site grid gap-12 section-y lg:grid-cols-[14rem_1fr]">
        <nav aria-label="FAQ topics" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {categories.map((category) => (
              <li key={category}>
                <a
                  href={`#${category}`}
                  className="inline-flex min-h-11 items-center rounded-md border border-line px-3 text-sm font-medium text-navy-950 hover:border-water-500 lg:border-0 lg:px-0 lg:hover:text-water-700"
                >
                  {faqCategories[category]}
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
                  {faqCategories[category]}
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
      <CtaBand />
      <JsonLd data={faqPageSchema(faqs)} />
    </>
  );
}
