import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import { testimonials, testimonialGridClasses } from "@/lib/testimonials";

const PREVIEW_COUNT = 3;

export default function TestimonialsPreview() {
  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Testimonials"
          title="Worn With Confidence"
          description="In our clients' own words."
        />
        <div className={testimonialGridClasses(Math.min(testimonials.length, PREVIEW_COUNT))}>
          {testimonials.slice(0, PREVIEW_COUNT).map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
        {testimonials.length > PREVIEW_COUNT && (
          <div className="flex justify-center">
            <Button href="/testimonials" variant="outline">
              Read More Testimonials
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
