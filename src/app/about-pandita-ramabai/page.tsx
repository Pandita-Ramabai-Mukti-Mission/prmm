import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { LegacyMotif } from "@/components/LegacyMotif";

// Editorial redesign of this page (2026-09-11), matching a layout the
// client shared (hero + quick facts, sticky chapter nav, two-column
// narrative with a sidebar factsheet, archival gallery, milestone
// timeline, closing pull-quote, CTA band). The visual structure follows
// that reference; the CONTENT does not — the reference's own narrative
// text invents specific life-story beats and dates (birthplace, husband's
// name, exact founding-day, specific famine-relief numbers, a 1989 postal
// stamp, sourced quotes) that were never confirmed against prmm.org.in or
// a primary source. That's the exact problem the biography content hit
// once already (see git history: "Strip unverified biography content"),
// so only facts already verified elsewhere in this codebase are used here
// — 1858/1922 life dates and the founding-story/registration/Kaiser-i-Hind
// paragraphs from content/pages/about-pandita-ramabai.md, and the 1889
// founding year + service stats already asserted on the homepage
// (src/app/page.tsx's STATS). Anything the mockup added beyond that is
// marked as a placeholder for the client to confirm or supply, not
// presented as fact.

const QUICK_FACTS = [
  { label: "Founded", value: "1889" },
  { label: "Location", value: "Kedgaon, Maharashtra" },
  { label: "Continuity", value: "130+ Years" },
];

const CHAPTERS = [
  {
    id: "founding",
    kicker: "1858 – 1889",
    title: "From Reformer to Founder",
    paragraphs: [
      "Ramabai Dongre-Medhavi was a champion for the emancipation of women and a pioneer in education. In the late 1800s, seeing the need around her, she began a home for widows — a home that grew into Pandita Ramabai Mukti Mission, \"Mukti\" meaning freedom, liberation and salvation. For over 130 years the mission she started has continued to serve orphaned, destitute and disabled women and children, irrespective of caste, creed, religion or status.",
    ],
  },
  {
    id: "scholarship",
    kicker: "Recognition",
    title: "The Pandita Title & the Kaiser-i-Hind Medal",
    paragraphs: [
      "From its founding, education was central to her work: Ramabai herself was an exceptionally well-educated social reformer, and remains the only woman ever conferred the title \"Pandita\" for her command of Sanskrit. In 1919, the British Empire honoured her with the Kaiser-i-Hind Medal for her services to Indian society.",
    ],
  },
];

export default async function AboutRamabai() {
  const page = await getPageBySlug("about-pandita-ramabai");
  if (!page) notFound();

  return (
    <main id="main-content" className="flex flex-1 flex-col bg-paper">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 text-sm text-ink-soft sm:px-12">
        <Link href="/">Home</Link> / About / Pandita Ramabai
      </div>

      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden px-6 py-14 sm:px-12">
          <LegacyMotif className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 text-coral/[0.12] md:h-96 md:w-96" />
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 md:flex-row md:items-start">
            <div className="max-w-2xl flex-1">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-coral">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-coral" />
                Heritage &amp; Foundations
              </div>
              <h1 className="text-4xl leading-tight text-ink sm:text-5xl">
                A Legacy of Faith, Courage &amp; 130+ Years of Unbroken Service
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
                The story of Pandita Ramabai Dongre-Medhavi and the founding of Mukti Mission at
                Kedgaon — an enduring source of restorative hope and female agency.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                {QUICK_FACTS.map((f, i) => (
                  <div key={f.label} className="flex items-center gap-8">
                    {i > 0 && <span className="h-8 w-px bg-black/10" />}
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-ink-soft">{f.label}</span>
                      <span className="text-lg font-semibold text-ink">{f.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex-shrink-0 sm:w-80">
              <div className="rounded-xl bg-white p-2 shadow-md">
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-lg border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-center text-xs text-[#8a8170]">
                  Portrait — Pandita Ramabai
                </div>
                <p className="px-2 py-3 text-center text-sm italic text-ink-soft">
                  Pandita Ramabai (1858 – 1922)
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Quick chapter nav */}
      <div className="sticky top-0 z-30 border-y border-black/10 bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-6 py-3 sm:px-12">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-ink-soft">
            In This Chapter:
          </span>
          {CHAPTERS.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="shrink-0 text-sm text-ink-soft transition-colors hover:text-coral"
            >
              {c.title}
            </a>
          ))}
          <a href="#gallery" className="shrink-0 text-sm text-ink-soft transition-colors hover:text-coral">
            Gallery
          </a>
          <a href="#timeline" className="shrink-0 text-sm font-semibold text-coral">
            Chronology
          </a>
        </div>
      </div>

      {/* Narrative + sidebar */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-14 px-6 py-16 sm:px-12 lg:grid-cols-12">
        <article className="flex flex-col gap-14 lg:col-span-8">
          {CHAPTERS.map((c) => (
            <Reveal key={c.id}>
              <section id={c.id} className="scroll-mt-32">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                    {c.kicker}
                  </span>
                  <span className="h-1 w-6 bg-coral/40" />
                </div>
                <h2 className="text-3xl text-ink">{c.title}</h2>
                <div className="prose mt-4 max-w-[68ch] text-ink-soft">
                  {c.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}

          <Reveal>
            <blockquote className="rounded-xl border-l-4 border-coral bg-white p-6 text-xl italic text-ink shadow-md">
              &ldquo;[A Ramabai quote — distinct from the one used on the Mukti Mission page.
              Confirm wording and source with the client before publishing.]&rdquo;
            </blockquote>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/donate/"
                className="inline-block rounded-md bg-coral px-7 py-3 text-sm font-semibold text-white hover:bg-coral-dark"
              >
                Support This Legacy &rarr;
              </Link>
              <Link href="/about-mukti-mission/" className="text-sm font-semibold text-ink hover:text-coral">
                Read About Mukti Mission &rarr;
              </Link>
              <Link href="/programs/" className="text-sm font-semibold text-ink hover:text-coral">
                See Her Legacy in Action &rarr;
              </Link>
            </div>
          </Reveal>
        </article>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 lg:col-span-4">
          <Reveal>
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-ink">Archival Factsheet</h3>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-ink-soft">Life dates</span>
                  <span className="font-medium text-ink">23 Apr 1858 – 5 Apr 1922</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-ink-soft">Honorific title</span>
                  <span className="font-medium text-coral">Pandita (for command of Sanskrit)</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-ink-soft">Government distinction</span>
                  <span className="text-ink">Kaiser-i-Hind Medal (1919)</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-ink-soft">Mission founded</span>
                  <span className="text-ink">1889, Kedgaon</span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-xl border border-black/10 bg-[#f3efe7] p-6 shadow-md">
              <span className="text-xs uppercase tracking-wider text-ink-soft">Continuous Service</span>
              <div className="my-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-coral">130+</span>
                <span className="text-sm text-ink-soft">years since founding</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">
                Serving orphaned, destitute and disabled women and children at Kedgaon,
                irrespective of caste, creed, religion or status.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-xl border border-black/10 bg-white p-4 shadow-md">
              <span className="mb-2 block text-xs uppercase tracking-wider text-ink-soft">
                Geographic Location
              </span>
              <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-black/15 bg-[#ece7dd] text-center text-xs text-[#8a8170]">
                Map — Kedgaon, Daund Taluka,
                <br />
                Pune District, Maharashtra
              </div>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* Archival gallery — placeholders, not fabricated photos: no real
          archival photos have been supplied yet, and the site's imagery
          policy (docs/design-system.md) rules out generating stand-ins for
          documentary photos of a real person/place. */}
      <Reveal>
        <section id="gallery" className="scroll-mt-32 bg-[#f3efe7] px-6 py-16 sm:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-coral">
                  Photographic Evidence
                </span>
                <h2 className="mt-1 text-2xl text-ink sm:text-3xl">The Kedgaon Archive</h2>
              </div>
              <p className="max-w-md text-sm text-ink-soft">
                Placeholders awaiting real photographs from the mission&rsquo;s own archive —
                nothing here is a stand-in photo.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {["Early mission life at Kedgaon", "Community & residents", "The Kedgaon campus"].map(
                (label) => (
                  <div key={label} className="rounded-xl bg-white p-2 shadow-md">
                    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-center text-xs text-[#8a8170]">
                      Photo pending
                    </div>
                    <p className="px-2 py-3 text-sm text-ink-soft">{label}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Chronology — only entries already verified elsewhere in this
          codebase. Additional milestones (e.g. Arya Mahila Samaj, Sharada
          Sadan's opening date, famine-relief numbers) appear in the
          client's reference mockup but aren't confirmed against a source
          yet, so they're listed as open items rather than invented. */}
      <Reveal>
        <section id="timeline" className="scroll-mt-32 px-6 py-20 sm:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-coral">
              Chronology
            </span>
            <h2 className="mt-1 text-3xl text-ink">Milestones</h2>
          </div>
          <div className="relative mx-auto mt-14 max-w-2xl">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-black/10 sm:left-1/2" />
            <div className="flex flex-col gap-10">
              {[
                { year: "1858", title: "Birth", body: "Born 23 April 1858." },
                {
                  year: "1889",
                  title: "Mukti Mission Founded",
                  body: "The home for widows Ramabai began grows into Pandita Ramabai Mukti Mission at Kedgaon.",
                },
                {
                  year: "1919",
                  title: "Kaiser-i-Hind Medal",
                  body: "Honoured by the British Empire for her services to Indian society.",
                },
                { year: "1922", title: "Passing", body: "Died 5 April 1922." },
                {
                  year: "Present",
                  title: "Ongoing Service",
                  body: "130+ years of continuous service to orphaned, destitute and disabled women and children.",
                },
              ].map((item, i) => (
                <div key={item.year} className="relative flex flex-col gap-4 pl-12 sm:flex-row sm:pl-0">
                  <div className="absolute left-4 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-coral sm:left-1/2" />
                  <div className={`sm:w-1/2 ${i % 2 === 0 ? "sm:pr-10 sm:text-right" : "sm:order-2 sm:pl-10"}`}>
                    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-md">
                      <span className="text-xs font-semibold uppercase tracking-widest text-coral">
                        {item.year}
                      </span>
                      <h3 className="mt-1 text-lg font-semibold text-ink">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                    </div>
                  </div>
                  {i % 2 === 0 && <div className="hidden sm:block sm:w-1/2" />}
                </div>
              ))}
              <div className="relative flex flex-col gap-4 pl-12 sm:flex-row sm:pl-0">
                <div className="absolute left-4 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-black/20 sm:left-1/2" />
                <div className="sm:order-2 sm:w-1/2 sm:pl-10">
                  <div className="rounded-xl border border-dashed border-black/15 bg-[#f3efe7] p-5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                      Open items
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      More milestones (e.g. Sharada Sadan&rsquo;s founding, famine-relief efforts,
                      later honours) can be added here once confirmed with the client or a primary
                      source.
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block sm:w-1/2" />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Closing CTA band */}
      <Reveal>
        <section className="bg-[#f3efe7] px-6 py-14 sm:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-8 rounded-2xl bg-white p-8 shadow-md lg:flex-row lg:p-10">
              <div className="max-w-xl text-center lg:text-left">
                <span className="text-xs font-semibold uppercase tracking-widest text-coral">
                  The Stewardship Continues
                </span>
                <h2 className="mt-1 text-2xl text-ink sm:text-3xl">
                  Walk Alongside Our 130+ Year Mission
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Every woman and child served today at Kedgaon traces their lineage to Pandita
                  Ramabai&rsquo;s vision. See how that work continues.
                </p>
              </div>
              <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                <Link
                  href="/programs/"
                  className="inline-flex items-center justify-center rounded-md border border-black/10 bg-[#f3efe7] px-6 py-3 text-sm font-semibold text-ink hover:bg-black/5"
                >
                  Explore Our Programs
                </Link>
                <Link
                  href="/donate/"
                  className="inline-flex items-center justify-center rounded-md bg-coral px-6 py-3 text-sm font-semibold text-white hover:bg-coral-dark"
                >
                  Donate Today
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
