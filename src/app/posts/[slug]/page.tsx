import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostBySlug } from "@/lib/content";
import { PostDetailCore } from "@/components/content-views/PostDetailCore";

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAllPostSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const post = await getPostBySlug(slug);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-4 py-24 px-8">
        <PostDetailCore
          title={post.title}
          date={post.date}
          body={<div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />}
        />
      </main>
    </div>
  );
}
