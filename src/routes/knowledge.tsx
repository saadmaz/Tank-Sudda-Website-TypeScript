import { createFileRoute } from "@tanstack/react-router";
import { Section, Reveal, WaterBackdrop } from "@/components/site/primitives";
import { ArrowRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Centre — Tank Sudda" },
      { name: "description", content: "Guides on water tank hygiene, health risks and cleaning best practices." },
      { property: "og:title", content: "Knowledge Centre — Tank Sudda" },
      { property: "og:description", content: "Guides on water tank hygiene and cleaning best practices." },
      { property: "og:url", content: "/knowledge" },
    ],
    links: [{ rel: "canonical", href: "/knowledge" }],
  }),
  component: Knowledge,
});

function Knowledge() {
  const posts = [
    { title: "How often should you clean your water tank?", tag: "Basics", read: "4 min" },
    { title: "10 signs your water tank needs urgent attention", tag: "Warning", read: "5 min" },
    { title: "Hidden health risks of neglected water tanks", tag: "Health", read: "6 min" },
    { title: "Apartment tank maintenance: a complete guide", tag: "Apartments", read: "7 min" },
    { title: "Commercial water compliance in Sri Lanka", tag: "Business", read: "8 min" },
    { title: "Rainwater harvesting tanks: cleaning essentials", tag: "Rainwater", read: "5 min" },
    { title: "Water safety during monsoon season", tag: "Seasonal", read: "4 min" },
    { title: "Dengue prevention through tank hygiene", tag: "Health", read: "5 min" },
  ];
  return (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-16">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Knowledge Centre</p>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight md:text-7xl">
            Learn to <span className="gradient-text">drink safer.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Practical guides on water tank hygiene, health risks and best practices.
          </p>
        </div>
      </section>
      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <article className="group h-full rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-soft">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{p.tag}</span>
                  <span className="text-xs text-muted-foreground">{p.read}</span>
                </div>
                <BookOpen className="mb-5 size-5 text-primary" />
                <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
                <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Read <ArrowRight className="size-3" />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
