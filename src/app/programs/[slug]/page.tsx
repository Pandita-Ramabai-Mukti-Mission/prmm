import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProgramSlugs, getAllProgramsMeta, getProgramBySlug } from "@/lib/content";
import { GetInvolvedBand } from "@/components/GetInvolvedBand";

export async function generateStaticParams() {
  return getAllProgramSlugs().map((slug) => ({ slug }));
}

export default async function ProgramDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAllProgramSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const program = await getProgramBySlug(slug);
  const related = getAllProgramsMeta()
    .filter((p) => p.slug !== slug && p.category === program.category)
    .slice(0, 3);

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-6 pt-6 text-sm text-ink-soft sm:px-12">
        <Link href="/">Home</Link> / <Link href="/programs/">Programs</Link> / {program.title}
      </div>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8 sm:px-12 md:flex-row">
        <div className="flex-1">
          <span className="inline-block rounded-full bg-[#e7ecf1] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#3f5268]">
            {program.category}
          </span>
          <h1 className="mt-3 font-serif text-3xl">{program.title}</h1>
          <div
            className="prose mt-4 max-w-none text-ink"
            dangerouslySetInnerHTML={{ __html: program.contentHtml }}
          />

          {/* Inline pre-filtered donate CTA — the highest-intent page on the
              site; previously the only donate path here was the Get
              Involved band at the very bottom. */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#f0c6c5] bg-[#fbeaea] p-5">
            <div className="font-semibold">Support {program.title} directly</div>
            <Link
              href={`/donate/?cause=${program.slug}`}
              className="rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark"
            >
              Donate to This Program &rarr;
            </Link>
          </div>
        </div>
        <div className="flex h-80 flex-1 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-center text-xs text-[#8a8170]">
          {program.image?.alt ?? "Program photograph"}
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-[#f3efe7] px-6 py-10 sm:px-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-xl">Similar Programs</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/programs/${r.slug}/`}
                  className="overflow-hidden rounded-lg border border-black/10 bg-white"
                >
                  <div className="flex h-24 items-center justify-center bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-xs text-[#8a8170]">
                    {r.image?.alt ?? r.title}
                  </div>
                  <div className="p-3.5">
                    <span className="inline-block rounded-full bg-[#e7ecf1] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#3f5268]">
                      {r.category}
                    </span>
                    <h3 className="mt-2 text-sm font-semibold">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <GetInvolvedBand />
    </main>
  );
}
