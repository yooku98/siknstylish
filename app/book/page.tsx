import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingForm from "@/components/booking/BookingForm";
import MeasurementOptionCard from "@/components/measurements/MeasurementOptionCard";
import ProcessTimeline from "@/components/process/ProcessTimeline";
import { measurementOptions } from "@/lib/measurements";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start Your Custom Order",
  description:
    "Start your custom order with Sik n Stylish — book an in-person or virtual consultation, choose how you'll be measured, and see what happens next.",
  path: "/book",
});

export default function BookPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <SectionHeading
              eyebrow="Start Your Custom Order"
              title="Let's Design Something for You"
              align="left"
              as="h1"
            />
            <p className="text-ink/70 text-base leading-relaxed">
              Choose in-person or virtual, share your preferred date and
              time, and tell us a little about the occasion. We'll confirm
              your consultation directly.
            </p>
            <p className="text-ink/70 text-sm leading-relaxed">
              Not sure how measurements work yet? See our{" "}
              <Link href="/measurements" className="text-gold underline underline-offset-4">
                measurement options and guide
              </Link>{" "}
              below.
            </p>
          </div>
          <div className="lg:col-span-3">
            <BookingForm />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-ink/[0.02]">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Step Two"
            title="How Would You Like to Be Measured?"
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {measurementOptions.map((option) => (
              <MeasurementOptionCard key={option.title} option={option} />
            ))}
          </div>
          <p className="text-ink/60 text-sm">
            Submitting your own measurements?{" "}
            <Link href="/measurements" className="text-gold underline underline-offset-4">
              See the full measurement guide
            </Link>
            .
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-ink text-ivory">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="What Happens Next"
            title="From Consultation to Delivery"
            align="left"
          />
          <div className="[&_h3]:text-ivory [&_p]:text-ivory/70">
            <ProcessTimeline />
          </div>
          <Link
            href="/process"
            className="text-gold underline underline-offset-4 text-sm w-fit"
          >
            See the full process
          </Link>
        </Container>
      </section>
    </>
  );
}
