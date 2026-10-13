import { afterEach, describe, expect, it, vi } from "vitest";
import { formatLongDate } from "@/lib/dates";
import {
  escapeHtml,
  formatSubmitted,
  renderCustomerEmail,
  renderTeamEmail,
} from "@/server/leads/email";
import type { Lead } from "@/server/leads/types";
import { resendChannel } from "@/server/notifications/channels";

function booking(overrides: Partial<Lead> = {}): Lead {
  return {
    kind: "booking",
    reference: "TS-20261013-ABCDE",
    submittedAt: "2026-10-13T11:42:33.684Z",
    contact: { name: "Saad <b>Mazhar</b>", phone: "+94720135801", email: "customer@example.com" },
    fields: [
      { label: "Service", value: "Deep cleaning", shared: true },
      { label: "Town / area", value: "Dehiwala", shared: true },
      { label: "Address", value: "5/5 Secret Lane" },
      { label: "Notes", value: "Visit <script>alert(1)</script> www.spam.example" },
      { label: "Preferred date", value: "Thursday, 22 October 2026", shared: true },
    ],
    marketingConsent: false,
    ...overrides,
  };
}

describe("lead email templates", () => {
  it("escapes everything typed into the form", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;",
    );
    const team = renderTeamEmail(booking());
    expect(team.html).not.toContain("<script>");
    expect(team.html).toContain("&lt;script&gt;");
    expect(team.html).toContain("Saad &lt;b&gt;Mazhar&lt;/b&gt;");
  });

  it("gives the team every field plus call, WhatsApp and reply links", () => {
    const team = renderTeamEmail(booking());
    expect(team.subject).toContain("TS-20261013-ABCDE");
    expect(team.html).toContain("5/5 Secret Lane");
    expect(team.html).toContain('href="tel:+94720135801"');
    expect(team.html).toContain('href="https://wa.me/94720135801"');
    expect(team.html).toContain('href="mailto:customer@example.com"');
    expect(team.text).toContain("Service: Deep cleaning");
  });

  it("repeats only the safe fields back to the customer", () => {
    const customer = renderCustomerEmail(booking());
    expect(customer).not.toBeNull();
    const { html, text, subject } = customer!;
    expect(subject).toBe("We've received your booking request (TS-20261013-ABCDE)");
    for (const body of [html, text]) {
      expect(body).toContain("Deep cleaning");
      expect(body).toContain("Dehiwala");
      expect(body).not.toContain("Secret Lane");
      expect(body).not.toContain("spam.example");
    }
    expect(text).toContain("Hi Saad");
    expect(text).toContain("Team Tank Sudda");
    expect(html).toContain("/email/icons/whatsapp.png");
    expect(html).toContain("https://www.facebook.com/TankSuddaa");
    expect(text).toContain("confirmed only at that point");
  });

  it("sends no confirmation when the customer gave no email", () => {
    const lead = booking({ contact: { name: "A", phone: "+94720135801", email: null } });
    expect(renderCustomerEmail(lead)).toBeNull();
  });

  it("formats dates for people", () => {
    expect(formatLongDate("2026-10-22")).toBe("Thursday, 22 October 2026");
    expect(formatLongDate("not a date")).toBe("not a date");
    expect(formatSubmitted("2026-10-13T11:42:33.684Z")).toBe("13 Oct 2026, 17:12 (Sri Lanka time)");
  });
});

describe("Resend channel", () => {
  afterEach(() => vi.restoreAllMocks());

  function mockFetch(statuses: number[]) {
    const calls: { to: string[]; reply_to?: string }[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      calls.push(JSON.parse(String(init?.body)) as { to: string[]; reply_to?: string });
      return new Response(null, { status: statuses[calls.length - 1] ?? 200 });
    });
    return calls;
  }

  const config = {
    apiKey: "test",
    from: "Tank Sudda <bookings@tanksudda.com>",
    to: ["info@tanksudda.com"],
    replyTo: "info@tanksudda.com",
  };

  it("emails the team, then the customer with replies going to the business", async () => {
    const calls = mockFetch([200, 200]);
    await resendChannel(config).send(booking());
    expect(calls.map((call) => call.to)).toEqual([
      ["info@tanksudda.com"],
      ["customer@example.com"],
    ]);
    expect(calls[0]?.reply_to).toBe("customer@example.com");
    expect(calls[1]?.reply_to).toBe("info@tanksudda.com");
  });

  it("still counts as delivered when only the customer confirmation fails", async () => {
    const calls = mockFetch([200, 500]);
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(resendChannel(config).send(booking())).resolves.toBeUndefined();
    expect(calls).toHaveLength(2);
  });

  it("fails when the team email is not accepted", async () => {
    mockFetch([500]);
    await expect(resendChannel(config).send(booking())).rejects.toThrow("Resend");
  });

  it("can be told not to email customers", async () => {
    const calls = mockFetch([200]);
    await resendChannel({ ...config, confirmToCustomer: false }).send(booking());
    expect(calls).toHaveLength(1);
  });
});
