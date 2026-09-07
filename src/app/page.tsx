import Link from "next/link";
import { getPageBySlug } from "@/lib/content";
import { getAllPostsMeta } from "@/lib/content";

export default async function Home() {
  const page = await getPageBySlug("home");
  const posts = getAllPostsMeta();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-10 py-24 px-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {page.title}
          </h1>
          <div
            className="prose mt-4 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: page.contentHtml }}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Posts
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="font-medium text-zinc-950 underline dark:text-zinc-50"
                >
                  {post.title}
                </Link>
                {post.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {post.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-zinc-500">
          Edit this page and posts from{" "}
          <a href="/admin" className="underline">
            /admin
          </a>{" "}
          (Decap CMS).
        </p>
      </main>
    </div>
  );
}
