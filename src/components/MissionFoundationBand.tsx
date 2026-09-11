import Link from "next/link";

// Vision / Mission / Basis — Mukti's three core doctrinal statements.
// Shared by the homepage's "Our Foundation" teaser and the About Mukti
// Mission page itself, so both stay in sync from one place rather than
// two copies drifting apart. Dark band layout technique — bg-ink per
// docs/design-system.md's "one dark color only" rule, curved
// single-accent line icons, a decorative flourish under the heading —
// echoes a reference layout the client shared; icons and flourish are
// redrawn originals, not that reference's actual glyphs.

// Curved line icons — bezier-only, single-weight style matching the
// homepage stats icons, sized up (72px, thinner 1.1 stroke) since these
// anchor only 3 tiles rather than 6.
function VisionIcon() {
  // An open, embracing curve around a small heart — "accepted, regardless
  // of background."
  return (
    <svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12c0-3 1.5-5.5 4-6.5" />
      <path d="M20 12c0-3-1.5-5.5-4-6.5" />
      <path d="M3 12c0 5 4 8.5 9 9.5 5-1 9-4.5 9-9.5" />
      <path d="M12 15.3c-3-2-4.6-3.7-4.6-5.6 0-1.5 1.1-2.6 2.5-2.6 1 0 1.7.5 2.1 1.3.4-.8 1.1-1.3 2.1-1.3 1.4 0 2.5 1.1 2.5 2.6 0 1.9-1.6 3.6-4.6 5.6z" />
    </svg>
  );
}
function MissionIcon() {
  // A sprouting seed — "sow seeds of change."
  return (
    <svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="19.5" rx="3" ry="1.8" />
      <path d="M12 18V10" />
      <path d="M12 12c0-3 1.5-5 4.5-5.5-.3 3.2-1.7 5-4.5 5.5z" />
      <path d="M12 15c0-2.6-1.3-4.3-4-4.8.3 2.8 1.5 4.3 4 4.8z" />
    </svg>
  );
}
function BasisIcon() {
  // An open book with rays fanning up — "proclaim good news" / anointing
  // imagery.
  return (
    <svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9.5c-1.6-1.6-3.9-2.2-6-1.4a.8.8 0 00-.5.7v9.6c0 .6.6 1 1.2.8 1.8-.6 3.8-.2 5.3 1.2" />
      <path d="M12 9.5c1.6-1.6 3.9-2.2 6-1.4a.8.8 0 01.5.7v9.6c0 .6-.6 1-1.2.8-1.8-.6-3.8-.2-5.3 1.2" />
      <path d="M12 3.2v2.3" />
      <path d="M8.3 4.3l1.1 2" />
      <path d="M15.7 4.3l-1.1 2" />
    </svg>
  );
}

const FOUNDATION = [
  {
    title: "Mukti's Vision",
    body: "A Christ-centred home where destitute women and children, irrespective of their background, are accepted, cared for, transformed and empowered to be Salt & Light in society.",
    Icon: VisionIcon,
  },
  {
    title: "Mukti's Mission",
    body: "We seek, in the Spirit of Christ, to sow seeds of change in the life of every individual under Mukti's care — counseling them through life's issues, opening opportunities for healing, and shaping them prayerfully as models of God's kingdom for society at large.",
    Icon: MissionIcon,
  },
  {
    title: "Basis of Mukti",
    body: "“The Spirit of the Sovereign Lord is on me, because the Lord has anointed me to proclaim good news to the poor. He has sent me to bind up the brokenhearted, to proclaim freedom for the captives and release from darkness for the prisoners.” — Isaiah 61:1, 4",
    Icon: BasisIcon,
  },
];

// Decorative flourish under the section heading — a flowing curved swash
// with two small accent dots, echoing a reference layout's own scribble
// under its section title (structure only — redrawn as an original mark).
function FoundationFlourish({ className }: { className?: string }) {
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

export function MissionFoundationBand({ ctaHref }: { ctaHref?: string }) {
  return (
    <section className="bg-ink px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-2xl text-white sm:text-3xl">Our Foundation</h2>
        <FoundationFlourish className="mx-auto mt-3 h-7 w-44 text-coral" />
        <div className="mt-14 grid gap-12 text-left sm:grid-cols-3 sm:text-center">
          {FOUNDATION.map((f) => (
            <div key={f.title} className="flex flex-col items-start sm:items-center">
              <span className="mb-4 flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center text-coral">
                <f.Icon />
              </span>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{f.body}</p>
            </div>
          ))}
        </div>
        {ctaHref && (
          <Link
            href={ctaHref}
            className="mt-14 inline-block rounded-md bg-coral px-7 py-3 font-semibold text-white hover:bg-coral-dark"
          >
            Read Our Full Story
          </Link>
        )}
      </div>
    </section>
  );
}
