"use client";

import { useState } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export type GalleryImage = { label: string; src?: string };

function GalleryTile({ image, className }: { image: GalleryImage; className?: string }) {
  if (!image.src) {
    return <PlaceholderImage label={image.label} aspect="aspect-square" className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.label}
      loading="lazy"
      className={`${className} aspect-square object-cover border border-ink/10`}
    />
  );
}

export default function Lightbox({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);
  const showPrev = () =>
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const showNext = () =>
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, i) => (
          <button
            key={image.src ?? image.label}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="text-left"
            aria-label={`View ${image.label}`}
          >
            <GalleryTile image={image} className="w-full" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-ink/90 flex items-center justify-center p-6"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute top-6 right-6 text-ivory text-2xl leading-none hover:text-gold"
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-4 sm:left-8 text-ivory text-3xl hover:text-gold"
          >
            ‹
          </button>
          <div
            className={images[openIndex].src ? "max-w-3xl w-full" : "max-w-md w-full"}
            onClick={(e) => e.stopPropagation()}
          >
            {images[openIndex].src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[openIndex].src}
                alt={images[openIndex].label}
                className="w-full max-h-[85vh] object-contain"
              />
            ) : (
              <PlaceholderImage
                label={images[openIndex].label}
                aspect="aspect-square"
                className="w-full"
              />
            )}
          </div>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-4 sm:right-8 text-ivory text-3xl hover:text-gold"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
