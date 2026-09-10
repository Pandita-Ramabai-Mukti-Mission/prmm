"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaithMotif } from "@/components/FaithMotif";
import type { ImageWithAlt } from "@/lib/content";

export type HeroSlide = {
  eyebrow?: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: ImageWithAlt;
};

// Restores the real prmm.org.in homepage's own structure — a rotating
// full-bleed-photo hero with a coral overlay for text legibility — rather
// than the single static hero this rebuild used before. Auto-rotates but
// honors prefers-reduced-motion (checked once on mount; a user who prefers
// reduced motion never gets the interval, only manual dot/arrow control).
//
// Fixed viewport-relative height (not content-driven) so the section
// doesn't resize as slides with different copy lengths rotate through —
// dvh rather than vh so mobile browser chrome doesn't cause a jump.
// Content is centered (not left/bottom-anchored) specifically because the
// longest slide's paragraph reads cramped against a fixed height when
// left-aligned; centering plus a wider max-width gives long copy more
// room to breathe within the same fixed box.
//
// Each slide's photo is CMS-managed (content/hero/home-hero.md via
// getHomeHeroSlides()) — same "real photo, or a placeholder with a
// caption" contract as PhotoBox elsewhere on the site, just implemented
// directly here instead of reusing PhotoBox itself: PhotoBox's angled
// corner-clip is a card-scale treatment (see PhotoBox.tsx) that would
// look wrong on a full-bleed hero background.
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 7000);
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
    <section
      className="relative flex h-[88dvh] min-h-[520px] max-h-[820px] flex-col overflow-hidden bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] sm:h-[85dvh]"
      aria-roledescription="carousel"
      aria-label="Homepage highlights"
    >
      {slide.image?.src && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-uploaded
        // path under public/images/uploads, not a next/image-optimizable
        // remote source; matches PhotoBox's own plain <img> approach.
        <img
          src={slide.image.src}
          alt={slide.image.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Coral-to-transparent overlay so white text stays legible over the
          photo (real or placeholder). */}
      <div className="absolute inset-0 bg-gradient-to-t from-coral/90 via-coral/55 to-coral/25" aria-hidden="true" />

      {/* This section's one decorative motif — see FaithMotif.tsx. Corner
          placement (not dead-center behind the text) so it stays visible
          rather than getting visually lost under the text block; opacity
          raised so it actually reads against the coral overlay. */}
      <FaithMotif className="pointer-events-none absolute -right-20 -top-20 h-[60vh] max-h-[480px] w-[60vh] max-w-[480px] text-white/30 sm:-right-16 sm:-top-16" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10 text-center sm:px-12">
        <div aria-live="polite" className="flex max-w-5xl flex-col items-center">
          {slide.eyebrow && (
            <div className="text-xs font-semibold uppercase tracking-wide text-white/80 sm:text-sm">
              {slide.eyebrow}
            </div>
          )}
          {/* Wider than a typical hero heading/paragraph measure —
              deliberately, so the longest slide wraps to about the same
              number of lines as the shortest, keeping the fixed-height
              section looking uniform across all 3 slides instead of one
              slide's text looking sparse and another's looking cramped. */}
          <h1 className="mt-2 max-w-[34ch] text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
            {slide.heading}
          </h1>
          <p className="mt-4 max-w-[80ch] text-base text-white/90 sm:text-lg">{slide.body}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {slide.ctaHref && (
              <Link
                href={slide.ctaHref}
                className="rounded-md bg-white px-6 py-3 font-semibold text-coral hover:bg-white/90"
              >
                {slide.ctaLabel ?? "Learn More"}
              </Link>
            )}
            <Link href="/donate/" className="text-sm font-semibold text-white underline hover:text-white/80">
              Donate Now &rarr;
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="relative flex items-center justify-center gap-2.5 pb-6">
          {slides.map((s, i) => (
            <button
              key={s.heading}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1}: ${s.heading}`}
              aria-current={i === active}
              className={`h-2.5 rounded-full transition-all ${
                i === active ? "w-7 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Placeholder caption — same contract as PhotoBox: only shown while
          no real photo has been uploaded for this slide via the CMS. */}
      {!slide.image?.src && (
        <p className="relative bg-white px-6 py-2 text-center text-[11px] text-ink-soft sm:px-12">
          {slide.eyebrow || slide.heading} — photo pending
        </p>
      )}
    </section>
  );
}
