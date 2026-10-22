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
  | "contact_form_sent"
  | "contact_whatsapp_fallback";

export type AnalyticsProps = Record<string, string | number | boolean>;

type ContactChannel = "phone" | "whatsapp" | "email";

type ConsentValue = "granted" | "denied";

/** The parts of Google's gtag() API this site uses. */
export interface Gtag {
  (command: "event", event: string, params?: AnalyticsProps): void;
  (command: "js", date: Date): void;
  (command: "config", targetId: string, params?: Record<string, string | boolean>): void;
  (command: "consent", action: "default" | "update", params: Record<string, ConsentValue>): void;
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
    gtag?: Gtag;
    dataLayer?: unknown[];
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

/** A Google Analytics 4 measurement ID such as G-ABC123XYZ9, or null if malformed. */
export function parseGaMeasurementId(raw: string | undefined): string | null {
  const id = raw?.trim().toUpperCase();
  return id && /^G-[A-Z0-9]{4,15}$/.test(id) ? id : null;
}

// ---- Analytics opt-out (Google Analytics runs unless the visitor turns it off on /cookies) ----

export type CookieConsent = "granted" | "denied";

const CONSENT_KEY = "tanksudda-cookie-consent";
const CONSENT_EVENT = "tanksudda:cookie-consent";
/** Fallback when the browser blocks storage: the choice then lasts until the page closes. */
let memoryConsent: CookieConsent | null = null;

/** "denied" if the visitor turned analytics off, otherwise null (no choice made). */
export function readCookieConsent(): CookieConsent | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : memoryConsent;
  } catch {
    return memoryConsent;
  }
}

export function saveCookieConsent(value: CookieConsent | null): void {
  memoryConsent = value;
  try {
    if (value) window.localStorage.setItem(CONSENT_KEY, value);
    else window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Storage can be blocked (private mode); the choice then lasts for this page only.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Subscribes to consent changes (this tab and other tabs), for useSyncExternalStore. */
export function subscribeCookieConsent(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
