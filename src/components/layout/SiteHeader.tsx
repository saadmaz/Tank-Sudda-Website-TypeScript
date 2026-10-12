import { business } from "@/data/business";
import { primaryNav } from "@/data/navigation";
import { buildWhatsAppUrl, serviceEnquiryMessage } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="container-site flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks
            links={primaryNav}
            className="flex items-center gap-1"
            linkClassName="inline-flex min-h-11 items-center rounded-md px-3 text-[0.9375rem] font-medium text-navy-900 hover:bg-grey-50 hover:text-water-700"
          />
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/book" size="sm" className="min-h-11 px-4 sm:px-5">
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book a cleaning</span>
          </ButtonLink>
          <MobileNav
            links={primaryNav}
            phoneHref={business.phone ? `tel:${business.phone.e164}` : null}
            whatsappHref={buildWhatsAppUrl(business.whatsapp, serviceEnquiryMessage())}
          />
        </div>
      </div>
    </header>
  );
}
