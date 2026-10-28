import type { Metadata } from "next";

// Must match public/CNAME: www redirects to the apex, and canonical/OG/
// sitemap URLs should point at the final host, not a redirect.
export const siteConfig = {
  name: "Sik n Stylish",
  shortName: "SiknStylish",
  description:
    "Bespoke fashion house in Accra, Ghana, crafting custom-made evening wear, office wear, bridal, men's wear and beaded luxury pieces for clients in Ghana and abroad.",
  url: "https://siknstylish.com",
  locale: "en_GH",
  address: {
    locality: "Accra",
    country: "Ghana",
    mapsUrl: "https://maps.app.goo.gl/ErLkzhMesaFFseoq7",
  },
  contact: {
    whatsapp: "https://wa.me/233242123525",
    email: "siknstylish2025@gmail.com",
    phone: "+233242123525",
    instagram: "https://www.instagram.com/siknstylish/",
  },
};

// Branded fallback until real photography exists; swap per page later.
export const ogImage = {
  url: "/brand/og-card.jpg",
  width: 1200,
  height: 630,
  alt: "Sik n Stylish",
};

export const baseKeywords = [
  "bespoke fashion in Ghana",
  "custom-made dresses",
  "luxury African fashion",
  "bespoke women's wear",
  "custom men's wear",
  "luxury tailoring in Accra",
];

export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  return {
    title,
    description,
    keywords: [...baseKeywords, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
