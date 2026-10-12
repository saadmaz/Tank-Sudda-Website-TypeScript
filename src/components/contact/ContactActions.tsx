import { Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { business } from "@/data/business";
import { ButtonAnchor, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { MissingInfo } from "@/components/ui/MissingInfo";
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
      <MessageCircle aria-hidden="true" />
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

/** List of verified direct contact methods. Empty when none are verified. */
export function ContactMethodList({ tone = "light" }: { tone?: "light" | "dark" }) {
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp, serviceEnquiryMessage());
  const items: {
    icon: LucideIcon;
    label: string;
    value: string;
    href: string;
    external: boolean;
  }[] = [];
  if (business.phone) {
    items.push({
      icon: Phone,
      label: "Phone",
      value: business.phone.display,
      href: `tel:${business.phone.e164}`,
      external: false,
    });
  }
  if (business.whatsapp && whatsappUrl) {
    items.push({
      icon: MessageCircle,
      label: "WhatsApp",
      value: business.whatsapp.display,
      href: whatsappUrl,
      external: true,
    });
  }
  if (business.email) {
    items.push({
      icon: Mail,
      label: "Email",
      value: business.email,
      href: `mailto:${business.email}`,
      external: false,
    });
  }

  if (items.length === 0) {
    return <MissingInfo what="phone, WhatsApp and email" />;
  }
  const dark = tone === "dark";
  return (
    <ul className="space-y-3">
      {items.map(({ icon: Icon, label, value, href, external }) => (
        <li key={label} className="flex items-center gap-3">
          <Icon
            aria-hidden="true"
            className={dark ? "size-5 text-water-300" : "size-5 text-water-600"}
          />
          <span className="sr-only">{label}: </span>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={
              dark
                ? "text-white underline-offset-4 hover:underline"
                : "font-medium text-navy-950 underline-offset-4 hover:underline"
            }
          >
            {value}
          </a>
        </li>
      ))}
    </ul>
  );
}
