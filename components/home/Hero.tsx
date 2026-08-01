import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function Hero() {
  return (
    <section className="relative bg-ivory">
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 sm:py-20 lg:py-28">
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em]">
            Bespoke Fashion House · Accra, Ghana
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-ink">
            Every Piece, Made Only for You
          </h1>
          <p className="text-ink/70 text-base sm:text-lg leading-relaxed max-w-lg">
            Sik n Stylish designs and hand-crafts bespoke evening wear,
            bridal, office wear and beaded luxury pieces — tailored to your
            body, your story and your occasion, for clients in Ghana and
            abroad.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Button href="/book" variant="primary">
              Start Your Custom Order
            </Button>
            <Button href="/portfolio" variant="outline">
              Explore Our Craftsmanship
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <PlaceholderImage
            label="Hero photograph — model in signature piece"
            aspect="aspect-[4/5] lg:aspect-[3/4]"
            className="w-full"
          />
        </div>
      </Container>
    </section>
  );
}
