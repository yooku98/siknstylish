import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Button from "@/components/ui/Button";
import Lightbox from "@/components/portfolio/Lightbox";
import { collections, getCollection } from "@/lib/collections";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};

  return pageMetadata({
    title: collection.name,
    description: collection.description,
    path: `/portfolio/${collection.slug}`,
  });
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const galleryImages = [
    { label: `${collection.name} — full look` },
    { label: `${collection.name} — fabric close-up` },
    { label: `${collection.name} — beadwork detail` },
    { label: `${collection.name} — construction detail` },
    { label: `${collection.name} — previous client creation` },
    { label: `${collection.name} — styling detail` },
  ];

  return (
    <>
      <section className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <PlaceholderImage
            label={`${collection.name} — signature photograph`}
            aspect="aspect-[4/5]"
            className="w-full"
          />
          <div className="flex flex-col gap-5">
            <span className="text-gold text-xs sm:text-sm uppercase tracking-[0.2em]">
              Collection
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink leading-tight">
              {collection.name}
            </h1>
            <p className="text-ink/70 text-base sm:text-lg leading-relaxed">
              {collection.description}
            </p>
            <span className="text-gold text-sm uppercase tracking-wide">
              {collection.startingFrom}
            </span>
            <div className="flex flex-wrap gap-4 mt-2">
              <Button href="/book" variant="primary">
                Start Your Custom Order
              </Button>
              <Button href="/portfolio" variant="outline">
                Back to Portfolio
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-ink/[0.02]">
        <Container className="flex flex-col gap-10">
          <h2 className="font-serif text-2xl sm:text-3xl text-ink">
            Craftsmanship Detail
          </h2>
          <Lightbox images={galleryImages} />
        </Container>
      </section>
    </>
  );
}
