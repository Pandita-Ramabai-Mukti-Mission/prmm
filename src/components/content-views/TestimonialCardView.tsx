import type { ImageWithAlt } from "@/lib/content";
import { PhotoBox } from "@/components/content-views/PhotoBox";

export function TestimonialCardView({
  quote,
  name,
  image,
}: {
  quote: string;
  name: string;
  image?: ImageWithAlt;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5">
      <PhotoBox
        image={image}
        placeholderLabel="Photo"
        recommendedSize="200×200"
        className="mb-3.5 flex h-14 w-14 rounded-full border border-dashed border-black/15 text-[9px]"
      />
      <p className="text-sm italic text-ink-soft">&ldquo;{quote}&rdquo;</p>
      <div className="mt-3 text-sm font-semibold">{name}</div>
    </div>
  );
}
