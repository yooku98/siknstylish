"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Lightbox, { type GalleryImage } from "@/components/portfolio/Lightbox";

type PortfolioDoc = {
  imageUrl: string;
  caption?: string;
  createdAt?: { toMillis: () => number } | null;
};

// Shows the photos staff upload in /admin for this collection, falling back
// to the placeholder set until any exist (or if Firestore can't be reached).
export default function CollectionGallery({
  slug,
  collectionName,
  placeholders,
}: {
  slug: string;
  collectionName: string;
  placeholders: GalleryImage[];
}) {
  const [uploaded, setUploaded] = useState<GalleryImage[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Sorted client-side: where() + orderBy() on different fields would
    // need a composite index.
    getDocs(query(collection(db, "portfolioItems"), where("collectionSlug", "==", slug)))
      .then((snap) => {
        if (cancelled) return;
        const images = snap.docs
          .map((d) => d.data() as PortfolioDoc)
          .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
          .map((item, i) => ({
            label: item.caption || `${collectionName} — photo ${i + 1}`,
            src: item.imageUrl,
          }));
        setUploaded(images);
      })
      .catch(() => {
        if (!cancelled) setUploaded([]);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, collectionName]);

  return <Lightbox images={uploaded && uploaded.length > 0 ? uploaded : placeholders} />;
}
