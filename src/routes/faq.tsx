import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Section, WaterBackdrop } from "@/components/site/primitives";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Tank Sudda" },
      { name: "description", content: "Answers to common questions about water tank cleaning, pricing and safety." },
      { property: "og:title", content: "FAQ — Tank Sudda" },
      { property: "og:description", content: "Answers to common questions about water tank cleaning." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }),
    }],
  }),
  component: FAQPage,
});

const FAQ_ITEMS = [
  { q: "How often should I clean my water tank?", a: "Every six months. Sediment and biofilm accumulate faster than most people realise, especially in Sri Lanka's climate." },
  { q: "How long does a cleaning take?", a: "Residential tanks: 2–3 hours. Commercial: 4–6 hours depending on capacity." },
  { q: "Do I need to be home?", a: "Not required. We coordinate via caretaker or building management and send the digital report when done." },
  { q: "Is your sanitiser safe for drinking water?", a: "Yes. Food-grade, hospital-approved disinfectants that leave no residue." },
  { q: "How much does a cleaning cost?", a: "Residential from LKR 6,500. Commercial pricing depends on capacity — get a free quote in 2 minutes." },
  { q: "Do you work in my area?", a: "20+ areas including Colombo, Kandy, Galle, Negombo, Jaffna and Batticaloa. Same-day dispatch in Western Province." },
  { q: "What about emergencies?", a: "Annual members get 24h emergency response. Non-members can call our hotline for priority handling." },
  { q: "Do you clean underground sumps?", a: "Yes. Sumps require specialised safety equipment which our teams carry as standard." },
  { q: "What chemicals do you use?", a: "NSF-approved food-grade disinfectants. Full ingredient list available on request." },
  { q: "Do you provide a warranty?", a: "Every clean includes a 30-day quality guarantee. If you spot any issue, we return free of charge." },
  { q: "Can you clean while the tank is full?", a: "No. Full drainage is a required step in our clinical protocol to fully expose interior surfaces." },
  { q: "Do you serve apartments and property managers?", a: "Yes. We hold long-term maintenance contracts with 40+ apartment complexes across Colombo." },
];

function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-16">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">FAQ</p>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight md:text-7xl">
            Answers, <span className="gradient-text">upfront.</span>
          </h1>
        </div>
      </section>
      <Section>
        <div className="mx-auto max-w-3xl divide-y divide-border rounded-3xl border border-border bg-card">
          {FAQ_ITEMS.map((it, i) => (
            <div key={i}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-6 text-left hover:bg-secondary/50">
                <span className="font-display text-base font-semibold md:text-lg">{it.q}</span>
                <span className={`grid size-8 shrink-0 place-items-center rounded-full border border-border transition-transform ${open === i ? "rotate-45 bg-primary text-primary-foreground" : ""}`}>+</span>
              </button>
              <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
