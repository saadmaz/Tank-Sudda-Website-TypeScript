import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { BreakableValue, getContactMethods } from "@/components/contact/ContactActions";
import { GoogleReviewsPanel, SocialLinks } from "@/components/contact/SocialLinks";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { business, getSocialProfiles } from "@/data/business";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";
import { isLeadDeliveryConfigured } from "@/server/notifications/channels";

export function contactMetadata(locale: Locale): Metadata {
  return buildLocalizedMetadata(locale, "/contact", getDictionary(locale).contactPage.meta);
}

export function ContactPageView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const page = t.contactPage;
  // The message form is English-only; other languages point to WhatsApp and the booking form.
  const formAvailable =
    locale === "en" && (isLeadDeliveryConfigured() || process.env.NODE_ENV === "development");
  const methods = getContactMethods(locale);
  const hasSocial = getSocialProfiles().length > 0;
  const hasGoogle = Boolean(business.google.profileUrl || business.google.reviewUrl);
  return (
    <>
      <PageHeader
        locale={locale}
        breadcrumbs={[{ name: page.breadcrumb, path: localeHref(locale, "/contact") }]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={
          <>
            {page.introBefore}
            <Link href="/book" className="underline underline-offset-4">
              {page.introLink}
            </Link>
            {page.introAfter}
          </>
        }
      />

      {methods.length > 0 ? (
        <section
          aria-labelledby="direct-heading"
          data-analytics-placement="contact_page"
          className="container-site pt-12 lg:pt-16"
        >
          <h2 id="direct-heading" className="sr-only">
            {page.contactDetails}
          </h2>
          <ul className="grid gap-3 md:grid-cols-3 md:gap-4">
            {methods.map(({ icon: Icon, brandColored, label, value, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-line bg-white p-4 shadow-card transition-[border-color,box-shadow] hover:border-water-300 hover:shadow-raised sm:p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-x-4 md:gap-y-6 md:p-6"
                >
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-lg ring-1 md:col-start-1 md:row-start-1",
                      brandColored
                        ? "bg-whatsapp/10 ring-whatsapp/30"
                        : "bg-water-50 text-water-700 ring-water-100",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-col md:col-span-2 md:row-start-2">
                    <span className="text-sm font-medium text-muted">{label}</span>
                    <span className="mt-0.5 font-display text-lg font-bold break-words text-navy-950 group-hover:text-water-700 md:mt-1 md:text-xl">
                      <BreakableValue value={value} />
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-grey-400 transition-colors group-hover:text-water-600 md:col-start-2 md:row-start-1"
                  />
                  {external ? <span className="sr-only">{t.common.opensNewTab}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasSocial || hasGoogle ? (
        <section aria-label={page.socialLabel} className="container-site space-y-4 pt-4">
          {hasSocial ? (
            <div className="grid gap-5 rounded-xl border border-line bg-white p-6 shadow-card lg:grid-cols-[1fr_23rem] lg:items-center lg:px-8">
              <div>
                <h2 className="font-display text-lg font-bold text-navy-950">{page.followTitle}</h2>
                <p className="mt-1 text-muted">{page.followBody}</p>
              </div>
              <SocialLinks locale={locale} />
            </div>
          ) : null}
          {hasGoogle ? <GoogleReviewsPanel locale={locale} /> : null}
        </section>
      ) : null}

      <div className="container-site grid gap-12 section-y lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        {formAvailable ? (
          <section aria-labelledby="form-heading">
            <h2 id="form-heading" className="text-h2">
              {page.sendMessage}
            </h2>
            <div className="mt-8">
              <ContactForm available={formAvailable} />
            </div>
          </section>
        ) : (
          <section aria-labelledby="book-heading">
            <h2 id="book-heading" className="text-h2">
              {page.needCleaning}
            </h2>
            <p className="mt-4 max-w-xl text-lead text-muted">{page.needCleaningBody}</p>
            <Link
              href="/book"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-water-600 px-6 font-semibold text-white hover:bg-water-700 sm:w-auto"
            >
              {t.common.requestBooking}
            </Link>
          </section>
        )}
        <aside aria-label={page.enquiryLabel} className="space-y-6">
          {business.openingHours.length > 0 ? (
            <div className="rounded-xl border border-line p-6">
              <h2 className="text-h3">{page.openingHours}</h2>
              <ul className="mt-3 space-y-1 text-[0.9375rem]">
                {business.openingHours.map((hours) => (
                  <li key={hours.days.join()}>
                    {hours.days.join(", ")}: {hours.opens}–{hours.closes}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="rounded-xl border border-line bg-mist p-6 text-[0.9375rem] leading-relaxed">
            <h2 className="text-h3">{page.detailsTitle}</h2>
            <p className="mt-2 text-muted">
              {page.detailsBefore}
              <Link href="/privacy" className="text-water-700 underline underline-offset-4">
                {page.detailsLink}
              </Link>
              {page.detailsAfter}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
