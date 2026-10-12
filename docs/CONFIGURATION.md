# Configuration and launch

All variables are listed in [`.env.example`](../.env.example). Pages are statically generated, so
variables must be present **when the site is built**.

## Canonical domain and indexing

| Variable                   | Effect                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`     | Verified production origin, e.g. `https://www.example.lk`. Enables canonical URLs, absolute Open Graph URLs, JSON-LD URLs, sitemap entries and `robots.txt` allowing crawlers. |
| `SITE_NOINDEX=1`           | Forces `noindex` + `Disallow: /` (use on staging/preview builds).                                                                                                              |
| `GOOGLE_SITE_VERIFICATION` | Adds the Search Console verification meta tag.                                                                                                                                 |

Without `NEXT_PUBLIC_SITE_URL` the site is deliberately **not indexable**: every page is `noindex`,
the sitemap is empty and `robots.txt` disallows everything. No domain is guessed.

## Booking and contact delivery

At least one channel must be configured in production; otherwise the forms show
"temporarily unavailable" and the server refuses submissions (nothing is silently lost).

**Email (Resend)** — `RESEND_API_KEY`, `LEAD_EMAIL_FROM` (on a domain verified in Resend),
`LEAD_EMAIL_TO` (comma-separated). Emails are plain text; the customer's email is set as Reply-To.

**Webhook** — `LEAD_WEBHOOK_URL` (HTTPS) receives `POST` JSON:
`{ "type": "lead.booking" | "lead.contact", "lead": { reference, submittedAt, contact, fields, marketingConsent } }`.
If `LEAD_WEBHOOK_SECRET` is set, verify `X-TankSudda-Signature: sha256=<hex HMAC of the raw body>`.
Suitable targets: an automation tool, a Google Apps Script that appends to a sheet, or a future API.

If both are configured, a submission succeeds when at least one accepts it; failures are logged.

In development with no channel configured, submissions are printed to the server console only.

**Spam protection:** hidden honeypot field (silently dropped), minimum fill time (3 s), 24-hour form
expiry, and a per-IP limit of 5 submissions per 10 minutes. The rate limiter is in-memory, so on
serverless/multi-instance hosting use a shared store (e.g. Upstash Redis) or add Cloudflare
Turnstile if abuse appears.

## Hosting

Any Node.js host that runs `next start` (Node ≥ 20.9), or a platform with native Next.js support.
Server Actions require a server runtime — a purely static export is not sufficient.

## Google Search Console

1. Set `NEXT_PUBLIC_SITE_URL` to the final domain and deploy.
2. In [Search Console](https://search.google.com/search-console) add a **Domain** property (DNS TXT
   verification, preferred) or a **URL-prefix** property; for the latter, copy the HTML-tag token
   into `GOOGLE_SITE_VERIFICATION` and redeploy.
3. Submit `https://<domain>/sitemap.xml` under _Sitemaps_.
4. Use _URL inspection_ on the homepage and a service page; request indexing.
5. Check _Pages_ and _Enhancements_ (Breadcrumbs, Articles) after a few days.
6. Also create/verify a Google Business Profile with the verified address and phone, then add its
   URL to `sameAs` in `src/data/business.ts`.
