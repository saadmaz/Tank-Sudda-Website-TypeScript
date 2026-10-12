import Image from "next/image";
import type { ServiceIllustration } from "@/data/services";
import { cn } from "@/lib/utils";
import { ILLUSTRATION_SIZE, illustrationSrc, type IllustrationTone } from "./illustration-files";

/**
 * Decorative technical illustration served as a static SVG file. The meaning
 * is always carried by nearby text, so the image has empty alt text. SVGs are
 * already resolution-independent, so they skip the image optimiser.
 */
export function Illustration({
  kind,
  tone = "light",
  annotated = true,
  priority = false,
  className,
}: {
  kind: ServiceIllustration;
  tone?: IllustrationTone;
  annotated?: boolean;
  /** Load immediately (above-the-fold artwork). */
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={illustrationSrc(kind, tone, annotated)}
      alt=""
      width={ILLUSTRATION_SIZE.width}
      height={ILLUSTRATION_SIZE.height}
      unoptimized
      loading={priority ? "eager" : "lazy"}
      className={cn("h-auto w-full", className)}
    />
  );
}
