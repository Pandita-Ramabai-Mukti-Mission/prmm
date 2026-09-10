// Third entry in the sitewide decorative-motif family (see LegacyMotif.tsx
// for the one-motif-per-page rule and why these are neutral/geometric,
// never a lotus/mandala/chakra). Two interlacing wave lines, used once on
// Testimonials — reads as lives interlaced through the mission's
// community, distinct from the heritage (LegacyMotif) and growth
// (RootGrowthMotif) motifs used elsewhere.
export function WovenThreadsMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <path d="M0 45 Q25 15 50 45 T100 45 T150 45 T200 45" strokeWidth={1.5} />
      <path d="M0 58 Q25 88 50 58 T100 58 T150 58 T200 58" strokeWidth={1.5} />
    </svg>
  );
}
