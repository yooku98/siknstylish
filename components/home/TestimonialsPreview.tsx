import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import { testimonials } from "@/lib/testimonials";

export default function TestimonialsPreview() {
  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Testimonials"
          title="Worn With Confidence"
          description="A few words from clients — real testimonials are added here as they come in."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
        <div className="flex justify-center">
          <Button href="/testimonials" variant="outline">
            Read More Testimonials
          </Button>
        </div>
      </Container>
    </section>
  );
}
