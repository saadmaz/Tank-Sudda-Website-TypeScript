import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  ShieldCheck,
  Sparkles,
  Leaf,
  Waves,
  ClipboardCheck,
  BellRing,
  Camera,
  HeartPulse,
  Wrench,
  Home as HomeIcon,
  Building2,
  Hotel,
  Utensils,
  School,
  Hospital,
  Factory,
  Building,
  Landmark,
  Star,
  Check,
  MapPin,
  ChevronRight,
} from "lucide-react";
import {
  Section,
  Reveal,
  Counter,
  Parallax,
  WaterBackdrop,
  Bubbles,
} from "@/components/site/primitives";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tank Sudda — Clean Water Starts Here" },
      {
        name: "description",
        content:
          "Premium water tank cleaning for homes, apartments and businesses across Sri Lanka. 1,500+ tanks cleaned. Book a free health inspection today.",
      },
      { property: "og:title", content: "Tank Sudda — Clean Water Starts Here" },
      {
        property: "og:description",
        content:
          "Clinical-grade water tank cleaning across Sri Lanka. Trusted by 1,500+ families.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Stats />
      <Problem />
      <WhyUs />
      <Process />
      <BeforeAfter />
      <Services />
      <Industries />
      <Coverage />
      <Membership />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}

/* ────────────────────────────── HERO ────────────────────────────── */
function Hero() {
  return (
    <section className="relative isolate flex min-h-[100dvh] items-center overflow-hidden pt-28">
      <WaterBackdrop />
      <Bubbles count={16} />

      <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Sri Lanka's premium hygiene service
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-balance md:text-7xl xl:text-8xl"
          >
            Clean water <span className="gradient-text">starts</span> here.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl"
          >
            Professional water tank cleaning for homes, apartments and businesses. Protect
            your family from bacteria, algae, sludge and contaminated water — with
            clinical-grade sanitisation and a full digital report.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.34 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/book"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-glow transition-transform hover:scale-[1.03] active:scale-95"
            >
              Book free inspection
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background/70 px-5 py-3.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-secondary">
              <span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                <Play className="size-3 fill-current" />
              </span>
              Watch the process
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-9 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-primary-deep/40"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-3.5 fill-primary text-primary" />
                ))}
                <span className="ml-1.5 text-xs font-semibold">4.9 · 300+ reviews</span>
              </div>
              <p className="text-xs text-muted-foreground">Trusted by 1,500+ households</p>
            </div>
          </motion.div>
        </div>

        <HeroVisual />
      </div>

      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="relative mx-auto w-full max-w-lg"
    >
      <Parallax offset={30}>
        <div className="relative aspect-square">
          {/* Ripple rings */}
          <div className="absolute inset-0 grid place-items-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute size-64 rounded-full border border-primary/30"
                style={{ animation: `ripple 3s ease-out ${i}s infinite` }}
              />
            ))}
          </div>

          {/* Tank illustration */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative size-80 rounded-[2.5rem] glass-strong p-6 shadow-float">
              <div className="relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-b from-primary/10 to-primary/30">
                {/* Water waves */}
                <motion.svg
                  className="absolute inset-x-0 bottom-0 w-[200%]"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                >
                  <path
                    d="M0,60 C150,100 300,20 600,60 C900,100 1050,20 1200,60 L1200,120 L0,120 Z"
                    fill="oklch(0.62 0.18 245 / 0.55)"
                  />
                </motion.svg>
                <motion.svg
                  className="absolute inset-x-0 bottom-0 w-[200%]"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                  animate={{ x: ["-25%", "-75%"] }}
                  transition={{ duration: 16, ease: "linear", repeat: Infinity }}
                >
                  <path
                    d="M0,80 C150,40 300,120 600,80 C900,40 1050,120 1200,80 L1200,120 L0,120 Z"
                    fill="oklch(0.32 0.11 260 / 0.7)"
                  />
                </motion.svg>
                {/* Sparkles */}
                <Sparkles className="absolute right-6 top-6 size-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Floating spec cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-16 rounded-2xl glass-strong px-4 py-3 shadow-float"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-success/15 text-success">
                <ShieldCheck className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold">99.9% bacteria</p>
                <p className="text-[10px] text-muted-foreground">Eliminated</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 bottom-20 rounded-2xl glass-strong px-4 py-3 shadow-float"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
                <ClipboardCheck className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold">Digital report</p>
                <p className="text-[10px] text-muted-foreground">After every clean</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-2xl glass-strong px-4 py-3 shadow-float"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-aqua/25 text-primary-deep">
                <Waves className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold">Food-grade</p>
                <p className="text-[10px] text-muted-foreground">Sanitisers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Parallax>
    </motion.div>
  );
}

/* ────────────────────────── TRUST BAR ────────────────────────── */
function TrustBar() {
  const logos = ["Cinnamon", "John Keells", "Prime Residencies", "Havelock City", "Softlogic", "MAS", "Dilmah", "Ceylon Cold Stores"];
  return (
    <section className="border-y border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Trusted by leading brands · Apartments · Hotels · Hospitals · Factories
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex animate-scroll-x gap-16 whitespace-nowrap">
            {[...logos, ...logos].map((l, i) => (
              <span
                key={i}
                className="font-display text-2xl font-bold tracking-tight text-muted-foreground/60"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── STATS ────────────────────────── */
function Stats() {
  const items = [
    { n: 1500, suffix: "+", label: "Tanks cleaned" },
    { n: 99, suffix: "%", label: "Customer satisfaction" },
    { n: 24, suffix: "h", label: "Response time" },
    { n: 100, suffix: "%", label: "Safe cleaning" },
    { n: 20, suffix: "+", label: "Service areas" },
  ];
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.08}>
              <div className="border-l-2 border-primary/30 pl-4">
                <div className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                  <Counter to={it.n} suffix={it.suffix} />
                </div>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {it.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── PROBLEM ────────────────────────── */
function Problem() {
  const risks = [
    { icon: HeartPulse, title: "Bacterial colonies", desc: "E. coli, Legionella and other pathogens breed silently in stagnant tanks." },
    { icon: Waves, title: "Sludge & sediment", desc: "Heavy minerals settle into thick layers that recontaminate every new fill." },
    { icon: Leaf, title: "Algae growth", desc: "Sunlight and warmth grow biofilm that dulls taste and clouds water." },
    { icon: ShieldCheck, title: "Mosquito breeding", desc: "Neglected tanks are a leading source of dengue-carrying mosquitoes." },
  ];
  return (
    <Section
      eyebrow="The invisible problem"
      title={<>Clear water isn't clean water.</>}
      intro="Every tank accumulates sediment, biofilm and bacteria — even when the water looks fine at the tap. If it's been more than six months since your last clean, you're not drinking water. You're drinking history."
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <Reveal>
          <div className="relative aspect-square rounded-[2rem] glass-strong p-8 shadow-float">
            {/* Cross-section illustration */}
            <svg viewBox="0 0 400 400" className="h-full w-full">
              <defs>
                <linearGradient id="waterGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.14 235)" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="oklch(0.42 0.14 250)" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="sludgeGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.42 0.08 60)" />
                  <stop offset="100%" stopColor="oklch(0.28 0.06 50)" />
                </linearGradient>
              </defs>
              {/* Tank body */}
              <rect x="60" y="40" width="280" height="320" rx="24" fill="none" stroke="oklch(0.16 0.03 260 / 0.2)" strokeWidth="3" />
              {/* Water */}
              <rect x="66" y="120" width="268" height="180" fill="url(#waterGrad)" opacity="0.6" />
              {/* Sludge */}
              <path d="M66 300 Q 130 260 200 285 T 334 300 L 334 355 L 66 355 Z" fill="url(#sludgeGrad)" />
              {/* Algae dots */}
              {[[100, 150], [180, 130], [260, 160], [140, 200], [220, 210], [280, 190]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 2 ? 4 : 6} fill="oklch(0.55 0.14 130)" opacity="0.55" />
              ))}
              {/* Labels */}
              <line x1="340" y1="150" x2="380" y2="150" stroke="oklch(0.62 0.18 245)" strokeWidth="1.5" />
              <line x1="340" y1="330" x2="380" y2="330" stroke="oklch(0.6 0.22 25)" strokeWidth="1.5" />
              <text x="384" y="154" className="fill-primary" fontSize="10" fontFamily="var(--font-mono)">ALGAE</text>
              <text x="384" y="334" className="fill-destructive" fontSize="10" fontFamily="var(--font-mono)">SLUDGE</text>
            </svg>
            <div className="absolute left-8 top-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Tank cross-section · Untreated
            </div>
          </div>
        </Reveal>

        <div className="space-y-4">
          {risks.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <r.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{r.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ────────────────────────── WHY US ────────────────────────── */
function WhyUs() {
  const reasons = [
    { icon: ShieldCheck, title: "Professionally trained team", desc: "Certified technicians in uniform, background-checked and safety-trained." },
    { icon: Sparkles, title: "Food-grade sanitisers", desc: "Hospital-approved disinfectants that eliminate 99.9% of pathogens." },
    { icon: Leaf, title: "Eco-friendly methods", desc: "Non-toxic chemistry, minimal water waste, environmentally responsible." },
    { icon: Waves, title: "Complete sludge removal", desc: "Industrial vacuums extract every gram of sediment — not just the surface." },
    { icon: HeartPulse, title: "Health-first protocol", desc: "8-step clinical process designed by hygiene engineers." },
    { icon: ClipboardCheck, title: "Transparent pricing", desc: "Upfront quotes. No hidden fees. Ever." },
    { icon: Camera, title: "Before-after documentation", desc: "Photo and video evidence of every job we complete." },
    { icon: BellRing, title: "Automatic reminders", desc: "We track your schedule and remind you before it matters." },
    { icon: Wrench, title: "Recurring maintenance", desc: "Membership plans that keep your water pure year-round." },
  ];

  return (
    <Section
      eyebrow="Why Tank Sudda"
      title={<>The Sudda standard.</>}
      intro="We built a technology company that happens to clean water tanks. Every detail — from our chemistry to our reporting — is engineered for your family's safety."
      className="bg-surface"
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.05}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-float">
              <div className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <span className="mb-6 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-deep to-primary text-primary-foreground shadow-glow">
                <r.icon className="size-5" strokeWidth={2.2} />
              </span>
              <h3 className="font-display text-xl font-bold tracking-tight">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ────────────────────────── PROCESS ────────────────────────── */
function Process() {
  const steps = [
    { n: "01", title: "Inspection", desc: "20-point tank assessment with camera and bacterial testing." },
    { n: "02", title: "Drain water", desc: "Managed removal of stagnant water and full interior exposure." },
    { n: "03", title: "Sludge removal", desc: "Industrial vacuum extraction of every gram of sediment." },
    { n: "04", title: "Pressure cleaning", desc: "High-bar oscillating jets remove biofilm from every surface." },
    { n: "05", title: "Sanitisation", desc: "Food-grade disinfectants eliminate 99.9% of pathogens." },
    { n: "06", title: "Final inspection", desc: "Post-service testing to verify water quality and clarity." },
    { n: "07", title: "Customer approval", desc: "You sign off after seeing before/after evidence." },
    { n: "08", title: "Digital report", desc: "Complete PDF with photos, video and next-service date." },
  ];
  return (
    <Section
      eyebrow="Our process"
      title={<>Engineered for hygiene.</>}
      intro="Eight surgical steps. Every technician follows the same protocol. Every tank leaves us with photographic proof."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <div className="group relative h-full rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-primary">Step {s.n}</span>
                <span className="size-2 rounded-full bg-primary/40 transition-colors group-hover:bg-primary" />
              </div>
              <h3 className="font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/30 to-transparent" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ────────────────────────── BEFORE / AFTER ────────────────────────── */
function BeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <Section
      eyebrow="Before & after"
      title={<>The difference is undeniable.</>}
      intro="Drag the handle to reveal what six months of neglect looks like — and what our team leaves behind."
      className="bg-surface"
    >
      <Reveal>
        <div
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[2rem] border border-border shadow-float select-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setPos(((e.clientX - rect.left) / rect.width) * 100);
          }}
          onTouchMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setPos(((e.touches[0].clientX - rect.left) / rect.width) * 100);
          }}
        >
          {/* AFTER (clean) - base */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-aqua/20 to-background">
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-primary">After</p>
                <p className="mt-2 font-display text-3xl font-bold md:text-5xl">Crystal clear.</p>
              </div>
            </div>
          </div>
          {/* BEFORE (dirty) - clipped */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-[oklch(0.32_0.08_60)] via-[oklch(0.4_0.09_70)] to-[oklch(0.25_0.05_50)]"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center text-white/90">
                <p className="font-mono text-xs uppercase tracking-widest text-white/70">Before</p>
                <p className="mt-2 font-display text-3xl font-bold md:text-5xl">Contaminated.</p>
              </div>
            </div>
          </div>
          {/* Slider */}
          <div
            className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-glow"
            style={{ left: `${pos}%` }}
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="grid size-12 place-items-center rounded-full bg-white shadow-float">
                <div className="flex gap-0.5">
                  <ChevronRight className="size-3 -rotate-180 text-primary-deep" strokeWidth={3} />
                  <ChevronRight className="size-3 text-primary-deep" strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ────────────────────────── SERVICES ────────────────────────── */
function Services() {
  const items = [
    { icon: HomeIcon, title: "Residential", desc: "Homes, villas and family water storage." },
    { icon: Building2, title: "Apartments", desc: "Multi-unit and management contracts." },
    { icon: Hotel, title: "Hotels", desc: "Guest-facing hygiene, no downtime." },
    { icon: Utensils, title: "Restaurants", desc: "Health-code compliant cleaning." },
    { icon: Hospital, title: "Hospitals", desc: "Clinical-grade sterilisation." },
    { icon: School, title: "Schools", desc: "Safe water for young students." },
    { icon: Factory, title: "Factories", desc: "Industrial-scale tank operations." },
    { icon: Building, title: "Commercial", desc: "Offices, malls, retail centres." },
  ];
  return (
    <Section
      eyebrow="Services"
      title={<>One protocol. Every scale.</>}
      intro="From single-family homes to hospital compounds, we service every tank type with the same clinical rigor."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05}>
            <Link
              to="/services"
              className="group block h-full rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-float"
            >
              <span className="mb-6 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="size-5" />
              </span>
              <h3 className="font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Explore <ArrowRight className="size-3" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ────────────────────────── INDUSTRIES ────────────────────────── */
function Industries() {
  const industries = [
    "Residential",
    "Apartments",
    "Hotels",
    "Hospitals",
    "Restaurants",
    "Factories",
    "Schools",
    "Government",
    "Commercial buildings",
  ];
  return (
    <Section
      eyebrow="Industries"
      title={<>Trusted across sectors.</>}
      className="bg-surface"
    >
      <div className="flex flex-wrap gap-2.5">
        {industries.map((i, idx) => (
          <Reveal key={i} delay={idx * 0.03}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              {i}
            </span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ────────────────────────── COVERAGE ────────────────────────── */
function Coverage() {
  const pins = [
    { name: "Colombo", top: "52%", left: "28%" },
    { name: "Kandy", top: "42%", left: "48%" },
    { name: "Galle", top: "82%", left: "32%" },
    { name: "Negombo", top: "45%", left: "22%" },
    { name: "Jaffna", top: "8%", left: "42%" },
    { name: "Anuradhapura", top: "26%", left: "44%" },
    { name: "Batticaloa", top: "48%", left: "68%" },
    { name: "Matara", top: "88%", left: "38%" },
  ];
  return (
    <Section
      eyebrow="Coverage"
      title={<>Every corner of the island.</>}
      intro="20+ service areas across Sri Lanka. Same-day dispatch in Colombo, Gampaha and Kalutara."
    >
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <Reveal>
          <div className="relative aspect-[3/4] max-h-[560px] rounded-[2rem] glass-strong p-8 shadow-float">
            {/* Simplified Sri Lanka silhouette */}
            <svg viewBox="0 0 300 500" className="h-full w-full">
              <defs>
                <linearGradient id="lkGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.18 245 / 0.15)" />
                  <stop offset="100%" stopColor="oklch(0.32 0.11 260 / 0.25)" />
                </linearGradient>
              </defs>
              <path
                d="M140 20 C 180 25 210 60 220 110 C 235 160 250 210 250 260 C 250 310 240 360 220 400 C 200 445 165 480 130 480 C 95 480 65 450 55 400 C 45 350 55 300 60 250 C 65 200 75 150 90 100 C 105 55 120 25 140 20 Z"
                fill="url(#lkGrad)"
                stroke="oklch(0.62 0.18 245 / 0.4)"
                strokeWidth="1.5"
              />
            </svg>
            {pins.map((p, i) => (
              <div
                key={p.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: p.top, left: p.left }}
              >
                <span className="relative flex">
                  <span
                    className="absolute inline-flex size-4 animate-ping rounded-full bg-primary/50"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                  <span className="relative grid size-4 place-items-center rounded-full bg-primary shadow-glow">
                    <MapPin className="size-2.5 text-primary-foreground" />
                  </span>
                </span>
                <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold shadow-soft">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="space-y-3">
          {pins.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.04}>
              <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Same-day available</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-success">
                  ● Active
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ────────────────────────── MEMBERSHIP ────────────────────────── */
function Membership() {
  const plans = [
    {
      name: "Bi-annual",
      tag: "Homes",
      price: "From LKR 6,500",
      cadence: "/ visit",
      features: ["2 cleanings per year", "Priority scheduling", "Free health inspection", "Digital report"],
      cta: "Select plan",
      featured: false,
    },
    {
      name: "Annual shield",
      tag: "Most popular",
      price: "From LKR 12,000",
      cadence: "/ year",
      features: [
        "Quarterly inspection",
        "2 full cleanings",
        "24h emergency response",
        "Water quality dashboard",
        "15% discount on parts",
      ],
      cta: "Subscribe now",
      featured: true,
    },
    {
      name: "Corporate",
      tag: "Enterprise",
      price: "Custom",
      cadence: "quote",
      features: [
        "Multi-location management",
        "Compliance certification",
        "Dedicated account manager",
        "Scheduled maintenance",
        "Bulk discounts",
      ],
      cta: "Contact sales",
      featured: false,
    },
  ];
  return (
    <Section
      eyebrow="Membership"
      title={<>Maintenance on autopilot.</>}
      intro="Bacteria doesn't take a day off. Subscribe to pure water and forget about it."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <div
              className={`relative h-full overflow-hidden rounded-[2rem] p-8 ${
                p.featured
                  ? "bg-ink text-background shadow-float"
                  : "border border-border bg-card"
              }`}
            >
              {p.featured && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}
              <div className="flex items-center justify-between">
                <p
                  className={`font-mono text-[11px] uppercase tracking-widest ${
                    p.featured ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {p.tag}
                </p>
                {p.featured && (
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Recommended
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-2xl font-extrabold">{p.name}</h3>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold">{p.price}</span>
                <span className={p.featured ? "text-white/60" : "text-muted-foreground"}>
                  {p.cadence}
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`mt-0.5 size-4 shrink-0 ${
                        p.featured ? "text-primary" : "text-success"
                      }`}
                    />
                    <span className={p.featured ? "text-white/85" : "text-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/book"
                className={`mt-10 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95 ${
                  p.featured
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-secondary"
                }`}
              >
                {p.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ────────────────────────── TESTIMONIALS ────────────────────────── */
function Testimonials() {
  const reviews = [
    { name: "Nimali P.", role: "Homeowner, Colombo 5", text: "Utterly professional. The report they left made me realise how bad our tank was. My whole family drinks tap water with confidence now." },
    { name: "Ravi S.", role: "Property manager, Rajagiriya", text: "We manage 6 apartment blocks. Tank Sudda handles all of them. Never a complaint from residents." },
    { name: "Dr. Amila K.", role: "Clinic owner, Kandy", text: "Their sanitisation protocol is genuinely clinical. I trust them with our patients' safety." },
    { name: "Ishara M.", role: "Restaurant owner, Galle", text: "Health inspections became a non-event. They give us the paperwork the inspectors want to see." },
    { name: "Priya D.", role: "Homeowner, Nugegoda", text: "Booked online in 2 minutes. Team arrived on time, in uniform, worked quietly. This is what service should feel like." },
    { name: "Sanjay F.", role: "Hotel GM, Bentota", text: "Guest reviews mentioning water quality have completely stopped. Best invested LKR ever spent." },
  ];
  return (
    <Section
      eyebrow="Testimonials"
      title={<>Loved across the island.</>}
      className="bg-surface"
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.06}>
            <div className="h-full rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-soft">
              <div className="mb-4 flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="size-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground">"{r.text}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className="size-9 rounded-full bg-gradient-to-br from-primary/40 to-primary-deep/40" />
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ────────────────────────── FAQ ────────────────────────── */
function FAQ() {
  const items = [
    { q: "How often should I clean my water tank?", a: "Every six months. Sediment and biofilm accumulate faster than most people realise, especially in Sri Lanka's climate." },
    { q: "How long does a cleaning take?", a: "Most residential tanks are completed in 2–3 hours. Larger commercial tanks take 4–6 hours depending on capacity and condition." },
    { q: "Do I need to be home?", a: "Not required. We can coordinate through your caretaker or building management, and send you the digital report when done." },
    { q: "Is your sanitiser safe for drinking water?", a: "Yes. We use food-grade, hospital-approved disinfectants that leave no residue and are safe for immediate use." },
    { q: "How much does a cleaning cost?", a: "Residential tanks start at LKR 6,500. Commercial and industrial pricing depends on tank capacity and access — get a free quote in 2 minutes." },
    { q: "Do you work in my area?", a: "We cover 20+ areas across Sri Lanka including Colombo, Kandy, Galle, Negombo, Jaffna and Batticaloa. Same-day dispatch in the Western Province." },
    { q: "What if I have an emergency?", a: "Annual members get 24h emergency response. Others can call our hotline — we prioritise emergency contamination events." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section eyebrow="FAQ" title={<>Answers, upfront.</>}>
      <div className="mx-auto max-w-3xl divide-y divide-border rounded-3xl border border-border bg-card">
        {items.map((it, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-secondary/50"
            >
              <span className="font-display text-base font-semibold md:text-lg">{it.q}</span>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full border border-border transition-transform ${
                  open === i ? "rotate-45 bg-primary text-primary-foreground" : ""
                }`}
              >
                +
              </span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ────────────────────────── FINAL CTA ────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-deep via-primary-deep to-primary p-12 text-primary-foreground shadow-float md:p-20">
            <div className="absolute -right-40 -top-40 size-[500px] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-aqua/20 blur-3xl" />
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary-foreground/70">
                Free health inspection · No obligation
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance md:text-6xl">
                Ready for a healthier home?
              </h2>
              <p className="mt-6 max-w-xl text-lg text-primary-foreground/80">
                Join 1,500+ Sri Lankan households who trust Tank Sudda for clinical-grade water
                purity. Booking takes under two minutes.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-4 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03] active:scale-95"
                >
                  Book free inspection
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-transparent px-7 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                >
                  Talk to a specialist
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
