import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Section, Reveal, WaterBackdrop } from "@/components/site/primitives";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Tank Sudda" },
      { name: "description", content: "Transparent pricing for water tank cleaning. Bi-annual, annual and corporate plans across Sri Lanka." },
      { property: "og:title", content: "Pricing — Tank Sudda" },
      { property: "og:description", content: "Transparent pricing for water tank cleaning across Sri Lanka." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

function Pricing() {
  const plans = [
    { name: "Single clean", tag: "One-time", price: "LKR 6,500", cadence: "starting from", features: ["Complete 8-step protocol", "Digital before/after report", "Water quality testing", "No membership required"], cta: "Book once", featured: false },
    { name: "Annual shield", tag: "Most popular", price: "LKR 12,000", cadence: "per year", features: ["2 full cleanings", "Quarterly inspection", "24h emergency response", "Water quality dashboard", "15% discount on parts", "Priority scheduling"], cta: "Subscribe now", featured: true },
    { name: "Corporate", tag: "Enterprise", price: "Custom", cadence: "quote", features: ["Multi-location management", "Compliance certification", "Dedicated account manager", "Scheduled maintenance", "Bulk discounts", "Digital reporting API"], cta: "Contact sales", featured: false },
  ];
  return (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-16">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Pricing</p>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight md:text-7xl">
            Fair. Upfront. <span className="gradient-text">Forever.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            No hidden fees. No surprise charges. See exactly what you'll pay before we start.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className={`relative h-full overflow-hidden rounded-[2rem] p-8 ${p.featured ? "bg-ink text-background shadow-float" : "border border-border bg-card"}`}>
                <div className="flex items-center justify-between">
                  <p className={`font-mono text-[11px] uppercase tracking-widest ${p.featured ? "text-primary" : "text-muted-foreground"}`}>{p.tag}</p>
                  {p.featured && <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Recommended</span>}
                </div>
                <h3 className="mt-3 font-display text-2xl font-extrabold">{p.name}</h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold">{p.price}</span>
                  <span className={p.featured ? "text-white/60" : "text-muted-foreground"}>{p.cadence}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`mt-0.5 size-4 shrink-0 ${p.featured ? "text-primary" : "text-success"}`} />
                      <span className={p.featured ? "text-white/85" : "text-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/book" className={`mt-10 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold ${p.featured ? "bg-primary text-primary-foreground" : "border border-border bg-background text-foreground hover:bg-secondary"}`}>
                  {p.cta} <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
