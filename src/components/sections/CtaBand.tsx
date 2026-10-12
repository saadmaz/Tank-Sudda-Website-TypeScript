import { ArrowRight } from "lucide-react";
import { WhatsAppButton } from "@/components/contact/ContactActions";
import { WaterLines } from "@/components/illustrations/TechnicalIllustrations";
import { ButtonLink } from "@/components/ui/Button";

export function CtaBand({
  title = "Ready to have your tank cleaned?",
  body = "Tell us about your property and tanks. We will review your request and contact you to confirm the details, the quotation and a date.",
  serviceName,
}: {
  title?: string;
  body?: string;
  serviceName?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" className="on-dark relative overflow-hidden bg-navy-950">
      <WaterLines className="absolute inset-x-0 bottom-0 h-24 text-water-500/50" />
      <div className="relative container-site py-16 lg:py-20">
        <div className="max-w-2xl">
          <h2 id="cta-heading" className="text-h2 text-white">
            {title}
          </h2>
          <p className="mt-4 text-lead text-grey-200">{body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/book" variant="onDark" size="lg">
              Request a booking
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <WhatsAppButton serviceName={serviceName} />
          </div>
        </div>
      </div>
    </section>
  );
}
