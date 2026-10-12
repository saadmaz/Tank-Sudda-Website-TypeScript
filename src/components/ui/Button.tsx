import Link from "next/link";
import type { Route } from "next";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  "primary" | "secondary" | "ghost" | "onDark" | "onDarkOutline" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:size-[1.1em] [&_svg]:shrink-0";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-water-600 text-white hover:bg-water-700 active:bg-water-800",
  secondary: "border border-grey-300 bg-white text-navy-950 hover:border-navy-950 hover:bg-grey-50",
  ghost: "text-water-700 hover:bg-water-50 hover:text-navy-950",
  onDark: "bg-white text-navy-950 hover:bg-water-50",
  onDarkOutline: "border border-white/35 text-white hover:border-white hover:bg-white/10",
  // Official WhatsApp green; dark text keeps WCAG AA contrast (white on #25D366 fails).
  whatsapp: "bg-whatsapp text-navy-950 hover:bg-whatsapp-hover",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-sm",
  md: "min-h-11 px-5 text-[0.9375rem]",
  lg: "min-h-12 px-6 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button"> & StyleProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: StyleProps & { href: Route; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}

/** For tel:, mailto: and external links (opened in a new tab when external). */
export function ButtonAnchor({
  href,
  variant,
  size,
  className,
  children,
  external = false,
  ...rest
}: StyleProps &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string; external?: boolean }) {
  return (
    <a
      href={href}
      className={buttonClasses(variant, size, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
