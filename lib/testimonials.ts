// Real client testimonials only, added with the client's permission.
// Layouts adapt to the count (see testimonialGridClasses), so add entries
// here as they come in -- never placeholder text, which renders publicly.
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
];

// One quote reads as a featured pull-quote; more fill a grid.
export function testimonialGridClasses(count: number) {
  if (count <= 1) return "grid grid-cols-1 max-w-2xl mx-auto w-full";
  if (count === 2) return "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto w-full";
  return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
}
