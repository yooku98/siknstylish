"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import { navGroups } from "@/lib/navigation";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const overlay = (
    <div className="fixed inset-0 z-[100] bg-ivory/90 backdrop-blur-xl overflow-y-auto">
      <button
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center text-2xl text-ink"
      >
        ×
      </button>
      <nav aria-label="Main" className="mx-auto flex max-w-md flex-col gap-10 px-6 pt-20 pb-12">
        {navGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-6">
            <p className="font-serif text-2xl text-ink">{group.label}</p>
            {group.columns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-3">
                <p className="text-gold text-[0.7rem] uppercase tracking-[0.2em]">
                  {column.heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-ink hover:text-gold transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className="font-serif text-2xl text-ink hover:text-gold transition-colors"
        >
          Contact
        </Link>
        <Button href="/book" variant="primary" onClick={() => setOpen(false)}>
          Start Your Custom Order
        </Button>
      </nav>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`block h-px w-6 bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
        />
        <span
          className={`block h-px w-6 bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
        />
      </button>

      {/* `open` only becomes true from a tap, i.e. after hydration, so
          document.body always exists here. */}
      {open && createPortal(overlay, document.body)}
    </div>
  );
}
