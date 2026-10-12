import { Mail, Phone } from "lucide-react";
import { BrandIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { business, getSocialProfiles } from "@/data/business";
import { buildWhatsAppUrl, serviceEnquiryMessage } from "@/lib/whatsapp";

/** Slim contact strip above the header on larger screens. */
export function TopBar() {
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp, serviceEnquiryMessage());
  const socials = getSocialProfiles();
  if (!business.phone && !whatsappUrl && !business.email && socials.length === 0) return null;
  const link = "inline-flex items-center gap-2 whitespace-nowrap text-grey-200 hover:text-white";
  return (
    <aside
      aria-label="Contact details"
      className="on-dark hidden bg-navy-950 text-[0.8125rem] lg:block"
    >
      <div className="container-site flex h-10 items-center justify-between gap-6">
        <p className="hidden truncate text-grey-300 xl:block">
          Water tank &amp; sump cleaning in Sri Lanka
        </p>
        <div className="ml-auto flex items-center gap-6">
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
                  <WhatsAppIcon className="size-3.5" />
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
          {socials.length > 0 ? (
            <ul className="flex items-center gap-3 border-l border-white/15 pl-6">
              {socials.map((profile) => (
                <li key={profile.id}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${business.name} on ${profile.label} (opens in a new tab)`}
                    title={profile.label}
                    className="grid size-7 place-items-center text-grey-300 hover:text-white"
                  >
                    <BrandIcon name={profile.id} className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
