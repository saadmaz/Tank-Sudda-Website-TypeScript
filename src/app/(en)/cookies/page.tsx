import Link from "next/link";
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
      lastUpdated="2026-10-12"
      intro="This page explains how this website uses cookies and similar technologies."
    >
      <h2>What we use today</h2>
      <p>
        This website does not use cookies for analytics, advertising or tracking, and it does not
        load third-party tracking scripts. Our forms work without setting cookies.
      </p>
      <p>
        Your browser may store files such as fonts and stylesheets in its cache so pages load faster
        on your next visit. This does not identify you.
      </p>

      <h2>Third-party services</h2>
      <p>
        If you choose to contact us on WhatsApp, you will leave this website and WhatsApp’s own
        cookie and privacy policies will apply.
      </p>

      <h2>If this changes</h2>
      <p>
        If we add analytics or other cookies in the future, we will update this page before doing so
        and, where required, ask for your consent first.
      </p>

      <h2>More information</h2>
      <p>
        See our <Link href="/privacy">Privacy Policy</Link> for how we handle personal information.
      </p>
    </LegalPage>
  );
}
