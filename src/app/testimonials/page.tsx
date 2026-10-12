import { PageHeader } from "@/components/layout/PageHeader";
import { GoogleReviewsPanel } from "@/components/contact/SocialLinks";
import { CtaBand } from "@/components/sections/CtaBand";
import { TestimonialList } from "@/components/sections/ProofSections";
import { business } from "@/data/business";
import { getPublishableTestimonials } from "@/data/testimonials";
import { buildMetadata } from "@/lib/seo/metadata";

const items = getPublishableTestimonials();

export const metadata = buildMetadata({
  title: "Customer Feedback",
  description: "Verified feedback from Tank Sudda customers, published with their permission.",
  path: "/testimonials",
  // Kept out of search results until genuine feedback is published.
  noIndex: items.length === 0,
});

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Testimonials", path: "/testimonials" }]}
        eyebrow="Customer feedback"
        title="What our customers say"
        intro="We only publish genuine feedback from real customers, with their permission. Each entry shows where and when it was given."
      />
      <section aria-label="Testimonials" className="container-site section-y">
        {business.google.profileUrl || business.google.reviewUrl ? (
          <div className="mb-10">
            <GoogleReviewsPanel />
          </div>
        ) : null}
        {items.length > 0 ? (
          <TestimonialList items={items} />
        ) : (
          <div className="max-w-2xl rounded-lg border border-dashed border-grey-300 bg-mist p-8">
            <h2 className="text-h3">No published feedback yet</h2>
            <p className="mt-3 leading-relaxed text-muted">
              We are collecting feedback from customers and will publish it here once they have
              agreed. We will never invent or edit reviews.
            </p>
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}
