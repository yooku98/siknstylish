import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description:
    "Explore our bespoke collections — Bridal, Luxury Evening, Corporate Elegance, Men's Collection, Occasion Wear and Beaded Luxury.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Portfolio"
          title="Our Collections"
          description="Each collection reflects a category of craftsmanship, not a fixed catalogue — every client's piece is designed individually within it."
          as="h1"
        />
        <PortfolioGrid />
      </Container>
    </section>
  );
}
