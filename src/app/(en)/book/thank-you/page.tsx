import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import { PhoneButton, WhatsAppButton } from "@/components/contact/ContactActions";
import { WaterLines } from "@/components/illustrations/TechnicalIllustrations";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { REFERENCE_PATTERN } from "@/server/leads/format";

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false, follow: false },
};

const nextSteps = [
  {
    title: "We review your request",
    description: "We check the details you sent and whether we can serve your area.",
  },
  {
    title: "We contact you",
    description: "Our team gets in touch to confirm the details and give you a quotation.",
  },
  {
    title: "We agree a date",
    description: "Once you accept the quotation, we agree a date. Only then is it confirmed.",
  },
];

function readReference(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && REFERENCE_PATTERN.test(raw) ? raw : null;
}

export default async function ThankYouPage({ searchParams }: PageProps<"/book/thank-you">) {
  const reference = readReference((await searchParams).ref);
  const whatsappMessage = reference
    ? `Hello Tank Sudda, about my booking request ${reference}: `
    : "Hello Tank Sudda, about my booking request: ";

  return (
    <>
      <section
        aria-labelledby="thank-you-heading"
        className="on-dark relative overflow-hidden surface-navy"
      >
        <WaterLines className="absolute inset-x-0 bottom-0 h-20 text-water-500/30" />
        <div className="relative container-site grid gap-10 pt-12 pb-16 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
          <div>
            <span className="grid size-14 place-items-center rounded-full bg-success-50 text-success-700 ring-8 ring-white/10">
              <Check aria-hidden="true" className="size-7" strokeWidth={3} />
            </span>
            <p className="mt-8 eyebrow text-water-300">Booking request received</p>
            <h1 id="thank-you-heading" className="mt-3 text-h1 text-white">
              Thank you, we’ve received your request
            </h1>
            <p className="mt-5 max-w-xl text-lead text-grey-200">
              <strong className="text-white">Your appointment is not confirmed yet.</strong> Our
              team will review your request and contact you to confirm the details, the quotation
              and the date.
            </p>
          </div>

          {reference ? (
            <div className="rounded-xl bg-white/6 p-6 ring-1 ring-white/15 backdrop-blur-sm lg:p-8">
              <p className="text-sm font-medium text-grey-300">Your reference</p>
              <p className="mt-2 font-mono text-2xl font-bold tracking-wider break-all text-white sm:text-3xl">
                {reference}
              </p>
              <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-grey-300">
                Mention it when you contact us about this request. If you gave us your email
                address, a confirmation is on its way.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="container-site grid gap-12 section-y lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <section aria-labelledby="next-heading">
          <p className="eyebrow">Next steps</p>
          <h2 id="next-heading" className="mt-3 text-h2">
            What happens next
          </h2>
          <div className="mt-8">
            <ProcessSteps steps={nextSteps} layout="column" />
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/">Back to the homepage</ButtonLink>
            <ButtonLink href="/guides" variant="secondary">
              Read our guides
            </ButtonLink>
          </div>
        </section>

        <aside aria-label="While you wait" className="space-y-6 lg:pt-2">
          <div className="rounded-xl border border-line bg-white p-6 shadow-card">
            <h2 className="text-h3">Need to add something?</h2>
            <p className="mt-2 leading-relaxed text-muted">
              Send us a photo of the tank or any extra details. Your reference is added to the
              message for you.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <WhatsAppButton message={whatsappMessage} size="md" className="w-full" />
              <PhoneButton size="md" className="w-full" />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-mist p-6">
            <span className="grid size-10 place-items-center rounded-lg bg-white text-water-700 ring-1 ring-line">
              <BookOpen aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-4 text-h3">Get ready for the day</h2>
            <p className="mt-2 leading-relaxed text-muted">
              Our guide explains how to store water, clear access to the tank and prepare for the
              cleaning.
            </p>
            <Link
              href="/blog/how-to-prepare-for-water-tank-cleaning"
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-water-700 underline-offset-4 hover:underline"
            >
              Preparing for a tank cleaning
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
