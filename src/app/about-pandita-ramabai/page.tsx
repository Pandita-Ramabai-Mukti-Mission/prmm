import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import { PageTitleBody } from "@/components/content-views/PageTitleBody";
import { Reveal } from "@/components/Reveal";

export default async function AboutRamabai() {
  const page = await getPageBySlug("about-pandita-ramabai");
  if (!page) notFound();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 text-sm text-ink-soft sm:px-12">
        <Link href="/">Home</Link> / About / Pandita Ramabai
      </div>

      <Reveal>
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-14 px-6 py-12 sm:px-12 md:flex-row">
        <div className="flex h-80 flex-1 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-center text-xs text-[#8a8170]">
          Portrait — Pandita Ramabai
        </div>
        <div className="flex-1">
          <PageTitleBody
            title={page.title}
            headingClassName="text-4xl"
            bodyClassName="prose mt-3 max-w-none text-ink"
            body={<div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />}
          />
        </div>
      </section>
      </Reveal>

      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 pb-14 sm:px-12">
        <blockquote className="border-l-4 border-coral pl-5 text-xl italic">
          &ldquo;[A Ramabai quote — distinct from the one used on the Mukti Mission page]&rdquo;
        </blockquote>
      </section>
      </Reveal>

      {/* Story → Exploration & the Ask, so this page doesn't dead-end
          after the biography — confirmed missing during today's
          artifact-vs-dev review. */}
      <Reveal>
      <section className="mx-auto w-full max-w-6xl px-6 pb-14 sm:px-12">
        <div className="flex flex-wrap gap-6 text-sm font-semibold">
          <Link href="/about-mukti-mission/" className="hover:text-coral">
            Read About Mukti Mission &rarr;
          </Link>
          <Link href="/programs/" className="hover:text-coral">
            See Her Legacy in Action &rarr;
          </Link>
          <Link href="/donate/" className="text-coral hover:text-coral-dark">
            Support This Legacy &rarr;
          </Link>
        </div>
      </section>
      </Reveal>
    </main>
  );
}
