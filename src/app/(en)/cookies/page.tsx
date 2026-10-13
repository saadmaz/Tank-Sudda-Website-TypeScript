import Link from "next/link";
import { AnalyticsOptOut } from "@/components/analytics/Analytics";
import { LegalPage } from "@/components/layout/LegalPage";
import { business } from "@/data/business";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Cookie Information",
  description: `How the ${business.name} website uses cookies and similar technologies.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Information"
      path="/cookies"
      lastUpdated="2026-10-14"
      intro="This page explains how this website uses cookies and similar technologies, and how to turn analytics off."
    >
      <h2>Google Analytics</h2>
      <p>
        We use Google Analytics to understand how visitors find and use this website, for example
        which pages are viewed and whether people use the booking form, call or WhatsApp buttons,
        and how our Google ads perform. This helps us improve the site. We do not use it for
        advertising based on your interests.
      </p>
      <p>
        When you visit, Google sets cookies whose names start with <code>_ga</code> (and, for ad
        measurement, <code>_gcl</code>). They contain a random identifier, not your name or contact
        details. Google decides how long they last; at the time of writing, Google Analytics cookies
        last up to two years. Google processes this data under its own privacy policy, which
        explains how it uses information from sites that use its services:{" "}
        <a href="https://policies.google.com/technologies/partner-sites">
          policies.google.com/technologies/partner-sites
        </a>
        .
      </p>

      <h2>Turning analytics off</h2>
      <p>
        You can turn Google Analytics off for this website in this browser. Your choice is saved in
        your browser&apos;s local storage and is not sent to us. You can also block cookies in your
        browser settings, or use Google&apos;s{" "}
        <a href="https://tools.google.com/dlpage/gaoptout">opt-out browser add-on</a>.
      </p>
      <AnalyticsOptOut />

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
