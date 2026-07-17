import { createFileRoute } from "@tanstack/react-router";
import { Section, WaterBackdrop } from "@/components/site/primitives";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Tank Sudda" },
      { name: "description", content: "How Tank Sudda collects, uses and protects your personal information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-8">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Legal</p>
          <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-6xl">Privacy Policy</h1>
        </div>
      </section>
      <Section>
        <div className="prose prose-slate mx-auto max-w-3xl text-muted-foreground">
          <p>Tank Sudda respects your privacy. We collect only the information required to schedule and deliver your water tank cleaning service — including your name, contact details, service address and photos you choose to upload.</p>
          <p className="mt-6">We do not sell your data. We share information only with our service technicians and payment processors, strictly to fulfil your booking.</p>
          <p className="mt-6">You can request deletion of your data at any time by emailing hello@tanksudda.lk.</p>
        </div>
      </Section>
    </>
  ),
});
