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

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: [
      { href: "/services/water-tank-deep-cleaning", label: "Deep cleaning" },
      { href: "/services/sump-cleaning", label: "Sump cleaning" },
      { href: "/services/commercial-tank-cleaning", label: "Commercial cleaning" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
      { href: "/areas", label: "Service areas" },
    ],
  },
  {
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
