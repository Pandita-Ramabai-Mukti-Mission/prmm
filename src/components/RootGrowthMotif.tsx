// Second entry in the sitewide decorative-motif family alongside
// LegacyMotif — one restrained motif per page, never combined or
// scattered (see LegacyMotif.tsx for why: a prior four-scattered-icon
// attempt was tried and reverted, dev-backlog.md #56). This one reads as
// a branching root/growth line rather than rings-and-rays, for sections
// about a gift's effect rather than the mission's heritage — "rebuilt,
// restored, renewed" as a literal growing line, not a repeat of the
// heritage motif everywhere. Same neutral-geometric rule applies: no
// lotus/mandala/chakra reference, since Mukti Mission is a Christian
// faith mission.
export function RootGrowthMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <path d="M100 190 L100 115" strokeWidth={2} />
      <path d="M100 140 L72 102" strokeWidth={1.5} />
      <path d="M100 140 L128 102" strokeWidth={1.5} />
      <path d="M100 115 L88 62" strokeWidth={1.5} />
      <path d="M100 115 L100 40" strokeWidth={1.5} />
      <path d="M100 115 L112 62" strokeWidth={1.5} />
      <path d="M72 102 L58 72" strokeWidth={1.2} />
      <path d="M128 102 L142 72" strokeWidth={1.2} />
    </svg>
  );
}
