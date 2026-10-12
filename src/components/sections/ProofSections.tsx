/**
 * Sections that depend on real evidence: photographs, before/after pairs and
 * customer feedback. Each renders nothing until genuine content is supplied.
 */
import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/primitives";
import { beforeAfterPairs, gallery, type GalleryItem } from "@/data/gallery";
import { getPublishableTestimonials, type Testimonial } from "@/data/testimonials";
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
              <div className="grid grid-cols-2">
                {(["before", "after"] as const).map((key) => (
                  <div key={key} className="relative">
                    <Image
                      src={item[key].src}
                      alt={item[key].alt}
                      width={item[key].width}
                      height={item[key].height}
                      sizes="(min-width: 1024px) 17vw, 50vw"
                      className="aspect-square w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded-sm bg-navy-950/85 px-2 py-0.5 text-xs font-semibold text-white capitalize">
                      {key}
                    </span>
                  </div>
                ))}
              </div>
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

export function HomeGallerySection() {
  const photos = gallery.filter((item) => item.kind === "photo").slice(0, 3);
  if (photos.length === 0) return null;
  return (
    <section aria-labelledby="gallery-heading" className="container-site section-y">
      <SectionHeading id="gallery-heading" eyebrow="Our work" title="Recent projects" />
      <div className="mt-10">
        <GalleryGrid items={photos} />
      </div>
      <Link
        href="/gallery"
        className="mt-8 inline-flex font-semibold text-water-700 underline-offset-4 hover:underline"
      >
        View the gallery
      </Link>
    </section>
  );
}

export function BeforeAfterSection() {
  const pairs = beforeAfterPairs.slice(0, 3);
  if (pairs.length === 0) return null;
  return (
    <section aria-labelledby="before-after-heading" className="bg-mist">
      <div className="container-site section-y">
        <SectionHeading
          id="before-after-heading"
          eyebrow="Before and after"
          title="The difference a clean makes"
          intro="Photographs taken before and after cleaning on the same job."
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

export function HomeTestimonialsSection() {
  const items = getPublishableTestimonials().slice(0, 3);
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-heading" className="container-site section-y">
      <SectionHeading
        id="testimonials-heading"
        eyebrow="Customer feedback"
        title="What customers say"
      />
      <div className="mt-10">
        <TestimonialList items={items} />
      </div>
      <Link
        href="/testimonials"
        className="mt-8 inline-flex font-semibold text-water-700 underline-offset-4 hover:underline"
      >
        Read more feedback
      </Link>
    </section>
  );
}
