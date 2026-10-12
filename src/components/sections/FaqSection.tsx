import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/primitives";
import type { Faq } from "@/data/faqs";

export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  intro,
  showAllLink = true,
}: {
  faqs: Faq[];
  title?: string;
  intro?: string;
  showAllLink?: boolean;
}) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="container-site section-y">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading id="faq-heading" eyebrow="FAQ" title={title} intro={intro} />
          {showAllLink ? (
            <Link
              href="/faq"
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-water-700 underline-offset-4 hover:underline"
            >
              See all questions
            </Link>
          ) : null}
        </div>
        <Accordion
          items={faqs.map((faq) => ({
            id: `faq-${faq.id}`,
            title: faq.question,
            content: <p>{faq.answer}</p>,
          }))}
        />
      </div>
    </section>
  );
}
