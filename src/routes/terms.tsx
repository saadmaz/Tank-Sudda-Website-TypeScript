import { createFileRoute } from "@tanstack/react-router";
import { Section, WaterBackdrop } from "@/components/site/primitives";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Tank Sudda" },
      { name: "description", content: "The terms that govern your use of Tank Sudda's services." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-8">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Legal</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-6xl">Terms of Service</h1>
        </div>
      </section>
      <Section>
        <div className="prose prose-slate mx-auto max-w-3xl text-muted-foreground">
          <p>By booking a Tank Sudda service, you agree to grant our technicians safe access to your water tank and related equipment.</p>
          <p className="mt-6">All quoted prices are estimates. Final pricing may vary based on tank condition observed during on-site inspection. You will be notified before any additional work is performed.</p>
          <p className="mt-6">We provide a 30-day quality guarantee. Any concerns raised within that window will be addressed at no additional cost.</p>
        </div>
      </Section>
    </>
  ),
});
