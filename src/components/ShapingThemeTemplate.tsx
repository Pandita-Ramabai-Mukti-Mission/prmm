import Link from "next/link";
import { getAllProgramsMeta } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { Reveal } from "@/components/Reveal";
import { GetInvolvedBand } from "@/components/GetInvolvedBand";
import { PhotoBox } from "@/components/content-views/PhotoBox";
import { ThemeBannerSlider } from "@/components/ThemeBannerSlider";

// Content below is paraphrased from the live prmm.org.in "Shaping the…"
// pages (fetched 2026-09-11), not copied verbatim — each page there repeats
// the same opening paragraph about Ramabai, then a short theme-specific
// paragraph, an Isaiah 61 citation, and a bank of related project cards
// with a small photo carousel banner up top. Structure follows that
// pattern; wording here is original. Banner photos stay placeholders (see
// ThemeBannerSlider) until the client supplies real ones.
const THEME_META = {
  Mind: {
    label: "Education",
    intro:
      "Ramabai believed in shaping the mind, not just filling the head — a philosophy that has guided the Mission's schools since Sharada Sadan opened in 1889 and continues today through its primary, high school, junior college and special-needs education.",
    bannerLabel: "Manorama Memorial School campus",
  },
  Spirit: {
    label: "Health",
    intro:
      "Good healthcare changes more than the body — it restores dignity to people who could otherwise never afford treatment. Krishnabai Memorial Hospital carries that conviction forward at Kedgaon today, alongside the Mission's mobile medical outreach.",
    bannerLabel: "Krishnabai Memorial Hospital",
  },
  Heart: {
    label: "Care for the vulnerable",
    intro:
      "Mukti's homes for the aged and the blind trace back to the famine relief of 1896-97, when hundreds of starving women and children were brought to Kedgaon. Over 130 years on, that same commitment to the overlooked continues through Priti Sadan, Bartimi Sadan and Krupa Sadan.",
    bannerLabel: "Residents at Mukti's homes",
  },
  Environment: {
    label: "Agriculture & sustainability",
    intro:
      "Decades-fallow land at Kedgaon has been restored, well by well and field by field, into farmland growing sugarcane, wheat, vegetables and more — alongside a small dairy herd and goatery — feeding the community and building a more self-sustaining Mission.",
    bannerLabel: "Mukti Farm",
  },
  Destiny: {
    label: "Spiritual formation",
    intro:
      "Faith has shaped Mukti from its first church service to the Bible college it runs today. The Mission's own church, its cornerstone laid in 1899, still stands at the heart of the Kedgaon campus, and Agape Bible Institute now trains ministry leaders across Maharashtra.",
    bannerLabel: "Pandita Ramabai Mukti Mission Church",
  },
} as const;

export type ShapingTheme = keyof typeof THEME_META;

export function ShapingThemeTemplate({ theme }: { theme: ShapingTheme }) {
  const meta = THEME_META[theme];
  const programs = getAllProgramsMeta().filter((p) => p.theme === theme);

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-12">
        <div className="text-sm text-ink-soft">
          <Link href="/">Home</Link> / <Link href="/programs/">Our Work</Link> / Shaping the {theme}
        </div>

        <div className="mt-6">
          <ThemeBannerSlider
            images={programs.filter((p) => p.image?.src).map((p) => p.image!)}
            placeholderLabel={meta.bannerLabel}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-coral px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              {meta.label}
            </span>
            <h1 className="mt-3 text-4xl">Shaping the {theme}</h1>
          </div>
          <Link
            href="/donate/"
            className="rounded-md bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark"
          >
            Support This Work &rarr;
          </Link>
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 pb-14 sm:px-12">
        <blockquote className="border-l-4 border-coral pl-5 text-xl italic">
          &ldquo;The Spirit of the Sovereign Lord is on me, because the Lord has anointed me to
          proclaim good news to the poor. He has sent me to bind up the brokenhearted, to proclaim
          freedom for the captives and release from darkness for the prisoners.&rdquo;
          <cite className="mt-2 block text-sm not-italic text-ink-soft">Isaiah 61:1, 4</cite>
        </blockquote>
        <p className="mt-5 max-w-[70ch] text-ink-soft">{meta.intro}</p>
      </section>
      </Reveal>

      <Reveal>
      <section className="bg-[#f3efe7] px-6 py-14 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl">Programs in this theme</h2>
          {programs.length === 0 ? (
            <div className="mt-5">
              <EmptyState>Programs for this theme are being migrated from the current site.</EmptyState>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <Link
                  key={p.slug}
                  href={`/programs/${p.slug}/`}
                  className="flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-md"
                >
                  <PhotoBox
                    image={p.image}
                    placeholderLabel={p.title}
                    recommendedSize="800×600"
                    className="flex h-32 text-center text-xs"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{p.title}</h3>
                    {p.description && <p className="mt-1.5 text-sm text-ink-soft">{p.description}</p>}
                    <span className="mt-3 inline-block text-sm font-semibold hover:text-coral">
                      View Program &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      </Reveal>

      {/* This template had no donate path at all before — confirmed missing
          during today's artifact-vs-dev review. No per-theme cause bucket
          exists in the donation form (causes are per-program), so this
          links to the general Donate page rather than inventing a
          theme-scoped query param the backend doesn't support. */}
      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-black/10 bg-white shadow-md p-6">
          <div>
            <h3 className="font-semibold">Support the programs shaping the {theme.toLowerCase()}</h3>
            <p className="mt-1 text-sm text-ink-soft">Your gift helps fund every ministry in this theme.</p>
          </div>
          <Link
            href="/donate/"
            className="whitespace-nowrap rounded-md bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark"
          >
            Donate Now &rarr;
          </Link>
        </div>
      </section>
      </Reveal>

      <Reveal>
        <GetInvolvedBand />
      </Reveal>
    </main>
  );
}
