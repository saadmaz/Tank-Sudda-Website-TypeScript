import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { business } from "@/data/business";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Terms and Conditions",
  description: `Terms for using the ${business.name} website and requesting water tank and sump cleaning services.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      path="/terms"
      lastUpdated="2026-10-12"
      intro={`These terms cover your use of this website and how booking requests made through it are handled.`}
    >
      <h2>Using this website</h2>
      <p>
        The information on this website is provided for general guidance. Our articles and guides
        explain tank care in general terms and are not a substitute for an inspection of your
        specific tank or for advice from your water supplier or public health authorities.
      </p>

      <h2>Booking requests are not confirmed appointments</h2>
      <p>
        Submitting the booking form sends us a <strong>request</strong>. It does not create a
        confirmed appointment or a contract. We will contact you to confirm the details, provide a
        quotation and agree a date. A booking is confirmed only when we have agreed it with you
        directly.
      </p>

      <h2>Quotations</h2>
      <p>
        Quotations are based on the information you provide, such as tank capacity, number of tanks,
        access and condition. If the situation on site is materially different, we will discuss any
        change with you before continuing.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Provide accurate details about the property and tanks.</li>
        <li>Make sure we can access the tank or sump safely at the agreed time.</li>
        <li>Make arrangements for water supply being interrupted during the work.</li>
        <li>Tell us about any known hazards, damage or defects.</li>
      </ul>

      <h2>Changes and cancellations</h2>
      <p>
        If you need to change or cancel an appointment, please let us know as early as possible. Any
        specific cancellation terms will be explained when your booking is confirmed.
      </p>

      <h2>Content and links</h2>
      <p>
        The content of this website belongs to {business.name}. Links to other websites are provided
        for convenience; we are not responsible for their content.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle personal information is explained in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The date at the top of the page shows when they
        were last changed.
      </p>
    </LegalPage>
  );
}
