import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="container-site section-y">
      <div className="max-w-2xl">
        <p className="mb-3 eyebrow">Error 404</p>
        <h1 className="text-h1">We couldn’t find that page</h1>
        <p className="mt-5 text-lead text-muted">
          The page may have moved, or the address may be mistyped. These links may help:
        </p>
        <ul className="mt-6 space-y-2">
          {(
            [
              ["/services", "Our services"],
              ["/guides", "Tank care guides"],
              ["/faq", "Frequently asked questions"],
              ["/contact", "Contact us"],
            ] as const
          ).map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className="font-medium text-water-700 underline underline-offset-4 hover:text-navy-950"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Go to the homepage</ButtonLink>
          <ButtonLink href="/book" variant="secondary">
            Book a cleaning
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
