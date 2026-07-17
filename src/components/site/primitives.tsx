import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* Section shell with reveal */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  center = false,
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        {(eyebrow || title || intro) && (
          <div className={`mb-14 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
            {eyebrow && (
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-primary">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-4xl font-extrabold tracking-tight text-balance md:text-6xl">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
                {intro}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* Reveal-on-scroll fade + rise */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Animated counter */
export function Counter({
  to,
  suffix = "",
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* Parallax wrapper (subtle) */
export function Parallax({
  children,
  offset = 60,
  className = "",
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* Animated water blob background */
export function WaterBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 left-[10%] size-[520px] rounded-full bg-primary/12 blur-[120px] animate-float-slow" />
      <div
        className="absolute top-40 right-[5%] size-[420px] rounded-full bg-aqua/25 blur-[120px] animate-float-slow"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="absolute bottom-0 left-[35%] size-[380px] rounded-full bg-primary-deep/10 blur-[110px] animate-float-slow"
        style={{ animationDelay: "-8s" }}
      />
      <div className="absolute inset-0 grid-fade" />
    </div>
  );
}

/* Floating bubble particles */
export function Bubbles({ count = 14 }: { count?: number }) {
  const bubbles = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {bubbles.map((i) => {
        const size = 8 + Math.random() * 22;
        const left = Math.random() * 100;
        const delay = Math.random() * -20;
        const dur = 14 + Math.random() * 12;
        return (
          <span
            key={i}
            className="absolute bottom-0 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              animation: `bubble-rise ${dur}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
