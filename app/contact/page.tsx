import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Sik n Stylish via WhatsApp, email, phone, Instagram or our contact form.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <SectionHeading eyebrow="Contact" title="Get in Touch" align="left" as="h1" />
          <ContactInfo />
        </div>
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
