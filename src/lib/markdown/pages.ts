/**
 * Markdown versions of public pages. Each renderer mirrors the matching page
 * view and reads the same data, so the Markdown never says more than the HTML
 * page. Pure: everything that depends on publication state arrives in the
 * MarkdownContext, built in index.server.ts.
 *
 * To add a page: write a renderer below and list it in buildMarkdownPages.
 * See docs/CONTENT.md → "Markdown versions and llms.txt".
 */
import type { ServiceArea } from "@/data/areas";
import {
  ARTICLES_PER_PAGE,
  blogCategories,
  blogCategoryKeys,
  blogIntro,
  guidePaths,
} from "@/data/blog";
import { business, getSocialProfiles } from "@/data/business";
import { faqCategories, featuredFaqs, getFaqsByIds, type FaqCategory, type Faq } from "@/data/faqs";
import type { GalleryItem } from "@/data/gallery";
import { getPriceEntry, isDisplayablePrice } from "@/data/pricing";
import { getServicesBySlugs, services, type Service } from "@/data/services";
import type { Testimonial } from "@/data/testimonials";
import { paginate, relatedArticles, tagLabel, type Article } from "@/lib/content/articles";
import { htmlLang, localeHref, type Locale } from "@/lib/i18n/config";
import {
  describeServicePrice,
  getDictionary,
  getLocalizedFaqs,
  getLocalizedServices,
  localizeService,
} from "@/lib/i18n/dictionary";
import { absoluteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  blocks,
  bullets,
  escapeText,
  frontMatter,
  heading,
  link,
  numbered,
  paragraph,
  table,
  titled,
  absolutizeLinks,
} from "./format";

export interface MarkdownContext {
  origin: URL;
  /** Published articles, newest first. Never drafts or development previews. */
  articles: Article[];
  /** Confirmed service areas only. */
  areas: ServiceArea[];
  /** Testimonials with consent to publish. */
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  /** English plus any translation that has been reviewed. */
  locales: readonly Locale[];
}

export type MarkdownGroup = "main" | "services" | "articles" | "blog" | "areas" | "translations";

export interface MarkdownPage {
  /** Root-relative path of the HTML page, e.g. "/pricing". */
  path: string;
  locale: Locale;
  group: MarkdownGroup;
  /** Page title without the brand suffix (the HTML <title>). */
  title: string;
  description: string;
  /** Last content update shown on the page (articles only). */
  updated?: string;
  /** Markdown body, starting with the page's h1. */
  render: () => string;
}

/** "/pricing" → "/pricing.md"; the home page is "/index.md". */
export function markdownPath(path: string): string {
  return path === "/" ? "/index.md" : `${path}.md`;
}

/** The HTML path a Markdown request refers to: ["blog", "x"] → "/blog/x", ["index"] → "/". */
export function htmlPathFromSegments(segments: readonly string[]): string {
  const joined = segments.join("/");
  return joined === "index" ? "/" : `/${joined}`;
}

/** The complete Markdown document for a page: front matter, then the body. */
export function renderMarkdownDocument(page: MarkdownPage, origin: URL): string {
  return `${frontMatter({
    title: page.title,
    description: page.description,
    url: absoluteUrl(page.path, origin)!,
    language: htmlLang[page.locale],
    updated: page.updated,
  })}\n\n${page.render().trim()}\n`;
}

/** Every page with a Markdown version, in the order used by llms.txt. */
export function buildMarkdownPages(ctx: MarkdownContext): MarkdownPage[] {
  const u = (path: string) => absoluteUrl(path, ctx.origin)!;
  const pages: MarkdownPage[] = [];

  for (const locale of ctx.locales) {
    const t = getDictionary(locale);
    const group: MarkdownGroup = locale === "en" ? "main" : "translations";
    const at = (path: string) => localeHref(locale, path);
    pages.push(
      {
        path: at("/"),
        locale,
        group,
        title: t.home.meta.title,
        description: t.home.meta.description,
        render: () => renderHome(ctx, locale, u),
      },
      {
        path: at("/services"),
        locale,
        group,
        ...t.servicesPage.meta,
        render: () => renderServices(locale, u),
      },
      {
        path: at("/pricing"),
        locale,
        group,
        ...t.pricingPage.meta,
        render: () => renderPricing(locale, u),
      },
      {
        path: at("/about"),
        locale,
        group,
        ...t.aboutPage.meta,
        render: () => renderAbout(locale, u),
      },
      {
        path: at("/contact"),
        locale,
        group,
        ...t.contactPage.meta,
        render: () => renderContact(locale, u),
      },
      { path: at("/faq"), locale, group, ...t.faqPage.meta, render: () => renderFaq(locale, u) },
    );
    for (const base of services) {
      const service = localizeService(base, locale);
      pages.push({
        path: at(`/services/${service.slug}`),
        locale,
        group: locale === "en" ? "services" : "translations",
        title: service.name,
        description: service.metaDescription,
        render: () => renderService(ctx, locale, base, u),
      });
    }
  }

  pages.push(
    {
      path: "/guides",
      locale: "en",
      group: "main",
      title: "Water Tank Care Guides",
      description:
        "Plain-language guides to water tank and sump care in Sri Lanka: cleaning frequency, sediment, preparation, and choosing a cleaning service.",
      render: () => renderGuides(ctx, u),
    },
    {
      path: "/areas",
      locale: "en",
      group: "main",
      title: "Service Areas",
      description: `Where ${business.name} provides water tank and sump cleaning in Sri Lanka, and how to check whether we can serve your location.`,
      render: () => renderAreas(ctx, u),
    },
  );
  if (ctx.gallery.length > 0) {
    pages.push({
      path: "/gallery",
      locale: "en",
      group: "main",
      title: "Project Gallery",
      description:
        "Photographs of water tank and sump cleaning work completed by Tank Sudda in Sri Lanka.",
      render: () => renderGallery(ctx, u),
    });
  }
  if (ctx.testimonials.length > 0) {
    pages.push({
      path: "/testimonials",
      locale: "en",
      group: "main",
      title: "Customer Feedback",
      description: "Verified feedback from Tank Sudda customers, published with their permission.",
      render: () => renderTestimonials(ctx),
    });
  }

  for (const area of ctx.areas) {
    pages.push({
      path: `/areas/${area.slug}`,
      locale: "en",
      group: "areas",
      title: `Water Tank Cleaning in ${area.name}`,
      description: area.metaDescription,
      render: () => renderArea(area, u),
    });
  }

  const totalPages = Math.max(1, Math.ceil(ctx.articles.length / ARTICLES_PER_PAGE));
  for (let page = 1; page <= totalPages; page++) {
    pages.push({
      path: page === 1 ? "/blog" : `/blog/page/${page}`,
      locale: "en",
      group: "blog",
      title: page === 1 ? "Tank Care Blog" : `Tank Care Blog: Page ${page}`,
      description: blogIntro,
      render: () => renderBlogIndex(ctx, page, u),
    });
  }
  for (const key of blogCategoryKeys) {
    const articles = ctx.articles.filter((article) => article.category === key);
    // Empty categories are noindex, like the sitemap leaves them out.
    if (articles.length === 0) continue;
    const category = blogCategories[key];
    pages.push({
      path: `/blog/category/${key}`,
      locale: "en",
      group: "blog",
      title: `${category.name}: Articles`,
      description: category.description,
      render: () =>
        blocks(
          heading(1, category.name),
          paragraph(category.description),
          articleList(articles, u),
        ),
    });
  }
  // Syndicated (external canonical) and noindex articles stay HTML-only.
  for (const article of ctx.articles.filter((item) => !item.noindex && !item.canonicalUrl)) {
    pages.push({
      path: `/blog/${article.slug}`,
      locale: "en",
      group: "articles",
      title: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.description,
      updated: article.updatedAt ?? article.publishedAt,
      render: () => renderArticle(ctx, article, u),
    });
  }
  return pages;
}

type UrlFor = (path: string) => string;

function ctaBlock(locale: Locale, u: UrlFor, title?: string): string {
  const t = getDictionary(locale);
  return blocks(
    heading(2, title ?? t.cta.title),
    paragraph(t.cta.body),
    bullets([
      link(t.common.requestBooking, u("/book")),
      link(t.common.howPricingWorks, u(localeHref(locale, "/pricing"))),
    ]),
  );
}

function steps(items: readonly { title: string; description: string }[]): string {
  return numbered(items.map((step) => titled(step.title, step.description)));
}

function faqBlock(items: readonly Faq[], level: 2 | 3 = 3): string {
  return blocks(...items.map((faq) => blocks(heading(level, faq.question), paragraph(faq.answer))));
}

function serviceCards(list: readonly Service[], locale: Locale, u: UrlFor): string {
  return blocks(
    ...list.map((service) =>
      blocks(
        `### ${link(service.name, u(localeHref(locale, `/services/${service.slug}`)))}`,
        paragraph(service.summary),
        bullets([
          ...service.suitableFor.slice(0, 2).map(escapeText),
          escapeText(describeServicePrice(locale, service.slug)),
        ]),
      ),
    ),
  );
}

function articleList(articles: readonly Article[], u: UrlFor): string {
  return bullets(
    articles.map(
      (article) =>
        `${link(article.title, u(`/blog/${article.slug}`))}: ${escapeText(article.description)} ` +
        `(${escapeText(article.categoryName)}, ${formatDate(article.publishedAt)})`,
    ),
  );
}

function renderHome(ctx: MarkdownContext, locale: Locale, u: UrlFor): string {
  const t = getDictionary(locale);
  const articles = locale === "en" ? ctx.articles.slice(0, 3) : [];
  const testimonials = ctx.testimonials.slice(0, 3);
  return blocks(
    heading(1, t.hero.kicker),
    `**${escapeText(`${t.hero.line1} ${t.hero.line2}`)}**`,
    paragraph(t.hero.intro),
    bullets(t.hero.assurances.map((item) => titled(item.title, item.description))),
    heading(2, t.home.servicesTitle),
    paragraph(t.home.servicesIntro),
    serviceCards(getLocalizedServices(locale), locale, u),
    link(t.home.compareAll, u(localeHref(locale, "/services"))),
    heading(2, t.why.title),
    paragraph(t.why.intro),
    numbered(t.why.points.map((point) => titled(point.title, point.description))),
    link(t.why.readMore, u("/blog/understanding-sediment-in-water-tanks")),
    heading(2, t.home.processTitle),
    paragraph(t.home.processIntro),
    steps(t.content.customerJourney),
    heading(2, t.commitments.title),
    paragraph(t.commitments.intro),
    bullets(t.content.commitments.map((item) => titled(item.title, item.description))),
    heading(2, t.pricingTeaser.title),
    paragraph(t.pricingTeaser.intro),
    heading(3, t.pricingTeaser.factorsHeading),
    bullets(t.content.pricingFactors.map((factor) => titled(factor.title, factor.description))),
    areasTeaser(ctx, locale, u),
    testimonials.length > 0
      ? blocks(
          heading(2, t.proof.testimonialsTitle),
          testimonialList(testimonials),
          link(t.proof.readMoreFeedback, u("/testimonials")),
        )
      : null,
    articles.length > 0
      ? blocks(
          heading(2, t.home.articlesTitle),
          paragraph(t.home.articlesIntro),
          articleList(articles, u),
          link(t.home.browseGuides, u("/guides")),
        )
      : null,
    heading(2, t.faqSection.title),
    faqBlock(getLocalizedFaqs(locale, featuredFaqs)),
    link(t.faqSection.seeAll, u(localeHref(locale, "/faq"))),
    ctaBlock(locale, u),
  );
}

function areasTeaser(ctx: MarkdownContext, locale: Locale, u: UrlFor): string {
  const { areas: text } = getDictionary(locale);
  return blocks(
    heading(2, text.title),
    paragraph(ctx.areas.length > 0 ? text.introWithAreas : text.introNoAreas),
    ctx.areas.length > 0
      ? bullets(ctx.areas.map((area) => link(area.name, u(`/areas/${area.slug}`))))
      : null,
    link(text.coverageLink, u("/areas")),
  );
}

function renderServices(locale: Locale, u: UrlFor): string {
  const t = getDictionary(locale);
  const page = t.servicesPage;
  const list = getLocalizedServices(locale);
  return blocks(
    heading(1, page.title),
    paragraph(page.intro),
    heading(2, page.allServices),
    serviceCards(list, locale, u),
    heading(2, page.compareTitle),
    paragraph(page.compareIntro),
    table(
      [page.service, page.bestFor, page.price].map(escapeText),
      list.map((service) => [
        link(service.name, u(localeHref(locale, `/services/${service.slug}`))),
        escapeText(service.suitableFor[0] ?? ""),
        escapeText(describeServicePrice(locale, service.slug)),
      ]),
    ),
    heading(2, page.journeyTitle),
    steps(t.content.customerJourney),
    ctaBlock(locale, u),
  );
}

function renderService(ctx: MarkdownContext, locale: Locale, base: Service, u: UrlFor): string {
  const t = getDictionary(locale);
  const page = t.servicePage;
  const service = localizeService(base, locale);
  const faqs = getLocalizedFaqs(locale, getFaqsByIds(service.faqIds));
  const related = getServicesBySlugs(service.relatedServiceSlugs).map((item) =>
    localizeService(item, locale),
  );
  // Articles are in English, so they are suggested on English pages only.
  const articles =
    locale === "en"
      ? service.relatedArticleSlugs.flatMap((slug) => {
          const article = ctx.articles.find((item) => item.slug === slug);
          return article ? [article] : [];
        })
      : [];
  const prepLink = link(page.prepLink, u("/blog/how-to-prepare-for-water-tank-cleaning"));
  return blocks(
    heading(1, service.name),
    paragraph(service.intro),
    link(page.bookThis, u(`/book?service=${service.slug}`)),
    heading(2, page.price),
    paragraph(describeServicePrice(locale, service.slug)),
    `${escapeText(page.priceNote)} ${link(t.common.howPricingWorks, u(localeHref(locale, "/pricing")))}`,
    heading(2, page.suitableFor),
    bullets(service.suitableFor.map(escapeText)),
    heading(2, page.involves),
    bullets(service.whatItInvolves.map(escapeText)),
    heading(2, page.process),
    steps(service.process),
    ...service.sections.map((section) =>
      blocks(heading(2, section.heading), ...section.paragraphs.map(paragraph)),
    ),
    heading(2, page.beforeYouBook),
    bullets(service.beforeYouBook.map(escapeText)),
    `${escapeText(page.prepBefore)}${prepLink}${escapeText(t.common.inEnglish)}${escapeText(page.prepAfter)}`,
    faqs.length > 0 ? blocks(heading(2, page.faqHeading(service.shortName)), faqBlock(faqs)) : null,
    related.length > 0
      ? blocks(
          heading(2, page.relatedServices),
          bullets(
            related.map((item) => link(item.name, u(localeHref(locale, `/services/${item.slug}`)))),
          ),
        )
      : null,
    articles.length > 0 ? blocks(heading(2, page.helpfulGuides), articleList(articles, u)) : null,
    ctaBlock(locale, u, page.ctaTitle(service.shortName)),
  );
}

function renderPricing(locale: Locale, u: UrlFor): string {
  const t = getDictionary(locale);
  const page = t.pricingPage;
  const list = getLocalizedServices(locale);
  const anyPublishedPrice = list.some((service) => isDisplayablePrice(getPriceEntry(service.slug)));
  return blocks(
    heading(1, page.title),
    paragraph(page.intro),
    link(t.common.requestQuotation, u("/book")),
    heading(2, page.pricesTitle),
    anyPublishedPrice
      ? null
      : `> **${escapeText(page.noticeTitle)}**\n>\n> ${escapeText(page.noticeBody)}`,
    ...list.map((service) => {
      // Price notes are entered in English only.
      const note = locale === "en" ? getPriceEntry(service.slug)?.notes : null;
      return blocks(
        `### ${link(service.name, u(localeHref(locale, `/services/${service.slug}`)))}`,
        paragraph(note ?? service.summary),
        `${escapeText(t.servicePage.price)}: ${escapeText(describeServicePrice(locale, service.slug))}`,
      );
    }),
    heading(2, page.factorsTitle),
    paragraph(page.factorsIntro),
    bullets(t.content.pricingFactors.map((factor) => titled(factor.title, factor.description))),
    heading(2, page.quoteTitle),
    steps(t.content.quotationSteps),
    ctaBlock(locale, u, page.ctaTitle),
  );
}

function renderAbout(locale: Locale, u: UrlFor): string {
  const t = getDictionary(locale);
  const page = t.aboutPage;
  const list = getLocalizedServices(locale);
  const serviceLinks = list
    .map((service, index) => {
      const name = page.lowercaseServiceNames ? service.shortName.toLowerCase() : service.shortName;
      const separator =
        index < list.length - 2
          ? page.listSeparator
          : index === list.length - 2
            ? page.listAnd
            : page.listEnd;
      return `${link(name, u(localeHref(locale, `/services/${service.slug}`)))}${escapeText(separator)}`;
    })
    .join("");
  return blocks(
    heading(1, page.title),
    paragraph(page.intro),
    heading(2, page.storyTitle),
    ...page.storyParagraphs.map(paragraph),
    `${escapeText(page.servicesLead)}${serviceLinks}`,
    heading(2, t.commitments.title),
    paragraph(t.commitments.intro),
    bullets(t.content.commitments.map((item) => titled(item.title, item.description))),
    heading(2, page.learnTitle),
    `${escapeText(page.learnBefore)}${link(page.learnGuides, u("/guides"))}${escapeText(page.learnMiddle)}${link(page.learnBlog, u("/blog"))}${escapeText(page.learnAfter)}`,
    ctaBlock(locale, u),
  );
}

function renderContact(locale: Locale, u: UrlFor): string {
  const t = getDictionary(locale);
  const page = t.contactPage;
  const methods: string[] = [];
  if (business.phone) {
    methods.push(
      `${escapeText(t.common.phone)}: ${link(business.phone.display, `tel:${business.phone.e164}`)}`,
    );
  }
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp, t.whatsapp.general);
  if (business.whatsapp && whatsappUrl) {
    methods.push(
      `${escapeText(t.common.whatsapp)}: ${link(business.whatsapp.display, whatsappUrl)}`,
    );
  }
  if (business.email) {
    methods.push(
      `${escapeText(t.common.email)}: ${link(business.email, `mailto:${business.email}`)}`,
    );
  }
  const social = getSocialProfiles();
  const reviews = [
    business.google.profileUrl ? link(t.proof.readReviews, business.google.profileUrl) : null,
    business.google.reviewUrl ? link(t.proof.leaveReview, business.google.reviewUrl) : null,
  ].filter((item): item is string => item !== null);
  return blocks(
    heading(1, page.title),
    `${escapeText(page.introBefore)}${link(page.introLink, u("/book"))}${escapeText(page.introAfter)}`,
    methods.length > 0 ? blocks(heading(2, page.contactDetails), bullets(methods)) : null,
    social.length > 0
      ? blocks(
          heading(2, page.followTitle),
          paragraph(page.followBody),
          bullets(social.map((profile) => link(profile.label, profile.url))),
        )
      : null,
    reviews.length > 0
      ? blocks(heading(2, t.proof.googleTitle), paragraph(t.proof.googleBody), bullets(reviews))
      : null,
    heading(2, page.needCleaning),
    paragraph(page.needCleaningBody),
    link(t.common.requestBooking, u("/book")),
    business.openingHours.length > 0
      ? blocks(
          heading(2, page.openingHours),
          bullets(
            business.openingHours.map((hours) =>
              escapeText(`${hours.days.join(", ")}: ${hours.opens}–${hours.closes}`),
            ),
          ),
        )
      : null,
    heading(2, page.detailsTitle),
    `${escapeText(page.detailsBefore)}${link(page.detailsLink, u("/privacy"))}${escapeText(page.detailsAfter)}`,
  );
}

function renderFaq(locale: Locale, u: UrlFor): string {
  const t = getDictionary(locale);
  const faqs = getLocalizedFaqs(locale);
  const categories = Object.keys(faqCategories) as FaqCategory[];
  return blocks(
    heading(1, t.faqPage.title),
    paragraph(t.faqPage.intro),
    ...categories.map((category) => {
      const items = faqs.filter((faq) => faq.category === category);
      return items.length > 0
        ? blocks(heading(2, t.content.faqCategories[category]), faqBlock(items))
        : null;
    }),
    ctaBlock(locale, u),
  );
}

function renderGuides(ctx: MarkdownContext, u: UrlFor): string {
  const paths = guidePaths
    .map((path) => ({
      ...path,
      articles: path.articleSlugs.flatMap((slug) => {
        const article = ctx.articles.find((item) => item.slug === slug);
        return article ? [article] : [];
      }),
    }))
    .filter((path) => path.articles.length > 0);
  const categories = blogCategoryKeys
    .map((key) => ({
      key,
      ...blogCategories[key],
      count: ctx.articles.filter((article) => article.category === key).length,
    }))
    .filter((category) => category.count > 0);
  return blocks(
    heading(1, "Guides to looking after your water tank"),
    paragraph(
      "Start with the basics, understand what builds up inside a tank, and learn how to plan a cleaning. Written in plain language for homeowners and building managers.",
    ),
    ...paths.map((path, index) =>
      blocks(
        heading(2, `Step ${index + 1}: ${path.title}`),
        paragraph(path.description),
        articleList(path.articles, u),
      ),
    ),
    heading(2, "Browse by topic"),
    bullets(
      categories.map(
        (category) =>
          `${link(category.name, u(`/blog/category/${category.key}`))} (${category.count} ${category.count === 1 ? "article" : "articles"}): ${escapeText(category.description)}`,
      ),
    ),
    heading(2, "From guides to action"),
    paragraph("When you are ready, these pages explain each service in detail."),
    bullets([
      ...services.map((service) => link(service.name, u(`/services/${service.slug}`))),
      link("Frequently asked questions", u("/faq")),
    ]),
    ctaBlock("en", u),
  );
}

function renderAreas(ctx: MarkdownContext, u: UrlFor): string {
  return blocks(
    heading(1, "Where we work"),
    paragraph(
      `${business.name} provides tank and sump cleaning in ${business.countryName}. We only list areas we can reliably serve, and we confirm coverage for every request before arranging a visit.`,
    ),
    link("Check availability for your location", u("/book")),
    heading(2, "Confirmed service areas"),
    ctx.areas.length > 0
      ? bullets(
          ctx.areas.map(
            (area) =>
              `${link(area.name, u(`/areas/${area.slug}`))} (${escapeText(`${area.district} District, ${area.province} Province`)}): ${escapeText(area.intro)}`,
          ),
        )
      : "> **Our coverage list is being finalised**\n>\n> We are confirming the areas we can serve reliably before listing them here. In the meantime, include your town and address in your booking request and we will tell you whether we can help before anything is arranged.",
    heading(2, "How we confirm coverage"),
    bullets([
      titled("Tell us your location.", "The booking form asks for your town and address."),
      titled(
        "We check before confirming.",
        "We consider travel, equipment and scheduling for your location.",
      ),
      titled(
        "You get a straight answer.",
        "If we cannot serve your area, we will tell you rather than leave you waiting.",
      ),
    ]),
    ctaBlock("en", u),
  );
}

function renderArea(area: ServiceArea, u: UrlFor): string {
  return blocks(
    heading(1, `Water tank and sump cleaning in ${area.name}`),
    paragraph(`${area.district} District · ${area.province} Province`),
    paragraph(area.intro),
    link(`Request a booking in ${area.name}`, u("/book")),
    heading(2, `What to know in ${area.name}`),
    ...area.localNotes.map((note) => blocks(heading(3, note.heading), paragraph(note.body))),
    area.placesCovered.length > 0
      ? blocks(heading(3, "Places we cover"), paragraph(`${area.placesCovered.join(", ")}.`))
      : null,
    `Not sure whether your address is covered? Include it in your ${link("booking request", u("/book"))} and ${escapeText(business.name)} will confirm before arranging anything.`,
    heading(2, `Services in ${area.name}`),
    serviceCards(getServicesBySlugs(area.serviceSlugs), "en", u),
    ctaBlock("en", u, `Book a tank cleaning in ${area.name}`),
  );
}

function renderGallery(ctx: MarkdownContext, u: UrlFor): string {
  const photo = (src: string, alt: string) => `![${escapeText(alt)}](${u(src)})`;
  return blocks(
    heading(1, "Our work"),
    paragraph("Photographs from real Tank Sudda jobs: tanks, sumps and the equipment we use."),
    ...ctx.gallery.map((item) =>
      blocks(
        heading(2, item.title),
        item.kind === "photo"
          ? photo(item.photo.src, item.photo.alt)
          : blocks(
              `Before: ${photo(item.before.src, item.before.alt)}`,
              `After: ${photo(item.after.src, item.after.alt)}`,
            ),
        item.location || item.date
          ? escapeText(
              [item.location, item.date ? formatDate(item.date) : null].filter(Boolean).join(" · "),
            )
          : null,
      ),
    ),
    ctaBlock("en", u),
  );
}

function testimonialList(items: readonly Testimonial[]): string {
  return blocks(
    ...items.map((item) => {
      const source =
        item.sourceUrl && /^https:\/\//.test(item.sourceUrl)
          ? link(item.source, item.sourceUrl)
          : escapeText(item.source);
      const who = [item.name, item.context].filter(Boolean).join(", ");
      return `> ${escapeText(item.quote)}\n>\n> ${escapeText(who)} · ${source} · ${formatDate(item.date)}`;
    }),
  );
}

function renderTestimonials(ctx: MarkdownContext): string {
  return blocks(
    heading(1, "What our customers say"),
    paragraph(
      "We only publish genuine feedback from real customers, with their permission. Each entry shows where and when it was given.",
    ),
    testimonialList(ctx.testimonials),
  );
}

function renderBlogIndex(ctx: MarkdownContext, page: number, u: UrlFor): string {
  const result = paginate(ctx.articles, page, ARTICLES_PER_PAGE);
  const pageUrl = (n: number) => u(n === 1 ? "/blog" : `/blog/page/${n}`);
  return blocks(
    heading(1, page > 1 ? `Blog: page ${page}` : "Tank care blog"),
    paragraph(blogIntro),
    result && result.items.length > 0
      ? articleList(result.items, u)
      : paragraph("No articles have been published yet."),
    result && result.totalPages > 1
      ? bullets([
          ...(page > 1 ? [link("Previous page", pageUrl(page - 1))] : []),
          ...(page < result.totalPages ? [link("Next page", pageUrl(page + 1))] : []),
        ])
      : null,
    heading(2, "Categories"),
    bullets(
      blogCategoryKeys
        .filter((key) => ctx.articles.some((article) => article.category === key))
        .map((key) => link(blogCategories[key].name, u(`/blog/category/${key}`))),
    ),
  );
}

function renderArticle(ctx: MarkdownContext, article: Article, u: UrlFor): string {
  const related = relatedArticles(article, ctx.articles);
  const relatedServices = getServicesBySlugs(article.relatedServices);
  const byline = [
    escapeText(article.authorName),
    `Published ${formatDate(article.publishedAt)}`,
    article.updatedAt && article.updatedAt !== article.publishedAt
      ? `Updated ${formatDate(article.updatedAt)}`
      : null,
    `${article.readingTimeMinutes} min read`,
  ]
    .filter(Boolean)
    .join(" · ");
  return blocks(
    heading(1, article.title),
    paragraph(article.description),
    `${byline}  \nCategory: ${link(article.categoryName, u(`/blog/category/${article.category}`))}`,
    article.cover ? `![${escapeText(article.cover.alt)}](${u(article.cover.src)})` : null,
    // Article bodies are trusted repository Markdown (see src/lib/content/mdx.tsx).
    absolutizeLinks(article.body, ctx.origin),
    article.tags.length > 0
      ? `Tags: ${article.tags.map((tag) => link(tagLabel(tag), u(`/blog/tag/${tag}`))).join(", ")}`
      : null,
    relatedServices.length > 0
      ? blocks(
          heading(2, "Related services"),
          bullets(
            relatedServices.map((service) => link(service.name, u(`/services/${service.slug}`))),
          ),
        )
      : null,
    related.length > 0 ? blocks(heading(2, "Related articles"), articleList(related, u)) : null,
    ctaBlock("en", u),
  );
}
