// One large, purposeful decorative motif — not the earlier attempt's four
// small scattered generic icons (heart/book/home/family), which read as
// random rather than belonging to this site. A single motif near one
// heading, echoing how a reference site (isha.sadhguru.org) places one
// large spiral beside its "Latest Wisdom" section rather than icons spread
// across the page.
//
// Deliberately a neutral concentric-rings/radiating-rays motif (warmth,
// heritage, a life's-work-radiating-outward feel) rather than a
// lotus/mandala/chakra — Mukti Mission is a Christian faith mission (see
// the Isaiah 61 citation in about-mukti-mission.md), so a Hindu/Buddhist-
// coded symbol would be a real mismatch for this specific org, not just an
// aesthetic choice. Purely decorative — aria-hidden, no claim of meaning
// beyond "this section is about heritage."
export function LegacyMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="100" cy="100" r="90" strokeWidth={1} opacity={0.5} />
      <circle cx="100" cy="100" r="66" strokeWidth={1} opacity={0.7} />
      <circle cx="100" cy="100" r="42" strokeWidth={1.5} />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * 2 * Math.PI;
        const x1 = 100 + Math.cos(angle) * 96;
        const y1 = 100 + Math.sin(angle) * 96;
        const x2 = 100 + Math.cos(angle) * 108;
        const y2 = 100 + Math.sin(angle) * 108;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={1.5} />;
      })}
    </svg>
  );
}
