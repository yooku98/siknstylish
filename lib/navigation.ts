import { collections } from "@/lib/collections";

export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export type NavColumn = {
  heading: string;
  links: NavLink[];
};

// The supporting column that sits beside the link columns in a mega menu.
export type NavFeature = {
  eyebrow: string;
  title: string;
  body: string;
  cta: NavLink;
};

export type NavGroup = {
  id: string;
  label: string;
  columns: NavColumn[];
  feature: NavFeature;
};

function collectionLinks(slugs: string[]): NavLink[] {
  return slugs.flatMap((slug) => {
    const c = collections.find((col) => col.slug === slug);
    return c ? [{ href: `/portfolio/${c.slug}`, label: c.name, description: c.startingFrom }] : [];
  });
}

export const navGroups: NavGroup[] = [
  {
    id: "collections",
    label: "Collections",
    columns: [
      {
        heading: "Signature",
        links: collectionLinks(["bridal", "luxury-evening", "beaded-luxury"]),
      },
      {
        heading: "Tailored & occasion",
        links: [
          ...collectionLinks(["corporate-elegance", "occasion-wear", "mens-collection"]),
          {
            href: "/portfolio",
            label: "View the full portfolio",
            description: "Every collection in one place",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Made to measure",
      title: "Begin your bespoke piece",
      body: "Tell us about the occasion and we will design around your body, your venue and your vision.",
      cta: { href: "/book", label: "Start Your Custom Order" },
    },
  },
  {
    id: "atelier",
    label: "The Atelier",
    columns: [
      {
        heading: "About the house",
        links: [
          { href: "/about", label: "About", description: "Who we are and how we work" },
          { href: "/process", label: "Our Process", description: "Consultation to final fitting" },
          { href: "/testimonials", label: "Testimonials", description: "In our clients' words" },
        ],
      },
      {
        heading: "Client care",
        links: [
          { href: "/measurements", label: "Measurements", description: "Guide and fitting options" },
          { href: "/faq", label: "FAQs", description: "Timelines, pricing and delivery" },
          { href: "/portal", label: "Client Login", description: "Orders and saved measurements" },
        ],
      },
    ],
    feature: {
      eyebrow: "Studio · Accra",
      title: "Visit or call the atelier",
      body: "Book a consultation in person at our studio, or meet us on a virtual call from anywhere.",
      cta: { href: "/contact", label: "Contact Us" },
    },
  },
];

// Flat list for the footer and any other place that needs every page once.
export const navLinks: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/process", label: "Our Process" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/measurements", label: "Measurements" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];
