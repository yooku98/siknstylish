// Entries marked "placeholder-*" below are PLACEHOLDER content — no real
// client names, quotes or photos exist for them yet. Replace every field
// with real testimonials (with client permission) before this site goes live.
export type Testimonial = {
  id: string;
  quote: string;
  clientName: string;
  occasion: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "anna-custom-dress",
    quote:
      "From start to finish, the experience with Sik n Stylish was amazing. Great customer service, genuine support, and honesty every step of the way — my dress turned out beautifully. I couldn't be happier and I'm already looking forward to wearing it.",
    clientName: "Anna",
    occasion: "Custom Dress",
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
