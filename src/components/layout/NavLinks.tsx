"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function isActivePath(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  // A home page ("/", "/si", "/ta") is only active on itself.
  const isHome = href === "/" || /^\/[a-z]{2}$/.test(href);
  return !isHome && pathname.startsWith(`${href}/`);
}

export function NavLinks({
  links,
  className,
  linkClassName,
  onNavigate,
}: {
  links: NavLink[];
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(linkClassName, active && "text-water-700")}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
