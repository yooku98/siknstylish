import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ProcessTimeline from "@/components/process/ProcessTimeline";

export default function ProcessPreview() {
  return (
    <section className="py-16 sm:py-24 bg-ink text-ivory">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Our Process"
          title="What Happens After You Reach Out"
          description="From first consultation to final delivery, here is exactly what to expect."
          tone="dark"
        />
        <div className="[&_h3]:text-ivory [&_p]:text-ivory/70">
          <ProcessTimeline />
        </div>
        <div className="flex justify-center">
          <Button href="/process" variant="onDark">
            See the Full Process
          </Button>
        </div>
      </Container>
    </section>
  );
}
