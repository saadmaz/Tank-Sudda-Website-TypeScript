"use client";

import Script from "next/script";
import { useEffect } from "react";
import { contactChannelForHref, track } from "@/lib/analytics";

/**
 * Loads the configured analytics provider (if any) and records clicks on
 * phone, WhatsApp and email links anywhere on the site with a single
 * delegated listener, so individual links need no extra code.
 */
export function Analytics({ plausibleDomain }: { plausibleDomain: string | null }) {
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

  if (!plausibleDomain) return null;
  return (
    <Script
      src="https://plausible.io/js/script.js"
      data-domain={plausibleDomain}
      strategy="afterInteractive"
    />
  );
}
