import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Client Portal",
  description: "The Sik n Stylish client portal is coming soon.",
  path: "/portal",
});

const upcomingFeatures = [
  "View the progress of your order",
  "Approve sketches or fabric choices",
  "Upload inspiration photos",
  "Make payments",
  "Access your saved measurements",
  "Review your previous orders",
];

export default function PortalPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-10 items-center text-center max-w-2xl mx-auto">
        <SectionHeading
          eyebrow="Client Portal"
          title="Coming Soon"
          description="We're building a dedicated space for returning clients. Soon you'll be able to:"
          as="h1"
        />
        <ul className="flex flex-col gap-3 text-ink/70 text-base">
          {upcomingFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p className="text-ink/60 text-sm">
          In the meantime, reach out directly and we'll help with any of the
          above.
        </p>
        <Button href="/contact" variant="primary">
          Contact Us
        </Button>
      </Container>
    </section>
  );
}
