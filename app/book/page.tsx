import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingForm from "@/components/booking/BookingForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book a Consultation",
  description:
    "Book an in-person or virtual consultation with Sik n Stylish to begin your bespoke fashion piece.",
  path: "/book",
});

export default function BookPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SectionHeading
            eyebrow="Book a Consultation"
            title="Let's Design Something for You"
            align="left"
          />
          <p className="text-ink/70 text-base leading-relaxed">
            Choose in-person or virtual, share your preferred date and time,
            and tell us a little about the occasion. We'll confirm your
            consultation directly.
          </p>
          <p className="text-ink/70 text-sm leading-relaxed">
            Not sure how measurements work yet? See our{" "}
            <Link href="/measurements" className="text-gold underline underline-offset-4">
              measurement options and guide
            </Link>{" "}
            first.
          </p>
        </div>
        <div className="lg:col-span-3">
          <BookingForm />
        </div>
      </Container>
    </section>
  );
}
