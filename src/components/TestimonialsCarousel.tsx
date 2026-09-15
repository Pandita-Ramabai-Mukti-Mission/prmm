"use client";

import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/content";
import { PhotoBox } from "@/components/content-views/PhotoBox";

// One slide at a time (not a grid) so this reads as a "trust strip" a
// visitor pauses on between Our Work and the Donate CTA, matching
// HeroCarousel's auto-advance + honor-reduced-motion pattern rather than
// inventing a second carousel behavior.
export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || testimonials.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testimonials.length]);

  function goTo(i: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    setActive((i + testimonials.length) % testimonials.length);
  }

  if (testimonials.length === 0) return null;
  const t = testimonials[active];

  return (
    <div className="mx-auto max-w-3xl text-center">
      <svg width="30" height="23" viewBox="0 0 24 24" fill="#f0c6c5" className="mx-auto mb-4">
        <path d="M9.5 3C6 3 3 6 3 10.5 3 14 5.5 17 9 17c-.5 3-3 5-6 5.5v2C8 24 12 20 12 14 12 8 11 3 9.5 3zm11 0C17 3 14 6 14 10.5c0 3.5 2.5 6.5 6 6.5-.5 3-3 5-6 5.5v2c5 0 9-4 9-10 0-6-1-11-2.5-11z" />
      </svg>

      <div aria-live="polite">
        <p className="text-lg italic leading-relaxed text-ink sm:text-xl">&ldquo;{t.quote}&rdquo;</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <PhotoBox
            image={t.image}
            placeholderLabel="Photo"
            recommendedSize="200×200"
            className="flex h-11 w-11 flex-shrink-0 rounded-full text-[8px]"
          />
          <span className="text-sm font-semibold">{t.name}</span>
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2.5">
          {testimonials.map((q, i) => (
            <button
              key={q.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show testimonial ${i + 1}: ${q.name}`}
              aria-current={i === active}
              className={`h-2.5 rounded-full transition-all ${
                i === active ? "w-7 bg-coral" : "w-2.5 bg-coral/25 hover:bg-coral/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
