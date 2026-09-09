import type { ImageWithAlt } from "@/lib/content";
import { PhotoBox } from "@/components/content-views/PhotoBox";

export function GalleryDetailCore({
  title,
  date,
  images,
  body,
}: {
  title: string;
  date?: string;
  images: ImageWithAlt[];
  body: React.ReactNode;
}) {
  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-12">
        <h1 className="text-2xl">{title}</h1>
        <div className="mt-2.5 text-sm text-ink-soft">{date && new Date(date).toLocaleDateString()}</div>
        <div className="prose mt-5 max-w-none">{body}</div>
      </article>

      {images.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 pb-10 sm:px-12">
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            {images.map((img, i) => (
              <PhotoBox
                key={i}
                image={img}
                recommendedSize="800×600"
                className="flex h-36 rounded-md text-center text-[11px]"
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
