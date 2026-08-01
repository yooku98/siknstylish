import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import MobileNav from "@/components/layout/MobileNav";

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/process", label: "Our Process" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/measurements", label: "Measurements" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur border-b border-ink/10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3 sm:py-4 gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
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

        <nav className="hidden lg:flex items-center gap-5 font-sans text-xs uppercase tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-ink hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-0.5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <Link
            href="/portal"
            className="whitespace-nowrap text-xs uppercase tracking-wide text-ink/60 hover:text-gold transition-colors border-l border-ink/15 pl-4"
          >
            Client Login
          </Link>
          <Button href="/book" variant="primary" className="text-xs px-5 py-2.5">
            Start Your Custom Order
          </Button>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
