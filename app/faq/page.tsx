import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQs",
  description:
    "Answers to common questions about custom-made dresses, production time, shipping, payment and alterations at Sik n Stylish.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-12 max-w-3xl">
        <SectionHeading
          eyebrow="FAQs"
          title="Frequently Asked Questions"
          align="left"
        />
        <FaqAccordion />
      </Container>
    </section>
  );
}
