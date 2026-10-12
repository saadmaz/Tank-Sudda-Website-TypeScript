import Link from "next/link";
import { business, getSocialProfiles } from "@/data/business";
import { footerNav, legalNav } from "@/data/navigation";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary, localizeNav } from "@/lib/i18n/dictionary";
import { ContactMethodList } from "@/components/contact/ContactActions";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { WaterLines } from "@/components/illustrations/TechnicalIllustrations";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function SiteFooter({ locale = "en" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();
  const groups = footerNav.map((group) => ({
    ...group,
    title: t.chrome.footerGroups[group.key],
    links: localizeNav(locale, group.links),
  }));
  return (
    <footer className="on-dark relative overflow-hidden bg-navy-950 text-grey-300">
      <WaterLines className="absolute inset-x-0 top-0 h-16 text-water-500/40" />
      <div className="relative container-site pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm space-y-5">
            <Logo tone="light" href={localeHref(locale, "/")} label={t.common.logoHome} />
            <p className="text-sm leading-relaxed text-grey-300">{t.chrome.description}</p>
            <ContactMethodList tone="dark" locale={locale} />
            {getSocialProfiles().length > 0 ? (
              <div className="pt-2">
                <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-white uppercase">
                  {t.chrome.followUs}
                </p>
                <SocialLinks tone="dark" locale={locale} />
              </div>
            ) : (
              <SocialLinks tone="dark" locale={locale} />
            )}
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <nav
                key={group.title}
                aria-label={t.chrome.footerGroupLinks(group.title)}
                className="border-t border-white/10 pt-6 sm:border-0 sm:pt-0"
              >
                <h2 className="mb-2 font-sans text-xs font-semibold tracking-[0.12em] text-white uppercase sm:mb-3">
                  {group.title}
                </h2>
                {/* Two even columns on phones so rows line up; one column from tablet up. */}
                <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex min-h-11 items-center text-[0.9375rem] text-grey-300 hover:text-white hover:underline hover:underline-offset-4 sm:text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p>
            © {year} {business.legalName ?? business.name}. {business.countryName}.
          </p>
          <LanguageSwitcher
            locale={locale}
            label={t.common.language}
            tone="dark"
            className="-mx-2.5 sm:order-last"
          />
          <nav aria-label={t.chrome.legal}>
            <ul className="flex flex-wrap gap-x-6">
              {localizeNav(locale, legalNav).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center hover:text-white hover:underline hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
