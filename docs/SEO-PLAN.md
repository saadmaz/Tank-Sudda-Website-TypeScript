# SEO plan

Written 2026-10-13 from the OpenSEO keyword research (`keyword-research.csv`) and the Google
results check (`serp-analysis.csv`). Review it monthly; see "Measuring progress" at the end.

## What the research shows

1. **Few people search for tank cleaning in English, but they are ready to buy.** In Sri Lanka:
   "water tank cleaning" (~50/month), "water tank cleaning services" (~30), "… near me" (~30
   combined), "water sump tank" (~40) and "water tank and sump cleaning" (~10). That is roughly
   150 searches a month in total. Each one is a potential booking, so ranking first matters more
   than the numbers suggest.
2. **The tool does not measure Sinhala, Tamil or Singlish searches** (for example "ටැංකි සුද්ද
   කිරීම" or "tank sudda karana"), nor Google Maps searches. Real demand is higher than the
   table shows, and much of it is local.
3. **Far more people search about tanks themselves:** "water tank" (~1,600), "1000 litre water
   tank" / "water tank 1000 ltr" (~140 each), "s-lon water tank" (~140), "water tank sizes and
   dimensions" (~110), "water tank size in sri lanka" (~50), "arpico water tank size" (~50),
   "anton water tank sizes" (~20). These are tank owners and buyers, which makes them future
   cleaning customers. Helpful guides can bring them to the site.
4. **The competition is weak.** The Sri Lankan results are two Facebook pages (DPM Watertank
   Cleaners, Tanclean Sri Lanka) and two small service pages (doctorclean.lk, mespl.lk). The rest
   are foreign blogs and YouTube how-to videos. A fast, well-organised local site can reach the
   top three.
5. **Tank Sudda already appears:** the Instagram profile is #3 and Threads is #12, before the
   website has been indexed. The brand name already works; the website now needs to take those
   positions.
6. **Video ranks.** Three of the results are YouTube how-to videos, so short videos of real jobs
   can rank as well as reach social media.

Ignore the unrelated keywords in the file (Jamaica, Karachi, UAE, Bunnings, CAD blocks,
clipart, irrigation, fuel tanks and so on). They are other countries or other products.

## Keyword → page map

Each keyword group gets one page, so pages do not compete with each other.

| Keyword group                                                                                           | Page                                       | Status                           |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------- |
| water tank cleaning, water tank cleaning services, … Sri Lanka, … near me                               | Home page                                  | Live                             |
| water tank deep cleaning, how to clean a water tank (service intent)                                    | `/services/water-tank-deep-cleaning`       | Live                             |
| water tank and sump cleaning, water sump tank, sump cleaning                                            | `/services/sump-cleaning`                  | Live                             |
| apartment / office / hotel / school tank cleaning                                                       | `/services/commercial-tank-cleaning`       | Live                             |
| water tank cleaning + town (Colombo, Dehiwala, Gampaha …)                                               | `/areas/<town>`                            | **Needs confirmed towns**        |
| water tank cleaning price / cost Sri Lanka, water tank quotes                                           | `/pricing`                                 | Live (stronger with real prices) |
| water tank sizes and dimensions, water tank size in Sri Lanka, Arpico / S-lon / Anton sizes, 1000 litre | New guide: "Water tank sizes in Sri Lanka" | **To write**                     |
| underground water tank size, water sump tank                                                            | New guide: "Sump sizes and how sumps work" | To write                         |
| how to clean a water tank, … without removing water                                                     | New guide (honest answer)                  | To write                         |
| why water tank cleaning is important, how often                                                         | Existing guides                            | Live                             |
| Sinhala and Tamil searches                                                                              | `/si`, `/ta` pages                         | Built; needs native review       |

## Phase 1: this week (foundations)

Most of this is free and has the biggest effect for a local business.

- [x] Website live on `tanksudda.com`, sitemap submitted, Search Console verified.
- [x] Logo, favicon and Organization structured data in place.
- [ ] **Google Business Profile** (`docs/marketing/google-business-profile.md`). For local
      searches and Google Maps this matters more than anything on the website. Add the service
      areas, logo, at least 10 real photos, the services and the website link. Send the profile and
      review links so the website can show them.
- [ ] **Confirm the towns you serve.** Each confirmed town gets its own page ("Water tank cleaning
      in Dehiwala"). These pages are how small businesses win "near me" and town searches. Start
      with the 5–10 towns you actually work in most.
- [ ] **Make every profile point to the website.** Instagram, Facebook, Threads, TikTok, YouTube,
      LinkedIn and WhatsApp Business should all link to `https://tanksudda.com`. Use the same name,
      phone and email everywhere (`docs/marketing/directory-listings.md`).
- [ ] **Fix the old Zircon DNS copy** (see the "DNS" note in `docs/CONFIGURATION.md`), so nobody is
      sent to the old WordPress site.

## Phase 2: weeks 2–4 (content that brings visitors)

Write one guide a week. Every fact must be checked (see `docs/CONTENT.md`); no invented sizes,
prices or claims.

1. **"Water tank sizes in Sri Lanka: litres, dimensions and how to choose."** Targets the largest
   related searches (~500/month together). Use **manufacturers' published specifications only**
   (Arpico, S-lon, Anton and others), name the source and link it, and add a section on how size
   affects cleaning. End with a link to booking.
2. **"Can you clean a water tank without draining it?"** Targets the how-to searches that foreign
   blogs and YouTube currently win. Give an honest answer about what that method can and cannot
   remove, and explain why sediment needs draining. Have the owner confirm the method first.
3. **"How much does water tank cleaning cost in Sri Lanka?"** Explain what affects the price
   (already on `/pricing`). Once prices can be published, add a real price range; that turns this
   into a strong page.
4. **"Underground sump tanks: sizes, how they work and how to keep them clean."** Targets "water
   sump tank" and "underground water tank size".
5. Publish the three draft articles already written (plastic vs concrete tanks, signs your sump
   needs cleaning, tank care after flooding) after review: remove `draft: true`.

Each new guide links to the relevant service page, and each service page links back to its
guides. This helps Google understand the site, and the links are already in the code.

## Phase 3: months 2–3 (trust and local authority)

- **Reviews:** ask every happy customer for a Google review using
  `docs/marketing/review-requests.md`. Aim for 20+ genuine reviews. Reviews are a ranking factor
  for the map results and the strongest sales factor.
- **Real photos and before/after pairs** on the website (gallery, service pages, home page) and
  on Google Business Profile.
- **Area pages for every confirmed town,** each with something specific to that area (for
  example common tank types or sumps in apartment buildings), never copied text.
- **Short videos:** a 30–60 second clip of a real clean on YouTube Shorts, TikTok and Instagram,
  each linking to the website. Video already ranks for these searches.
- **Links from relevant local websites:** directory listings (Rainbow Pages, ikman.lk services,
  Google, Bing, Apple Maps), apartment management companies you work with, tank sellers and
  plumbers who can refer you, and local community pages. A few relevant local links matter more
  than many random ones.
- **Sinhala and Tamil pages:** after a native-speaker review, switch on indexing
  (`translationsReviewed` in `src/lib/i18n/config.ts`). Very few competitors have Sinhala pages.

## Phase 4: ongoing

- One helpful article a month, based on real customer questions from WhatsApp and calls.
- Keep the Google Business Profile active: a post a week (`docs/marketing/social-media-plan.md`),
  new photos, and replies to every review.
- Update prices, areas and FAQs in `src/data` as they change.

## What is already done on the website

- Fast pages built in advance, mobile-friendly and accessible (Lighthouse 100 for accessibility,
  best practice and SEO once the domain is set).
- A title and meta description for each page, canonical URLs, a sitemap and robots.txt.
- Structured data: Organization (with logo), Service, FAQ, BreadcrumbList and BlogPosting.
- Sinhala and Tamil versions, hidden from Google until reviewed.
- Service pages with real detail, internal links between services and guides, and an FAQ.

## What the owner needs to provide

1. The towns and districts you serve (for area pages and Google Business Profile).
2. Real photos and short videos of jobs (before/after of the same tank).
3. Prices or "from" prices, if you are happy to publish them.
4. Opening hours.
5. A native Sinhala and Tamil reviewer.
6. Confirmation of methods for the new guides (for example cleaning without draining).

## Measuring progress

Check monthly and note the numbers here.

| Where                        | What to look at                                                  |
| ---------------------------- | ---------------------------------------------------------------- |
| Search Console → Performance | Queries, clicks and average position for the keywords in the map |
| Search Console → Pages       | Every page indexed; fix anything listed as "not indexed"         |
| Google Business Profile      | Searches, calls, website clicks, direction requests              |
| OpenSEO rank tracker         | Positions for the target keywords above, checked monthly         |
| Bookings and WhatsApp chats  | Ask new customers "How did you find us?" and keep a simple tally |

**Realistic expectations:** a new site usually takes 2–4 months to settle in Google. The first
gains come from the Google Business Profile and brand searches ("Tank Sudda"). Town pages and
guides follow once they are indexed and earn a few links and reviews.
