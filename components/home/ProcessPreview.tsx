import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ProcessTimeline from "@/components/process/ProcessTimeline";

export default function ProcessPreview() {
  return (
    <section className="py-16 sm:py-24 bg-ink text-ivory">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-4 items-center text-center max-w-2xl mx-auto">
          <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em]">
            Our Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-ivory">
            What Happens After You Reach Out
          </h2>
          <p className="text-ivory/70 text-base sm:text-lg leading-relaxed">
            From first consultation to final delivery, here is exactly what
            to expect.
          </p>
        </div>
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
