import type { ImageWithAlt } from "@/lib/content";

// Single source of truth for "photo, or a placeholder box with its alt
// text" — used by every real page AND by the Decap CMS preview templates
// (src/lib/cms-preview-templates.tsx), so an editor's uploaded photo shows
// up identically in both places by construction, not by two people
// remembering to keep hand-copied markup in sync.
export function PhotoBox({
  image,
  placeholderLabel,
  className,
}: {
  image?: ImageWithAlt;
  placeholderLabel?: string;
  className: string;
}) {
  if (image?.src) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        className={`${className} object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center bg-[repeating-linear-gradient(45deg,#ece7dd,#ece7dd_10px,#dfd9cc_10px,#dfd9cc_20px)] text-center text-[#8a8170]`}
    >
      {image?.alt || placeholderLabel || "Photo"}
    </div>
  );
}
