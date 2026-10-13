import { Mail, Phone } from "lucide-react";
import type { ComponentType } from "react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { business } from "@/data/business";
import { ButtonAnchor, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { MissingInfo } from "@/components/ui/MissingInfo";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * WhatsApp call to action with a context-aware opening message. Renders
 * nothing (or a development-only marker) until a WhatsApp number is verified.
 */
export function WhatsAppButton({
  message,
  serviceName,
  label,
  variant = "whatsapp",
  size = "lg",
  className,
  locale = "en",
}: {
  message?: string;
  serviceName?: string;
  label?: string;
  locale?: Locale;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const t = getDictionary(locale);
  const defaultMessage = serviceName ? t.whatsapp.service(serviceName) : t.whatsapp.general;
  const href = buildWhatsAppUrl(business.whatsapp, message ?? defaultMessage);
  if (!href) return <MissingInfo what="WhatsApp number" />;
  return (
    <ButtonAnchor href={href} external variant={variant} size={size} className={className}>
      <WhatsAppIcon className="text-current" />
      {label ?? t.common.chatOnWhatsApp}
      <span className="sr-only">{t.common.opensWhatsApp}</span>
    </ButtonAnchor>
  );
}

export function PhoneButton({
  variant = "secondary",
  size = "lg",
  className,
  locale = "en",
}: {
  locale?: Locale;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  if (!business.phone) return <MissingInfo what="phone number" />;
  return (
    <ButtonAnchor
      href={`tel:${business.phone.e164}`}
      variant={variant}
      size={size}
      className={className}
    >
      <Phone aria-hidden="true" />
      {getDictionary(locale).common.callNumber(business.phone.display)}
    </ButtonAnchor>
  );
}

export interface ContactMethod {
  icon: ComponentType<{ className?: string }>;
  /** The icon carries its own brand colour; don't recolour it. */
  brandColored: boolean;
  label: string;
  value: string;
  href: string;
  external: boolean;
}

/** Verified direct contact methods, in display order. Empty when none are verified. */
export function getContactMethods(
  locale: Locale = "en",
  whatsappMessage?: string,
): ContactMethod[] {
  const t = getDictionary(locale);
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp, whatsappMessage ?? t.whatsapp.general);
  const items: ContactMethod[] = [];
  if (business.phone) {
    items.push({
      icon: Phone,
      brandColored: false,
      label: t.common.phone,
      value: business.phone.display,
      href: `tel:${business.phone.e164}`,
      external: false,
    });
  }
  if (business.whatsapp && whatsappUrl) {
    items.push({
      icon: WhatsAppIcon,
      brandColored: true,
      label: t.common.whatsapp,
      value: business.whatsapp.display,
      href: whatsappUrl,
      external: true,
    });
  }
  if (business.email) {
    items.push({
      icon: Mail,
      brandColored: false,
      label: t.common.email,
      value: business.email,
      href: `mailto:${business.email}`,
      external: false,
    });
  }
  return items;
}

/** List of verified direct contact methods. */
export function ContactMethodList({
  tone = "light",
  locale = "en",
  centerOnMobile = false,
}: {
  tone?: "light" | "dark";
  locale?: Locale;
  /** Centre each line on phones (used in the footer). */
  centerOnMobile?: boolean;
}) {
  const items = getContactMethods(locale);
  if (items.length === 0) {
    return <MissingInfo what="phone, WhatsApp and email" />;
  }
  const dark = tone === "dark";
  return (
    <ul className="space-y-1">
      {items.map(({ icon: Icon, brandColored, label, value, href, external }) => (
        <li
          key={label}
          className={cn(
            "flex items-center gap-3",
            centerOnMobile && "justify-center sm:justify-start",
          )}
        >
          <Icon
            className={cn("size-5", !brandColored && (dark ? "text-water-300" : "text-water-600"))}
          />
          <span className="sr-only">{label}: </span>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={
              dark
                ? "inline-flex min-h-11 items-center text-white underline-offset-4 hover:underline"
                : "inline-flex min-h-11 items-center font-medium text-navy-950 underline-offset-4 hover:underline"
            }
          >
            {value}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Contact value with a preferred line-break point after "@" so a long email
 * address wraps as "name@ / domain" on narrow screens instead of mid-word.
 */
export function BreakableValue({ value }: { value: string }) {
  const at = value.indexOf("@");
  if (at === -1) return <>{value}</>;
  return (
    <>
      {value.slice(0, at + 1)}
      <wbr />
      {value.slice(at + 1)}
    </>
  );
}
