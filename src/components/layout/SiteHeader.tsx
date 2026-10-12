import { business } from "@/data/business";
import { primaryNav } from "@/data/navigation";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary, localizeNav } from "@/lib/i18n/dictionary";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function SiteHeader({ locale = "en" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const links = localizeNav(locale, primaryNav);
  // Sinhala and Tamil labels are longer, so their full menu bar starts at a wider screen.
  const wide = locale !== "en";
  return (
    <header className="border-b border-line bg-white">
      <div className="container-site flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Logo href={localeHref(locale, "/")} label={t.common.logoHome} />
        <nav aria-label={t.chrome.mainNav} className={wide ? "hidden xl:block" : "hidden lg:block"}>
          <NavLinks
            links={links}
            className="flex items-center gap-1"
            linkClassName="inline-flex min-h-11 items-center rounded-md px-3 text-[0.9375rem] font-medium whitespace-nowrap text-navy-900 hover:bg-grey-50 hover:text-water-700"
          />
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/book" size="sm" className="min-h-11 px-4 sm:px-5">
            <span className={wide ? "2xl:hidden" : "sm:hidden"}>{t.common.bookShort}</span>
            <span className={wide ? "hidden 2xl:inline" : "hidden sm:inline"}>
              {t.common.bookCleaning}
            </span>
          </ButtonLink>
          <MobileNav
            locale={locale}
            wide={wide}
            homeHref={localeHref(locale, "/")}
            links={localizeNav(locale, [
              { href: "/", label: "Home" },
              ...primaryNav,
              { href: "/faq", label: "FAQ" },
            ])}
            labels={{
              openMenu: t.chrome.openMenu,
              closeMenu: t.chrome.closeMenu,
              siteMenu: t.chrome.siteMenu,
              mobileNav: t.chrome.mobileNav,
              bookCleaning: t.common.bookCleaning,
              call: t.common.call,
              opensWhatsApp: t.common.opensWhatsApp,
              language: t.common.language,
              logoHome: t.common.logoHome,
            }}
            phoneHref={business.phone ? `tel:${business.phone.e164}` : null}
            whatsappHref={buildWhatsAppUrl(business.whatsapp, t.whatsapp.general)}
          />
        </div>
      </div>
    </header>
  );
}
