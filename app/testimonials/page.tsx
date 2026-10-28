import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import { testimonials, testimonialGridClasses } from "@/lib/testimonials";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Testimonials",
  description:
    "Read what clients say about their bespoke experience with Sik n Stylish.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Clients Say"
          description="Feedback from clients, shared with their permission."
          as="h1"
        />
        <div className={testimonialGridClasses(testimonials.length)}>
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
        <div className="flex justify-center">
          <Button href="/book" variant="primary">
            Start Your Own Story With Us
          </Button>
        </div>
      </Container>
    </section>
  );
}
