# Growth plan: making the Tank Sudda website work

The website itself is in good shape. What is missing is mostly real-world information and setup
that only the owner can provide, and that is what will decide whether it brings in customers.

Written 12 October 2026. Tick items off as they are done. Ready-to-use texts for WhatsApp,
reviews, Google Business Profile, directories, the company profile and social media are in
[`docs/marketing/`](marketing/README.md).

## 1. Before launch (must do)

| #   | What                                                                                                                                                                     | Why it matters                                                                                                                                                      | Effort    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | **Put the site live on tanksudda.com.** Host it (e.g. Vercel's free plan), set `NEXT_PUBLIC_SITE_URL=https://tanksudda.com`, pick www or non-www and redirect the other. | Until then Google is told **not** to index the site. Zero search traffic.                                                                                           | 1–2 hours |
| 2   | **Set up booking delivery**: a free Resend account, with requests sent to tanksuddaglobal@gmail.com.                                                                     | Right now the booking form hands off to WhatsApp. With delivery, requests arrive as organised emails with a reference number, and nothing gets lost in a busy chat. | 1 hour    |
| 3   | **Get a domain email** like `hello@tanksudda.com` (Google Workspace or Zoho).                                                                                            | A Gmail address looks less established to apartment managers and hotels. It is also needed to send booking emails from your own domain.                             | 1 hour    |
| 4   | **Check every claim on the site** (see `docs/OWNER-CHECKLIST.md`): service steps, the four "How we work" promises, the five starter articles.                            | If the site says "we tell you how long the water will be off" and the team does not, that costs trust and reviews.                                                  | 2 hours   |
| 5   | **Get the Privacy, Terms and Cookies pages reviewed**, and add the registered business name (`legalName` in `src/data/business.ts`).                                     | They are sensible drafts, but they are not legal advice.                                                                                                            | Lawyer    |

- [ ] Site live on tanksudda.com
- [ ] Booking delivery (Resend) configured and tested with a real request
- [ ] Domain email set up
- [ ] Site claims reviewed
- [ ] Legal pages reviewed, registered business name added

## 2. Getting found on Google (the biggest growth lever)

Most people search "water tank cleaning Colombo" or "tank cleaning near me" on a phone. Google
shows **map results first**.

1. **Create a Google Business Profile** at business.google.com.
   - Set it up as a _service-area business_ (no address shown), using +94 74 100 4296.
   - Choose the closest matching category, and list the three services, your areas, opening
     hours, photos and the WhatsApp link.
   - Then add the profile link and the "Ask for reviews" link to `google` in
     `src/data/business.ts`. That switches on the review panels on the homepage, contact and
     testimonials pages.
2. **Collect reviews deliberately.** After every job, send the review link on WhatsApp the same
   day, and reply to every review. A steady flow of reviews is the single strongest local ranking
   signal.
3. **Confirm your service areas.** Mark the towns you actually cover as `confirmed` in
   `src/data/areas.ts` (Colombo and Gampaha drafts are ready). Each confirmed area gets its own
   page, and pages like "Water tank cleaning in Gampaha" are what rank for local searches.
4. **Connect Google Search Console** and submit the sitemap. The steps are in
   `docs/CONFIGURATION.md`.
5. **Add Sinhala and Tamil versions.** Many customers search in Sinhala (e.g. "ටැංකි පිරිසිදු
   කිරීම"), and very few competitors have proper Sinhala pages. The site is built to support this
   (see `docs/ARCHITECTURE.md`), and it is probably the biggest reach increase available.
6. **List the business in directories** with exactly the same name, phone and website: the
   Facebook page, Instagram bio, Rainbow Pages and ikman.lk services. Consistent details help
   local ranking.
7. **Publish one helpful article a month**, based on real customer questions. Examples: "How much
   does tank cleaning cost in Sri Lanka?" once prices are published, "Plastic vs concrete tanks",
   or "What to do with your tank after flooding". Every fact must be checked before publishing
   (see `docs/CONTENT.md`).

- [ ] Google Business Profile created and verified
- [ ] Profile and review links added to the site
- [ ] Review request sent after every job
- [ ] Service areas confirmed
- [ ] Search Console connected, sitemap submitted
- [ ] Sinhala and Tamil versions (built; waiting for a native-speaker review before Google can
      index them, see `docs/OWNER-CHECKLIST.md`)
- [ ] Directory listings with consistent details
- [ ] Monthly article schedule started

## 3. Trust: why visitors will (or will not) book

This is where the site is weakest today. It is honest and professional, but it has **no proof**
yet.

1. **Real photographs.** The site currently shows drawings. The highest-impact photos to take:
   - the team at work, in uniform, with their consent;
   - equipment, vehicle and branding;
   - **before/after pairs of the same tank** (an inside shot of a dirty tank next to the clean
     result convinces people instantly);
   - commercial jobs, such as rooftop tanks on apartment buildings.

   Photos slot into the site with no design changes (`src/data/images.ts` and
   `src/data/gallery.ts`). The gallery and testimonials pages stay hidden from Google until they
   have real content.

2. **A proper logo.** The current mark is a placeholder. A professional logo also improves social
   media, uniforms and invoices.
3. **Prices.** Every service currently says "Quoted after assessment". Even one figure, like "From
   LKR X for a standard 1,000 L house tank", increases enquiries, because people want a ballpark
   before they message. Commercial work can stay quote-only. Prices go in `src/data/pricing.ts`.
4. **Opening hours and reply time.** If you can keep it, "We reply on WhatsApp within an hour,
   8am–6pm" is a strong reason to message you rather than a competitor. The opening hours field
   in `src/data/business.ts` is empty.
5. **Credentials, only if true:** business registration number, years operating, insurance,
   number of tanks cleaned. Never invented; one real fact beats ten vague ones.
6. **Video.** A 60-second cleaning video from the YouTube channel, embedded on the homepage and
   the deep-cleaning page, would be very persuasive.

- [ ] Photo shoot done (team, equipment, before/after, commercial)
- [ ] Professional logo
- [ ] Starting prices published
- [ ] Opening hours and reply time added
- [ ] Verified credentials added
- [ ] Cleaning video embedded

## 4. Behind the website: operations

1. **WhatsApp Business app.** Set up a greeting message, an away message with your hours, quick
   replies for common questions, labels (New / Quoted / Booked / Done), and a catalogue of the
   three services.
2. **A simple lead tracker.** Every booking can be sent into a Google Sheet automatically (using
   the webhook option in `docs/CONFIGURATION.md`), so you can see how many requests came in, how
   many became jobs, and from which page.
3. **Repeat business.** Tanks need cleaning every 6–12 months, and the booking form already asks
   customers for permission to send reminders. A "your tank is due" message is the cheapest sale
   there is. This needs the database planned in `docs/BACKEND.md`.
4. **Commercial clients.** Prepare a one-page company profile (PDF) for apartment management,
   hotels and schools, and use LinkedIn to reach building managers. One building contract can be
   worth dozens of house jobs.

- [ ] WhatsApp Business set up
- [ ] Lead tracker (Google Sheet) connected
- [ ] Reminder system planned
- [ ] Commercial company profile ready

## 5. Measurement

There is **no analytics** on the site right now. That was deliberate, so the cookie page stays
accurate. Add privacy-friendly analytics (e.g. Vercel Analytics or Plausible) to track:

- how many people start and finish the booking form;
- clicks on WhatsApp and Call;
- which pages and searches bring visitors.

Update the cookie page at the same time.

- [ ] Analytics added and cookie page updated
- [ ] Monthly review of Search Console and analytics

## 6. Social media

1. The Facebook page is **TankSuddaa** (double "a") while every other profile is "tanksudda". If
   Facebook allows the change, matching handles look more professional and are easier to find.
2. Post before/after photos and short tips, using the articles as material, and always link to
   the website or WhatsApp.
3. A small boosted-post budget on Facebook/Instagram, targeted at homeowners and apartment
   buildings in your confirmed areas, can work well. Point ads at the relevant service page, not
   the homepage.

- [ ] Facebook handle aligned (if possible)
- [ ] Regular posting schedule
- [ ] First small ad test

## 7. Website work to do next

Roughly in order of impact:

1. Switch on booking emails as soon as a Resend key exists, and optionally log every booking to a
   Google Sheet.
2. ~~Sinhala and Tamil versions of the site.~~ Done: `/si` and `/ta` versions of the main pages.
   Publish them after a native-speaker review.
3. Service area pages as towns are confirmed.
4. A real gallery with before/after comparisons once photos arrive.
5. Analytics with booking and WhatsApp click tracking.
6. Price display, and a simple estimate guide once prices are confirmed.
7. A video section using the YouTube clips.
8. A customer database with reminders and a private admin page (a bigger job, planned in
   `docs/BACKEND.md`).

## 8. Known technical limits

- **Settings take effect on rebuild.** Changing the domain, email keys and similar settings
  requires a rebuild, which happens automatically on a redeploy.
- **Spam protection is per server.** It is fine for normal hosting; it may need upgrading if spam
  ever becomes a problem.
- **Hidden until real content arrives.** The gallery and testimonials pages are hidden from Google
  until they contain real content. That is intentional.

## Suggested order

- **Week 1:** go live on tanksudda.com, set up Resend and the domain email, create the Google
  Business Profile, connect Search Console, check the site's claims.
- **Weeks 2–4:** get photos and a logo, decide on starting prices and hours, confirm service
  areas, start asking for reviews, add analytics.
- **Months 2–3:** Sinhala and Tamil pages, monthly articles, WhatsApp Business setup, commercial
  outreach, small ad tests.

The three things that will move the needle most are **going live, the Google Business Profile
with reviews, and real photos**.
