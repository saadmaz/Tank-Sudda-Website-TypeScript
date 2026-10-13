# Architecture

## Principles

- **Static first.** Public pages are prerendered at build time. Only `/blog/search` and
  `/book/thank-you` render on request (they read query strings and are `noindex`).
- **Server Components by default.** Client JavaScript is limited to the mobile menu, the active
  nav state, the language switcher, the booking wizard and the contact form.
- **Data separate from presentation.** Business facts, services, prices, areas, FAQs and copy
  live in typed modules under `src/data`. Articles live in `src/content/blog`. Pages compose them.
- **Verified facts only.** Unknown values are `null`; UI and structured data omit them.

## Directory layout

```
src/
  app/
    (en)/                 English routes and their root layout (<html lang="en-LK">)
    (intl)/[lang]/        Sinhala (/si) and Tamil (/ta) routes and their root layout
    global-not-found.tsx  404 for unmatched URLs (needed with two root layouts)
    fonts.ts              next/font: Inter, Schibsted Grotesk, Noto Sans Sinhala/Tamil
    sitemap.ts robots.ts manifest.ts favicon.ico icon.png apple-icon.png
    social-card.png/route.tsx (default Open Graph image, with the logo)
  components/
    layout/               SiteDocument (shared <html> shell), header, mobile nav, footer,
                          language switcher, page header, legal page shell, logo
    pages/                Page views shared by English and Sinhala/Tamil routes
    sections/             Homepage and shared page sections
    services/ blog/       Feature components
    booking/ forms/       Booking wizard, contact form, accessible field components
    contact/              WhatsApp / phone actions (render nothing until verified)
    illustrations/        Technical SVG illustrations used until photos are supplied
    media/                SlotImage: photo from data/images.ts or illustration fallback
    seo/ ui/              JSON-LD renderer, primitives, accordion, breadcrumbs, buttons
  content/blog/*.mdx      Articles (front matter + MDX body)
  data/                   business, services, pricing, areas, faqs, testimonials,
                          gallery, images, navigation, blog taxonomy, site copy
    i18n/                 en.ts (English text + the Dictionary type), si.ts, ta.ts
  lib/
    content/              articles.ts (pure parsing/validation/querying),
                          blog.server.ts (filesystem loader), mdx.tsx (renderer)
    seo/                  metadata builder, JSON-LD builders, sitemap builder
    validation/           Zod schemas shared by client and server
    site.ts               Canonical origin and indexing switch
    i18n/                 config.ts (languages, paths, review switch), dictionary.ts
    whatsapp.ts dates.ts utils.ts
  server/
    actions/              Server Actions: submitBooking, submitContact
    leads/                Lead model, formatting, shared submission pipeline
    notifications/        Resend email + signed webhook channels
    rate-limit.ts
tests/
  unit/                   Vitest
  e2e/                    Playwright (routes, 404s, links, forms, layout, axe)
```

## Routes

| Route                                                                                                   | Notes                                                                  |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `/`                                                                                                     | Homepage                                                               |
| `/about`, `/pricing`, `/faq`, `/contact`                                                                | Static                                                                 |
| `/services`, `/services/[slug]`                                                                         | 3 services from `data/services.ts`                                     |
| `/book`, `/book/thank-you`                                                                              | Booking wizard; acknowledgement (`noindex`)                            |
| `/gallery`, `/testimonials`                                                                             | Empty states until real content exists (`noindex` while empty)         |
| `/areas`, `/areas/[slug]`                                                                               | Only `status: "confirmed"` areas are generated                         |
| `/blog`, `/blog/page/[n]`                                                                               | Listing, 9 per page (page 1 is `/blog`)                                |
| `/blog/[slug]`                                                                                          | Article with TOC, related articles and services, `BlogPosting` JSON-LD |
| `/blog/category/[slug]`                                                                                 | Category archives                                                      |
| `/blog/tag/[slug]`                                                                                      | Tag archives (`noindex`)                                               |
| `/blog/search?q=`                                                                                       | Server-rendered search (works without JS, `noindex`)                   |
| `/guides`                                                                                               | Curated learning paths + topics                                        |
| `/privacy`, `/terms`, `/cookies`                                                                        | Legal                                                                  |
| `/si`, `/ta` + `/services`, `/services/[slug]`, `/pricing`, `/about`, `/contact`, `/faq`                | Sinhala and Tamil versions (see below)                                 |
| `/sitemap.xml`, `/robots.txt`, `/social-card.png`, `/favicon.ico`, `/icon.png`, `/manifest.webmanifest` | Metadata files                                                         |
| `/knowledge`                                                                                            | 308 redirect to `/guides` (route from the previous site)               |

Unknown slugs return HTTP 404 (`dynamicParams = false`).

## Analytics and illustrations

- `src/lib/analytics.ts` + `src/components/analytics/Analytics.tsx`: provider-neutral events
  (no-op until a provider is configured; see CONFIGURATION.md).
- Illustrations are rendered to static SVG files by `scripts/generate-illustrations.tsx`
  (`bun run illustrations`), so they are not part of the React tree.

## Lead flow

```
BookingWizard (client, RHF + Zod per step)
   └─ submitBooking (Server Action)
        └─ processLead: rate limit → Zod validation → honeypot/timing checks
             → notification channels (Resend email and/or HTTPS webhook)
             → success only if at least one channel accepted the lead
```

Nothing is stored in a database yet. See [BACKEND.md](BACKEND.md).

## Sinhala and Tamil pages

English stays at the root URLs. The main pages also exist in Sinhala (`/si/…`) and Tamil
(`/ta/…`): home, services, the three service pages, pricing, about, contact and FAQ. Booking,
articles, guides, areas and legal pages are English only; links to them from Sinhala and Tamil
pages go to the English page.

- **Two root layouts.** `app/(en)/layout.tsx` and `app/(intl)/[lang]/layout.tsx` both render
  `SiteDocument`, so each page is served with the right `<html lang>` and stays static.
  Unmatched URLs use `app/global-not-found.tsx` (`experimental.globalNotFound`). Moving between
  English and Sinhala/Tamil is a full page load.
- **One page view per page.** `src/components/pages/*PageView.tsx` take a `locale`; the English
  and `[lang]` route files only pick the language.
- **Text.** `src/data/i18n/en.ts` builds English from the existing data modules and defines the
  `Dictionary` type; `si.ts` and `ta.ts` must provide every key (TypeScript enforces this, and
  `tests/unit/i18n.test.ts` checks every service, FAQ and list length). Shared components take a
  `locale` prop that defaults to English. Client components receive plain strings, so the
  dictionaries never reach the browser.
- **Links.** Use `localeHref(locale, path)` from `src/lib/i18n/config.ts`. It prefixes translated
  pages and leaves English-only pages alone.
- **Fonts.** Noto Sans Sinhala / Tamil load only on their own pages; `globals.css` adds them to
  the font stacks and relaxes heading tracking and line height for these scripts.
- **Search engines.** `translationsReviewed` in `src/lib/i18n/config.ts` is `false` for `si`
  and `ta` until a native speaker has checked the text. While false, those pages are
  `noindex`, are left out of the sitemap and hreflang, and show a short "translation under
  review" note. Setting it to `true` publishes them: they join the sitemap and every translated
  page gets `hreflang` links (en-LK, si-LK, ta-LK, x-default).

When English text in `src/data` changes, update `si.ts` and `ta.ts` too (see CONTENT.md).
