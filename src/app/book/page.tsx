import { BookingWizard, type DeliveryMode } from "@/components/booking/BookingWizard";
import { ContactMethodList } from "@/components/contact/ContactActions";
import { TankCrossSection } from "@/components/illustrations/TechnicalIllustrations";
import { PageHeader } from "@/components/layout/PageHeader";
import { SlotImage } from "@/components/media/SlotImage";
import { business, hasDirectContact } from "@/data/business";
import { buildMetadata } from "@/lib/seo/metadata";
import { isLeadDeliveryConfigured } from "@/server/notifications/channels";

export const metadata = buildMetadata({
  title: "Book a Tank Cleaning",
  description:
    "Request a water tank or sump cleaning from Tank Sudda. Tell us about your property and tanks, and we will contact you to confirm the details and a date.",
  path: "/book",
});

function getDeliveryMode(): DeliveryMode {
  if (isLeadDeliveryConfigured()) return "live";
  return process.env.NODE_ENV === "development" ? "development" : "unavailable";
}

export default function BookPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Book", path: "/book" }]}
        eyebrow="Booking request"
        title="Request a tank cleaning"
        intro="It takes about three minutes. Your request is not a confirmed appointment — we will contact you to confirm the details, the quotation and a date."
      />
      <div className="container-site grid gap-12 section-y lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0">
          <noscript>
            <p className="mb-6 rounded-md border border-warning-700/30 bg-warning-50 p-4 text-warning-700">
              The booking form needs JavaScript. Please enable it, or contact us directly.
            </p>
          </noscript>
          <BookingWizard deliveryMode={getDeliveryMode()} whatsapp={business.whatsapp} />
        </div>
        <aside
          aria-label="About your request"
          className="space-y-6 lg:sticky lg:top-24 lg:self-start"
        >
          <SlotImage
            slot="bookingAside"
            fallback={<TankCrossSection annotated={false} />}
            className="rounded-lg border border-line bg-mist p-6"
          />
          <div className="rounded-lg border border-line p-5 text-[0.9375rem] leading-relaxed">
            <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase">
              What happens next
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>We review your request.</li>
              <li>We contact you to confirm details and give a quotation.</li>
              <li>Once you agree, we confirm the date.</li>
            </ol>
          </div>
          {hasDirectContact() ? (
            <div className="rounded-lg border border-line p-5">
              <h2 className="font-sans text-sm font-semibold tracking-[0.12em] text-muted uppercase">
                Prefer to talk?
              </h2>
              <div className="mt-3">
                <ContactMethodList />
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}
