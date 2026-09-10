import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import { PhotoBox } from "@/components/content-views/PhotoBox";
import { Reveal } from "@/components/Reveal";

// Redesigned from a two-column "photo beside a long single block of text"
// layout into a long-form editorial layout — hero band, article with a
// sticky facts sidebar, closing CTA — the structural technique of a
// reference layout the client shared. Only the LAYOUT TECHNIQUE is
// reused, not that reference's own content.
//
// A prior pass here also added a Milestones timeline, a pull-quote and
// specific birth/death dates — all independently drafted from general
// historical knowledge, not verified against prmm.org.in or any primary
// source. When asked directly whether this page's content matched the
// live site, it didn't, and that's not acceptable for a page about a
// real person — removed rather than kept "as unverified," per the
// client's own call. Everything below is only what's actually confirmed
// on the live /about-pandita-ramabai/ page (fetched directly — see
// content/pages/about-pandita-ramabai.md, which has no bracketed/pending
// notes left because nothing here is invented).
export default async function AboutRamabai() {
  const page = await getPageBySlug("about-pandita-ramabai");
  if (!page) notFound();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 text-sm text-ink-soft sm:px-12">
        <Link href="/">Home</Link> / About / Pandita Ramabai
      </div>

      {/* Hero — title and a full-width portrait, replacing the old
          side-by-side "photo beside a whole page of text" pairing. No
          birth/death dates here — not confirmed on the live site. */}
      <Reveal>
        <section className="bg-[#f3efe7] px-6 py-14 sm:px-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h1 className="text-4xl text-ink sm:text-5xl">{page.title}</h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-ink-soft">
              <span className="rounded-full border border-black/10 bg-white px-3 py-1">Kedgaon, Pune District, Maharashtra</span>
            </div>
            <PhotoBox
              className="mt-8 h-72 w-full sm:h-96"
              placeholderLabel="Portrait of Pandita Ramabai"
              recommendedSize="1600×1000"
            />
          </div>
        </section>
      </Reveal>

      {/* Article + a sticky sidebar of facts, instead of the biography
          running as one undivided column beside a photo. Sidebar only
          restates facts already confirmed in the article body itself. */}
      <Reveal>
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div
              className="prose max-w-none text-ink"
              dangerouslySetInnerHTML={{ __html: page.contentHtml }}
            />
            <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-black/10 bg-white p-5 text-sm">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Quick Facts</h2>
                <dl className="mt-3 flex flex-col gap-2.5">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">Location</dt>
                    <dd className="text-right font-semibold text-ink">Kedgaon, Pune District</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">Title</dt>
                    <dd className="text-right font-semibold text-ink">Only woman ever conferred &ldquo;Pandita&rdquo;</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">Honour</dt>
                    <dd className="text-right font-semibold text-ink">Kaiser-E-Hind, 1919</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">Registered under</dt>
                    <dd className="text-right font-semibold text-ink">Societies Registration Act &amp; Bombay Public Trust Act, 1950</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </section>
      </Reveal>

      {/* Closing ask, promoted to a bold band rather than a row of text
          links, so this page doesn't dead-end after the biography. */}
      <Reveal>
        <section className="bg-coral px-6 py-16 text-center sm:px-12">
          <h2 className="mx-auto max-w-2xl text-2xl text-white sm:text-3xl">Walk Alongside Her Legacy</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            More than a century later, Mukti Mission continues the work she began.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              href="/donate/"
              className="inline-block rounded-md bg-white px-7 py-3 text-sm font-semibold text-coral hover:bg-white/90"
            >
              Support This Legacy &rarr;
            </Link>
            <Link href="/about-mukti-mission/" className="text-sm font-semibold text-white underline hover:text-white/80">
              Read About Mukti Mission &rarr;
            </Link>
            <Link href="/programs/" className="text-sm font-semibold text-white underline hover:text-white/80">
              See Her Legacy in Action &rarr;
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
