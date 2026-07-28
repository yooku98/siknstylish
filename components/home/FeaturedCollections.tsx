import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import CollectionCard from "@/components/portfolio/CollectionCard";
import { collections } from "@/lib/collections";

export default function FeaturedCollections() {
  const featured = collections.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Portfolio"
          title="Collections, Not a Catalogue"
          description="Every collection is a starting point for conversation, not a fixed product — each piece is designed around the client wearing it."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((collection) => (
            <CollectionCard key={collection.slug} collection={collection} />
          ))}
        </div>
      </Container>
    </section>
  );
}
