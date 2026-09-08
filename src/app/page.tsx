import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug, getAllProgramsMeta, getAllNewsMeta } from "@/lib/content";
import { GetInvolvedBand } from "@/components/GetInvolvedBand";
import { EmptyState } from "@/components/EmptyState";

// Six-tile stats strip: the most effective element on the current site
// (docs/site-audit.md), but its numbers were never dated or sourced.
// Not CMS-managed yet — flagged for the client to confirm real figures.
const STATS = [
  { value: "1,500", label: "residents cared for", asOf: "[as of — confirm]" },
  { value: "130", label: "years of service", asOf: "since 1889" },
  { value: "100,000+", label: "women & children helped", asOf: "[as of — confirm]" },
  { value: "240+", label: "acres of farm & dairy", asOf: "[as of — confirm]" },
  { value: "19", label: "locations across India", asOf: "[as of — confirm]" },
  { value: "2,400+", label: "students enrolled K-12", asOf: "[as of — confirm]" },
];

export default async function Home() {
  const page = await getPageBySlug("home");
  if (!page) notFound();

  const programs = getAllProgramsMeta().slice(0, 4);
  const news = getAllNewsMeta().slice(0, 3);

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      {/* Hero — one primary CTA, per marketing-page convention */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 py-16 sm:px-12 md:flex-row">
        <div className="flex-1">
          <h1 className="max-w-[14ch] font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {page.title}
          </h1>
          <div
            className="prose mt-4 max-w-[60ch] text-ink-soft"
            dangerouslySetInnerHTML={{ __html: page.contentHtml }}
          />
          <div className="mt-7 flex items-center gap-5">
            <Link
              href="/donate/"
              className="rounded-md bg-coral px-6 py-3 font-semibold text-white hover:bg-coral-dark"
            >
              Donate Now
            </Link>
            <Link href="/programs/" className="text-sm font-semibold hover:text-coral">
              See Our Programs &rarr;
            </Link>
          </div>
        </div>
        <div className="flex h-72 flex-1 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] p-4 text-center text-xs text-[#8a8170]">
          Specific beneficiary photo/story — not a generic campus shot
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-black/10 bg-white px-6 py-8 sm:px-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-2xl font-bold text-coral">{s.value}</div>
              <div className="mt-1 text-xs text-ink">{s.label}</div>
              <div className="mt-0.5 text-[11px] italic text-ink-soft">{s.asOf}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm">
          &#8377;500 provides a month of school supplies for one child &middot;{" "}
          <Link href="/donate/" className="font-semibold hover:text-coral">
            Give &#8377;500 now &rarr;
          </Link>
        </p>
      </section>

      {/* Mission teaser — full statements live on About, not repeated here */}
      <section className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-8 sm:px-12">
        <p className="max-w-[70ch] text-sm italic text-ink-soft">
          [One-sentence mission teaser — full Vision / Mission / Basis statements live on the About page]
        </p>
        <Link href="/about-mukti-mission/" className="whitespace-nowrap text-sm font-semibold hover:text-coral">
          Read Our Story &rarr;
        </Link>
      </section>

      {/* Latest Programs */}
      <section className="bg-[#f3efe7] px-6 py-12 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">Our Work</h2>
            <Link href="/programs/" className="text-sm font-semibold hover:text-coral">
              View all programs &rarr;
            </Link>
          </div>
          {programs.length === 0 ? (
            <div className="mt-6">
              <EmptyState>Programs are being migrated from the current site — check back soon.</EmptyState>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {programs.map((p) => (
                <div key={p.slug} className="overflow-hidden rounded-lg border border-black/10 bg-white">
                  <div className="flex h-32 items-center justify-center bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-center text-xs text-[#8a8170]">
                    {p.image?.alt ?? p.title}
                  </div>
                  <div className="p-4">
                    <span className="inline-block rounded-full bg-[#e7ecf1] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#3f5268]">
                      {p.category}
                    </span>
                    <h3 className="mt-2.5 text-base font-semibold">{p.title}</h3>
                    {p.description && <p className="mt-1.5 text-sm text-ink-soft">{p.description}</p>}
                    <div className="mt-3 flex gap-3.5 text-sm font-semibold">
                      <Link href={`/programs/${p.slug}/`} className="hover:text-coral">
                        View Program &rarr;
                      </Link>
                      <Link href={`/donate/?cause=${p.slug}`} className="text-coral hover:text-coral-dark">
                        Support this program
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest News */}
      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-12">
        <h2 className="font-serif text-2xl">News &amp; Updates</h2>
        {news.length === 0 ? (
          <div className="mt-6">
            <EmptyState>
              No news posted yet. The previous site&apos;s feed was compromised with spam — genuine posts
              are being manually curated before this section goes live (see docs/site-audit.md).
            </EmptyState>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {news.map((n) => (
              <div key={n.slug} className="overflow-hidden rounded-lg border border-black/10 bg-white">
                <div className="flex h-28 items-center justify-center bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-xs text-[#8a8170]">
                  {n.image?.alt ?? "News photo"}
                </div>
                <div className="p-4">
                  <div className="text-xs text-ink-soft">
                    {n.date && new Date(n.date).toLocaleDateString()}
                  </div>
                  <h3 className="mt-1.5 text-sm font-semibold">{n.title}</h3>
                  {n.description && <p className="mt-1 text-sm text-ink-soft">{n.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <GetInvolvedBand />
    </main>
  );
}
