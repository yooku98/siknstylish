import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import ProcessPreview from "@/components/home/ProcessPreview";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Bespoke Fashion in Accra, Ghana",
  description:
    "Sik n Stylish is a bespoke fashion house in Accra, Ghana crafting custom-made dresses, evening wear, bridal, men's wear and beaded luxury pieces for clients in Ghana and abroad.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <ProcessPreview />

      <section className="py-16 sm:py-24 bg-ivory">
        <Container className="flex flex-col gap-8 items-center text-center max-w-2xl mx-auto">
          <SectionHeading
            eyebrow="No Fixed Prices"
            title="Every Piece Is Priced to the Person"
            description="Because every garment is designed and built around you, we don't sell off a price list. Starting prices give you a sense of scale — your exact quotation comes after a consultation."
          />
          <Button href="/book" variant="primary">
            Request a Custom Quotation
          </Button>
        </Container>
      </section>

      <TestimonialsPreview />
    </>
  );
}
