# Deployment

<!-- nav -->

<sub><a href="../README.md">Project README</a> · <a href="README.md">Documentation index</a></sub>

> How tanksudda.com reaches production: hosting, DNS, email and launch checks. Part of the [project documentation](README.md).

## Environments

| Environment   | Branch    | URL                                            | Deploys                                                                      |
| ------------- | --------- | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `development` | `develop` | [dev.tanksudda.com](https://dev.tanksudda.com) | Automatically on every merge into `develop`                                  |
| `production`  | `main`    | [tanksudda.com](https://tanksudda.com)         | Automatically when `develop` is promoted to `main` by a release pull request |

Cloudflare Workers Builds builds and serves each branch; the Deploy workflow verifies the build and the live URL. Each environment is a GitHub Environment with its own variables (`APP_URL` and host settings) and secrets, so one workflow serves both. Production accepts deployments from `main` only; development from `develop` only.

Development deploys are switched on per repository by setting the `DEVELOPMENT_ENABLED` repository variable to `true` once the development host exists. Until then, `develop` is built and tested by CI but not deployed.

### Setting up development

Cloudflare: set the `develop` branch build to deploy to the development Worker and attach `dev.tanksudda.com`.

### Promotion

1. Feature branches merge into `develop` and deploy to development.
2. When development is verified, open a release pull request from `develop` into `main` (see [runbooks/release.md](runbooks/release.md)).
3. Merging it deploys to production.

## Hosting on Cloudflare

Production runs on **Cloudflare Workers** using the OpenNext adapter (`@opennextjs/cloudflare`).
`tanksudda.com` uses Cloudflare DNS. `pos.tanksudda.com` is a separate system on Zircon and only
has a DNS record here; keep it **DNS only** (grey cloud) unless it has been tested behind the
proxy.

| File                  | Purpose                                                                         |
| --------------------- | ------------------------------------------------------------------------------- |
| `wrangler.jsonc`      | Worker name (`tank-sudda-website-typescript`), compatibility flags, assets      |
| `open-next.config.ts` | Serves prebuilt pages from static assets (no R2 or KV needed, no revalidation)  |
| `patches/…`           | One-line fix to the adapter for Next.js 16.4 (`preview-props.json`)             |
| `public/_headers`     | Caches hashed `/_next/static/*` files for a year (Workers serves them uncached) |

**Commands**

```bash
bun run cf:preview   # build for Cloudflare and run it locally (http://localhost:8787)
bun run cf:deploy    # build and deploy from your computer (needs `bunx wrangler login`)
```

**Automatic deploys (Workers Builds).** Workers & Pages → Create → Import a repository → this
repo, branch `main`. Build command `bunx opennextjs-cloudflare build`, deploy command
`bunx opennextjs-cloudflare deploy`. Every push to `main` then rebuilds and deploys.

**Environment variables.** Settings are needed in two places, because pages are built ahead of
time and form submissions run later on the Worker:

- **Build** (Worker → Settings → Build → Variables and secrets): `NEXT_PUBLIC_SITE_URL`,
  `RESEND_API_KEY` (secret), `LEAD_EMAIL_FROM`, `LEAD_EMAIL_TO`, `BUN_VERSION`. These decide how
  pages are generated, for example whether the booking form is offered.
- **Runtime:** the non-secret values are in `vars` in `wrangler.jsonc`, because every deploy
  replaces plain-text variables set in the dashboard. Add only **secrets** in the dashboard
  (Worker → Settings → Variables and secrets): `RESEND_API_KEY`, and `LEAD_WEBHOOK_SECRET` if used.

Change a value in both places and redeploy. For local previews, put values in `.dev.vars`
(git-ignored).

**Custom domains.** Worker → Settings → Domains & Routes → add `tanksudda.com` and
`www.tanksudda.com`. Then add a Redirect Rule from `www.tanksudda.com/*` to
`https://tanksudda.com/${1}` (301).

**Rate-limiting rule.** Security → WAF → Rate limiting rules → create a rule where _URI Path_ is
in `/book`, `/contact` and _Request Method_ equals `POST`; allow 5 requests per 10 seconds per IP
(the longest period on the free plan); action **Block** for 10 seconds. Form submissions are POST
requests to those pages.

**Limits to know**

- The free Workers plan allows a 3 MB compressed Worker. This site is about 2.7 MB. If a deploy
  fails with a size error, upgrade to Workers Paid (US$5/month).
- Pages are built once per deploy. Content changes, and future-dated articles going live, need a
  new deploy.
- Next.js image resizing is off (`images.unoptimized`), so export photos at web size.
- After upgrading `next` or `@opennextjs/cloudflare`, run `bun run cf:preview` and check pages
  load. Once the adapter handles `preview-props.json` itself, delete the patch file and the
  `patchedDependencies` entry in `package.json`.

The site still runs on any Node.js host with `bun run build && bun run start` (Node ≥ 20.9).

## DNS

DNS for `tanksudda.com` is managed in Cloudflare (nameservers `jerome` and
`lilith.ns.cloudflare.com`, set at Namecheap). `tanksudda.com` and `www` are Worker custom domains;
`pos`, `mail` and the cPanel names point to the Zircon server (IP shown in cPanel under _Server Information_) as **DNS only**.

Zircon's nameservers (`ns1/ns2.zirconhost.com`) still hold an old copy of the zone. Internet
providers that cached the old nameservers can keep using that copy for up to about 48 hours after a
nameserver change, which sends visitors to the old WordPress site on Zircon and email to Zircon. To
avoid this, keep Zircon's copy in step:

- In cPanel → Zone Editor, set the `tanksudda.com` A records to Cloudflare's addresses for the site.
- Set the MX records to Cloudflare Email Routing (`route1/2/3.mx.cloudflare.net`).
- Set the SPF record to `v=spf1 include:_spf.mx.cloudflare.net ~all`.
- In cPanel → Email Routing, choose **Remote Mail Exchanger**.

Never use cPanel's Cloudflare plugin for this domain.

## Email for tanksudda.com

There are no mailboxes on the domain; everything is handled in the owner's Gmail.

- **Receiving:** Cloudflare Email Routing (Email → Email Routing) forwards `info@` and
  `bookings@tanksudda.com` to the Gmail address. Website emails are sent from `info@tanksudda.com`
  (`LEAD_EMAIL_FROM` in `wrangler.jsonc`). Its MX, SPF and `cf2024-1._domainkey` records are
  managed by Cloudflare; keep exactly one SPF record on `tanksudda.com`.
- **Sending:** Resend (domain `tanksudda.com` verified). Gmail sends as `info@tanksudda.com`
  through Resend's SMTP server (`smtp.resend.com`, port 587, user `resend`, password = an API
  key). The website uses a separate Resend API key (`RESEND_API_KEY`).
- **DMARC:** TXT `_dmarc` = `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:<Cloudflare
address>`. Reports go to Cloudflare DMARC Management (Email → DMARC Management), which adds its
  own `…@dmarc-reports.cloudflare.net` address to `rua`; read them in that dashboard. Do not point
  `rua` at `info@tanksudda.com`: Gmail rejects the forwarded report emails, which shows up as
  repeated "Delivery failed" rows from `noreply-dmarc-support@google.com` in the Email Routing
  activity log. Before adding a new service that sends as `@tanksudda.com`, set up its SPF/DKIM
  first, or `p=quarantine` will send its mail to spam.
- The Resend free plan sends up to 100 emails a day. It is not for newsletters or bulk mail.

## Post-deployment checklist

Run after the first production deploy and after any change to environment variables (which
requires a rebuild). Replace `<domain>` with the production domain.

- [ ] `https://<domain>/robots.txt` allows crawling and lists `https://<domain>/sitemap.xml`.
- [ ] The sitemap lists only real pages on the production domain (no localhost or staging URLs).
- [ ] View the source of the homepage and a service page: `<link rel="canonical">` points at the
      production domain and `<meta name="robots">` reads `index, follow`.
- [ ] `https://<domain>/social-card.png` loads; paste a page URL into a social share preview tool.
- [ ] Send a **real booking request** and a **contact message**; confirm each arrives by email
      and/or webhook with the reference shown on screen. Reply to one to check Reply-To.
- [ ] `/book` and `/contact` do **not** show "temporarily unavailable".
- [ ] Call and WhatsApp buttons appear only if numbers are set in `src/data/business.ts`, and they
      open the correct number.
- [ ] A nonsense URL (e.g. `/does-not-exist`) returns the 404 page.
- [ ] `/knowledge` redirects to `/guides`.
- [ ] `https://<domain>/llms.txt` lists pages on the production domain, `/pricing.md` returns
      Markdown, and `/does-not-exist.md` returns a Markdown 404.
- [ ] Staging/preview deployments have `SITE_NOINDEX=1` (their `robots.txt` reads `Disallow: /`).
- [ ] Test the [Rich Results Test](https://search.google.com/test/rich-results) on an article and a
      service page.

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
