import Link from "next/link";
import { CookieChoice } from "@/components/analytics/Analytics";
import { LegalPage } from "@/components/layout/LegalPage";
import { business } from "@/data/business";
import { getDictionary } from "@/lib/i18n/dictionary";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Cookie Information",
  description: `How the ${business.name} website uses cookies and similar technologies.`,
  path: "/cookies",
});

export default function CookiesPage() {
  const { consent } = getDictionary("en");
  return (
    <LegalPage
      title="Cookie Information"
      path="/cookies"
      lastUpdated="2026-10-14"
      intro="This page explains how this website uses cookies and similar technologies, and how to change your choice."
    >
      <h2>Your choice</h2>
      <p>
        When you first visit, we ask whether you accept Google Analytics cookies. Nothing is sent to
        Google unless you accept. You can change your choice here at any time.
      </p>
      <CookieChoice labels={{ accept: consent.accept, decline: consent.decline }} />

      <h2>Google Analytics (only if you accept)</h2>
      <p>
        We use Google Analytics to understand how visitors find and use this website, for example
        which pages are viewed and whether people use the booking form, call or WhatsApp buttons,
        and how our Google ads perform. This helps us improve the site. We do not use it for
        advertising based on your interests.
      </p>
      <p>
        If you accept, Google sets cookies whose names start with <code>_ga</code> (and, for ad
        measurement, <code>_gcl</code>). They contain a random identifier, not your name or contact
        details. Google decides how long they last; at the time of writing, Google Analytics cookies
        last up to two years. Google processes this data under its own privacy policy, which
        explains how it uses information from sites that use its services:{" "}
        <a href="https://policies.google.com/technologies/partner-sites">
          policies.google.com/technologies/partner-sites
        </a>
        .
      </p>

      <h2>Storing your choice</h2>
      <p>
        Your answer to the cookie question is saved in your browser&apos;s local storage, so we do
        not ask again on every page. It is not sent to us or anyone else.
      </p>

      <h2>Everything else</h2>
      <p>
        Our booking and contact forms work without setting cookies. Your browser may store files
        such as fonts and stylesheets in its cache so pages load faster on your next visit. This
        does not identify you.
      </p>
      <p>
        If you choose to contact us on WhatsApp, you leave this website and WhatsApp&apos;s own
        cookie and privacy policies apply.
      </p>

      <h2>More information</h2>
      <p>
        See our <Link href="/privacy">Privacy Policy</Link> for how we handle personal information.
      </p>
    </LegalPage>
  );
}
