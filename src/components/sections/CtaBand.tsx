import { ArrowRight } from "lucide-react";
import { getContactMethods } from "@/components/contact/ContactActions";
import { WaterLines } from "@/components/illustrations/TechnicalIllustrations";
import { ButtonLink } from "@/components/ui/Button";
import { serviceEnquiryMessage } from "@/lib/whatsapp";

/** Closing call to action: booking on the left, direct contact on the right. */
export function CtaBand({
  title = "Ready to have your tank cleaned?",
  body = "Tell us about your property and tanks. We will review your request and contact you to confirm the details, the quotation and a date.",
  serviceName,
}: {
  title?: string;
  body?: string;
  serviceName?: string;
}) {
  const contacts = getContactMethods(serviceEnquiryMessage(serviceName));
  return (
    <section
      aria-labelledby="cta-heading"
      className="on-dark relative overflow-hidden surface-navy"
    >
      <WaterLines className="absolute inset-x-0 bottom-0 h-24 text-water-500/40" />
      <div className="relative container-site grid items-center gap-10 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
        <div className="max-w-2xl">
          <h2 id="cta-heading" className="text-h1 text-white">
            {title}
          </h2>
          <p className="mt-5 text-lead text-grey-200">{body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/book" variant="onDark" size="lg">
              Request a booking
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/pricing" variant="onDarkOutline" size="lg">
              How pricing works
            </ButtonLink>
          </div>
        </div>
        {contacts.length > 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
            <p className="px-4 pt-3 pb-2 text-xs font-semibold tracking-[0.12em] text-water-200 uppercase">
              Talk to us directly
            </p>
            <ul className="space-y-2">
              {contacts.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 rounded-lg bg-navy-950/60 p-4 ring-1 ring-white/10 transition-colors hover:bg-navy-900"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-water-600/20 text-water-300 ring-1 ring-water-400/30">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-grey-300">{label}</span>
                      <span className="block truncate font-display text-lg font-bold text-white group-hover:text-water-200">
                        {value}
                      </span>
                    </span>
                    {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
