# Managing content

## Publishing a blog article

1. Create `src/content/blog/<slug>.mdx`. The file name **must** match the `slug`.
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

**Moving to a CMS later:** `src/lib/content/articles.ts` is storage-agnostic. A CMS adapter only
needs to return `{ id, raw }` sources (or already-parsed front matter) in place of
`blog.server.ts`'s filesystem reader.

## Editing site data

| What                                                 | File                                                 |
| ---------------------------------------------------- | ---------------------------------------------------- |
| Phone, WhatsApp, email, address, hours, social links | `src/data/business.ts`                               |
| Services and their content                           | `src/data/services.ts`                               |
| Prices (shown only when `verified: true`)            | `src/data/pricing.ts`                                |
| Service areas (`status: "confirmed"` to publish)     | `src/data/areas.ts`                                  |
| FAQs                                                 | `src/data/faqs.ts`                                   |
| Testimonials (genuine, with consent)                 | `src/data/testimonials.ts`                           |
| Gallery and before/after photos                      | `src/data/gallery.ts` + `public/images/gallery/`     |
| Page photos (hero, about, …)                         | `src/data/images.ts` + `public/images/photos/`       |
| Homepage process and commitments copy                | `src/data/site-content.ts`                           |
| Navigation                                           | `src/data/navigation.ts`                             |
| Logo                                                 | `src/components/layout/Logo.tsx`, `src/app/icon.svg` |

### Photos

Use real Tank Sudda photographs of tanks, sumps and equipment; avoid identifiable people unless
they have consented. Export JPEGs around 1600–2000 px wide; Next.js generates responsive AVIF and
WebP versions. Always write descriptive alt text. Before/after pairs must show the same tank on
the same job.
