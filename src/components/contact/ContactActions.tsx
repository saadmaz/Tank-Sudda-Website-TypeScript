import { Mail, Phone } from "lucide-react";
import type { ComponentType } from "react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { business } from "@/data/business";
import { ButtonAnchor, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { MissingInfo } from "@/components/ui/MissingInfo";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, serviceEnquiryMessage } from "@/lib/whatsapp";

/**
 * WhatsApp call to action with a context-aware opening message. Renders
 * nothing (or a development-only marker) until a WhatsApp number is verified.
 */
export function WhatsAppButton({
  message,
  serviceName,
  label = "Chat on WhatsApp",
  variant = "whatsapp",
  size = "lg",
  className,
}: {
  message?: string;
  serviceName?: string;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const href = buildWhatsAppUrl(business.whatsapp, message ?? serviceEnquiryMessage(serviceName));
  if (!href) return <MissingInfo what="WhatsApp number" />;
  return (
    <ButtonAnchor href={href} external variant={variant} size={size} className={className}>
      <WhatsAppIcon className="text-current" />
      {label}
      <span className="sr-only"> (opens WhatsApp)</span>
    </ButtonAnchor>
  );
}

export function PhoneButton({
  variant = "secondary",
  size = "lg",
  className,
}: {
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
      Call {business.phone.display}
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
export function getContactMethods(whatsappMessage = serviceEnquiryMessage()): ContactMethod[] {
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp, whatsappMessage);
  const items: ContactMethod[] = [];
  if (business.phone) {
    items.push({
      icon: Phone,
      brandColored: false,
      label: "Phone",
      value: business.phone.display,
      href: `tel:${business.phone.e164}`,
      external: false,
    });
  }
  if (business.whatsapp && whatsappUrl) {
    items.push({
      icon: WhatsAppIcon,
      brandColored: true,
      label: "WhatsApp",
      value: business.whatsapp.display,
      href: whatsappUrl,
      external: true,
    });
  }
  if (business.email) {
    items.push({
      icon: Mail,
      brandColored: false,
      label: "Email",
      value: business.email,
      href: `mailto:${business.email}`,
      external: false,
    });
  }
  return items;
}

/** List of verified direct contact methods. */
export function ContactMethodList({ tone = "light" }: { tone?: "light" | "dark" }) {
  const items = getContactMethods();
  if (items.length === 0) {
    return <MissingInfo what="phone, WhatsApp and email" />;
  }
  const dark = tone === "dark";
  return (
    <ul className="space-y-1">
      {items.map(({ icon: Icon, brandColored, label, value, href, external }) => (
        <li key={label} className="flex items-center gap-3">
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
