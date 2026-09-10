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
    <div className="rounded-lg border border-black/10 bg-white shadow-md p-6">
      <svg width="22" height="17" viewBox="0 0 24 24" fill="#f0c6c5" className="mb-3">
        <path d="M9.5 3C6 3 3 6 3 10.5 3 14 5.5 17 9 17c-.5 3-3 5-6 5.5v2C8 24 12 20 12 14 12 8 11 3 9.5 3zm11 0C17 3 14 6 14 10.5c0 3.5 2.5 6.5 6 6.5-.5 3-3 5-6 5.5v2c5 0 9-4 9-10 0-6-1-11-2.5-11z" />
      </svg>
      <p className="text-sm italic text-ink-soft">{quote}</p>
      <div className="mt-3 flex items-center gap-3 border-t border-black/10 pt-3">
        <PhotoBox
          image={image}
          placeholderLabel="Photo"
          recommendedSize="200×200"
          className="flex h-10 w-10 flex-shrink-0 rounded-full border border-dashed border-black/15 text-[8px]"
        />
        <div className="text-sm font-semibold">{name}</div>
      </div>
    </div>
  );
}
