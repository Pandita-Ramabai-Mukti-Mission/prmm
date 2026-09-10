// Fourth entry in the sitewide decorative-motif family (see
// LegacyMotif.tsx for the one-motif-per-section rule). Unlike the other
// three (deliberately neutral/geometric, chosen to avoid any
// religion-specific reference), this one is intentionally a Christian
// motif — a simple radiant cross — since Mukti Mission is explicitly a
// Christian faith mission (the "Christ Centred Home" vision statement,
// the Isaiah 61 citation used across the "Shaping the…" pages). Kept
// plain-line and restrained rather than ornate, matching this site's
// existing register (thin strokes, low opacity, one per section).
export function FaithMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="92" strokeWidth={1} opacity={0.5} />
      <circle cx="100" cy="100" r="70" strokeWidth={1} opacity={0.35} />
      {/* radiating rays, echoing the site's existing rings-and-rays language.
          Coordinates rounded to 2dp: Math.cos/sin can return a
          last-digit-different double on the server's V8 vs the browser's,
          which otherwise serializes as a different attribute string and
          breaks hydration — rounding gives server and client an identical
          string every time (see LegacyMotif.tsx, which had the same bug). */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 2 * Math.PI;
        const round = (n: number) => Math.round(n * 100) / 100;
        const x1 = round(100 + Math.cos(angle) * 96);
        const y1 = round(100 + Math.sin(angle) * 96);
        const x2 = round(100 + Math.cos(angle) * 110);
        const y2 = round(100 + Math.sin(angle) * 110);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={1.2} opacity={0.6} />;
      })}
      {/* simple cross, centered */}
      <line x1="100" y1="50" x2="100" y2="150" strokeWidth={2.5} />
      <line x1="66" y1="80" x2="134" y2="80" strokeWidth={2.5} />
    </svg>
  );
}
