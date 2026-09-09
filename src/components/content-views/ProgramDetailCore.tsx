import type { ImageWithAlt } from "@/lib/content";
import { PhotoBox } from "@/components/content-views/PhotoBox";
import { DonateCta } from "@/components/content-views/DonateCta";

// Shared by the real route (src/app/programs/[slug]/page.tsx) and the
// Decap CMS preview (src/lib/cms-preview-templates.tsx) — one component,
// so a markup/style change here updates both automatically. The real page
// wraps this with a breadcrumb and a "Similar Programs" section; those
// need sitewide data a single CMS entry preview doesn't have.
export function ProgramDetailCore({
  slug,
  title,
  category,
  image,
  body,
}: {
  slug: string;
  title: string;
  category: string;
  image?: ImageWithAlt;
  body: React.ReactNode;
}) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8 sm:px-12 md:flex-row">
      <div className="flex-1">
        <span className="inline-block rounded-full bg-[#e7ecf1] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#3f5268]">
          {category}
        </span>
        <h1 className="mt-3 font-serif text-3xl">{title}</h1>
        <div className="prose mt-4 max-w-none text-ink">{body}</div>
        <DonateCta programTitle={title} programSlug={slug} />
      </div>
      <PhotoBox
        image={image}
        placeholderLabel="Program photograph"
        recommendedSize="1200×800"
        className="flex h-80 flex-1 rounded-xl border border-dashed border-black/15 text-xs"
      />
    </section>
  );
}
