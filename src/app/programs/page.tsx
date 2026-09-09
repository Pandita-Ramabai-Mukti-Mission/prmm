import Link from "next/link";
import { getAllProgramsMeta } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { PhotoBox } from "@/components/content-views/PhotoBox";

// Must match the `category` select options in public/admin/config.yml.
const CATEGORIES = [
  "Boys Home",
  "Church and Bible College",
  "Farming",
  "Home for Aged and Blind",
  "Hospital",
  "School",
];

export default async function ProgramsIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allPrograms = getAllProgramsMeta();
  const programs = category ? allPrograms.filter((p) => p.category === category) : allPrograms;
  const urgentProgram = allPrograms.find((p) => p.featured);

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Programs
      </div>
      <h1 className="mt-3 text-4xl">Our Programs</h1>
      <p className="mt-2 max-w-[60ch] text-ink-soft">
        Ministries spanning education, health, agriculture and care for the vulnerable — filter by
        category to explore.
      </p>
      {/* "14" is the org's own verified ministry count (content/pages/home.md,
          about-mukti-mission.md — sourced from site-audit.md's crawl of the
          live Impact page), named next to the real migrated count so an
          incomplete grid reads as "still migrating," not as the full roster. */}
      <p className="mt-1 text-sm text-ink-soft">
        {allPrograms.length} of our 14 real ministries have been migrated here so far.
      </p>

      {/* "Most urgent need" banner (dev-backlog.md #19) — reuses the same
          `featured` flag as the homepage spotlight rather than a second
          flag, so an editor only ever sets one switch for "the current
          priority cause." Shown above the grid regardless of the active
          category filter, since the whole point is that it doesn't get
          missed. */}
      {urgentProgram && (
        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-coral/40 bg-[#fff4f2] p-5 sm:flex-row sm:items-center">
          <span className="inline-block flex-shrink-0 self-start rounded-full bg-coral px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Most Urgent Need
          </span>
          <div className="flex-1">
            <h2 className="text-base font-semibold">{urgentProgram.title}</h2>
            {urgentProgram.description && (
              <p className="mt-1 text-sm text-ink-soft">{urgentProgram.description}</p>
            )}
          </div>
          <Link
            href={`/donate/?cause=${urgentProgram.slug}`}
            className="flex-shrink-0 rounded-md bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark"
          >
            Donate to This Cause
          </Link>
        </div>
      )}

      {/* URL-shareable filter (?category=...) — replaces the current site's
          anchor-only (#category) filter on /impact/. */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Link
          href="/programs/"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            !category ? "bg-coral text-white" : "border border-black/15"
          }`}
        >
          All ({allPrograms.length})
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/programs/?category=${encodeURIComponent(c)}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              category === c ? "bg-coral text-white" : "border border-black/15"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {programs.length === 0 ? (
        <div className="mt-8">
          <EmptyState>
            {allPrograms.length === 0
              ? "Programs are being migrated from the current site — check back soon."
              : `No programs found in "${category}" yet.`}
          </EmptyState>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p) => (
            <div key={p.slug} className="flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-md">
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
                <h3 className="mt-2.5 text-base font-semibold">{p.title}</h3>
                {p.description && <p className="mt-1.5 text-sm text-ink-soft">{p.description}</p>}
                <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                  <Link href={`/programs/${p.slug}/`} className="hover:text-coral">
                    Read More &rarr;
                  </Link>
                  <Link href={`/donate/?cause=${p.slug}`} className="text-coral hover:text-coral-dark">
                    Donate
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
