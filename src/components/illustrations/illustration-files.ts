/**
 * Static illustration files in /public/illustrations, generated from the SVG
 * components in TechnicalIllustrations.tsx by `bun run illustrations`.
 * Serving them as images keeps them out of the page's React tree, which makes
 * pages lighter to load and hydrate.
 */
import type { ServiceIllustration } from "@/data/services";

export type IllustrationTone = "light" | "dark";

export const ILLUSTRATION_KINDS: readonly ServiceIllustration[] = ["tank", "sump", "commercial"];
export const ILLUSTRATION_TONES: readonly IllustrationTone[] = ["light", "dark"];
export const ILLUSTRATION_SIZE = { width: 480, height: 400 } as const;

export function illustrationFileName(
  kind: ServiceIllustration,
  tone: IllustrationTone,
  annotated: boolean,
): string {
  return `${kind}-${tone}${annotated ? "" : "-plain"}.svg`;
}

export function illustrationSrc(
  kind: ServiceIllustration,
  tone: IllustrationTone,
  annotated: boolean,
): string {
  return `/illustrations/${illustrationFileName(kind, tone, annotated)}`;
}
