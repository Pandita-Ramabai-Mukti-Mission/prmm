import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNewsSlugs, getAllNewsMeta, getNewsBySlug } from "@/lib/content";
import { NewsDetailCore } from "@/components/content-views/NewsDetailCore";
import { PhotoBox } from "@/components/content-views/PhotoBox";
import { Reveal } from "@/components/Reveal";

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAllNewsSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const post = await getNewsBySlug(slug);
  const related = getAllNewsMeta()
    .filter((n) => n.slug !== slug)
    .slice(0, 3);

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl px-6 pt-6 text-sm text-ink-soft sm:px-12">
        <Link href="/">Home</Link> / <Link href="/news/">News</Link> / {post.title}
      </div>

      <Reveal>
      <NewsDetailCore
        title={post.title}
        date={post.date}
        image={post.image}
        body={<div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />}
      />

      {/* One nudge toward the Ask — generic, not cause-specific, since a
          news post isn't always tied to one program (unlike ProgramDetail's
          DonateCta). */}
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 rounded-lg border border-black/10 bg-[#fff4f2] p-6 sm:mx-auto">
        <div className="font-semibold">Stories like this happen because of Mukti&rsquo;s supporters.</div>
        <Link
          href="/donate/"
          className="whitespace-nowrap rounded-md bg-coral px-5 py-2.5 text-sm font-semibold text-white hover:bg-coral-dark"
        >
          Donate Now &rarr;
        </Link>
      </div>
      </Reveal>

      {related.length > 0 && (
        <Reveal>
        <section className="bg-[#f3efe7] px-6 py-14 sm:px-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl">More Updates</h2>
            <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-3">
              {related.map((n) => (
                <Link
                  key={n.slug}
                  href={`/news/${n.slug}/`}
                  className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-md"
                >
                  <PhotoBox
                    image={n.image}
                    placeholderLabel="News photo"
                    recommendedSize="400×300"
                    className="flex h-24 text-xs"
                  />
                  <div className="p-3.5">
                    <h3 className="text-sm font-semibold">{n.title}</h3>
                    <div className="mt-1 text-xs text-ink-soft">
                      {n.date && new Date(n.date).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        </Reveal>
      )}
    </main>
  );
}
