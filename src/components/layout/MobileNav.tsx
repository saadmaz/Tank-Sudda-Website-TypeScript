"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRef } from "react";
import type { NavLink } from "@/data/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { NavLinks } from "./NavLinks";

/**
 * Mobile navigation in a native modal <dialog>: focus is trapped while open,
 * Escape closes it, and focus returns to the menu button afterwards.
 */
export function MobileNav({ links }: { links: NavLink[] }) {
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
        className="m-0 ml-auto h-dvh max-h-none w-[min(22rem,100vw)] max-w-none bg-white p-0 shadow-raised backdrop:bg-navy-950/50 lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="font-display text-base font-semibold text-navy-950">Menu</span>
            <button
              type="button"
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-md text-navy-950 hover:bg-grey-100"
            >
              <X aria-hidden="true" className="size-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
            <NavLinks
              links={[{ href: "/", label: "Home" }, ...links, { href: "/faq", label: "FAQ" }]}
              onNavigate={close}
              className="space-y-1"
              linkClassName="flex min-h-12 items-center rounded-md px-3 text-base font-medium text-navy-950 hover:bg-grey-50"
            />
          </nav>
          <div className="border-t border-line p-4">
            <Link href="/book" onClick={close} className={buttonClasses("primary", "lg", "w-full")}>
              Book a cleaning
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
