import Link from "next/link";
import { getAllNewsMeta } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { PhotoBox } from "@/components/content-views/PhotoBox";
import { Reveal } from "@/components/Reveal";

export default function NewsIndex() {
  const posts = getAllNewsMeta();

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / News
      </div>
      <h1 className="mt-3 text-4xl">News &amp; Updates</h1>
      <p className="mt-2 max-w-[60ch] text-ink-soft">
        Mission updates, milestones and stories from Kedgaon and beyond. Every post here goes through
        Decap&apos;s editorial workflow before publishing.
      </p>

      <Reveal>
      {posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState>
            No news posted yet. The previous site&apos;s feed was compromised with spam — genuine posts
            are being manually curated before this section goes live (see docs/site-audit.md).
          </EmptyState>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-3">
          {posts.map((n) => (
            <Link
              key={n.slug}
              href={`/news/${n.slug}/`}
              className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-md"
            >
              <PhotoBox
                image={n.image}
                placeholderLabel="News photo"
                recommendedSize="800×450"
                className="flex h-36 text-xs"
              />
              <div className="p-4">
                <div className="text-xs text-ink-soft">{n.date && new Date(n.date).toLocaleDateString()}</div>
                <h3 className="mt-1.5 text-base font-semibold">{n.title}</h3>
                {n.description && <p className="mt-1.5 text-sm text-ink-soft">{n.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
      </Reveal>

      {/* Keeps a visitor reading News from becoming a dead end — routes
          them back toward Programs (Exploration) or Donate (the Ask). */}
      <Reveal>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-black/10 bg-[#f3efe7] p-7">
        <div>
          <h2 className="text-lg font-semibold">Want to see the work behind the updates?</h2>
          <p className="mt-1 text-sm text-ink-soft">Every story here traces back to one of our 14 ministries.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/programs/" className="text-sm font-semibold hover:text-coral">
            Explore Our Programs &rarr;
          </Link>
          <Link href="/donate/" className="text-sm font-semibold text-coral hover:text-coral-dark">
            Donate Now &rarr;
          </Link>
        </div>
      </div>
      </Reveal>
    </main>
  );
}
