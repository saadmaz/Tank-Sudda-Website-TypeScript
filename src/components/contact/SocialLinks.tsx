import { ExternalLink, Star } from "lucide-react";
import { BrandIcon, GoogleColorIcon } from "@/components/icons/BrandIcons";
import { MissingInfo } from "@/components/ui/MissingInfo";
import { business, getSocialProfiles } from "@/data/business";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

/** Round icon links to Tank Sudda's official social profiles. */
export function SocialLinks({
  tone = "light",
  className,
  locale = "en",
}: {
  tone?: "light" | "dark";
  className?: string;
  locale?: Locale;
}) {
  const { common } = getDictionary(locale);
  const profiles = getSocialProfiles();
  if (profiles.length === 0) return <MissingInfo what="social media links" />;
  const dark = tone === "dark";
  return (
    // Full-size 44px buttons: a single row when there is room (container query),
    // otherwise a tidy 4-column grid. Seven columns (one per profile) need 22.25rem.
    <div className={cn("@container w-full", className)}>
      <ul className="grid w-fit grid-cols-4 gap-2 @[22.25rem]:grid-cols-7">
        {profiles.map((profile) => (
          <li key={profile.id}>
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${common.socialProfile(profile.label)}${common.opensNewTab}`}
              title={profile.label}
              className={cn(
                "grid size-11 place-items-center rounded-full transition-colors",
                dark
                  ? "bg-white/5 text-grey-200 ring-1 ring-white/15 hover:bg-white hover:text-navy-950"
                  : "bg-white text-navy-900 ring-1 ring-line hover:bg-navy-950 hover:text-white hover:ring-navy-950",
              )}
            >
              <BrandIcon name={profile.id} className="size-[1.125rem]" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Links to Tank Sudda's Google reviews. Reviews are read on Google itself;
 * nothing is copied or summarised here, so no rating is ever shown on the site.
 */
export function GoogleReviewsPanel({
  tone = "light",
  locale = "en",
}: {
  tone?: "light" | "dark";
  locale?: Locale;
}) {
  const { proof } = getDictionary(locale);
  const { profileUrl, reviewUrl } = business.google;
  if (!profileUrl && !reviewUrl) return <MissingInfo what="Google Business Profile links" />;
  const dark = tone === "dark";
  const button =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-[0.9375rem] font-semibold transition-colors";
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-xl p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8",
        dark ? "bg-white/5 ring-1 ring-white/10" : "border border-line bg-white shadow-card",
      )}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white shadow-card ring-1 ring-line">
          <GoogleColorIcon className="size-6" />
        </span>
        <div>
          <p
            className={cn("font-display text-lg font-bold", dark ? "text-white" : "text-navy-950")}
          >
            {proof.googleTitle}
          </p>
          <p className={cn("mt-1 max-w-md leading-relaxed", dark ? "text-grey-300" : "text-muted")}>
            {proof.googleBody}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {profileUrl ? (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              button,
              dark
                ? "text-white ring-1 ring-white/30 hover:bg-white/10"
                : "text-navy-950 ring-1 ring-grey-300 hover:ring-navy-950",
            )}
          >
            {proof.readReviews}
            <ExternalLink aria-hidden="true" className="size-4" />
            <span className="sr-only">{proof.opensGoogle}</span>
          </a>
        ) : null}
        {reviewUrl ? (
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(button, "bg-water-600 text-white hover:bg-water-700")}
          >
            <Star aria-hidden="true" className="size-4" />
            {proof.leaveReview}
            <span className="sr-only">{proof.opensGoogle}</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
