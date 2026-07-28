import { siteConfig } from "@/lib/seo";

const items = [
  { label: "WhatsApp", value: "Chat with us", href: siteConfig.contact.whatsapp, external: true },
  { label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { label: "Phone", value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone}` },
  { label: "Instagram", value: "@siknstylish", href: siteConfig.contact.instagram, external: true },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className="flex flex-col gap-1 border-b border-ink/10 pb-4 hover:border-gold transition-colors"
        >
          <span className="text-gold text-xs uppercase tracking-[0.2em]">
            {item.label}
          </span>
          <span className="text-ink text-lg">{item.value}</span>
        </a>
      ))}
      <p className="text-ink/60 text-sm">
        Studio based in {siteConfig.address.locality}, {siteConfig.address.country}.
      </p>
    </div>
  );
}
