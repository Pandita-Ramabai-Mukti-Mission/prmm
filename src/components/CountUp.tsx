"use client";

import { useEffect, useRef, useState } from "react";

// Animates a stat's leading number from 0 up to its real value once
// scrolled into view. Purely presentational — parses whatever numeric
// prefix is already in the string (e.g. "100,000+" → animates 100000,
// keeps the "+"), so it never changes what value is actually shown, only
// how it arrives. Non-numeric values (shouldn't occur for STATS, but keeps
// this safe for reuse elsewhere) render as static text.
export function CountUp({ value, durationMs = 1200 }: { value: string; durationMs?: number }) {
  const match = value.match(/^([\d,]+)(.*)$/);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const suffix = match ? match[2] : "";

  const [display, setDisplay] = useState(target === null ? value : "0");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        // Reduced-motion check happens inside the callback (event-driven),
        // not synchronously in the effect body — jumps straight to the
        // final value instead of animating.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setDisplay(target.toLocaleString("en-US"));
          observer.disconnect();
          return;
        }

        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(target! * eased).toLocaleString("en-US"));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return (
    <span ref={ref}>
      {target === null ? value : display}
      {suffix}
    </span>
  );
}
