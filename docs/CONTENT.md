# Managing content

## Publishing a blog article

1. Create `src/content/blog/<slug>.mdx`. The file name **must** match the `slug`. `bun run dev`
   and `bun run build` bundle articles into `articles.generated.ts` automatically. If the dev
   server is already running, run `bun run content` and refresh.
2. Add front matter:

```yaml
---
title: How to spot a damaged tank lid # 10–120 characters
slug: how-to-spot-a-damaged-tank-lid # lowercase, numbers, hyphens
description: A 50–220 character summary used on cards and in search results.
author: tank-sudda-team # key from src/data/blog.ts
publishedAt: 2026-11-01 # YYYY-MM-DD (future dates stay hidden until then)
updatedAt: 2026-11-15 # optional
category: maintenance # maintenance | cleaning-explained | choosing-a-service
tags: [maintenance, inspection] # optional, up to 8 slugs
relatedServices: [water-tank-deep-cleaning] # optional, service slugs
relatedArticles: [water-tank-maintenance-checklist] # optional, article slugs
cover: # optional — real photo only
  src: /images/blog/damaged-lid.jpg
  alt: Cracked plastic lid on a rooftop water tank
  width: 1600
  height: 900
seoTitle: Optional title for search results (≤ 70 chars)
seoDescription: Optional meta description (≤ 170 chars)
canonicalUrl: https://… # only if the article was first published elsewhere
noindex: false # true keeps the article out of search engines and the sitemap
draft: true # drafts are visible only in `bun run dev`
---
```

3. Write the body in Markdown. Start sections at `##` (the title is the page's only H1);
   `##` and `###` headings build the table of contents automatically (3+ headings).
   Link internally with root paths, e.g. `[sump cleaning](/services/sump-cleaning)`.
   A `<Callout tone="info" title="…">…</Callout>` component is available.
4. Preview with `bun run dev`, then set `draft: false`.
5. Run `bun run test` — it validates every article, its references and its internal links. An
   invalid article also fails the build with a message naming the file and field.
6. Rebuild and deploy. The article appears on `/blog`, its category, `/guides` (if listed in
   `guidePaths` in `src/data/blog.ts`), related pages and the sitemap.

Content rules: write accurately and conservatively. Do not invent statistics, regulations,
expert endorsements or health claims. MDX can run code, so only trusted people should edit
articles.

### Pre-publish checklist

- [ ] **Accuracy:** no fabricated reviews, results, statistics or regulations; no health or
      safety claims you cannot support; no prices, coverage or response times beyond what is
      confirmed in `src/data`. If unsure, leave it out.
- [ ] **Title** is specific and reads naturally; if it is long, add a `seoTitle` (≤ 70 characters).
- [ ] **Description** (50–220 characters) summarises the article; add `seoDescription`
      (≤ 170 characters) if the description is too long for search results.
- [ ] **One topic per article** — check that an existing article doesn't already cover it; update
      that one instead (and set `updatedAt`).
- [ ] **Headings** start at `##` and describe their section.
- [ ] **Internal links:** at least one link to a relevant service page and, where useful, to
      related articles. Set `relatedServices` and `relatedArticles` in the front matter.
- [ ] **Images** are real photos with descriptive alt text (describe what is shown, not "image of").
- [ ] **Category** fits; **tags** are reused from existing articles where possible.
- [ ] `bun run test` passes; preview in `bun run dev` on a phone-width window.

### What the site handles automatically

Per-page titles and descriptions, canonical URLs, Open Graph/Twitter metadata, breadcrumbs,
`BlogPosting` structured data, table of contents, reading time, related articles, sitemap
entries and `noindex` for drafts, tag archives, search results and empty gallery/testimonial
pages. Structured data never includes ratings or unverified business details.

### Service-area pages

Only publish an area (`status: "confirmed"` in `src/data/areas.ts`) when Tank Sudda really serves
it. Each area needs genuinely local notes — never copy one area's text to another with the name
swapped. Do not add response times, same-day or emergency promises unless confirmed.

### Removing or renaming pages

If a published URL changes, add a permanent redirect in `next.config.ts` (`redirects()`) from the
old path to the new one, then rebuild.

**Moving to a CMS later:** `src/lib/content/articles.ts` is storage-agnostic. A CMS adapter only
needs to return `{ id, raw }` sources (or already-parsed front matter) in place of
`blog.server.ts`'s filesystem reader.

## Editing site data

| What                                             | File                                                           |
| ------------------------------------------------ | -------------------------------------------------------------- |
| Phone, WhatsApp, email, address, hours           | `src/data/business.ts`                                         |
| Social media links and Google review links       | `src/data/business.ts` (`social`, `google`)                    |
| Services and their content                       | `src/data/services.ts`                                         |
| Prices (shown only when `verified: true`)        | `src/data/pricing.ts`                                          |
| Service areas (`status: "confirmed"` to publish) | `src/data/areas.ts`                                            |
| FAQs                                             | `src/data/faqs.ts`                                             |
| Testimonials (genuine, with consent)             | `src/data/testimonials.ts`                                     |
| Gallery and before/after photos                  | `src/data/gallery.ts` + `public/images/gallery/`               |
| Page photos (hero, about, …)                     | `src/data/images.ts` + `public/images/photos/`                 |
| Homepage process and commitments copy            | `src/data/site-content.ts`                                     |
| Navigation                                       | `src/data/navigation.ts`                                       |
| Logo (all sizes)                                 | Replace `public/logo/Tank Sudda Logo.png`, run `bun run brand` |
| Sinhala and Tamil text                           | `src/data/i18n/si.ts`, `src/data/i18n/ta.ts`                   |

### Sinhala and Tamil text

The main pages also exist in Sinhala (`/si`) and Tamil (`/ta`). Their text lives in
`src/data/i18n/si.ts` and `ta.ts`, keyed like the English data (services by slug, FAQs by id).

- **When you change English text** in `services.ts`, `faqs.ts`, `site-content.ts` or
  `pricing.ts`, change the Sinhala and Tamil text to match. When you add a service or FAQ, add
  its translations too; `bun run test` fails if one is missing.
- **Before publishing a language**, have a native speaker read every page, then set
  `translationsReviewed.si` / `.ta` to `true` in `src/lib/i18n/config.ts`. Until then the pages
  work but are hidden from search engines and show a review note.
- Keep "Tank Sudda", phone numbers, email and URLs exactly as they are in English.
- Articles are English only. Sinhala and Tamil pages link to them with an "(in English)" note.

### Illustrations

The technical drawings (tank, sump, building) are SVG components in
`src/components/illustrations/TechnicalIllustrations.tsx`. Pages show pre-rendered copies from
`public/illustrations/`, which keeps pages light. After editing a drawing, run
`bun run illustrations` to regenerate the files; a unit test fails if they are out of date.

### Photos

Use real Tank Sudda photographs of tanks, sumps and equipment; avoid identifiable people unless
they have consented. Export JPEGs around 1600 px wide and compress them (under about 300 KB each):
the site serves images as stored, because Cloudflare Workers do not run Next.js image resizing.
Always write descriptive alt text. Before/after pairs must show the same tank on
the same job.
