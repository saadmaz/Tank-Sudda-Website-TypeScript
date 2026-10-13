/**
 * Email templates for leads: the notification sent to the Tank Sudda team and
 * the confirmation sent to the customer. Each has an HTML version (table
 * layout with inline styles, which email clients render reliably) and a
 * plain-text version. Every value from the form is HTML-escaped.
 */
import { business } from "@/data/business";
import { siteUrl } from "@/lib/site";
import { EMAIL_ICON_PATH, EMAIL_ICONS, EMAIL_LOGO_PATH, type EmailIconId } from "./email-icons";
import { leadSubject, leadToText } from "./format";
import type { Lead } from "./types";

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const color = {
  navy: "#061c36",
  water: "#1a89ca",
  waterDark: "#11679b",
  mist: "#f3f7fa",
  line: "#e3e8ee",
  text: "#24303d",
  muted: "#5b6675",
  whatsapp: "#25d366",
};

const font = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escapes text and keeps the line breaks people typed (e.g. in notes). */
function multiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function websiteUrl(): string {
  return siteUrl ? siteUrl.origin : "https://tanksudda.com";
}

function websiteLabel(): string {
  return websiteUrl().replace(/^https?:\/\//, "");
}

function whatsappLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? `https://wa.me/${digits}` : null;
}

function button(href: string, label: string, background: string, textColor = "#ffffff"): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:6px;background:${background};color:${textColor};font-family:${font};font-size:14px;font-weight:600;text-decoration:none;">${escapeHtml(label)}</a>`;
}

function detailsTable(rows: { label: string; value: string }[]): string {
  const body = rows
    .map(
      (row, index) => `<tr>
  <td style="padding:10px 12px;width:38%;vertical-align:top;font-family:${font};font-size:13px;color:${color.muted};${index > 0 ? `border-top:1px solid ${color.line};` : ""}">${escapeHtml(row.label)}</td>
  <td style="padding:10px 12px;vertical-align:top;font-family:${font};font-size:14px;color:${color.text};${index > 0 ? `border-top:1px solid ${color.line};` : ""}">${multiline(row.value)}</td>
</tr>`,
    )
    .join("\n");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${color.line};border-radius:8px;border-collapse:separate;">${body}</table>`;
}

/** Where each round icon links to; icons without a verified link are left out. */
function iconHref(id: EmailIconId): string | null {
  switch (id) {
    case "phone":
      return business.phone ? `tel:${business.phone.e164}` : null;
    case "whatsapp":
      return business.whatsapp ? whatsappLink(business.whatsapp.e164) : null;
    case "email":
      return business.email ? `mailto:${business.email}` : null;
  }
}

/**
 * Row of round contact icons (PNG files on the website, because
 * email apps do not show SVG). Alt text names each one if images are blocked.
 */
export function contactIconsHtml(): string {
  const links = EMAIL_ICONS.flatMap((icon) => {
    const href = iconHref(icon.id);
    if (!href) return [];
    const src = `${websiteUrl()}${EMAIL_ICON_PATH}/${icon.id}.png`;
    return [
      `<a href="${escapeHtml(href)}" title="${escapeHtml(icon.label)}" style="display:inline-block;margin:0 8px 8px 0;text-decoration:none;"><img src="${src}" width="32" height="32" alt="${escapeHtml(icon.label)}" style="display:block;width:32px;height:32px;border:0;"></a>`,
    ];
  });
  return `<div style="margin:0 0 20px;font-size:0;line-height:0;">${links.join("")}</div>`;
}

function contactLinesText(): string {
  const lines: string[] = [];
  if (business.phone) lines.push(`Phone: ${business.phone.display}`);
  if (business.whatsapp) lines.push(`WhatsApp: ${business.whatsapp.display}`);
  if (business.email) lines.push(`Email: ${business.email}`);
  lines.push(`Website: ${websiteLabel()}`);
  return lines.join("\n");
}

/** Shared page frame: brand header, white card, footer. */
function layout({
  preheader,
  heading,
  body,
  footer,
}: {
  preheader: string;
  heading: string;
  body: string;
  footer: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${color.mist};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${color.mist};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
<tr><td style="background:${color.navy};border-radius:10px 10px 0 0;padding:18px 28px;">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="padding-right:14px;vertical-align:middle;"><img src="${websiteUrl()}${EMAIL_LOGO_PATH}" width="48" height="48" alt="Tank Sudda" style="display:block;width:48px;height:48px;border:0;"></td>
    <td style="vertical-align:middle;">
      <span style="font-family:${font};font-size:20px;font-weight:700;color:#ffffff;">Tank</span><span style="font-family:${font};font-size:20px;font-weight:700;color:#7fc1e6;"> Sudda</span>
      <div style="font-family:${font};font-size:12px;color:#b9c7d6;margin-top:4px;">Water tank &amp; sump cleaning in Sri Lanka</div>
    </td>
  </tr></table>
</td></tr>
<tr><td style="background:#ffffff;border:1px solid ${color.line};border-top:0;border-radius:0 0 10px 10px;padding:28px;">
  <h1 style="margin:0 0 16px;font-family:${font};font-size:22px;line-height:1.3;color:${color.navy};">${escapeHtml(heading)}</h1>
  ${body}
</td></tr>
<tr><td style="padding:18px 8px;font-family:${font};font-size:12px;line-height:1.6;color:${color.muted};text-align:center;">${footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${font};font-size:15px;line-height:1.6;color:${color.text};">${html}</p>`;
}

function referenceBadge(reference: string): string {
  return `<p style="margin:0 0 20px;font-family:${font};font-size:13px;color:${color.muted};">Reference <span style="display:inline-block;margin-left:6px;padding:4px 10px;border-radius:999px;background:${color.mist};border:1px solid ${color.line};font-family:Consolas,Menlo,monospace;font-size:13px;color:${color.navy};">${escapeHtml(reference)}</span></p>`;
}

/** Notification for the Tank Sudda team, with one-tap call, WhatsApp and reply buttons. */
export function renderTeamEmail(lead: Lead): RenderedEmail {
  const booking = lead.kind === "booking";
  const heading = booking ? "New booking request" : "New website enquiry";
  const { name, phone, email } = lead.contact;

  const actions: string[] = [];
  if (phone) {
    actions.push(button(`tel:${phone}`, `Call ${name}`, color.water));
    const link = whatsappLink(phone);
    if (link) actions.push(button(link, "WhatsApp", color.whatsapp, color.navy));
  }
  if (email) actions.push(button(`mailto:${email}`, "Reply by email", color.navy));

  const body = [
    referenceBadge(lead.reference),
    paragraph(
      booking
        ? `<strong>${escapeHtml(name)}</strong> asked for a cleaning through the website. Contact them to confirm the details, the quotation and a date.`
        : `<strong>${escapeHtml(name)}</strong> sent a message through the website.`,
    ),
    actions.length > 0 ? `<div style="margin:0 0 20px;">${actions.join("")}</div>` : "",
    detailsTable(lead.fields),
    `<p style="margin:20px 0 0;font-family:${font};font-size:13px;line-height:1.6;color:${color.muted};">Submitted ${escapeHtml(formatSubmitted(lead.submittedAt))}${lead.marketingConsent ? " · Marketing consent: Yes" : ""}${booking ? " · This is a request only, not a confirmed appointment." : ""}</p>`,
  ].join("\n");

  return {
    subject: leadSubject(lead),
    html: layout({
      preheader: `${booking ? "Booking request" : "Enquiry"} from ${name} (${lead.reference})`,
      heading,
      body,
      footer: `Sent automatically by the booking form on ${escapeHtml(websiteLabel())}. Replying to this email replies to the customer${email ? "" : " (no email given: use the phone buttons above)"}.`,
    }),
    text: leadToText(lead),
  };
}

/** "2026-10-13T11:42:33Z" → "13 Oct 2026, 17:12 (Sri Lanka time)". */
export function formatSubmitted(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Colombo",
  }).format(date);
  return `${formatted} (Sri Lanka time)`;
}

function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first.slice(0, 40);
}

/**
 * Confirmation for the customer that their request arrived. Returns null when
 * they gave no email address. Only `shared` fields are repeated back.
 */
export function renderCustomerEmail(lead: Lead): RenderedEmail | null {
  if (!lead.contact.email) return null;
  const booking = lead.kind === "booking";
  const greetingName = firstName(lead.contact.name);
  const greeting = greetingName ? `Hi ${greetingName},` : "Hello,";
  const shared = lead.fields.filter((field) => field.shared);
  const subject = booking
    ? `We've received your booking request (${lead.reference})`
    : `We've received your message (${lead.reference})`;

  const steps = booking
    ? [
        "We review your request and check whether we can serve your area.",
        "We contact you to confirm the details and give you a quotation.",
        "Once you accept, we agree a date. Your booking is confirmed only at that point.",
      ]
    : ["We read your message and reply as soon as we can."];

  const stepsHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">${steps
    .map(
      (step, index) => `<tr>
  <td style="width:30px;vertical-align:top;padding:0 0 10px;"><span style="display:inline-block;width:22px;height:22px;border-radius:999px;background:${color.mist};border:1px solid ${color.line};font-family:${font};font-size:12px;font-weight:700;line-height:22px;text-align:center;color:${color.waterDark};">${index + 1}</span></td>
  <td style="vertical-align:top;padding:2px 0 10px;font-family:${font};font-size:15px;line-height:1.5;color:${color.text};">${escapeHtml(step)}</td>
</tr>`,
    )
    .join("\n")}</table>`;

  const body = [
    paragraph(escapeHtml(greeting)),
    paragraph(
      booking
        ? "Thank you for choosing Tank Sudda. We've received your cleaning request and our team will contact you soon."
        : "Thank you for contacting Tank Sudda. We've received your message and will get back to you soon.",
    ),
    referenceBadge(lead.reference),
    `<h2 style="margin:0 0 12px;font-family:${font};font-size:16px;color:${color.navy};">What happens next</h2>`,
    stepsHtml,
    shared.length > 0
      ? `<h2 style="margin:0 0 12px;font-family:${font};font-size:16px;color:${color.navy};">Your request</h2>${detailsTable(shared)}<div style="height:20px;"></div>`
      : "",
    paragraph(
      "Need to change something or have a question? Just reply to this email, or call or WhatsApp us and mention your reference.",
    ),
    contactIconsHtml(),
    paragraph(`Thank you,<br><strong>Team Tank Sudda</strong>`),
  ].join("\n");

  const textLines = [
    greeting,
    "",
    booking
      ? "Thank you for choosing Tank Sudda. We've received your cleaning request and our team will contact you soon."
      : "Thank you for contacting Tank Sudda. We've received your message and will get back to you soon.",
    "",
    `Reference: ${lead.reference}`,
    "",
    "What happens next",
    ...steps.map((step, index) => `${index + 1}. ${step}`),
  ];
  if (shared.length > 0) {
    textLines.push("", "Your request", ...shared.map((field) => `${field.label}: ${field.value}`));
  }
  textLines.push(
    "",
    "Need to change something or have a question? Just reply to this email, or call or WhatsApp us and mention your reference.",
    "",
    contactLinesText(),
    "",
    "Thank you,",
    "Team Tank Sudda",
    "",
    `You received this email because this address was entered on the ${booking ? "booking" : "contact"} form at ${websiteLabel()}.`,
  );

  return {
    subject,
    html: layout({
      preheader: booking
        ? `We'll contact you soon to confirm the details. Reference ${lead.reference}.`
        : `We'll reply soon. Reference ${lead.reference}.`,
      heading: booking ? "We've received your request" : "We've received your message",
      body,
      footer: `You received this email because this address was entered on the ${booking ? "booking" : "contact"} form at <a href="${websiteUrl()}" style="color:${color.muted};">${escapeHtml(websiteLabel())}</a>. If that wasn't you, you can ignore it.`,
    }),
    text: textLines.join("\n"),
  };
}
