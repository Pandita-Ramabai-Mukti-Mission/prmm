import type { ImageWithAlt } from "@/lib/content";
import { PhotoSlider } from "@/components/content-views/PhotoSlider";

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
      <PhotoSlider images={images} />

      <article className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-12">
        <h1 className="text-2xl">{title}</h1>
        <div className="mt-2.5 text-sm text-ink-soft">{date && new Date(date).toLocaleDateString()}</div>
        <div className="prose mt-5 max-w-none">{body}</div>
      </article>
    </>
  );
}
