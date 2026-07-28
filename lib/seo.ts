import type { Metadata } from "next";

// PLACEHOLDER contact details — replace with real values before launch.
export const siteConfig = {
  name: "Sik n Stylish",
  shortName: "SiknStylish",
  description:
    "Bespoke fashion house in Accra, Ghana, crafting custom-made evening wear, office wear, bridal, men's wear and beaded luxury pieces for clients in Ghana and abroad.",
  url: "https://www.siknstylish.com",
  locale: "en_GH",
  address: {
    locality: "Accra",
    country: "Ghana",
  },
  contact: {
    whatsapp: "https://wa.me/233000000000",
    email: "hello@siknstylish.com",
    phone: "+233000000000",
    instagram: "https://instagram.com/siknstylish",
  },
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
