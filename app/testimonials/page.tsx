import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import { testimonials } from "@/lib/testimonials";
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
          description="Real feedback from clients, added as it comes in — with their permission."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
