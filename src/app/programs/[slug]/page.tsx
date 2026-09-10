import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProgramSlugs, getAllProgramsMeta, getProgramBySlug } from "@/lib/content";
import { GetInvolvedBand } from "@/components/GetInvolvedBand";
import { ProgramDetailCore } from "@/components/content-views/ProgramDetailCore";
import { PhotoBox } from "@/components/content-views/PhotoBox";
import { Reveal } from "@/components/Reveal";

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

      <Reveal>
      <ProgramDetailCore
        slug={program.slug}
        title={program.title}
        category={program.category}
        image={program.image}
        body={<div dangerouslySetInnerHTML={{ __html: program.contentHtml }} />}
      />
      </Reveal>

      {related.length > 0 && (
        <Reveal>
        <section className="bg-[#f3efe7] px-6 py-14 sm:px-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl">Similar Programs</h2>
            <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/programs/${r.slug}/`}
                  className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-md"
                >
                  <PhotoBox
                    image={r.image}
                    placeholderLabel={r.title}
                    recommendedSize="400×300"
                    className="flex h-24 text-xs"
                  />
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
        </Reveal>
      )}

      <Reveal>
        <GetInvolvedBand />
      </Reveal>
    </main>
  );
}
