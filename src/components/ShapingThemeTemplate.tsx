import Link from "next/link";
import { getAllProgramsMeta } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";

const THEME_META = {
  Mind: { label: "Education", blurb: "Education has been central to Mukti Mission since Sharada Sadan opened in 1891." },
  Spirit: { label: "Health", blurb: "Physical care and healing, from the Mission's earliest days to Krishnabai Memorial Hospital today." },
  Heart: { label: "Care for the vulnerable", blurb: "A home for those the world overlooks — the aged, the blind, the abandoned." },
  Environment: { label: "Agriculture & sustainability", blurb: "The land at Kedgaon has fed and employed the mission's community for over a century." },
  Destiny: { label: "Spiritual formation", blurb: "Faith formation and ministry training, carrying Ramabai's calling forward." },
} as const;

export type ShapingTheme = keyof typeof THEME_META;

export function ShapingThemeTemplate({ theme }: { theme: ShapingTheme }) {
  const meta = THEME_META[theme];
  const programs = getAllProgramsMeta().filter((p) => p.theme === theme);

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-12">
        <div className="text-sm text-ink-soft">
          <Link href="/">Home</Link> / About / Shaping the {theme}
        </div>
        <span className="mt-3 inline-block rounded-full bg-coral px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          {meta.label}
        </span>
        <h1 className="mt-3 font-serif text-4xl">Shaping the {theme}</h1>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-10 sm:px-12">
        <blockquote className="border-l-4 border-coral pl-5 font-serif text-xl italic">
          &ldquo;[Isaiah 61:1&amp;4 citation]&rdquo;
        </blockquote>
        <p className="mt-5 max-w-[70ch] text-ink-soft">
          [Opening Ramabai paragraph, repeated across all 5 theme pages] &mdash; {meta.blurb}
        </p>
      </section>

      <section className="bg-[#f3efe7] px-6 py-10 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-xl">Programs in this theme</h2>
          {programs.length === 0 ? (
            <div className="mt-5">
              <EmptyState>Programs for this theme are being migrated from the current site.</EmptyState>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {programs.map((p) => (
                <Link
                  key={p.slug}
                  href={`/programs/${p.slug}/`}
                  className="flex items-center gap-4 rounded-lg border border-black/10 bg-white p-4"
                >
                  <div className="flex h-[70px] w-[70px] flex-shrink-0 items-center justify-center rounded-md bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-[10px] text-[#8a8170]">
                    Photo
                  </div>
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <span className="text-sm font-semibold hover:text-coral">View Program &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
