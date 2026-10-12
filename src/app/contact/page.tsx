import Link from "next/link";
import { ContactMethodList, WhatsAppButton } from "@/components/contact/ContactActions";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { business, hasDirectContact } from "@/data/business";
import { buildMetadata } from "@/lib/seo/metadata";
import { isLeadDeliveryConfigured } from "@/server/notifications/channels";

export const metadata = buildMetadata({
  title: "Contact Tank Sudda",
  description:
    "Contact Tank Sudda about water tank and sump cleaning in Sri Lanka. Send a message or request a booking online.",
  path: "/contact",
});

export default function ContactPage() {
  const available = isLeadDeliveryConfigured() || process.env.NODE_ENV === "development";
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title="Get in touch"
        intro={
          <>
            Have a question about tank or sump cleaning? Send us a message. If you already know what
            you need, the{" "}
            <Link href="/book" className="text-water-700 underline underline-offset-4">
              booking form
            </Link>{" "}
            is the quickest way to request a cleaning.
          </>
        }
      />
      <div className="container-site grid gap-12 section-y lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="text-h2">
            Send a message
          </h2>
          <div className="mt-8">
            <ContactForm available={available} />
          </div>
        </section>
        <aside aria-label="Other ways to reach us" className="space-y-6">
          {hasDirectContact() ? (
            <div className="rounded-lg border border-line p-6">
              <h2 className="text-h3">Contact details</h2>
              <div className="mt-4">
                <ContactMethodList />
              </div>
            </div>
          ) : null}
          <WhatsAppButton label="Message us on WhatsApp" className="w-full" />
          {business.openingHours.length > 0 ? (
            <div className="rounded-lg border border-line p-6">
              <h2 className="text-h3">Opening hours</h2>
              <ul className="mt-3 space-y-1 text-[0.9375rem]">
                {business.openingHours.map((hours) => (
                  <li key={hours.days.join()}>
                    {hours.days.join(", ")}: {hours.opens}–{hours.closes}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="rounded-lg border border-line bg-mist p-6 text-[0.9375rem] leading-relaxed">
            <h2 className="text-h3">How we use your message</h2>
            <p className="mt-2 text-muted">
              We use your details only to reply to your message. Read our{" "}
              <Link href="/privacy" className="text-water-700 underline underline-offset-4">
                privacy policy
              </Link>{" "}
              for more information.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
