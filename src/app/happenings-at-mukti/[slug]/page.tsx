import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGallerySlugs, getGalleryPostBySlug } from "@/lib/content";
import { GalleryDetailCore } from "@/components/content-views/GalleryDetailCore";

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

      <GalleryDetailCore
        title={post.title}
        date={post.date}
        images={post.images}
        body={<div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />}
      />
    </main>
  );
}
