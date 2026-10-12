/**
 * Provider-neutral event tracking. Events are forwarded to whichever analytics
 * tool is loaded on the page (Plausible, Google Analytics 4 or Vercel Web
 * Analytics). When none is configured, tracking is a no-op, so nothing is
 * collected and no cookies are set. See docs/CONFIGURATION.md → Analytics.
 */

export type AnalyticsEvent =
  | "contact_click"
  | "booking_started"
  | "booking_step"
  | "booking_sent"
  | "booking_whatsapp_handoff"
  | "contact_form_sent";

export type AnalyticsProps = Record<string, string | number | boolean>;

type ContactChannel = "phone" | "whatsapp" | "email";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
    gtag?: (command: "event", event: string, params?: AnalyticsProps) => void;
    va?: (command: "event", payload: { name: string; data?: AnalyticsProps }) => void;
  }
}

/** Classifies a link by the contact channel it opens, if any. */
export function contactChannelForHref(href: string | null | undefined): ContactChannel | null {
  if (!href) return null;
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  try {
    const url = new URL(href, "https://example.invalid");
    if (url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")) return "whatsapp";
  } catch {
    return null;
  }
  return null;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, { props });
    window.gtag?.("event", event, props);
    window.va?.("event", { name: event, data: props });
  } catch {
    // Analytics must never break the page.
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, props);
  }
}
