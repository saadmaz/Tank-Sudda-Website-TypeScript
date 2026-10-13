"use client";

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

/** "pending" until the browser has been checked, so the tag never loads for an opted-out visitor. */
function useAnalyticsOptOut(): CookieConsent | null | "pending" {
  return useSyncExternalStore(subscribeCookieConsent, readCookieConsent, () => "pending");
}

/**
 * Loads the configured analytics providers and records clicks on phone,
 * WhatsApp and email links anywhere on the site with a single delegated
 * listener, so individual links need no extra code.
 *
 * Google Analytics runs for every visitor (no consent banner, by the owner's
 * decision). Visitors who turn it off on the Cookie Information page are
 * respected: the tag is not loaded for them.
 */
export function Analytics({
  plausibleDomain,
  gaMeasurementId,
}: {
  plausibleDomain: string | null;
  gaMeasurementId: string | null;
}) {
  const choice = useAnalyticsOptOut();

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

  const loadGoogle = gaMeasurementId !== null && choice !== "pending" && choice !== "denied";

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
    </>
  );
}

/** Standard gtag bootstrap. Measurement is on; ad personalisation stays off (no remarketing). */
function googleTagInit(measurementId: string): string {
  return `window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};
gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'denied'});
gtag('js',new Date());gtag('config',${JSON.stringify(measurementId)});`;
}

/** Lets visitors turn Google Analytics off (or back on) in this browser. Used on /cookies. */
export function AnalyticsOptOut() {
  const choice = useAnalyticsOptOut();
  if (choice === "pending") return null;
  const off = choice === "denied";
  return (
    <div className="not-prose my-6 rounded-lg border border-line bg-mist p-5">
      <p role="status" className="font-medium text-navy-950">
        {off
          ? "Google Analytics is turned off in this browser."
          : "Google Analytics is on in this browser."}
      </p>
      <button
        type="button"
        onClick={() => {
          if (off) {
            saveCookieConsent(null);
          } else {
            saveCookieConsent("denied");
            // Remove Google Analytics cookies already set on this site.
            for (const cookie of document.cookie.split(";")) {
              const name = cookie.split("=")[0]?.trim() ?? "";
              if (name.startsWith("_ga") || name.startsWith("_gcl")) {
                document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`;
                document.cookie = `${name}=; Max-Age=0; path=/`;
              }
            }
          }
          // Reload so the tag starts or stops cleanly.
          window.location.reload();
        }}
        className="mt-3 inline-flex min-h-11 items-center rounded-md border border-grey-300 bg-white px-5 font-semibold text-navy-950 hover:border-navy-950"
      >
        {off ? "Turn Google Analytics back on" : "Turn off Google Analytics"}
      </button>
    </div>
  );
}
