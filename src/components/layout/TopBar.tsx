import { Mail, Phone } from "lucide-react";
import { BrandIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { business, getSocialProfiles } from "@/data/business";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { LanguageSwitcher } from "./LanguageSwitcher";

const iconLink = "grid size-7 place-items-center text-grey-300 hover:text-white";

/**
 * Slim strip above the header on larger screens: tagline, phone number,
 * WhatsApp/email and social icons, and the language switcher.
 */
export function TopBar({ locale = "en" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp, t.whatsapp.general);
  const socials = getSocialProfiles();
  return (
    <aside
      aria-label={t.chrome.contactDetails}
      data-analytics-placement="top_bar"
      className="on-dark hidden bg-navy-950 text-[0.8125rem] lg:block"
    >
      <div className="container-site flex h-10 items-center justify-between gap-4 xl:gap-6">
        <p className="truncate text-grey-300">{t.chrome.tagline}</p>
        <div className="flex shrink-0 items-center gap-3 xl:gap-5">
          <ul className="flex items-center gap-2 xl:gap-3">
            {business.phone ? (
              <li>
                <a
                  href={`tel:${business.phone.e164}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap text-grey-200 hover:text-white"
                >
                  <Phone aria-hidden="true" className="size-3.5 text-water-300" />
                  {business.phone.display}
                </a>
              </li>
            ) : null}
            {whatsappUrl ? (
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.common.whatsapp}${t.common.opensWhatsApp}`}
                  title={t.common.whatsapp}
                  className={iconLink}
                >
                  <WhatsAppIcon className="size-4" />
                </a>
              </li>
            ) : null}
            {business.email ? (
              <li>
                <a
                  href={`mailto:${business.email}`}
                  aria-label={`${t.common.email}: ${business.email}`}
                  title={business.email}
                  className={iconLink}
                >
                  <Mail aria-hidden="true" className="size-4 text-water-300" />
                </a>
              </li>
            ) : null}
          </ul>
          {socials.length > 0 ? (
            <ul className="flex items-center gap-0.5 border-l border-white/15 pl-3 xl:gap-1 xl:pl-4">
              {socials.map((profile) => (
                <li key={profile.id}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.common.socialProfile(profile.label)}${t.common.opensNewTab}`}
                    title={profile.label}
                    className={iconLink}
                  >
                    <BrandIcon name={profile.id} className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <LanguageSwitcher
            locale={locale}
            label={t.common.language}
            tone="dark"
            compact
            landmark
            className="shrink-0 border-l border-white/15 pl-3"
          />
        </div>
      </div>
    </aside>
  );
}
