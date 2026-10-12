# Architecture

## Principles

- **Static first.** Public pages are prerendered at build time. Only `/blog/search` and
  `/book/thank-you` render on request (they read query strings and are `noindex`).
- **Server Components by default.** Client JavaScript is limited to the mobile menu, the active
  nav state, the booking wizard and the contact form.
- **Data separate from presentation.** Business facts, services, prices, areas, FAQs and copy
  live in typed modules under `src/data`. Articles live in `src/content/blog`. Pages compose them.
- **Verified facts only.** Unknown values are `null`; UI and structured data omit them.

## Directory layout

```
src/
  app/                    Routes (App Router), sitemap.ts, robots.ts, icon.svg,
                          social-card.png/route.tsx (default Open Graph image)
  components/
    layout/               Header, mobile nav, footer, page header, legal page shell, logo
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
  lib/
    content/              articles.ts (pure parsing/validation/querying),
                          blog.server.ts (filesystem loader), mdx.tsx (renderer)
    seo/                  metadata builder, JSON-LD builders, sitemap builder
    validation/           Zod schemas shared by client and server
    site.ts               Canonical origin and indexing switch
    whatsapp.ts dates.ts utils.ts i18n/config.ts
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

| Route                                                          | Notes                                                                  |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `/`                                                            | Homepage                                                               |
| `/about`, `/pricing`, `/faq`, `/contact`                       | Static                                                                 |
| `/services`, `/services/[slug]`                                | 3 services from `data/services.ts`                                     |
| `/book`, `/book/thank-you`                                     | Booking wizard; acknowledgement (`noindex`)                            |
| `/gallery`, `/testimonials`                                    | Empty states until real content exists (`noindex` while empty)         |
| `/areas`, `/areas/[slug]`                                      | Only `status: "confirmed"` areas are generated                         |
| `/blog`, `/blog/page/[n]`                                      | Listing, 9 per page (page 1 is `/blog`)                                |
| `/blog/[slug]`                                                 | Article with TOC, related articles and services, `BlogPosting` JSON-LD |
| `/blog/category/[slug]`                                        | Category archives                                                      |
| `/blog/tag/[slug]`                                             | Tag archives (`noindex`)                                               |
| `/blog/search?q=`                                              | Server-rendered search (works without JS, `noindex`)                   |
| `/guides`                                                      | Curated learning paths + topics                                        |
| `/privacy`, `/terms`, `/cookies`                               | Legal                                                                  |
| `/sitemap.xml`, `/robots.txt`, `/social-card.png`, `/icon.svg` | Metadata files                                                         |
| `/knowledge`                                                   | 308 redirect to `/guides` (route from the previous site)               |

Unknown slugs return HTTP 404 (`dynamicParams = false`).

## Lead flow

```
BookingWizard (client, RHF + Zod per step)
   └─ submitBooking (Server Action)
        └─ processLead: rate limit → Zod validation → honeypot/timing checks
             → notification channels (Resend email and/or HTTPS webhook)
             → success only if at least one channel accepted the lead
```

Nothing is stored in a database yet. See [BACKEND.md](BACKEND.md).

## Adding Sinhala and Tamil

1. Add `"si"` / `"ta"` to `src/lib/i18n/config.ts`.
2. Move routes under `src/app/[locale]/` and generate params for each locale.
3. Make text-bearing data modules locale-aware (e.g. `Record<Locale, string>` fields or
   per-locale files) and add per-locale MDX folders (`src/content/blog/si/…`).
4. Emit `alternates.languages` (hreflang) from `buildMetadata`.
5. Load fonts with Sinhala/Tamil coverage (e.g. Noto Sans Sinhala / Noto Sans Tamil).
