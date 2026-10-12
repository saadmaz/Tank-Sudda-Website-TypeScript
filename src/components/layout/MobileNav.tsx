"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useRef } from "react";
import type { NavLink } from "@/data/navigation";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { buttonClasses } from "@/components/ui/Button";
import { NavLinks } from "./NavLinks";
import { Logo } from "./Logo";

/**
 * Mobile navigation in a native modal <dialog>: focus is trapped while open,
 * Escape closes it, and focus returns to the menu button afterwards.
 */
export function MobileNav({
  links,
  phoneHref,
  whatsappHref,
}: {
  links: NavLink[];
  phoneHref: string | null;
  whatsappHref: string | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-controls="mobile-nav"
        className="inline-flex size-11 items-center justify-center rounded-md text-navy-950 hover:bg-grey-100 lg:hidden"
      >
        <Menu aria-hidden="true" className="size-6" />
        <span className="sr-only">Open menu</span>
      </button>
      <dialog
        id="mobile-nav"
        ref={dialogRef}
        aria-label="Site menu"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="m-0 ml-auto h-dvh max-h-none w-[min(24rem,100vw)] max-w-none bg-white p-0 shadow-raised backdrop:bg-navy-950/60 lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <Logo />
            <button
              type="button"
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-md text-navy-950 hover:bg-grey-100"
            >
              <X aria-hidden="true" className="size-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
            <NavLinks
              links={[{ href: "/", label: "Home" }, ...links, { href: "/faq", label: "FAQ" }]}
              onNavigate={close}
              className="divide-y divide-line"
              linkClassName="flex min-h-14 items-center px-3 font-display text-lg font-semibold text-navy-950 hover:text-water-700"
            />
          </nav>
          <div className="space-y-3 border-t border-line bg-mist p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link href="/book" onClick={close} className={buttonClasses("primary", "lg", "w-full")}>
              Book a cleaning
            </Link>
            {phoneHref || whatsappHref ? (
              <div className="grid grid-cols-2 gap-3">
                {phoneHref ? (
                  <a href={phoneHref} className={buttonClasses("secondary", "md", "w-full")}>
                    <Phone aria-hidden="true" />
                    Call
                  </a>
                ) : null}
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses("whatsapp", "md", "w-full")}
                  >
                    <WhatsAppIcon className="text-current" />
                    WhatsApp
                    <span className="sr-only"> (opens WhatsApp)</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
