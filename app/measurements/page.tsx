import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import MeasurementOptionCard from "@/components/measurements/MeasurementOptionCard";
import MeasurementGuide from "@/components/measurements/MeasurementGuide";
import { measurementOptions } from "@/lib/measurements";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Measurements",
  description:
    "How measurements work at Sik n Stylish — visit our studio, book a home measurement, or submit your own using our measurement guide.",
  path: "/measurements",
});

export default function MeasurementsPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Measurements"
            title="Getting Measured, Your Way"
            description="Wherever you're based, there's a way to get accurately measured before we begin your piece."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {measurementOptions.map((option) => (
              <MeasurementOptionCard key={option.title} option={option} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-ink/[0.02]">
        <Container className="flex flex-col gap-12 max-w-3xl">
          <SectionHeading
            eyebrow="Self-Measurement"
            title="Measurement Guide"
            description="If you're submitting your own measurements, follow these steps carefully. We'll review everything with you before production begins."
            align="left"
          />
          <MeasurementGuide />
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink">
            Ready With Your Measurements?
          </h2>
          <Button href="/book" variant="primary">
            Book a Consultation
          </Button>
        </Container>
      </section>
    </>
  );
}
