import Link from "next/link";
import { getAllNewsMeta } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";

export default function NewsIndex() {
  const posts = getAllNewsMeta();

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / News
      </div>
      <h1 className="mt-3 font-serif text-4xl">News &amp; Updates</h1>
      <p className="mt-2 max-w-[60ch] text-ink-soft">
        Mission updates, milestones and stories from Kedgaon and beyond. Every post here goes through
        Decap&apos;s editorial workflow before publishing.
      </p>

      {posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState>
            No news posted yet. The previous site&apos;s feed was compromised with spam — genuine posts
            are being manually curated before this section goes live (see docs/site-audit.md).
          </EmptyState>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {posts.map((n) => (
            <Link
              key={n.slug}
              href={`/news/${n.slug}/`}
              className="overflow-hidden rounded-lg border border-black/10 bg-white"
            >
              <div className="flex h-36 items-center justify-center bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-xs text-[#8a8170]">
                {n.image?.alt ?? "News photo"}
              </div>
              <div className="p-4">
                <div className="text-xs text-ink-soft">{n.date && new Date(n.date).toLocaleDateString()}</div>
                <h3 className="mt-1.5 text-base font-semibold">{n.title}</h3>
                {n.description && <p className="mt-1.5 text-sm text-ink-soft">{n.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
