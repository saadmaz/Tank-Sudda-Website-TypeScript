/**
 * Language-aware access to interface text and translated content.
 * English always comes straight from src/data, so it never changes here.
 */
import { en, type Dictionary } from "@/data/i18n/en";
import { si } from "@/data/i18n/si";
import { ta } from "@/data/i18n/ta";
import { faqs, type Faq } from "@/data/faqs";
import type { NavLink } from "@/data/navigation";
import { formatLkr, getPriceEntry, isDisplayablePrice } from "@/data/pricing";
import { services, type Service } from "@/data/services";
import { localeHref, type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { en, si, ta };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** A service with its text in the given language (English text if a translation is missing). */
export function localizeService(service: Service, locale: Locale): Service {
  const text = getDictionary(locale).content.services[service.slug];
  return text ? { ...service, ...text } : service;
}

export function getLocalizedServices(locale: Locale): Service[] {
  return services.map((service) => localizeService(service, locale));
}

export function localizeFaq(faq: Faq, locale: Locale): Faq {
  const text = getDictionary(locale).content.faqs[faq.id];
  return text ? { ...faq, ...text } : faq;
}

export function getLocalizedFaqs(locale: Locale, items: readonly Faq[] = faqs): Faq[] {
  return items.map((faq) => localizeFaq(faq, locale));
}

/** Price text for a service, in the given language. */
export function describeServicePrice(locale: Locale, serviceSlug: string): string {
  const { common } = getDictionary(locale);
  const entry = getPriceEntry(serviceSlug);
  if (!isDisplayablePrice(entry)) return common.quotedAfterAssessment;
  const amount = formatLkr(entry.amountLkr);
  const base = entry.model === "from" ? common.priceFrom(amount) : amount;
  return entry.unit ? `${base} ${entry.unit}` : base;
}

/** Navigation links with translated labels, pointing at the page in the same language. */
export function localizeNav(locale: Locale, links: readonly NavLink[]): NavLink[] {
  if (locale === "en") return [...links];
  const labels: Record<string, string> = getDictionary(locale).nav;
  return links.map((link) => ({
    href: localeHref(locale, link.href),
    label: labels[link.href] ?? link.label,
  }));
}
