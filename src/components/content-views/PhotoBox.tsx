import type { ImageWithAlt } from "@/lib/content";

// Single source of truth for "photo, or a placeholder box with its alt
// text" — used by every real page AND by the Decap CMS preview templates
// (src/lib/cms-preview-templates.tsx), so an editor's uploaded photo shows
// up identically in both places by construction, not by two people
// remembering to keep hand-copied markup in sync.
//
// The clipped bottom-right corner echoes the sitewide angled-section motif
// at card scale (see AngledDivider) — one design language, small and large.
// Living here means every card image gets it by construction; no per-card
// className to remember.
const ANGLED_CORNER_CLIP = "[clip-path:polygon(0_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%)]";

export function PhotoBox({
  image,
  placeholderLabel,
  recommendedSize,
  className,
}: {
  image?: ImageWithAlt;
  placeholderLabel?: string;
  /** Recommended upload dimensions, e.g. "1200×800" — shown on the
   * placeholder so an editor knows what to upload. Not the box's actual
   * rendered size, which is responsive and set by `className`. */
  recommendedSize?: string;
  className: string;
}) {
  if (image?.src) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        className={`${className} ${ANGLED_CORNER_CLIP} object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} ${ANGLED_CORNER_CLIP} flex-col items-center justify-center gap-1 bg-gray-200 text-center text-gray-500`}
    >
      <span>{image?.alt || placeholderLabel || "Photo"}</span>
      {recommendedSize && <span className="text-gray-400">{recommendedSize}</span>}
    </div>
  );
}
