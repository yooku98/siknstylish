"use client";

import { useState } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function Lightbox({ images }: { images: { label: string }[] }) {
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
            key={image.label}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="text-left"
            aria-label={`View ${image.label}`}
          >
            <PlaceholderImage label={image.label} aspect="aspect-square" className="w-full" />
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
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <PlaceholderImage
              label={images[openIndex].label}
              aspect="aspect-square"
              className="w-full"
            />
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
