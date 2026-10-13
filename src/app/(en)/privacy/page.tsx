import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { business } from "@/data/business";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${business.name} collects, uses and protects the personal information you share through this website.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      lastUpdated="2026-10-14"
      intro={`This policy explains what personal information ${business.name} collects through this website, why, and how it is handled.`}
    >
      <h2>Who we are</h2>
      <p>
        This website is operated by {business.legalName ?? business.name}, a water tank and sump
        cleaning service in {business.countryName}. In this policy, “we” and “us” refer to{" "}
        {business.name}.
      </p>

      <h2>Information we collect</h2>
      <p>We collect information you choose to give us through our forms:</p>
      <ul>
        <li>
          <strong>Booking requests:</strong> your name, phone number, email address (if given), the
          property and tank details, the service you need, your town (and address, if given), your
          preferred date, how you would like us to contact you, and any notes you add.
        </li>
        <li>
          <strong>Contact enquiries:</strong> your name, contact details and your message.
        </li>
      </ul>
      <p>
        We do not ask for payment details, identity documents or other sensitive information through
        this website.
      </p>
      <p>
        Like most websites, our hosting provider (Cloudflare) may keep standard server logs (such as
        IP address, browser type and the pages requested) for security and to keep the site running.
        We do not use these logs to identify you.
      </p>
      <p>
        <strong>Website analytics:</strong> we use Google Analytics to see how visitors use this
        website and how our Google ads perform, for example which pages are viewed and whether the
        booking, call or WhatsApp buttons are used. Google receives this data, including your IP
        address, under its own privacy policy. You can turn it off on the{" "}
        <Link href="/cookies">cookie information</Link> page.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to your enquiry or booking request</li>
        <li>To prepare a quotation and arrange an appointment</li>
        <li>To contact you about the service you requested</li>
        <li>To protect the website against spam and misuse</li>
        <li>To understand how the website is used and improve it</li>
      </ul>
      <p>We do not use your details to send you news or offers.</p>

      <h2>How your information is handled</h2>
      <p>
        When you submit a form, your details are sent securely to our team by email, using an email
        delivery service (Resend). Our email is received through Cloudflare and kept in Google
        Gmail. Only people who need the information to respond to you have access to it. If you
        contact us on WhatsApp, WhatsApp’s own privacy policy also applies to that conversation.
      </p>
      <p>We do not sell your personal information or share it for advertising.</p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry and booking information only for as long as we need it to provide the
        service, keep reasonable business records, and meet any legal obligations.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can ask to see the personal information we hold about you, ask us to correct it, or ask
        us to delete it where we are not required to keep it. We aim to handle personal information
        in line with applicable Sri Lankan law, including the Personal Data Protection Act, No. 9 of
        2022.
      </p>
      <p>
        To make a request, please{" "}
        {business.email ? (
          <a href={`mailto:${business.email}`}>email us at {business.email}</a>
        ) : (
          <Link href="/contact">contact us</Link>
        )}
        .
      </p>

      <h2>Cookies</h2>
      <p>
        See our <Link href="/cookies">cookie information</Link> for details of how this website uses
        cookies.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top of the page shows when it
        was last changed.
      </p>
    </LegalPage>
  );
}
