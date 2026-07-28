"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import { navLinks } from "@/components/layout/Header";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const overlay = (
    <div className="fixed inset-0 z-[100] bg-ivory flex flex-col items-center justify-center gap-8 px-6 overflow-y-auto">
      <button
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center text-2xl text-ink"
      >
        ×
      </button>
      <nav className="flex flex-col items-center gap-6 font-sans text-lg uppercase tracking-wide">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-ink hover:text-gold transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/portal"
          onClick={() => setOpen(false)}
          className="text-ink/60 text-sm hover:text-gold transition-colors"
        >
          Client Login
        </Link>
      </nav>
      <Button href="/book" variant="primary" onClick={() => setOpen(false)}>
        Book a Consultation
      </Button>
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

      {open && mounted && createPortal(overlay, document.body)}
    </div>
  );
}
