import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGallerySlugs, getGalleryPostBySlug } from "@/lib/content";

export async function generateStaticParams() {
  return getAllGallerySlugs().map((slug) => ({ slug }));
}

export default async function GalleryDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAllGallerySlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const post = await getGalleryPostBySlug(slug);

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-3xl px-6 pt-6 text-sm text-ink-soft sm:px-12">
        <Link href="/">Home</Link> / <Link href="/happenings-at-mukti/">Happenings</Link> / {post.title}
      </div>

      <article className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-12">
        <h1 className="font-serif text-2xl">{post.title}</h1>
        <div className="mt-2.5 text-sm text-ink-soft">
          {post.date && new Date(post.date).toLocaleDateString()}
        </div>
        <div className="prose mt-5 max-w-none" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      {post.images.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 pb-10 sm:px-12">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {post.images.map((img, i) => (
              <div
                key={i}
                className="flex h-36 items-center justify-center rounded-md bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-center text-[11px] text-[#8a8170]"
              >
                {img.alt}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
