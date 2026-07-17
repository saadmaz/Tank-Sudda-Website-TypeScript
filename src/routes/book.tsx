import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Home, Building2, Droplets, Calendar, User, Camera } from "lucide-react";
import { WaterBackdrop } from "@/components/site/primitives";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Appointment — Tank Sudda" },
      { name: "description", content: "Book your free water tank inspection in under 2 minutes. Live price estimate as you go." },
      { property: "og:title", content: "Book — Tank Sudda" },
      { property: "og:description", content: "Book your free water tank inspection in under 2 minutes." },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: Book,
});

const STEPS = [
  { key: "type", title: "Property type", icon: Home },
  { key: "location", title: "Location", icon: Building2 },
  { key: "tank", title: "Tank type", icon: Droplets },
  { key: "capacity", title: "Capacity", icon: Droplets },
  { key: "count", title: "Number of tanks", icon: Droplets },
  { key: "date", title: "Preferred date", icon: Calendar },
  { key: "photos", title: "Photos (optional)", icon: Camera },
  { key: "contact", title: "Your details", icon: User },
] as const;

function Book() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<Record<string, string>>({});

  const setField = (k: string, v: string) => setData((d) => ({ ...d, [k]: v }));

  const priceEstimate = () => {
    let base = 6500;
    if (data.type === "commercial") base = 15000;
    if (data.type === "hotel") base = 22000;
    const cap = data.capacity === "5000+" ? 3 : data.capacity === "2000-5000" ? 2 : 1;
    const count = parseInt(data.count || "1", 10) || 1;
    return base * cap * count;
  };

  return (
    <>
      <section className="relative isolate overflow-hidden pt-32 pb-8">
        <WaterBackdrop />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Book appointment</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            Two minutes to <span className="gradient-text">pure water.</span>
          </h1>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          {!done ? (
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-float md:p-10">
              {/* Progress */}
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
                    Step {step + 1} / {STEPS.length}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Est. LKR {priceEstimate().toLocaleString()}
                  </p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-deep to-primary"
                    initial={false}
                    animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <h2 className="font-display text-2xl font-bold md:text-3xl">{STEPS[step].title}</h2>
                  <div className="mt-6">
                    <StepBody stepKey={STEPS[step].key} data={data} setField={setField} />
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
                >
                  <ArrowLeft className="size-4" /> Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:scale-[1.02]"
                  >
                    Continue <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setDone(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.02]"
                  >
                    Confirm booking <Check className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[2rem] border border-border bg-card p-12 text-center shadow-float"
            >
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-success text-white shadow-glow">
                <Check className="size-8" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-extrabold md:text-4xl">Booking received.</h2>
              <p className="mt-3 text-muted-foreground">
                We'll confirm your inspection within one business hour. Your estimated total is{" "}
                <span className="font-semibold text-foreground">LKR {priceEstimate().toLocaleString()}</span>.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

function StepBody({ stepKey, data, setField }: { stepKey: string; data: Record<string, string>; setField: (k: string, v: string) => void }) {
  if (stepKey === "type") {
    return (
      <Options name="type" value={data.type} onChange={(v) => setField("type", v)} options={[
        { v: "residential", label: "Residential" },
        { v: "commercial", label: "Commercial" },
        { v: "apartment", label: "Apartment" },
        { v: "hotel", label: "Hotel / Hospital" },
      ]} />
    );
  }
  if (stepKey === "location") {
    return <Input placeholder="City / Area (e.g. Colombo 5)" value={data.location || ""} onChange={(v) => setField("location", v)} />;
  }
  if (stepKey === "tank") {
    return (
      <Options name="tank" value={data.tank} onChange={(v) => setField("tank", v)} options={[
        { v: "overhead", label: "Overhead tank" },
        { v: "underground", label: "Underground sump" },
        { v: "concrete", label: "Concrete tank" },
        { v: "steel", label: "Steel tank" },
      ]} />
    );
  }
  if (stepKey === "capacity") {
    return (
      <Options name="capacity" value={data.capacity} onChange={(v) => setField("capacity", v)} options={[
        { v: "0-2000", label: "Under 2,000 L" },
        { v: "2000-5000", label: "2,000–5,000 L" },
        { v: "5000+", label: "5,000+ L" },
      ]} />
    );
  }
  if (stepKey === "count") {
    return <Input type="number" placeholder="How many tanks?" value={data.count || ""} onChange={(v) => setField("count", v)} />;
  }
  if (stepKey === "date") {
    return <Input type="date" value={data.date || ""} onChange={(v) => setField("date", v)} />;
  }
  if (stepKey === "photos") {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center">
        <Camera className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Drag & drop tank photos (optional)</p>
      </div>
    );
  }
  if (stepKey === "contact") {
    return (
      <div className="space-y-3">
        <Input placeholder="Full name" value={data.name || ""} onChange={(v) => setField("name", v)} />
        <Input placeholder="Phone" value={data.phone || ""} onChange={(v) => setField("phone", v)} />
        <Input placeholder="Email" value={data.email || ""} onChange={(v) => setField("email", v)} />
      </div>
    );
  }
  return null;
}

function Options({ name, value, onChange, options }: { name: string; value?: string; onChange: (v: string) => void; options: { v: string; label: string }[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-2xl border p-5 text-left transition-all ${
            value === o.v ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-background hover:border-primary/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">{o.label}</span>
            {value === o.v && <Check className="size-4 text-primary" />}
          </div>
        </button>
      ))}
    </div>
  );
}

function Input({ placeholder, value, onChange, type = "text" }: { placeholder?: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-base outline-none transition-colors focus:border-primary"
    />
  );
}
