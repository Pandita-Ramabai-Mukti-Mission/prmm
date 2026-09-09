import Link from "next/link";
import { getAllGalleryPosts } from "@/lib/content";
import { EmptyState } from "@/components/EmptyState";
import { PhotoBox } from "@/components/content-views/PhotoBox";

export default async function GalleryIndex() {
  const events = await getAllGalleryPosts();

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Happenings at Mukti
      </div>
      <h1 className="mt-3 font-serif text-4xl">Happenings at Mukti</h1>
      <p className="mt-2 max-w-[60ch] text-ink-soft">
        Moments from campus life — events, milestones and celebrations.
      </p>

      {events.length === 0 ? (
        <div className="mt-8">
          <EmptyState>Gallery posts are being migrated from the current site.</EmptyState>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {events.map((g) => (
            <Link
              key={g.slug}
              href={`/happenings-at-mukti/${g.slug}/`}
              className="overflow-hidden rounded-lg border border-black/10 bg-white"
            >
              <PhotoBox
                image={g.images[0]}
                placeholderLabel={g.title}
                recommendedSize="800×600"
                className="flex h-40 text-xs"
              />
              <div className="p-4">
                <div className="text-xs text-ink-soft">{g.date && new Date(g.date).toLocaleDateString()}</div>
                <h3 className="mt-1.5 text-base font-semibold">{g.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
