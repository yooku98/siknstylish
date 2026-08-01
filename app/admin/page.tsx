import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Staff Admin — Sik n Stylish",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Staff Only"
          title="Admin"
          align="left"
          as="h1"
        />
        <AdminApp />
      </Container>
    </section>
  );
}
