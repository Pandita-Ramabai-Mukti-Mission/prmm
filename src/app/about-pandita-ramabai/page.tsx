import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import { PageTitleBody } from "@/components/content-views/PageTitleBody";

export default async function AboutRamabai() {
  const page = await getPageBySlug("about-pandita-ramabai");
  if (!page) notFound();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 text-sm text-ink-soft sm:px-12">
        <Link href="/">Home</Link> / About / Pandita Ramabai
      </div>

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 py-8 sm:px-12 md:flex-row">
        <div className="flex h-80 flex-1 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-center text-xs text-[#8a8170]">
          Portrait — Pandita Ramabai
        </div>
        <div className="flex-1">
          <PageTitleBody
            title={page.title}
            headingClassName="font-serif text-4xl"
            bodyClassName="prose mt-3 max-w-none text-ink"
            body={<div dangerouslySetInnerHTML={{ __html: page.contentHtml }} />}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-10 sm:px-12">
        <blockquote className="border-l-4 border-coral pl-5 font-serif text-xl italic">
          &ldquo;[A Ramabai quote — distinct from the one used on the Mukti Mission page]&rdquo;
        </blockquote>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-10 sm:px-12">
        <div className="flex flex-wrap gap-5 text-sm font-semibold">
          <Link href="/about-mukti-mission/" className="hover:text-coral">
            Read About Mukti Mission &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}
