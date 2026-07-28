import type { Testimonial } from "@/lib/testimonials";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex flex-col gap-5 border border-ink/10 bg-ivory p-8 h-full">
      <span className="font-serif text-5xl text-gold leading-none">“</span>
      <blockquote className="text-ink/80 text-base leading-relaxed flex-1">
        {testimonial.quote}
      </blockquote>
      <figcaption className="text-sm">
        <span className="text-ink font-medium">{testimonial.clientName}</span>
        <span className="text-ink/50"> — {testimonial.occasion}</span>
      </figcaption>
    </figure>
  );
}
