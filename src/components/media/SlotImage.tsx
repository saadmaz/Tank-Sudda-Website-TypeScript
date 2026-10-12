import Image from "next/image";
import type { ReactNode } from "react";
import { siteImages, type ImageSlot } from "@/data/images";
import { cn } from "@/lib/utils";

/**
 * Shows the photograph configured for an image slot in data/images.ts, or the
 * supplied fallback (normally a technical illustration) until one is added.
 */
export function SlotImage({
  slot,
  fallback,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority = false,
  className,
}: {
  slot: ImageSlot;
  fallback: ReactNode;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = siteImages[slot];
  if (!photo) return <div className={className}>{fallback}</div>;
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto w-full rounded-lg object-cover", className)}
    />
  );
}
