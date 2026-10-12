import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getContactMethods } from "@/components/contact/ContactActions";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { GoogleReviewsPanel, SocialLinks } from "@/components/contact/SocialLinks";
import { business, getSocialProfiles } from "@/data/business";
import { buildMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";
import { isLeadDeliveryConfigured } from "@/server/notifications/channels";

export const metadata = buildMetadata({
  title: "Contact Tank Sudda",
  description:
    "Contact Tank Sudda about water tank and sump cleaning in Sri Lanka. Call, WhatsApp or email us, or request a booking online.",
  path: "/contact",
});

export default function ContactPage() {
  const formAvailable = isLeadDeliveryConfigured() || process.env.NODE_ENV === "development";
  const methods = getContactMethods();
  const hasSocial = getSocialProfiles().length > 0;
  const hasGoogle = Boolean(business.google.profileUrl || business.google.reviewUrl);
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title="Talk to Tank Sudda"
        intro={
          <>
            Questions about tank or sump cleaning? Call, WhatsApp or email us. If you already know
            what you need, the{" "}
            <Link href="/book" className="underline underline-offset-4">
              booking form
            </Link>{" "}
            is the quickest way to request a cleaning.
          </>
        }
      />

      {methods.length > 0 ? (
        <section aria-labelledby="direct-heading" className="container-site pt-12 lg:pt-16">
          <h2 id="direct-heading" className="sr-only">
            Contact details
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {methods.map(({ icon: Icon, brandColored, label, value, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-card transition-[border-color,box-shadow] hover:border-water-300 hover:shadow-raised"
                >
                  <span className="flex items-center justify-between">
                    <span
                      className={cn(
                        "grid size-12 place-items-center rounded-lg ring-1",
                        brandColored
                          ? "bg-whatsapp/10 ring-whatsapp/30"
                          : "bg-water-50 text-water-700 ring-water-100",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 text-grey-400 transition-colors group-hover:text-water-600"
                    />
                  </span>
                  <span className="mt-6 text-sm font-medium text-muted">{label}</span>
                  <span className="mt-1 font-display text-xl font-bold break-all text-navy-950 group-hover:text-water-700">
                    {value}
                  </span>
                  {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasSocial || hasGoogle ? (
        <section aria-label="Social media and reviews" className="container-site space-y-4 pt-4">
          {hasSocial ? (
            <div className="flex flex-col gap-4 rounded-xl border border-line bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between lg:px-8">
              <div>
                <h2 className="font-display text-lg font-bold text-navy-950">
                  Follow {business.name}
                </h2>
                <p className="mt-1 text-muted">See our latest work and tank care tips.</p>
              </div>
              <SocialLinks />
            </div>
          ) : null}
          {hasGoogle ? <GoogleReviewsPanel /> : null}
        </section>
      ) : null}

      <div className="container-site grid gap-12 section-y lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        {formAvailable ? (
          <section aria-labelledby="form-heading">
            <h2 id="form-heading" className="text-h2">
              Send a message
            </h2>
            <div className="mt-8">
              <ContactForm available={formAvailable} />
            </div>
          </section>
        ) : (
          <section aria-labelledby="book-heading">
            <h2 id="book-heading" className="text-h2">
              Need a cleaning?
            </h2>
            <p className="mt-4 max-w-xl text-lead text-muted">
              Tell us about your property and tanks in a few short steps. We will contact you to
              confirm the details, the quotation and a date.
            </p>
            <Link
              href="/book"
              className="mt-8 inline-flex min-h-12 items-center rounded-md bg-water-600 px-6 font-semibold text-white hover:bg-water-700"
            >
              Request a booking
            </Link>
          </section>
        )}
        <aside aria-label="About your enquiry" className="space-y-6">
          {business.openingHours.length > 0 ? (
            <div className="rounded-xl border border-line p-6">
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
          <div className="rounded-xl border border-line bg-mist p-6 text-[0.9375rem] leading-relaxed">
            <h2 className="text-h3">How we use your details</h2>
            <p className="mt-2 text-muted">
              We use your details only to reply to you and arrange any cleaning you request. Read
              our{" "}
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
