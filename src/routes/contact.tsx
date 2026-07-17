import { createFileRoute } from "@tanstack/react-router";
import { Section, WaterBackdrop, Reveal } from "@/components/site/primitives";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tank Sudda" },
      { name: "description", content: "Get in touch with Tank Sudda. Call, WhatsApp or email for water tank cleaning in Sri Lanka." },
      { property: "og:title", content: "Contact — Tank Sudda" },
      { property: "og:description", content: "Call, WhatsApp or email Tank Sudda for water tank cleaning in Sri Lanka." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const channels = [
    { icon: Phone, title: "Call us", value: "+94 77 123 4567", href: "tel:+94771234567" },
    { icon: MessageCircle, title: "WhatsApp", value: "+94 77 123 4567", href: "https://wa.me/94771234567" },
    { icon: Mail, title: "Email", value: "hello@tanksudda.lk", href: "mailto:hello@tanksudda.lk" },
    { icon: MapPin, title: "Office", value: "Colombo 03, Sri Lanka", href: "#" },
    { icon: Clock, title: "Hours", value: "Mon–Sat · 8am–7pm", href: "#" },
  ];
  return (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-16">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Contact</p>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight md:text-7xl">
            Let's <span className="gradient-text">talk.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            We reply within one business hour, every day of the week.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-8">
              <h3 className="font-display text-2xl font-bold">Send a message</h3>
              <form className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input placeholder="Full name" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                  <input placeholder="Phone" className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                </div>
                <input placeholder="Email" className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                <textarea placeholder="How can we help?" rows={5} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
                <button type="button" className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:scale-[1.02]">
                  Send message
                </button>
              </form>
            </div>
          </Reveal>

          <div className="space-y-3">
            {channels.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <a href={c.href} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft">
                  <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary-deep to-primary text-primary-foreground shadow-glow">
                    <c.icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.title}</p>
                    <p className="font-semibold">{c.value}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
