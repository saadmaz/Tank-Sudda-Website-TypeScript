import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { REFERENCE_PATTERN } from "@/server/leads/format";

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false, follow: false },
};

function readReference(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && REFERENCE_PATTERN.test(raw) ? raw : null;
}

export default async function ThankYouPage({ searchParams }: PageProps<"/book/thank-you">) {
  const reference = readReference((await searchParams).ref);
  return (
    <section className="container-site section-y">
      <div className="max-w-2xl">
        <CheckCircle2 aria-hidden="true" className="size-12 text-success-700" />
        <h1 className="mt-6 text-h1">Thank you, we’ve received your request</h1>
        {reference ? (
          <p className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-md border border-line bg-mist px-4 py-3">
            <span className="text-muted">Your reference:</span>
            <strong className="font-display text-lg tracking-wide text-navy-950">
              {reference}
            </strong>
          </p>
        ) : null}
        <div className="mt-6 space-y-4 text-lead text-muted">
          <p>
            <strong className="text-navy-950">Your appointment is not confirmed yet.</strong> Our
            team will review your request and contact you to confirm the details, the quotation and
            the date.
          </p>
          <p>
            While you wait, our guide on{" "}
            <Link
              href="/blog/how-to-prepare-for-water-tank-cleaning"
              className="text-water-700 underline underline-offset-4"
            >
              preparing for a tank cleaning
            </Link>{" "}
            explains how to get ready.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
          <ButtonLink href="/guides" variant="secondary">
            Read our guides
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
