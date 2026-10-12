# Owner checklist — information needed before launch

Nothing below was available in the repository, and the previous site's details (phone
`+94 77 123 4567`, `hello@tanksudda.lk`, "Colombo 03" office, prices from LKR 6,500 / 12,000,
"20+ areas", "40+ apartment complexes", same-day dispatch, testimonials and before/after labels)
were placeholders, so none of it was carried over.

## Required for launch

- [ ] **Production domain** → `NEXT_PUBLIC_SITE_URL`
- [ ] **Form delivery** → Resend email and/or webhook (see CONFIGURATION.md). Without it, online
      booking and contact are disabled in production.
- [x] **Phone number**: +94 74 100 4296 (added 2026-10-12)
- [x] **WhatsApp**: +94 74 100 4296 (added 2026-10-12)
- [x] **Email address**: tanksuddaglobal@gmail.com (added 2026-10-12)
- [x] **Social media**: Facebook, Instagram, TikTok, YouTube, X, Threads and LinkedIn (added
      2026-10-12).
- [ ] **Google Business Profile** → `google.profileUrl` (Maps/profile link) and `google.reviewUrl`
      (the "Ask for reviews" link) in `src/data/business.ts`. Enables the Google reviews panels on
      the homepage, contact and testimonials pages.
- [ ] **Service coverage** → mark areas `confirmed` in `src/data/areas.ts`, add towns to
      `placesCovered`, or add new areas. Draft entries exist for Colombo and Gampaha.
- [ ] Review **service descriptions and process steps** (`src/data/services.ts`) — confirm they
      match how Tank Sudda actually works (draining, scrubbing, sump procedure,
      any cleaning agents).
- [ ] Review **"How we work" commitments** (`src/data/site-content.ts`).
- [ ] Have the **Privacy Policy, Terms and Cookie pages** reviewed (ideally by a lawyer), including
      the legal entity name (`legalName`).
- [ ] Review the **five starter articles** in `src/content/blog/`.
- [ ] Have a **native Sinhala speaker and a native Tamil speaker** check the `/si` and `/ta` pages
      (text in `src/data/i18n/si.ts` and `ta.ts`), then set `translationsReviewed` to `true` for
      that language in `src/lib/i18n/config.ts`. Until then those pages are hidden from Google.

## Recommended

- [ ] Real **logo** (replace the typographic wordmark in `Logo.tsx` and `src/app/icon.svg`)
- [ ] **Photographs** of real tanks, sumps, equipment → `src/data/images.ts`, `src/data/gallery.ts`
- [ ] **Before/after pairs** from real jobs
- [ ] **Prices** that can be published (`verified: true`)
- [ ] Business **address** and **opening hours** (enables LocalBusiness structured data)
- [ ] **Testimonials** with customer consent and source
- [ ] Founding year, registration details, insurance or certifications — only if verifiable
