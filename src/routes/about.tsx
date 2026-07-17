import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Users, Award, Target } from "lucide-react";
import { Section, Reveal, WaterBackdrop } from "@/components/site/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tank Sudda" },
      { name: "description", content: "The story behind Sri Lanka's most trusted water tank cleaning service." },
      { property: "og:title", content: "About — Tank Sudda" },
      { property: "og:description", content: "The story behind Sri Lanka's most trusted water tank cleaning service." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const values = [
    { icon: ShieldCheck, title: "Health first", desc: "Every decision starts with your family's safety." },
    { icon: Users, title: "Human service", desc: "Uniformed, trained, background-checked technicians." },
    { icon: Award, title: "Clinical rigor", desc: "A protocol built to hospital-grade standards." },
    { icon: Target, title: "Zero shortcuts", desc: "The same 8-step process, every tank, every time." },
  ];
  return (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-20">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">About Tank Sudda</p>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight text-balance md:text-7xl">
            Built to earn <span className="gradient-text">your trust.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Tank Sudda is a technology-first hygiene company. We started because we couldn't
            find a water tank service we'd trust with our own families. So we built one.
          </p>
        </div>
      </section>

      <Section eyebrow="Our values" title={<>What we stand for.</>}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-border bg-card p-7">
                <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary-deep to-primary text-primary-foreground shadow-glow">
                  <v.icon className="size-5" />
                </span>
                <h3 className="font-display text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-surface" center title={<>Ready when you are.</>}>
        <div className="mx-auto flex justify-center">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background hover:scale-[1.02]"
          >
            Book a free inspection <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
