"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import MobileNav from "@/components/layout/MobileNav";
import { navGroups, type NavGroup } from "@/lib/navigation";

const SCROLL_THRESHOLD = 8;
const CLOSE_DELAY_MS = 150;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function useScrolled() {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > SCROLL_THRESHOLD,
    () => false,
  );
}

function isGroupActive(group: NavGroup, pathname: string) {
  return group.columns.some((col) =>
    col.links.some((link) => pathname === link.href || pathname.startsWith(`${link.href}/`)),
  );
}

export default function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  // `shownId` outlives `openId` so the panel keeps its content while fading out.
  const [openId, setOpenId] = useState<string | null>(null);
  const [shownId, setShownId] = useState<string>(navGroups[0].id);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // A mouse click after hover-open should not immediately close the panel.
  const lastPointerType = useRef<string>("");

  const shownGroup = navGroups.find((g) => g.id === shownId) ?? navGroups[0];
  const isOpen = openId !== null;
  const elevated = scrolled || isOpen;

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function open(id: string) {
    cancelClose();
    setOpenId(id);
    setShownId(id);
  }

  function close() {
    cancelClose();
    setOpenId(null);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY_MS);
  }

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const trigger = openId ? triggerRefs.current[openId] : null;
      setOpenId(null);
      trigger?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, openId]);

  useEffect(() => cancelClose, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className="relative mx-auto max-w-7xl"
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") scheduleClose();
        }}
        onPointerEnter={cancelClose}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
        }}
      >
        <div
          className={`flex items-center justify-between gap-6 border px-4 py-2.5 sm:px-6 sm:py-3 transition-[background-color,border-color,box-shadow] duration-300 ${
            elevated
              ? "bg-ivory/70 backdrop-blur-xl backdrop-saturate-150 border-ink/10 shadow-[0_10px_30px_-12px_rgba(10,10,10,0.25)]"
              : "bg-ivory border-transparent"
          }`}
        >
          <Link href="/" className="flex items-center gap-3 shrink-0" onClick={close}>
            <Image
              src="/brand/logo-mark.png"
              alt="Sik n Stylish"
              width={44}
              height={44}
              className="h-10 w-10"
              priority
            />
            <span className="font-serif text-lg text-ink hidden sm:block">
              Sik n Stylish
            </span>
          </Link>

          <nav
            aria-label="Main"
            className="hidden lg:flex items-center gap-7 font-sans text-xs uppercase tracking-wide"
          >
            {navGroups.map((group) => {
              const expanded = openId === group.id;
              const active = isGroupActive(group, pathname);
              return (
                <button
                  key={group.id}
                  ref={(el) => {
                    triggerRefs.current[group.id] = el;
                  }}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls="mega-menu"
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") open(group.id);
                  }}
                  onPointerDown={(e) => {
                    lastPointerType.current = e.pointerType;
                  }}
                  onClick={(e) => {
                    const fromMouse = e.detail > 0 && lastPointerType.current === "mouse";
                    if (expanded && !fromMouse) close();
                    else open(group.id);
                  }}
                  className={`flex items-center gap-1.5 whitespace-nowrap uppercase tracking-wide border-b pb-0.5 transition-colors ${
                    expanded || active
                      ? "text-gold border-gold"
                      : "text-ink border-transparent hover:text-gold"
                  }`}
                >
                  {group.label}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 6"
                    className={`h-1.5 w-2.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  >
                    <path d="M1 1l4 4 4-4" />
                  </svg>
                </button>
              );
            })}
            <Link
              href="/contact"
              onClick={close}
              className={`whitespace-nowrap border-b pb-0.5 transition-colors ${
                pathname === "/contact"
                  ? "text-gold border-gold"
                  : "text-ink border-transparent hover:text-gold hover:border-gold"
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <Link
              href="/portal"
              onClick={close}
              className="whitespace-nowrap text-xs uppercase tracking-wide text-ink/60 hover:text-gold transition-colors border-l border-ink/15 pl-4"
            >
              Client Login
            </Link>
            <Button href="/book" variant="primary" className="text-xs px-5 py-2.5" onClick={close}>
              Start Your Custom Order
            </Button>
          </div>

          <MobileNav />
        </div>

        {/*
          Sibling of the bar, not a child: an ancestor with backdrop-filter
          becomes the backdrop root, so a nested panel would only blur the bar.
        */}
        <div
          id="mega-menu"
          role="region"
          aria-label={`${shownGroup.label} menu`}
          className={`absolute inset-x-0 top-full hidden lg:block pt-2 transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
            isOpen
              ? "visible opacity-100 translate-y-0"
              : "invisible opacity-0 -translate-y-1 pointer-events-none"
          }`}
        >
          <div className="grid grid-cols-[1fr_1fr_minmax(0,22rem)] border border-ink/10 bg-ivory/85 backdrop-blur-xl backdrop-saturate-150 shadow-[0_24px_60px_-20px_rgba(10,10,10,0.3)]">
            {shownGroup.columns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-5 p-8">
                <p className="text-gold text-[0.7rem] uppercase tracking-[0.2em]">
                  {column.heading}
                </p>
                <ul className="flex flex-col gap-4">
                  {column.links.map((link) => {
                    const current = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={close}
                          aria-current={current ? "page" : undefined}
                          className="group flex flex-col gap-0.5"
                        >
                          <span
                            className={`font-serif text-lg transition-colors group-hover:text-gold ${
                              current ? "text-gold" : "text-ink"
                            }`}
                          >
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="text-ink/55 text-xs">{link.description}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <aside className="flex flex-col justify-between gap-6 bg-ink p-8 text-ivory">
              <div className="flex flex-col gap-3">
                <p className="text-gold text-[0.7rem] uppercase tracking-[0.2em]">
                  {shownGroup.feature.eyebrow}
                </p>
                <p className="font-serif text-2xl leading-snug">{shownGroup.feature.title}</p>
                <p className="text-ivory/70 text-sm leading-relaxed">{shownGroup.feature.body}</p>
              </div>
              <Button
                href={shownGroup.feature.cta.href}
                variant="onDark"
                className="self-start text-xs px-5 py-2.5"
                onClick={close}
              >
                {shownGroup.feature.cta.label}
              </Button>
            </aside>
          </div>
        </div>
      </div>
    </header>
  );
}
