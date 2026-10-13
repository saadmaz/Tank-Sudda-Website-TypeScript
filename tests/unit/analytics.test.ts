import { afterEach, describe, expect, it, vi } from "vitest";
import { contactChannelForHref, parseGaMeasurementId, track } from "@/lib/analytics";

describe("contact link classification", () => {
  it.each([
    ["tel:+94741004296", "phone"],
    ["mailto:info@tanksudda.com", "email"],
    ["https://wa.me/94741004296?text=Hi", "whatsapp"],
    ["https://api.whatsapp.com/send?phone=94741004296", "whatsapp"],
  ])("%s → %s", (href, channel) => {
    expect(contactChannelForHref(href)).toBe(channel);
  });

  it.each(["/services", "https://www.facebook.com/TankSuddaa", "", null])("ignores %s", (href) => {
    expect(contactChannelForHref(href)).toBeNull();
  });
});

describe("track", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("does nothing when no provider is loaded", () => {
    vi.stubGlobal("window", {});
    expect(() => track("booking_started", { service: "sump-cleaning" })).not.toThrow();
  });

  it("forwards events to every loaded provider", () => {
    const plausible = vi.fn();
    const gtag = vi.fn();
    const va = vi.fn();
    vi.stubGlobal("window", { plausible, gtag, va });
    track("contact_click", { channel: "whatsapp" });
    expect(plausible).toHaveBeenCalledWith("contact_click", { props: { channel: "whatsapp" } });
    expect(gtag).toHaveBeenCalledWith("event", "contact_click", { channel: "whatsapp" });
    expect(va).toHaveBeenCalledWith("event", {
      name: "contact_click",
      data: { channel: "whatsapp" },
    });
  });

  it("never lets a provider error break the page", () => {
    vi.stubGlobal("window", {
      plausible: () => {
        throw new Error("blocked");
      },
    });
    expect(() => track("booking_sent")).not.toThrow();
  });
});

describe("Google Analytics measurement ID", () => {
  it("accepts GA4 IDs and rejects anything else", () => {
    expect(parseGaMeasurementId("G-EK434GVS4Z")).toBe("G-EK434GVS4Z");
    expect(parseGaMeasurementId(" g-ek434gvs4z ")).toBe("G-EK434GVS4Z");
    expect(parseGaMeasurementId("GTM-ABC123")).toBeNull();
    expect(parseGaMeasurementId("UA-12345-1")).toBeNull();
    expect(parseGaMeasurementId("G-<script>")).toBeNull();
    expect(parseGaMeasurementId("")).toBeNull();
    expect(parseGaMeasurementId(undefined)).toBeNull();
  });
});
