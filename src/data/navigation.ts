import type { Route } from "next";

/** Static routes, plus service detail pages (validated against typed routes at use). */
export type NavHref = Route | `/services/${string}`;

export interface NavLink {
  href: NavHref;
  label: string;
}

export const primaryNav: NavLink[] = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerNav: {
  /** Key for the translated group title. */
  key: "services" | "learn" | "company";
  title: string;
  links: NavLink[];
}[] = [
  {
    key: "services",
    title: "Services",
    links: [
      { href: "/services/water-tank-deep-cleaning", label: "Deep cleaning" },
      { href: "/services/sump-cleaning", label: "Sump cleaning" },
      { href: "/services/commercial-tank-cleaning", label: "Commercial cleaning" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    key: "learn",
    title: "Learn",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/areas", label: "Service areas" },
    ],
  },
  {
    key: "company",
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/gallery", label: "Gallery" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/contact", label: "Contact" },
      { href: "/book", label: "Book a cleaning" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];
