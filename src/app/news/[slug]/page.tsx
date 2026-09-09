import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNewsSlugs, getAllNewsMeta, getNewsBySlug } from "@/lib/content";
import { NewsDetailCore } from "@/components/content-views/NewsDetailCore";

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

      <NewsDetailCore
        title={post.title}
        date={post.date}
        image={post.image}
        body={<div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />}
      />

      {related.length > 0 && (
        <section className="bg-[#f3efe7] px-6 py-10 sm:px-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-xl">More Updates</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((n) => (
                <Link key={n.slug} href={`/news/${n.slug}/`} className="rounded-lg border border-black/10 bg-white p-4">
                  <h3 className="text-sm font-semibold">{n.title}</h3>
                  <div className="mt-1 text-xs text-ink-soft">
                    {n.date && new Date(n.date).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
