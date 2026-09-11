"use client";

import { useEffect, useRef, useState } from "react";
import type { ImageWithAlt } from "@/lib/content";

// The live prmm.org.in "Shaping the…" pages each open with a small banner
// image carousel (2-3 photos cycling via Owl Carousel) above the page
// title. This is the same pattern, restrained to match this site's own
// motion register (one auto-advancing interval, dot controls, honors
// prefers-reduced-motion — see HeroCarousel.tsx). Photos are placeholders
// until the client uploads real ones — no AI-generated stand-ins for real
// campus/program photos, per docs/design-system.md's imagery policy.
export function ThemeBannerSlider({
  images,
  placeholderLabel,
}: {
  images: ImageWithAlt[];
  placeholderLabel: string;
}) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slides = images.length > 0 ? images : [{ src: "", alt: placeholderLabel }];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length]);

  function goTo(i: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    setActive(i);
  }

  const slide = slides[active];

  return (
    <div className="relative overflow-hidden rounded-xl shadow-md">
      <div className="flex aspect-[16/7] w-full items-center justify-center bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)]">
        {slide.src ? (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-uploaded path, matches PhotoBox's own plain <img> approach.
          <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" />
        ) : (
          <span className="px-4 text-center text-sm text-[#8a8170]">{slide.alt} — photo pending</span>
        )}
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.alt + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/90"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
