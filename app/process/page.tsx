import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ProcessTimeline from "@/components/process/ProcessTimeline";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Bespoke Process",
  description:
    "From consultation to delivery — see exactly what happens when you commission a custom-made piece from Sik n Stylish.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="flex flex-col gap-16">
          <SectionHeading
            eyebrow="Our Process"
            title="Seven Steps, From Idea to Garment"
            description="Bespoke fashion is a collaboration. Here's exactly what to expect once you reach out — no surprises, no guesswork."
          />
          <ProcessTimeline />
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-ink text-ivory">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="font-serif text-2xl sm:text-3xl">
            Ready to Begin Your First Step?
          </h2>
          <Button href="/book" variant="onDark">
            Book a Consultation
          </Button>
        </Container>
      </section>
    </>
  );
}
