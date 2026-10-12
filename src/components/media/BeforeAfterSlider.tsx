"use client";

import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { useState } from "react";
import type { GalleryPhoto } from "@/data/gallery";

/**
 * Drag-to-compare view of a before/after pair of the same tank. A native range
 * input sits over the images, so it works with touch, mouse and keyboard
 * (arrow keys) and is announced correctly by screen readers.
 */
export function BeforeAfterSlider({
  before,
  after,
  label,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  before: GalleryPhoto;
  after: GalleryPhoto;
  label: string;
  sizes?: string;
}) {
  const [position, setPosition] = useState(50);
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-grey-100 select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-water-600">
      <Image src={after.src} alt={after.alt} fill sizes={sizes} className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes={sizes} className="object-cover" />
      </div>

      {/* Divider and handle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(6_28_54/0.25)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy-950 shadow-raised">
          <MoveHorizontal className="size-5" />
        </span>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 rounded-sm bg-navy-950/85 px-2 py-0.5 text-xs font-semibold text-white"
      >
        Before
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 rounded-sm bg-navy-950/85 px-2 py-0.5 text-xs font-semibold text-white"
      >
        After
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={`Compare before and after: ${label}`}
        aria-valuetext={`${position}% before, ${100 - position}% after`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
