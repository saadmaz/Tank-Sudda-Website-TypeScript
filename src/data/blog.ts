/**
 * Blog taxonomy. Article front matter must reference a key defined here.
 * Adding a category automatically creates /blog/category/[slug].
 */

export const blogCategories = {
  maintenance: {
    name: "Tank maintenance",
    description:
      "Practical guidance on looking after water tanks and sumps between professional cleans.",
  },
  "cleaning-explained": {
    name: "Cleaning explained",
    description:
      "What tank and sump cleaning involves, how to prepare, and what to expect on the day.",
  },
  "choosing-a-service": {
    name: "Choosing a service",
    description: "How to compare tank cleaning services and ask the right questions.",
  },
} as const satisfies Record<string, { name: string; description: string }>;

export type BlogCategoryKey = keyof typeof blogCategories;
export const blogCategoryKeys = Object.keys(blogCategories) as [
  BlogCategoryKey,
  ...BlogCategoryKey[],
];

export const blogAuthors = {
  "tank-sudda-team": {
    name: "Tank Sudda Team",
    description: "Written and reviewed by the Tank Sudda team.",
  },
} as const satisfies Record<string, { name: string; description: string }>;

export type BlogAuthorKey = keyof typeof blogAuthors;
export const blogAuthorKeys = Object.keys(blogAuthors) as [BlogAuthorKey, ...BlogAuthorKey[]];

/** Slugs that would collide with routes under /blog. */
export const RESERVED_ARTICLE_SLUGS = ["page", "category", "tag", "search", "feed"] as const;

export const ARTICLES_PER_PAGE = 9;

/** Introduction shown on /blog (and used as its meta description). */
export const blogIntro =
  "Practical guidance on water tanks and sumps: maintenance, sediment, cleaning schedules and how to prepare for a clean.";

/** Curated learning paths shown on /guides. Unpublished slugs are skipped. */
export const guidePaths: { title: string; description: string; articleSlugs: string[] }[] = [
  {
    title: "Start here",
    description: "The basics of keeping a water tank in good condition.",
    articleSlugs: [
      "how-often-should-you-clean-your-water-tank",
      "water-tank-maintenance-checklist",
    ],
  },
  {
    title: "Understand your tank",
    description: "What builds up inside a tank, and why it matters.",
    articleSlugs: ["understanding-sediment-in-water-tanks"],
  },
  {
    title: "Planning a cleaning",
    description: "Prepare your property and choose the right service.",
    articleSlugs: [
      "how-to-prepare-for-water-tank-cleaning",
      "choosing-a-water-tank-cleaning-service",
    ],
  },
];

export function isBlogCategory(value: string): value is BlogCategoryKey {
  return Object.hasOwn(blogCategories, value);
}
