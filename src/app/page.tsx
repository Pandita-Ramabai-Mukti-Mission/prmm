import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPageBySlug,
  getAllProgramsMeta,
  getAllNewsMeta,
  getHomeHeroSlides,
} from "@/lib/content";
import { GetInvolvedBand } from "@/components/GetInvolvedBand";
import { EmptyState } from "@/components/EmptyState";
import { PhotoBox } from "@/components/content-views/PhotoBox";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { SocialIcon, VERIFIED_SOCIAL_LINKS } from "@/components/socialLinks";
import { LegacyMotif } from "@/components/LegacyMotif";
import { RootGrowthMotif } from "@/components/RootGrowthMotif";
import { HeroCarousel } from "@/components/HeroCarousel";
import { MissionFoundationBand } from "@/components/MissionFoundationBand";

// One thin line icon per stat, no circle/background — matches a reference
// layout the client shared (plain line icons, heading above, single button
// below), redrawn as original icons rather than reusing that reference's
// actual icon set. Coral (not the reference's gold) since this section
// moved to a white background — coral already reads as this site's own
// single-accent color for numbers/CTAs everywhere else.
// Redrawn as a genuinely curved, single-weight set (bezier curves
// throughout, no straight-edged rectangles/triangles) after feedback that
// the first pass — built from more geometric primitives (a rectangle
// calendar, a triangular graduation cap) — didn't read as "curved."
function HomeIcon() {
  // A sheltering arc rather than an angular roofline — reads as
  // "shelter/care" (residents) without a literal boxy house shape.
  return (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 12.5C3.5 7 7 3 12 3s8.5 4 8.5 9.5" />
      <path d="M5.5 12v6.5c0 1.4 1.1 2.5 2.5 2.5h8c1.4 0 2.5-1.1 2.5-2.5V12" />
      <path d="M9.5 21v-4.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V21" />
    </svg>
  );
}
function YearsIcon() {
  // A laurel-sprig curl around a small core — "years of service / legacy"
  // instead of a literal grid-lined calendar.
  return (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="4.5" />
      <path d="M8 20c-2.5-1-4.5-2.7-5.5-5 1.8.3 3 0 3.8-1" />
      <path d="M16 20c2.5-1 4.5-2.7 5.5-5-1.8.3-3 0-3.8-1" />
      <path d="M9.5 20.5c1.6.7 3.4.7 5 0" />
    </svg>
  );
}
function HeartHandsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.2C7 17 2.7 13.4 2.7 9.4 2.7 6.4 5 4.2 7.7 4.2c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.7 0 5 2.2 5 5.2 0 4-4.3 7.6-9.3 10.8z" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 19.5C3 12 7 4.5 19.5 4.5c1 12.5-6.5 16.5-15 15z" />
      <path d="M4.8 19.2c3-4.5 6.5-7.8 11.7-10.4" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.5c-4.5-4.8-7-8.6-7-12A7 7 0 0119 9.5c0 3.4-2.5 7.2-7 12z" />
      <circle cx="12" cy="9.3" r="2.4" />
    </svg>
  );
}
function BookIcon() {
  // An open book, all curved pages — reads as "education/students" without
  // the earlier graduation cap's straight-edged triangle.
  return (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.5c-1.8-2-4.7-2.6-7.3-1.6a1 1 0 00-.7 1v11.6c0 .7.7 1.2 1.4.9 2.3-.8 4.9-.3 6.6 1.6" />
      <path d="M12 6.5c1.8-2 4.7-2.6 7.3-1.6a1 1 0 01.7 1v11.6c0 .7-.7 1.2-1.4.9-2.3-.8-4.9-.3-6.6 1.6" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

// Six-tile stats strip: the most effective element on the current site
// (docs/site-audit.md). Values are exactly what's already published on the
// live prmm.org.in homepage today — not re-derived or estimated, so no
// per-tile "[confirm]" placeholder. The live site itself never dates or
// sources them (site-audit.md, Page inventory) — that's a real limitation
// inherited from the source, disclosed once below rather than hedged six
// times with dev-scaffolding brackets that shouldn't reach production.
// Not CMS-managed yet; still worth the client re-confirming these are
// current whenever they next update the source figures.
const STATS = [
  { value: "1,500", label: "residents cared for", Icon: HomeIcon },
  { value: "130", label: "years of service", asOf: "since 1889", Icon: YearsIcon },
  { value: "100,000+", label: "women & children helped", Icon: HeartHandsIcon },
  { value: "240+", label: "acres of farm & dairy", Icon: LeafIcon },
  { value: "19", label: "locations across India", Icon: PinIcon },
  { value: "2,400+", label: "students enrolled K-12", Icon: BookIcon },
];

export default async function Home() {
  const page = await getPageBySlug("home");
  const ramabaiPage = await getPageBySlug("about-pandita-ramabai");
  const missionPage = await getPageBySlug("about-mukti-mission");
  if (!page) notFound();

  const allPrograms = getAllProgramsMeta();
  const programs = allPrograms.slice(0, 4);
  const featuredProgram = allPrograms.find((p) => p.featured);
  const news = getAllNewsMeta().slice(0, 3);
  const heroSlides = getHomeHeroSlides();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      {/* 1. Hero — restored as the real prmm.org.in homepage's own 3-slide
          rotator (see HeroCarousel.tsx) instead of the single static hero
          this rebuild used before. (A prior pass also tried a scattered
          generic-icon background here to echo other NGO/wellness sites —
          pulled after review, see dev-backlog.md #56 — unrelated to this
          change, noted so the same mistake isn't retried.) */}
      <HeroCarousel slides={heroSlides} />

      {/* Highlighted trust callout — same "one bold, unmissable fact right
          under the hero" treatment a reference site (isha.sadhguru.org)
          uses for its own headline stats, applied here to PRMM's own real
          legal/tax facts instead of a plain muted disclosure line. */}
      <div className="border-b border-black/10 bg-[#e7ecf1] px-6 py-5 sm:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2.5 text-center sm:flex-row sm:gap-3.5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3f5268"
            strokeWidth={2}
            className="flex-shrink-0"
            aria-hidden="true"
          >
            <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <p className="text-sm font-semibold text-[#3f5268] sm:text-base">
            Registered under the <span className="text-coral">Societies Registration Act (1950)</span> &amp;{" "}
            <span className="text-coral">Bombay Public Trust Act (1950)</span> &middot; Donations are{" "}
            <span className="text-coral">tax-exempt under Section 80G</span>
          </p>
        </div>
      </div>

      {/* 2. Stats strip — credibility signal right after the emotional hook.
          Bold dark band (bg-ink) rather than the previous plain white —
          one of two color-blocked sections added to give the homepage the
          visual rhythm/richness a reference site (isha.sadhguru.org) has
          through bold section banding, applied with our own brand colors.
          Numbers count up on scroll (CountUp) purely as presentation — the
          value shown at rest is identical to the source string, animation
          never changes what's actually claimed. */}
      <Reveal>
        <section className="relative overflow-hidden bg-white px-6 py-20 sm:px-12">
          {/* White, not the earlier bg-ink — this section sits directly
              under the photo-heavy hero carousel, and the Legacy section
              right after it is already the tan (#f3efe7) band; three heavy/
              dark sections back to back would read flat instead of giving
              the page rhythm, so this one stays light per
              docs/design-system.md's "alternate bold with neutral" rule.
              This section's one decorative motif — see RootGrowthMotif.tsx
              (already used on Donate) — now a light coral tint rather than
              white-on-dark, so it still reads against the white background. */}
          <RootGrowthMotif className="pointer-events-none absolute -right-16 -bottom-16 h-72 w-72 text-coral/[0.08] sm:h-96 sm:w-96" />
          {/* No heading or Donate CTA here by request — the numbers carry the
              section on their own; the Donate ask already appears in the
              hero and the trust callout right above this section. */}
          <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center">
                <span className="mb-3 flex h-14 w-14 flex-shrink-0 items-center justify-center text-coral">
                  <s.Icon />
                </span>
                <div className="text-3xl font-bold leading-tight tracking-tight text-coral">
                  <CountUp value={s.value} />
                </div>
                <div className="mt-1.5 text-sm leading-snug text-ink">{s.label}</div>
                {s.asOf && <div className="mt-0.5 text-xs italic leading-snug text-ink-soft">{s.asOf}</div>}
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 3. Legacy — Pandita Ramabai's own story is the site's strongest, most
          distinctive trust/brand asset (a named historical figure, not
          generic NGO copy). Reuses the real About Pandita Ramabai copy
          instead of restating it, so the two pages can't drift apart. */}
      {ramabaiPage && (
        <Reveal>
        <section className="relative overflow-hidden bg-[#f3efe7] px-6 py-20 sm:px-12">
          <LegacyMotif className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 text-coral/[0.14] md:h-96 md:w-96" />
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-14 md:flex-row">
            <div className="flex h-56 w-full flex-shrink-0 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-center text-xs text-[#8a8170] md:h-64 md:w-64">
              Portrait of Pandita Ramabai
            </div>
            <div className="flex-1">
              <h2 className="text-3xl text-ink">The Life of Pandita Ramabai</h2>
              <div
                className="prose mt-3 max-w-[65ch] text-ink-soft"
                dangerouslySetInnerHTML={{ __html: ramabaiPage.contentHtml }}
              />
              <Link
                href="/about-pandita-ramabai/"
                className="mt-4 inline-block text-base font-semibold hover:text-coral"
              >
                Read Her Full Story &rarr;
              </Link>
            </div>
          </div>
        </section>
        </Reveal>
      )}

      {/* 4. Our Foundation — Vision / Mission / Basis, the site's three
          core doctrinal statements, restored from the real About Mukti
          Mission page copy (previously a single teaser sentence while
          this content was still pending from the client). Dark band
          layout technique — bg-ink per docs/design-system.md's "one dark
          color only" rule, curved single-accent line icons, a decorative
          flourish under the heading — echoes a reference layout the
          client shared; icons and flourish are redrawn originals, not
          that reference's actual glyphs (which were seated-meditation-
          pose figures, specific to that site's own practice/branding and
          unrelated to this content). */}
      {missionPage && (
        <Reveal>
          <MissionFoundationBand ctaHref="/about-mukti-mission/" />
        </Reveal>
      )}

      {/* 5. Soft ask beside hard ask — isha.sadhguru.org pairs a
          lower-friction ask (Volunteer) directly beside the higher-friction
          one (Donate) in one bold band. There's no real volunteer program
          in this org's content though (GetInvolvedBand.tsx's own comment,
          dev-backlog.md #52 — a prior pass invented one and had to walk it
          back), so the left column stays honest: "get in touch about
          helping another way," not a fabricated program. The right column
          is the existing Featured Cause hard ask, unchanged. (Angled
          section edges were tried and reverted — see dev-backlog.md #64 —
          straight edges only.) */}
      <Reveal>
      <section className="bg-coral px-6 py-20 sm:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/70">Get Involved</div>
            <h2 className="mt-1.5 text-2xl leading-snug text-white">
              Money isn&rsquo;t the only way to help
            </h2>
            <p className="mt-2 max-w-[44ch] text-base text-white/85">
              Want to give your time, skills or connections instead? We&rsquo;d still like to hear from
              you.
            </p>
            <Link
              href="/contact/?interest=volunteer"
              className="mt-4 inline-block w-fit rounded-md bg-white px-5 py-2.5 text-base font-semibold text-coral hover:bg-white/90"
            >
              Get in Touch &rarr;
            </Link>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
              How You Can Help Right Now
            </div>
            {featuredProgram ? (
              <div className="mt-2.5 flex flex-col gap-6 rounded-lg border border-black/10 bg-white shadow-md p-6">
                <PhotoBox
                  image={featuredProgram.image}
                  placeholderLabel={featuredProgram.title}
                  recommendedSize="800×600"
                  className="flex h-40 flex-shrink-0 rounded-lg text-center text-xs"
                />
                <div className="flex-1">
                  <span className="inline-block rounded-full bg-[#e7ecf1] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#3f5268]">
                    {featuredProgram.category}
                  </span>
                  <h3 className="mt-2.5 text-xl font-semibold">{featuredProgram.title}</h3>
                  {featuredProgram.description && (
                    <p className="mt-1.5 text-base text-ink-soft">{featuredProgram.description}</p>
                  )}
                  <Link
                    href={`/donate/?cause=${featuredProgram.slug}`}
                    className="mt-4 inline-block rounded-md bg-coral px-5 py-2.5 text-base font-semibold text-white hover:bg-coral-dark"
                  >
                    Donate to This Cause
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-2.5">
                <EmptyState>
                  No cause is currently featured. Mark one program &quot;Feature on homepage&quot; in
                  the CMS to spotlight a specific, current need here.
                </EmptyState>
              </div>
            )}
          </div>
        </div>
      </section>
      </Reveal>

      {/* 6. Our Work — breadth, after the specific ask. Single CTA per card
          ("View Program", no per-card Donate) deliberately, so this section
          doesn't compete with the Featured Cause ask right above it or the
          Get Involved band right below — one clear ask per screen, not four
          more. The per-cause Donate link stays on the full /programs/ index
          (dev-backlog.md #19), where there's no adjacent ask to dilute. */}
      <Reveal>
      <section className="bg-[#f3efe7] px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl">Our Work</h2>
            <Link href="/programs/" className="text-base font-semibold hover:text-coral">
              View all programs &rarr;
            </Link>
          </div>
          {/* "14" is the real ministry count from the org's own verified copy
              (content/pages/home.md, about-mukti-mission.md — sourced from
              site-audit.md's crawl of the live Impact page), not invented
              here. Naming the total next to a partial grid signals "there's
              more, still migrating" instead of implying this is everything. */}
          <p className="mt-2 max-w-[60ch] text-base text-ink-soft">
            {programs.length > 0
              ? `Featuring ${programs.length} of our 14 ministries caring for women and children across India.`
              : "14 ministries caring for women and children across India — being migrated below."}
          </p>
          {programs.length === 0 ? (
            <div className="mt-6">
              <EmptyState>Programs are being migrated from the current site — check back soon.</EmptyState>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {programs.map((p) => (
                <div key={p.slug} className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-md">
                  <PhotoBox
                    image={p.image}
                    placeholderLabel={p.title}
                    recommendedSize="800×600"
                    className="flex h-32 text-center text-xs"
                  />
                  <div className="p-4">
                    <span className="inline-block rounded-full bg-[#e7ecf1] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#3f5268]">
                      {p.category}
                    </span>
                    <h3 className="mt-2.5 text-lg font-semibold">{p.title}</h3>
                    {p.description && <p className="mt-1.5 text-base text-ink-soft">{p.description}</p>}
                    <Link
                      href={`/programs/${p.slug}/`}
                      className="mt-3 inline-block text-base font-semibold hover:text-coral"
                    >
                      View Program &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      </Reveal>

      {/* 7. Get Involved — broad CTA once breadth of work is established */}
      <Reveal>
        <GetInvolvedBand />
      </Reveal>

      {/* 8. Latest News — proof the org is active right now, immediately
          before the footer's contact details so a convinced visitor can act. */}
      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl">News &amp; Updates</h2>
          {news.length > 0 && (
            <Link href="/news/" className="text-base font-semibold hover:text-coral">
              View all news &rarr;
            </Link>
          )}
        </div>
        {news.length === 0 ? (
          <div className="mt-6">
            <EmptyState>
              No news posted yet. The previous site&apos;s feed was compromised with spam — genuine posts
              are being manually curated before this section goes live (see docs/site-audit.md).
            </EmptyState>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-3">
            {news.map((n) => (
              <Link
                key={n.slug}
                href={`/news/${n.slug}/`}
                className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-md"
              >
                <PhotoBox
                  image={n.image}
                  placeholderLabel="News photo"
                  recommendedSize="800×600"
                  className="flex h-28 text-xs"
                />
                <div className="p-4">
                  <div className="text-xs text-ink-soft">
                    {n.date && new Date(n.date).toLocaleDateString()}
                  </div>
                  <h3 className="mt-1.5 text-base font-semibold">{n.title}</h3>
                  {n.description && <p className="mt-1 text-base text-ink-soft">{n.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      </Reveal>

      {/* 9. Follow us — honest version: real platform icon, no follower
          count. Facebook is the one channel site-audit.md confirms is
          actually live on the original site; showing a made-up subscriber
          number here would be the same category of problem as the removed
          impact-claim fabrications (#53, #55). Add other platforms/numbers
          back only once the client confirms real, current handles. */}
      <Reveal>
        <section className="border-t border-black/10 bg-white px-6 py-12 sm:px-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Follow Our Work</h2>
              <p className="mt-0.5 text-sm text-ink-soft">
                Stay connected with updates from Kedgaon and beyond.
              </p>
            </div>
            <div className="flex gap-2.5">
              {VERIFIED_SOCIAL_LINKS.map((s) => (
                <SocialIcon
                  key={s.label}
                  link={s}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-ink-soft hover:border-coral hover:text-coral"
                />
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
