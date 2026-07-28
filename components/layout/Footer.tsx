import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/lib/seo";
import { navLinks } from "@/components/layout/Header";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory">
      <Container className="py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo-mark.png"
              alt="Sik n Stylish"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <span className="font-serif text-xl text-ivory">Sik n Stylish</span>
          </div>
          <p className="text-ivory/70 text-sm leading-relaxed max-w-xs">
            Bespoke fashion, designed and crafted in Accra — for clients in
            Ghana and abroad.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-gold text-xs uppercase tracking-[0.2em]">
            Explore
          </span>
          <nav className="flex flex-col gap-2 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ivory/80 hover:text-gold transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-gold text-xs uppercase tracking-[0.2em]">
            Get in Touch
          </span>
          <div className="flex flex-col gap-2 text-sm text-ivory/80">
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors w-fit"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-gold transition-colors w-fit"
            >
              {siteConfig.contact.email}
            </a>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="hover:text-gold transition-colors w-fit"
            >
              {siteConfig.contact.phone}
            </a>
            <a
              href={siteConfig.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors w-fit"
            >
              Instagram
            </a>
            <span className="text-ivory/50">
              {siteConfig.address.locality}, {siteConfig.address.country}
            </span>
          </div>
        </div>
      </Container>

      <div className="border-t border-ivory/10">
        <Container className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ivory/50">
          <span>
            © {year} {siteConfig.name}. All rights reserved.
          </span>
          <span>Bespoke fashion in Ghana</span>
        </Container>
      </div>
    </footer>
  );
}
