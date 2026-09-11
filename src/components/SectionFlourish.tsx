// Small heading-flourish — a flowing curved swash with two accent dots.
// Extracted from MissionFoundationBand.tsx (where it first appeared,
// under "Our Foundation") so it can be reused under a handful of other
// major section headings sitewide, matching how isha.sadhguru.org
// actually uses this kind of small divider under several different
// section headings, not just once (isha_design_reference memory,
// refined 2026-09-11 after a follow-up audit). Kept sparse deliberately —
// a few major headings per page, not every single one, or it stops
// reading as an accent and starts reading as boilerplate.
export function SectionFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 40" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <path
        d="M20 20c0-8 10-8 15 0s15 8 15 0-10-8-15 0 5 12 15 12 25-8 30-12 20-8 25 0 15 8 20 0-10-8-15 0 5 12 15 12 25-8 20-12"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <circle cx="70" cy="14" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="130" cy="26" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
