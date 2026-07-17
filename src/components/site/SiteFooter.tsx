import { Link } from "@tanstack/react-router";
import { Droplets, Instagram, Facebook, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary-deep to-primary text-primary-foreground">
                <Droplets className="size-4.5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">
                Tank<span className="text-primary">Sudda</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The gold standard in water tank cleaning and hygiene restoration across Sri Lanka.
              Trusted by families, apartments, hotels and hospitals.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="social"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Services"
            links={[
              ["/services", "Residential"],
              ["/services", "Commercial"],
              ["/services", "Apartments"],
              ["/services", "Hotels & Hospitals"],
              ["/pricing", "Maintenance plans"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["/about", "About"],
              ["/gallery", "Before & After"],
              ["/knowledge", "Knowledge centre"],
              ["/faq", "FAQs"],
              ["/contact", "Contact"],
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              ["/privacy", "Privacy"],
              ["/terms", "Terms"],
              ["/contact", "Coverage areas"],
              ["/book", "Book now"],
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} Tank Sudda Hygiene · Colombo, Sri Lanka
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Clean water · Healthy families
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-5 font-mono text-xs uppercase tracking-widest text-foreground">{title}</h4>
      <ul className="space-y-3">
        {links.map(([to, label], i) => (
          <li key={i}>
            <Link
              to={to}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
