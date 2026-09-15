import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug, getAllLeadership, getAboutMuktiExtras } from "@/lib/content";
import { GetInvolvedBand } from "@/components/GetInvolvedBand";
import { PhotoBox } from "@/components/content-views/PhotoBox";
import { LegacyMotif } from "@/components/LegacyMotif";
import { Reveal } from "@/components/Reveal";
import { MissionFoundationBand } from "@/components/MissionFoundationBand";
import { SectionFlourish } from "@/components/SectionFlourish";

// History timeline, Leadership, Why We Exist, Character, Women's
// Leadership and Mukti Operations are not CMS-managed yet — they resolve
// the "since 1889" vs. Ramabai's 1858-1922 dates confusion from the
// current homepage (docs/site-audit.md) but need a real schema if the
// client wants to edit them without a code change. Flagged, not silently
// assumed.
const TIMELINE = [
  { year: "1889", label: "Mukti Mission founded" },
  { year: "1891", label: "Sharada Sadan opens" },
  { year: "1899", label: "Church cornerstone laid" },
  { year: "1993", label: "Manorama Memorial School opens" },
  { year: "2011", label: "Agape Bible Institute founded" },
  { year: "2020", label: "The Boys Home opens" },
];

// Single-weight curved-line icon set (24x24, hand-drawn originals — not
// copied from any icon library) matching MissionFoundationBand's existing
// aesthetic, so this page's two plainest sections (previously a bare text
// grid and a row of flat pills) pick up the same restrained icon language
// already established elsewhere on this page instead of inventing a new
// visual system. Deliberately generic/symbolic (heart, home, shield…), not
// literal depictions of any group — see docs/design-system.md's imagery
// policy on why a real photo would be the wrong call for sensitive
// categories like this, where icons are the appropriate abstraction.
function IconIntersectingCircles() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9.5" cy="12" r="6.5" />
      <circle cx="14.5" cy="12" r="6.5" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.3S3.5 15 3.5 9.2A4.7 4.7 0 0112 6.4a4.7 4.7 0 018.5 2.8C20.5 15 12 20.3 12 20.3z" />
    </svg>
  );
}
function IconHome() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11.5L12 4l8 7.5" />
      <path d="M6 10v9.5h12V10" />
      <path d="M10 19.5v-6h4v6" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconUmbrella() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c4.5 0 8 3 8 6.5H4C4 6 7.5 3 12 3z" />
      <path d="M12 3v15.5a2 2 0 01-3.5 1.3" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5l7 2.7v5.6c0 4.6-3 7.6-7 8.7-4-1.1-7-4.1-7-8.7V6.2z" />
    </svg>
  );
}
function IconSunCloud() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <path d="M9 2v1.4M13 4.3l-1 1M5 4.3l1 1" />
      <path d="M6.5 18.5h10a3.2 3.2 0 000-6.4 4.6 4.6 0 00-8.6-1.7 3.6 3.6 0 00-1.4 8.1z" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.3 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.3-3.8-8.5S9.5 5.9 12 3.5z" />
    </svg>
  );
}
function IconMedicalCross() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
function IconCross() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M6 9h12" />
    </svg>
  );
}
function IconTorch() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5c1.6 1.8 2.4 3.4 2.4 5 0 1.3-1 2.2-2.4 2.2S9.6 8.8 9.6 7.5c0-1 .4-2 1.2-3" />
      <path d="M9 10.8a4.5 4.5 0 106 0" />
      <path d="M12 15v6.5" />
    </svg>
  );
}
function IconCircleOfHands() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" strokeDasharray="2.2 3.4" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

// "Why We Exist" — who Mukti's work serves, from the live site's own
// list (prmm.org.in/about-mukti-mission/, fetched 2026-09-11).
const WHY_WE_EXIST = [
  { label: "Orphans and special-needs women and children", icon: <IconHeart /> },
  { label: "Widows, single parents, unwed mothers and childless couples", icon: <IconHome /> },
  { label: "People who are visually or physically challenged", icon: <IconEye /> },
  { label: "Children from the streets and slums", icon: <IconUmbrella /> },
  { label: "Children of commercial sex workers", icon: <IconShield /> },
  { label: "Children affected by natural disaster", icon: <IconSunCloud /> },
  { label: "Indigenous people groups", icon: <IconGlobe /> },
  { label: "The poor in the surrounding community, through medical care and a day-care center", icon: <IconMedicalCross /> },
];

const CHARACTER = [
  { label: "Christ-centred", icon: <IconCross /> },
  { label: "Destitute child and women focused", icon: <IconHeart /> },
  { label: "Holistic and multi-faceted", icon: <IconIntersectingCircles /> },
  { label: "Continuing Pandita Ramabai's founding vision", icon: <IconTorch /> },
  { label: "Fully governed by Indians", icon: <IconCircleOfHands /> },
];

// Mirrors the live site's own single-letter M/S/H/E/D operations nav —
// the direct path from About Mukti Mission into the 5 "Shaping the…"
// theme pages, missing from this rebuild until now.
const OPERATIONS = [
  { letter: "M", label: "Shaping the Mind", href: "/shaping-the-mind/" },
  { letter: "S", label: "Shaping the Spirit", href: "/shaping-the-spirit/" },
  { letter: "H", label: "Shaping the Heart", href: "/shaping-the-heart/" },
  { letter: "E", label: "Shaping the Environment", href: "/shaping-the-environment/" },
  { letter: "D", label: "Shaping the Destiny", href: "/shaping-the-destiny/" },
];

export default async function AboutMuktiMission() {
  const page = await getPageBySlug("about-mukti-mission");
  if (!page) notFound();
  const leadership = getAllLeadership();
  const { ramabaiImage, campusImage } = getAboutMuktiExtras();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 text-sm text-ink-soft sm:px-12">
        <Link href="/">Home</Link> / About / Mukti Mission
      </div>

      <Reveal>
      <section className="relative overflow-hidden px-6 py-12 sm:px-12">
        {/* This page's one decorative motif — see LegacyMotif.tsx */}
        <LegacyMotif className="pointer-events-none absolute -right-14 -top-14 h-64 w-64 text-coral/[0.12]" />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="text-4xl">{page.title}</h1>
          <div
            className="prose mt-4 max-w-[70ch]"
            dangerouslySetInnerHTML={{ __html: page.contentHtml }}
          />
        </div>
      </section>
      </Reveal>

      {/* Founder & Legacy triptych — founder credibility → mission
          continuity → present-day impact, adapted from isha.sadhguru.org's
          "Man / Mystic / Mission" triptych. Built around Pandita Ramabai as
          a historical figure (she's this org's actual founder), not a
          celebrity presence — Isha's version centers a living guru, which
          has no equivalent here. Home's own "Legacy" section covers her
          story too; this is the same facts in a different, denser shape
          for a visitor who lands on About directly. */}
      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-12">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-md">
            <PhotoBox
              image={ramabaiImage}
              placeholderLabel="Pandita Ramabai portrait/archival photo"
              recommendedSize="800×600"
              className="flex h-48 w-full text-xs"
            />
            <div className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">1858 &ndash; 1922</div>
              <h3 className="mt-1.5 font-semibold">Pandita Ramabai</h3>
              <p className="mt-1.5 text-sm text-ink-soft">
                A widow, scholar and social reformer who founded a home for widows in 1889 — the seed of
                what Mukti Mission is today.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-md">
            <PhotoBox
              image={campusImage}
              placeholderLabel="Mukti Mission campus/community photo"
              recommendedSize="800×600"
              className="flex h-48 w-full text-xs"
            />
            <div className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">130 Years</div>
              <h3 className="mt-1.5 font-semibold">Mukti Mission Today</h3>
              <p className="mt-1.5 text-sm text-ink-soft">
                14 ministries, 19 locations, still serving orphaned, destitute and vulnerable women and
                children.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-md">
            <PhotoBox
              placeholderLabel="A specific program in action — real photo"
              recommendedSize="800×600"
              className="flex h-48 w-full text-xs"
            />
            <div className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Right Now</div>
              <h3 className="mt-1.5 font-semibold">Impact Today</h3>
              <p className="mt-1.5 text-sm text-ink-soft">
                1,500 residents currently cared for across the mission&rsquo;s homes, schools and
                hospital.
              </p>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Our Foundation — same Vision/Mission/Basis band the homepage
          teases, shown here in full (see MissionFoundationBand.tsx). No
          CTA here since this already is that "full story." */}
      <Reveal>
        <MissionFoundationBand />
      </Reveal>

      {/* Why We Exist — icon + label cards rather than a bare text grid
          (client feedback: previous version "looks very basic"), on a bold
          tan band for page rhythm (docs/design-system.md's
          alternating-sections rule). Each card gets a small circular
          coral-tinted icon badge, matching the site's established
          icon-badge language (GetInvolvedBand's action icons), plus a
          hover lift so the grid feels tactile instead of static. */}
      <Reveal>
      <section className="bg-[#f3efe7] px-6 py-14 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl">Why We Exist</h2>
          <SectionFlourish className="mt-3 h-6 w-36 text-coral" />
          <p className="mt-4 max-w-[60ch] text-sm text-ink-soft">
            Mukti exists to make a difference in the lives of:
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_WE_EXIST.map((w) => (
              <div
                key={w.label}
                className="flex flex-col gap-3.5 rounded-lg border border-black/10 bg-white p-5 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#fff4f2] text-coral">
                  {w.icon}
                </span>
                <p className="text-sm leading-relaxed">{w.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      {/* Character of Mukti — icon + label cards, upgraded from a flat
          pill row for the same reason as Why We Exist above. Kept visually
          lighter (smaller icons, horizontal layout) than that section
          since these are five short standalone descriptors, not full
          sentences needing the same visual weight. */}
      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-12">
        <h2 className="text-xl">Character of Mukti</h2>
        <SectionFlourish className="mb-8 mt-3 h-6 w-36 text-coral" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CHARACTER.map((c) => (
            <div
              key={c.label}
              className="flex flex-col items-center gap-3 rounded-lg border border-coral/30 bg-[#fff4f2] p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-coral">
                {c.icon}
              </span>
              <span className="text-sm font-semibold text-coral">{c.label}</span>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* Women's Leadership — Mukti's founding-by-a-woman-for-women
          philosophy, as a bold pull-quote band (bg-coral) rather than
          another plain paragraph, so its own defining line gets the same
          weight the Isaiah 61 citation gets elsewhere on the site. */}
      <Reveal>
      <section className="bg-coral px-6 py-16 text-center sm:px-12">
        <div className="mx-auto max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
            Women&rsquo;s Leadership
          </span>
          <p className="mt-3 text-2xl leading-snug text-white sm:text-3xl">
            &ldquo;If you empower a man, you empower none; if you empower a girl, you empower the
            nation.&rdquo;
          </p>
          <p className="mt-5 text-sm leading-relaxed text-white/85">
            Mukti was started by a woman, for women, in 1889 — reaching women in the community,
            affirming the rightful place of women in God&rsquo;s plan, and the conviction that women
            can change the destiny of the nation.
          </p>
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-12">
        <h2 className="mb-8 text-xl">Our History</h2>
        <div className="relative flex justify-between">
          <div className="absolute left-0 right-0 top-2 h-0.5 bg-black/10" />
          {TIMELINE.map((t) => (
            <div key={t.year} className="relative flex-1 px-2 text-center">
              <div className="relative z-10 mx-auto mb-3 h-4 w-4 rounded-full bg-coral" />
              <div className="text-sm font-bold">{t.year}</div>
              <div className="mt-1 text-xs text-ink-soft">{t.label}</div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>

      {/* Mukti Operations — direct navigation into the 5 "Shaping the…"
          theme pages, mirroring the live site's own M/S/H/E/D nav band.
          Confirmed missing from this rebuild entirely (client feedback). */}
      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-12">
        <h2 className="text-xl">Mukti Operations</h2>
        <SectionFlourish className="mb-8 mt-3 h-6 w-36 text-coral" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {OPERATIONS.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="flex flex-col items-center gap-3 rounded-lg border border-black/10 bg-white p-5 text-center shadow-md hover:border-coral/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-lg font-bold text-white">
                {o.letter}
              </span>
              <span className="text-sm font-semibold">{o.label}</span>
            </Link>
          ))}
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="bg-[#f3efe7] px-6 py-14 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-xl">Leadership</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {leadership.map((l) => (
              <div key={l.slug} className="rounded-lg border border-black/10 bg-white shadow-md p-5 text-center">
                <PhotoBox
                  image={l.image}
                  placeholderLabel="Photo"
                  recommendedSize="400×400"
                  className="mx-auto mb-3.5 flex h-24 w-24 rounded-full text-[10px]"
                />
                <h3 className="font-semibold">{l.name}</h3>
                <div className="mb-2 text-sm text-ink-soft">{l.title}</div>
                <p className="text-sm italic text-ink-soft">
                  {l.bio || "[1–2 line bio — request from client]"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      <Reveal>
      {/* Transparency — cited Q&A, not a vague trust statement: a verdict
          first ("Yes."), then a specific, checkable source (an act, a
          section, a report) — isha.sadhguru.org's public transparency
          article uses this same verdict-first-then-cited-source shape.
          Every fact here is already stated elsewhere in this codebase
          (SiteFooter.tsx, page.tsx, docs/site-audit.md's Donate page
          crawl) — nothing new asserted here, just made explicit and
          scannable in one place. */}
      <section id="transparency" className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-12">
        <div className="rounded-lg border border-black/10 bg-white shadow-md p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-semibold">Transparency &amp; Accountability</h3>
            <Link
              href="/reports/"
              className="whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              View Audited Reports &rarr;
            </Link>
          </div>
          <dl className="mt-4 divide-y divide-black/10 border-t border-black/10">
            <div className="py-3">
              <dt className="text-sm font-semibold">Is Mukti Mission a registered, regulated organisation?</dt>
              <dd className="mt-1 text-sm text-ink-soft">
                <span className="font-semibold text-[#2d5c6b]">Yes.</span> Registered under the Societies
                Registration Act, 1950 and the Bombay Public Trust Act, 1950, and licensed under the
                Women&rsquo;s and Children&rsquo;s Institutions (Licensing) Act, 1956.
              </dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-semibold">Are donations tax-deductible?</dt>
              <dd className="mt-1 text-sm text-ink-soft">
                <span className="font-semibold text-[#2d5c6b]">Yes.</span> Donations qualify for tax
                exemption under Section 80G of the Income Tax Act.
              </dd>
            </div>
            <div className="py-3">
              <dt className="text-sm font-semibold">Can I see where donations actually go?</dt>
              <dd className="mt-1 text-sm text-ink-soft">
                <span className="font-semibold text-[#2d5c6b]">Yes.</span> Audited annual accounts and
                trust certificates are published on our{" "}
                <Link href="/reports/" className="underline hover:text-coral">
                  Reports page
                </Link>
                .
              </dd>
            </div>
          </dl>
        </div>
      </section>
      </Reveal>

      <Reveal>
        <GetInvolvedBand />
      </Reveal>
    </main>
  );
}
