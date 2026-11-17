# Configuration and launch

<!-- nav -->

<sub><a href="../README.md">Project README</a> · <a href="README.md">Documentation index</a></sub>

All variables are listed in [`.env.example`](../.env.example). Pages are statically generated, so
variables must be present **when the site is built**.

## Canonical domain and indexing

| Variable                   | Effect                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`     | Verified production origin, e.g. `https://www.example.lk`. Enables canonical URLs, absolute Open Graph URLs, JSON-LD URLs, sitemap entries and `robots.txt` allowing crawlers. |
| `SITE_NOINDEX=1`           | Forces `noindex` + `Disallow: /` (use on staging/preview builds).                                                                                                              |
| `GOOGLE_SITE_VERIFICATION` | Adds the Search Console verification meta tag.                                                                                                                                 |

Without `NEXT_PUBLIC_SITE_URL` the site is deliberately **not indexable**: every page is `noindex`,
the sitemap is empty and `robots.txt` disallows everything. No domain is guessed. The Markdown
versions (`/pricing.md`…), `/llms.txt` and `/llms-full.txt` follow the same switch: they return
404 without a verified origin or with `SITE_NOINDEX=1` (see ARCHITECTURE.md). They need no
variables of their own; `CONTENT_BUILD_DATE` is set automatically by `next.config.ts`.

`robots.txt` has no rules for individual AI crawlers: every crawler is treated alike. Cloudflare
can also block or label AI crawlers for the whole zone (Security → Bots / AI Crawl Control, and
"managed robots.txt"); check those settings if AI assistants cannot read the site.

## Booking and contact delivery

At least one channel must be configured in production; otherwise the forms show
"temporarily unavailable" and the server refuses submissions (nothing is silently lost).

**Email (Resend)** — `RESEND_API_KEY`, `LEAD_EMAIL_FROM` (on a domain verified in Resend),
`LEAD_EMAIL_TO` (comma-separated). Templates are in `src/server/leads/email.ts` (HTML plus a
plain-text copy):

- **Team notification** to `LEAD_EMAIL_TO`, or for booking requests to `LEAD_BOOKING_EMAIL_TO`
  when set (both comma-separated; live values are in `wrangler.jsonc`), with call, WhatsApp and reply buttons. Replying
  goes to the customer.
- **Customer confirmation** (when they gave an email): reference, next steps and the options
  they chose. Free text (address, notes, messages) is never repeated back, so the form cannot
  be used to send arbitrary text. Replies go to `LEAD_REPLY_TO`, or the business email if unset.
  The Call, WhatsApp and Email icons at the bottom are PNG files in `public/email/icons`,
  created by `bun run email-icons` (email apps cannot show SVG). They are kept to three because
  image- and link-heavy emails from a young domain are more often filtered as spam.
  `LEAD_CUSTOMER_CONFIRMATION=0` turns it off. A failed confirmation is logged but does not fail
  the submission.

**Webhook** — `LEAD_WEBHOOK_URL` (HTTPS) receives `POST` JSON:
`{ "type": "lead.booking" | "lead.contact", "lead": { reference, submittedAt, contact, fields, marketingConsent } }`.
If `LEAD_WEBHOOK_SECRET` is set, verify `X-TankSudda-Signature: sha256=<hex HMAC of the raw body>`.
Suitable targets: an automation tool, a Google Apps Script that appends to a sheet, or a future API.

If both are configured, a submission succeeds when at least one accepts it; failures are logged.

In development with no channel configured, submissions are printed to the server console only.

**Spam protection:** hidden honeypot field (silently dropped), minimum fill time (3 s), 24-hour form
expiry, and a per-IP limit of 5 submissions per 10 minutes. That limiter is in-memory, so on
Cloudflare each Worker instance counts separately; the main limit is the Cloudflare rate-limiting
rule described under "Hosting on Cloudflare". Add Cloudflare Turnstile if abuse still appears.

## Analytics

The site has no analytics until you switch it on, so nothing is tracked and no cookies are set.
Events are already wired in and are sent to whichever provider is loaded:

| Event                       | When                                                                    |
| --------------------------- | ----------------------------------------------------------------------- |
| `contact_click`             | Any phone, WhatsApp or email link (with `channel`, `page`, `placement`) |
| `booking_started`           | First step of the booking form completed                                |
| `booking_step`              | Each later step reached (`step`)                                        |
| `booking_sent`              | Booking request delivered                                               |
| `booking_whatsapp_handoff`  | "Send request on WhatsApp" clicked                                      |
| `contact_form_sent`         | Contact message delivered                                               |
| `contact_whatsapp_fallback` | "Send on WhatsApp instead" clicked after a contact message failed       |

**Plausible (recommended, cookieless):** create a site at plausible.io, set
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN=tanksudda.com` and redeploy. Add the event names above as goals in
Plausible to see them in reports.

**Google Analytics 4 (in use):** set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (e.g. `G-EK434GVS4Z`) as a
**build** variable in Cloudflare (Worker → Settings → Build → Variables and secrets) and redeploy.
By the owner's decision there is no consent banner: the Google tag loads for every visitor.
Visitors can turn it off for their browser on `/cookies` (the opt-out is stored locally and
respected). Analytics and ad measurement (for Google Ads conversions) are on; ad personalisation
stays off. The Cookie Information and Privacy pages say this. Events above are sent to
GA4 automatically; mark `booking_sent`, `contact_form_sent` and `contact_click` as key events in
GA4 (Admin → Events). Code: `src/components/analytics/Analytics.tsx`, `src/lib/analytics.ts`.

**Vercel Web Analytics:** add its script as its docs describe; events are forwarded to `window.va`.

If you add or change a provider, update the Cookie Information page
(`src/app/(en)/cookies/page.tsx`) and the Privacy Policy before going live.

Hosting, DNS, email routing, the post-deployment checklist and Search Console setup are in [DEPLOYMENT.md](DEPLOYMENT.md).
