import { Mail, Phone } from "lucide-react";
import { BrandIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { business, getSocialProfiles } from "@/data/business";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { LanguageSwitcher } from "./LanguageSwitcher";

/** Slim contact strip above the header on larger screens. */
export function TopBar({ locale = "en" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp, t.whatsapp.general);
  const socials = getSocialProfiles();
  const link = "inline-flex items-center gap-2 whitespace-nowrap text-grey-200 hover:text-white";
  return (
    <aside
      aria-label={t.chrome.contactDetails}
      data-analytics-placement="top_bar"
      className="on-dark hidden bg-navy-950 text-[0.8125rem] lg:block"
    >
      <div className="container-site flex h-10 items-center justify-between gap-6">
        <p className="hidden truncate text-grey-300 xl:block">{t.chrome.tagline}</p>
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
                  <span className="sr-only">{t.common.opensWhatsApp}</span>
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
            <ul className="hidden items-center gap-3 border-l border-white/15 pl-6 xl:flex">
              {socials.map((profile) => (
                <li key={profile.id}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.common.socialProfile(profile.label)}${t.common.opensNewTab}`}
                    title={profile.label}
                    className="grid size-7 place-items-center text-grey-300 hover:text-white"
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
            className="shrink-0 border-l border-white/15 pl-4"
          />
        </div>
      </div>
    </aside>
  );
}
