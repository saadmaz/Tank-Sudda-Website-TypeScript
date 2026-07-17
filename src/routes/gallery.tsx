import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Section, Reveal, WaterBackdrop } from "@/components/site/primitives";
import { useState } from "react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Before & After Gallery — Tank Sudda" },
      { name: "description", content: "See the transformation. Real tanks, real results, real proof." },
      { property: "og:title", content: "Before & After — Tank Sudda" },
      { property: "og:description", content: "See the transformation. Real tanks, real results." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-16">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Gallery</p>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight md:text-7xl">
            Before. <span className="gradient-text">After.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Every job we complete is documented. Drag any slider to reveal the transformation.
          </p>
        </div>
      </section>
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Reveal key={i} delay={i * 0.08}>
              <BAComparison label={["Residential · Colombo 5", "Hotel rooftop · Bentota", "Apartment complex · Rajagiriya", "Factory sump · Katunayake"][i]} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

function BAComparison({ label }: { label: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border shadow-soft select-none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPos(((e.clientX - rect.left) / rect.width) * 100);
        }}
        onTouchMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPos(((e.touches[0].clientX - rect.left) / rect.width) * 100);
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-aqua/20 to-background grid place-items-center">
          <p className="font-display text-2xl font-bold">After</p>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-br from-[oklch(0.3_0.08_60)] to-[oklch(0.22_0.05_50)] grid place-items-center"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <p className="font-display text-2xl font-bold text-white/85">Before</p>
        </div>
        <div className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-glow" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white shadow-float">
            <div className="flex gap-0.5">
              <ChevronRight className="size-3 -rotate-180 text-primary-deep" strokeWidth={3} />
              <ChevronRight className="size-3 text-primary-deep" strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
