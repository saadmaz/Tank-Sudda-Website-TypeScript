"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import {
  contactChannelForHref,
  readCookieConsent,
  saveCookieConsent,
  subscribeCookieConsent,
  track,
  type CookieConsent,
} from "@/lib/analytics";

export interface ConsentLabels {
  label: string;
  message: string;
  accept: string;
  decline: string;
  learnMore: string;
}

/** "pending" until the browser has been checked, so nothing flashes on first paint. */
function useCookieConsent(): CookieConsent | null | "pending" {
  return useSyncExternalStore(subscribeCookieConsent, readCookieConsent, () => "pending");
}

/**
 * Loads the configured analytics providers and records clicks on phone,
 * WhatsApp and email links anywhere on the site with a single delegated
 * listener, so individual links need no extra code.
 *
 * Google Analytics sets cookies, so it loads only after the visitor accepts
 * in the consent bar (nothing is sent to Google before that). Plausible is
 * cookieless and needs no consent.
 */
export function Analytics({
  plausibleDomain,
  gaMeasurementId,
  consentLabels,
}: {
  plausibleDomain: string | null;
  gaMeasurementId: string | null;
  consentLabels: ConsentLabels;
}) {
  const consent = useCookieConsent();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!link) return;
      const channel = contactChannelForHref(link.getAttribute("href"));
      if (!channel) return;
      const placement =
        link.closest("[data-analytics-placement]")?.getAttribute("data-analytics-placement") ??
        link.closest("header, footer, aside, nav, section")?.tagName.toLowerCase() ??
        "page";
      track("contact_click", { channel, page: window.location.pathname, placement });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  const loadGoogle = gaMeasurementId !== null && consent === "granted";

  return (
    <>
      {plausibleDomain ? (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={plausibleDomain}
          strategy="afterInteractive"
        />
      ) : null}
      {loadGoogle ? (
        <>
          <Script id="google-tag-init" strategy="afterInteractive">
            {googleTagInit(gaMeasurementId)}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
        </>
      ) : null}
      {gaMeasurementId !== null && consent === null ? <ConsentBar labels={consentLabels} /> : null}
    </>
  );
}

/**
 * Standard gtag bootstrap. Consent is granted for measurement (the visitor
 * accepted); ad personalisation stays off, as no remarketing is used.
 */
function googleTagInit(measurementId: string): string {
  return `window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'denied'});
gtag('js',new Date());gtag('config',${JSON.stringify(measurementId)});`;
}

function ConsentBar({ labels }: { labels: ConsentLabels }) {
  return (
    <section
      aria-label={labels.label}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-line bg-white p-4 shadow-raised sm:inset-x-6 sm:bottom-6 sm:p-5"
    >
      <p className="text-sm leading-relaxed text-body">
        {labels.message}{" "}
        <Link href="/cookies" className="font-medium text-water-700 underline underline-offset-4">
          {labels.learnMore}
        </Link>
      </p>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={() => saveCookieConsent("granted")}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-water-600 px-5 font-semibold text-white hover:bg-water-700 sm:flex-none"
        >
          {labels.accept}
        </button>
        <button
          type="button"
          onClick={() => saveCookieConsent("denied")}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-grey-300 bg-white px-5 font-semibold text-navy-950 hover:border-navy-950 sm:flex-none"
        >
          {labels.decline}
        </button>
      </div>
    </section>
  );
}

/** Lets visitors change their cookie choice later (used on the Cookie Information page). */
export function CookieChoice({ labels }: { labels: { accept: string; decline: string } }) {
  const consent = useCookieConsent();
  if (consent === "pending") return null;
  const status =
    consent === "granted"
      ? "You have accepted Google Analytics cookies."
      : consent === "denied"
        ? "You have declined Google Analytics cookies."
        : "You have not made a choice yet.";
  return (
    <div className="not-prose my-6 rounded-lg border border-line bg-mist p-5">
      <p role="status" className="font-medium text-navy-950">
        {status}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => saveCookieConsent("granted")}
          className="inline-flex min-h-11 items-center rounded-md bg-water-600 px-5 font-semibold text-white hover:bg-water-700"
        >
          {labels.accept}
        </button>
        <button
          type="button"
          onClick={() => {
            saveCookieConsent("denied");
            // Remove Google Analytics cookies already set on this site, then reload so the
            // tag is no longer running.
            for (const cookie of document.cookie.split(";")) {
              const name = cookie.split("=")[0]?.trim() ?? "";
              if (name.startsWith("_ga")) {
                document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`;
                document.cookie = `${name}=; Max-Age=0; path=/`;
              }
            }
            window.location.reload();
          }}
          className="inline-flex min-h-11 items-center rounded-md border border-grey-300 bg-white px-5 font-semibold text-navy-950 hover:border-navy-950"
        >
          {labels.decline}
        </button>
      </div>
    </div>
  );
}
