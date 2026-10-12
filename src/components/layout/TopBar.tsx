import { Mail, MessageCircle, Phone } from "lucide-react";
import { business } from "@/data/business";
import { buildWhatsAppUrl, serviceEnquiryMessage } from "@/lib/whatsapp";

/** Slim contact strip above the header on larger screens. */
export function TopBar() {
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp, serviceEnquiryMessage());
  if (!business.phone && !whatsappUrl && !business.email) return null;
  const link = "inline-flex items-center gap-2 text-grey-200 hover:text-white";
  return (
    <aside
      aria-label="Contact details"
      className="on-dark hidden bg-navy-950 text-[0.8125rem] lg:block"
    >
      <div className="container-site flex h-10 items-center justify-between gap-6">
        <p className="text-grey-300">
          Water tank and sump cleaning for homes and organisations in Sri Lanka
        </p>
        <ul className="flex items-center gap-6">
          {business.phone ? (
            <li>
              <a href={`tel:${business.phone.e164}`} className={link}>
                <Phone aria-hidden="true" className="size-3.5 text-water-300" />
                {business.phone.display}
              </a>
            </li>
          ) : null}
          {whatsappUrl ? (
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={link}>
                <MessageCircle aria-hidden="true" className="size-3.5 text-water-300" />
                WhatsApp
                <span className="sr-only"> (opens WhatsApp)</span>
              </a>
            </li>
          ) : null}
          {business.email ? (
            <li>
              <a href={`mailto:${business.email}`} className={link}>
                <Mail aria-hidden="true" className="size-3.5 text-water-300" />
                {business.email}
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </aside>
  );
}
