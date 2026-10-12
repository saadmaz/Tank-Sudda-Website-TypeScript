import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/primitives";
import type { Faq } from "@/data/faqs";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

export function FaqSection({
  faqs,
  title,
  intro,
  showAllLink = true,
  locale = "en",
}: {
  faqs: Faq[];
  title?: string;
  intro?: string;
  showAllLink?: boolean;
  locale?: Locale;
}) {
  if (faqs.length === 0) return null;
  const { faqSection } = getDictionary(locale);
  return (
    <section aria-labelledby="faq-heading" className="container-site section-y">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading
            id="faq-heading"
            eyebrow={faqSection.eyebrow}
            title={title ?? faqSection.title}
            intro={intro}
          />
          {showAllLink ? (
            <Link
              href={localeHref(locale, "/faq")}
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-water-700 underline-offset-4 hover:underline"
            >
              {faqSection.seeAll}
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
