import type { ImageWithAlt } from "@/lib/content";
import { PhotoBox } from "@/components/content-views/PhotoBox";

export function NewsDetailCore({
  title,
  date,
  image,
  body,
}: {
  title: string;
  date?: string;
  image?: ImageWithAlt;
  body: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-12">
      <h1 className="font-serif text-3xl">{title}</h1>
      <div className="mt-2.5 text-sm text-ink-soft">
        {date && new Date(date).toLocaleDateString()} &middot; Pandita Ramabai Mukti Mission
      </div>
      <PhotoBox
        image={image}
        placeholderLabel="Article photo"
        recommendedSize="1200×675"
        className="mt-6 flex h-72 rounded-xl border border-dashed border-black/15 text-xs"
      />
      <div className="prose mt-6 max-w-none">{body}</div>
    </article>
  );
}
