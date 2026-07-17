import { useEffect, useState } from "react";
import { Phone, MessageCircle, ArrowUp } from "lucide-react";

export function FloatingActions() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const on = () => setVisible(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {visible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid size-11 place-items-center rounded-full glass-strong text-foreground shadow-soft transition-transform hover:-translate-y-0.5"
          aria-label="Back to top"
        >
          <ArrowUp className="size-4" />
        </button>
      )}
      <a
        href="tel:+94771234567"
        className="grid size-12 place-items-center rounded-full bg-primary-deep text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
        aria-label="Call Tank Sudda"
      >
        <Phone className="size-5" />
      </a>
      <a
        href="https://wa.me/94771234567"
        target="_blank"
        rel="noopener noreferrer"
        className="grid size-12 place-items-center rounded-full bg-success text-white shadow-[0_20px_60px_-20px_oklch(0.7_0.17_155_/_0.6)] transition-transform hover:-translate-y-0.5"
        aria-label="WhatsApp Tank Sudda"
      >
        <MessageCircle className="size-5" />
      </a>
    </div>
  );
}
