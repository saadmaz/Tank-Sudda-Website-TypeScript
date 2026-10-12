/**
 * Project photographs. Place image files in /public/images/gallery and add an
 * entry here — no component changes are needed.
 *
 * Only use real Tank Sudda photographs. A "before-after" entry must pair two
 * photos of the same tank taken on the same job.
 */

export interface GalleryPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface GalleryBase {
  id: string;
  title: string;
  serviceSlug: string | null;
  /** General location (e.g. "Kandy"); omit if the customer prefers. */
  location: string | null;
  /** ISO date the work was done. */
  date: string | null;
}

export type GalleryItem =
  | (GalleryBase & { kind: "photo"; photo: GalleryPhoto })
  | (GalleryBase & { kind: "before-after"; before: GalleryPhoto; after: GalleryPhoto });

export const gallery: GalleryItem[] = [];

export const beforeAfterPairs = gallery.filter(
  (item): item is Extract<GalleryItem, { kind: "before-after" }> => item.kind === "before-after",
);
