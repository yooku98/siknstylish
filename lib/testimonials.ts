// All entries below are PLACEHOLDER content — no real client names, quotes or
// photos exist yet. Replace every field with real testimonials (with client
// permission) before this site goes live. Structure is real; words are not.
export type Testimonial = {
  id: string;
  quote: string;
  clientName: string;
  occasion: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "placeholder-1",
    quote:
      "[PLACEHOLDER TESTIMONIAL — replace with a real client quote about their experience and the finished piece.]",
    clientName: "[Client name]",
    occasion: "[Occasion — e.g. Wedding, Gala]",
  },
  {
    id: "placeholder-2",
    quote:
      "[PLACEHOLDER TESTIMONIAL — replace with a real client quote about the process, fit, or craftsmanship.]",
    clientName: "[Client name]",
    occasion: "[Occasion]",
  },
  {
    id: "placeholder-3",
    quote:
      "[PLACEHOLDER TESTIMONIAL — replace with a real client quote, ideally paired with a permissioned photo.]",
    clientName: "[Client name]",
    occasion: "[Occasion]",
  },
];
