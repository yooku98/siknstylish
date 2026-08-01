import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PortalApp from "@/components/portal/PortalApp";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Client Portal",
  description: "Sign in to the Sik n Stylish client portal.",
  path: "/portal",
});

export default function PortalPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-10 items-center text-center">
        <SectionHeading
          eyebrow="Client Portal"
          title="Welcome Back"
          description="Sign in to track your order, manage your measurements and more."
          as="h1"
        />
        <PortalApp />
      </Container>
    </section>
  );
}
