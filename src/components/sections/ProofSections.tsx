/**
 * Sections that depend on real evidence: photographs, before/after pairs and
 * customer feedback. Each renders nothing until genuine content is supplied.
 */
import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";
import { GoogleReviewsPanel } from "@/components/contact/SocialLinks";
import { BeforeAfterSlider } from "@/components/media/BeforeAfterSlider";
import { SectionHeading } from "@/components/ui/primitives";
import { business } from "@/data/business";
import { beforeAfterPairs, gallery, type GalleryItem } from "@/data/gallery";
import { getPublishableTestimonials, type Testimonial } from "@/data/testimonials";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatDate } from "@/lib/utils";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <figure className="overflow-hidden rounded-lg border border-line bg-white">
            {item.kind === "photo" ? (
              <Image
                src={item.photo.src}
                alt={item.photo.alt}
                width={item.photo.width}
                height={item.photo.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <BeforeAfterSlider before={item.before} after={item.after} label={item.title} />
            )}
            <figcaption className="p-4 text-sm">
              <span className="font-semibold text-navy-950">{item.title}</span>
              {item.location || item.date ? (
                <span className="mt-1 block text-muted">
                  {[item.location, item.date ? formatDate(item.date) : null]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              ) : null}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export function HomeGallerySection({ locale = "en" }: { locale?: Locale }) {
  const photos = gallery.filter((item) => item.kind === "photo").slice(0, 3);
  if (photos.length === 0) return null;
  const { proof } = getDictionary(locale);
  return (
    <section aria-labelledby="gallery-heading" className="container-site section-y">
      <SectionHeading
        id="gallery-heading"
        eyebrow={proof.galleryEyebrow}
        title={proof.galleryTitle}
      />
      <div className="mt-10">
        <GalleryGrid items={photos} />
      </div>
      <Link
        href="/gallery"
        className="mt-6 inline-flex min-h-11 items-center font-semibold text-water-700 underline-offset-4 hover:underline"
      >
        {proof.viewGallery}
      </Link>
    </section>
  );
}

export function BeforeAfterSection({ locale = "en" }: { locale?: Locale }) {
  const pairs = beforeAfterPairs.slice(0, 3);
  if (pairs.length === 0) return null;
  const { proof } = getDictionary(locale);
  return (
    <section aria-labelledby="before-after-heading" className="bg-mist">
      <div className="container-site section-y">
        <SectionHeading
          id="before-after-heading"
          eyebrow={proof.beforeAfterEyebrow}
          title={proof.beforeAfterTitle}
          intro={proof.beforeAfterIntro}
        />
        <div className="mt-10">
          <GalleryGrid items={pairs} />
        </div>
      </div>
    </section>
  );
}

export function TestimonialList({ items }: { items: Testimonial[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <figure className="flex h-full flex-col rounded-lg border border-line bg-white p-6 shadow-card">
            <Quote aria-hidden="true" className="size-6 text-water-500" />
            <blockquote className="mt-4 flex-1 leading-relaxed text-body">
              <p>{item.quote}</p>
            </blockquote>
            <figcaption className="mt-6 border-t border-line pt-4 text-sm">
              <span className="font-semibold text-navy-950">{item.name}</span>
              {item.context ? <span className="block text-muted">{item.context}</span> : null}
              <span className="mt-1 block text-muted">
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {item.source}
                  </a>
                ) : (
                  item.source
                )}{" "}
                · <time dateTime={item.date}>{formatDate(item.date)}</time>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export function HomeTestimonialsSection({ locale = "en" }: { locale?: Locale }) {
  const items = getPublishableTestimonials().slice(0, 3);
  const hasGoogle = Boolean(business.google.profileUrl || business.google.reviewUrl);
  if (items.length === 0 && !hasGoogle) return null;
  const { proof } = getDictionary(locale);
  return (
    <section aria-labelledby="testimonials-heading" className="container-site section-y">
      <SectionHeading
        id="testimonials-heading"
        eyebrow={proof.testimonialsEyebrow}
        title={proof.testimonialsTitle}
      />
      {items.length > 0 ? (
        <>
          <div className="mt-10">
            <TestimonialList items={items} />
          </div>
          <Link
            href="/testimonials"
            className="mt-6 inline-flex min-h-11 items-center font-semibold text-water-700 underline-offset-4 hover:underline"
          >
            {proof.readMoreFeedback}
          </Link>
        </>
      ) : null}
      {hasGoogle ? (
        <div className="mt-10">
          <GoogleReviewsPanel locale={locale} />
        </div>
      ) : null}
    </section>
  );
}
