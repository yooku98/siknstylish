import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import type { Collection } from "@/lib/collections";

export default function CollectionCard({
  collection,
}: {
  collection: Collection;
}) {
  return (
    <Link href={`/portfolio/${collection.slug}`} className="group flex flex-col gap-4">
      <PlaceholderImage
        label={`${collection.name} — photo placeholder`}
        className="w-full transition-opacity group-hover:opacity-90"
      />
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-2xl text-ink group-hover:text-gold transition-colors">
          {collection.name}
        </h3>
        <p className="text-ink/60 text-sm">{collection.tagline}</p>
        <span className="text-gold text-xs uppercase tracking-wide mt-1">
          {collection.startingFrom}
        </span>
      </div>
    </Link>
  );
}
