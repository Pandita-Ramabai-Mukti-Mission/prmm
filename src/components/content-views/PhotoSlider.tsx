"use client";

import { useState } from "react";
import type { ImageWithAlt } from "@/lib/content";

// Gallery-post image handling: a single large slide (cover-cropped, same
// no-distortion approach as PhotoBox) with prev/next + dot controls,
// instead of a flat cropped-thumbnail grid — reads as "here's the event,
// browse through it" rather than a wall of equally-weighted tiles. No
// auto-rotate (unlike HeroCarousel): this is a user-browsed photo set, not
// rotating marketing copy, so nothing should move until asked. Manual-only
// controls also means no prefers-reduced-motion branch is needed.
export function PhotoSlider({ images }: { images: ImageWithAlt[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  const image = images[active];

  function goTo(i: number) {
    setActive((i + images.length) % images.length);
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-8 sm:px-12">
      <div className="relative overflow-hidden rounded-xl border border-black/10 bg-gray-100 shadow-md">
        <div
          role="img"
          aria-label={image.alt}
          style={{ backgroundImage: `url(${image.src})` }}
          className="h-64 w-full bg-cover bg-center bg-no-repeat sm:h-96 md:h-[500px]"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow hover:bg-white"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow hover:bg-white"
            >
              &rarr;
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {images.map((img, i) => (
                <button
                  key={img.src + i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show photo ${i + 1} of ${images.length}`}
                  aria-current={i === active}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/85"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {image.alt && <p className="mt-2.5 text-center text-xs text-ink-soft">{image.alt}</p>}
      {images.length > 1 && (
        <p className="mt-1 text-center text-[11px] text-ink-soft">
          Photo {active + 1} of {images.length}
        </p>
      )}
    </section>
  );
}
