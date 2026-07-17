import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home as HomeIcon,
  Building2,
  Hotel,
  Utensils,
  School,
  Hospital,
  Factory,
  Building,
  ArrowRight,
  Droplets,
  Wrench,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Section, Reveal, WaterBackdrop } from "@/components/site/primitives";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Tank Sudda" },
      { name: "description", content: "Residential, commercial, industrial water tank cleaning across Sri Lanka. Same protocol, every scale." },
      { property: "og:title", content: "Services — Tank Sudda" },
      { property: "og:description", content: "Water tank cleaning for every scale — from homes to hospitals." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  const primary = [
    { icon: HomeIcon, title: "Residential", desc: "Single-family homes, villas, family compounds." },
    { icon: Building2, title: "Apartments", desc: "Single-block and multi-property management contracts." },
    { icon: Hotel, title: "Hotels", desc: "Guest-facing hygiene delivered with zero downtime." },
    { icon: Utensils, title: "Restaurants", desc: "Cleanings that pass health inspections, on time." },
    { icon: Hospital, title: "Hospitals", desc: "Clinical-grade sterilisation for patient areas." },
    { icon: School, title: "Schools", desc: "Safe drinking water for children and staff." },
    { icon: Factory, title: "Factories", desc: "Industrial-scale tanks, sumps and reservoirs." },
    { icon: Building, title: "Commercial", desc: "Offices, malls, retail centres and complexes." },
  ];
  const specialty = [
    { icon: Droplets, title: "Sump cleaning", desc: "Underground water reservoir specialised cleaning." },
    { icon: ShieldCheck, title: "Tank inspection", desc: "20-point audit with camera and lab testing." },
    { icon: Wrench, title: "Preventive maintenance", desc: "Scheduled service plans with reminders." },
    { icon: Zap, title: "Emergency cleaning", desc: "24h response for contamination events." },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-20">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Services</p>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight text-balance md:text-7xl">
            One protocol. <span className="gradient-text">Every scale.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            From single-family homes to hospital compounds, every tank is treated with the same
            8-step clinical process.
          </p>
        </div>
      </section>

      <Section eyebrow="Core services" title={<>Where we work.</>}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {primary.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <Link
                to="/book"
                className="group block h-full rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-float"
              >
                <span className="mb-6 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.icon className="size-5" />
                </span>
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Book <ArrowRight className="size-3" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Specialty" title={<>Beyond cleaning.</>} className="bg-surface">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {specialty.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-border bg-card p-6">
                <span className="mb-6 grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary-deep to-primary text-primary-foreground shadow-glow">
                  <s.icon className="size-5" />
                </span>
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
