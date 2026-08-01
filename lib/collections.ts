export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  startingFrom: string;
  imageFolder: string;
};

export const collections: Collection[] = [
  {
    slug: "bridal",
    name: "Bridal",
    tagline: "Gowns built around your story",
    description:
      "From the first sketch to the final fitting, every bridal gown is designed to fit your body, your venue and your vision — with fabric, beadwork and silhouette chosen together.",
    startingFrom: "Starting from GH₵ 5,000",
    imageFolder: "bridal",
  },
  {
    slug: "luxury-evening",
    name: "Luxury Evening",
    tagline: "Statement pieces for unforgettable nights",
    description:
      "Evening wear designed to hold a room — rich fabrics, considered draping and hand-finished detail for galas, red carpets and milestone celebrations.",
    startingFrom: "Starting from GH₵ 1,500",
    imageFolder: "luxury-evening",
  },
  {
    slug: "corporate-elegance",
    name: "Corporate Elegance",
    tagline: "Power dressing, tailored precisely",
    description:
      "Structured office wear cut to your measurements — sharp, comfortable and unmistakably polished for the boardroom and beyond.",
    startingFrom: "Starting from GH₵ 300",
    imageFolder: "corporate-elegance",
  },
  {
    slug: "mens-collection",
    name: "Men's Collection",
    tagline: "Suits and traditional wear, made to measure",
    description:
      "From tailored suits to custom traditional pieces, every garment is built to your exact frame with a focus on fit, fabric and finishing.",
    startingFrom: "Starting from GH₵ 700",
    imageFolder: "mens-collection",
  },
  {
    slug: "occasion-wear",
    name: "Occasion Wear",
    tagline: "Dressed right for every milestone",
    description:
      "Naming ceremonies, engagements, birthdays and everything in between — pieces designed around the occasion and the woman wearing them.",
    startingFrom: "Starting from GH₵ 200",
    imageFolder: "occasion-wear",
  },
  {
    slug: "beaded-luxury",
    name: "Beaded Luxury",
    tagline: "Hand-beaded detail, close up",
    description:
      "Intricate hand-applied beadwork on bespoke silhouettes — for clients who want their garment to be a piece of craftsmanship as much as clothing.",
    startingFrom: "Starting from GH₵ 500",
    imageFolder: "beaded-luxury",
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
