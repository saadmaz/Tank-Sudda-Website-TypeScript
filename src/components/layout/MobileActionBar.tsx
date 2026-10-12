import Link from "next/link";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { business } from "@/data/business";
import { buildWhatsAppUrl, serviceEnquiryMessage } from "@/lib/whatsapp";

/**
 * One-tap Call / WhatsApp / Book bar fixed to the bottom of small screens,
 * where most customers arrive. The root layout reserves space for it.
 */
export function MobileActionBar() {
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp, serviceEnquiryMessage());
  const item =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold";
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(6_28_54/0.25)] backdrop-blur lg:hidden"
    >
      <div className="flex divide-x divide-line">
        {business.phone ? (
          <a href={`tel:${business.phone.e164}`} className={`${item} text-navy-950`}>
            <Phone aria-hidden="true" className="size-5 text-water-600" />
            Call
          </a>
        ) : null}
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${item} text-whatsapp-700`}
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            WhatsApp
            <span className="sr-only"> (opens WhatsApp)</span>
          </a>
        ) : null}
        <Link href="/book" className={`${item} bg-water-600 text-white`}>
          <CalendarCheck aria-hidden="true" className="size-5" />
          Book
        </Link>
      </div>
    </nav>
  );
}
