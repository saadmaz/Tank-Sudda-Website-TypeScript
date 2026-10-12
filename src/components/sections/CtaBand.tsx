import { ArrowRight } from "lucide-react";
import { WaterLines } from "@/components/illustrations/TechnicalIllustrations";
import { ButtonLink } from "@/components/ui/Button";

/** Closing call to action shown at the end of most pages. */
export function CtaBand({
  title = "Ready to have your tank cleaned?",
  body = "Tell us about your property and tanks. We will review your request and contact you to confirm the details, the quotation and a date.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="on-dark relative overflow-hidden surface-navy"
    >
      <WaterLines className="absolute inset-x-0 bottom-0 h-24 text-water-500/40" />
      <div className="relative container-site py-16 lg:py-24">
        <div className="max-w-2xl">
          <h2 id="cta-heading" className="text-h1 text-white">
            {title}
          </h2>
          <p className="mt-5 text-lead text-grey-200">{body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/book" variant="onDark" size="lg">
              Request a booking
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/pricing" variant="onDarkOutline" size="lg">
              How pricing works
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
