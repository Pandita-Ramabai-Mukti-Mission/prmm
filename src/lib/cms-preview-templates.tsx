"use client";

import type { ImageWithAlt } from "@/lib/content";
import { PageTitleBody } from "@/components/content-views/PageTitleBody";
import { PostDetailCore } from "@/components/content-views/PostDetailCore";
import { ProgramDetailCore } from "@/components/content-views/ProgramDetailCore";
import { NewsDetailCore } from "@/components/content-views/NewsDetailCore";
import { GalleryDetailCore } from "@/components/content-views/GalleryDetailCore";
import { TestimonialCardView } from "@/components/content-views/TestimonialCardView";
import { ReportsTable } from "@/components/content-views/ReportsTable";
import { NewsletterRow } from "@/components/content-views/NewsletterRow";
import { ContactCardView } from "@/components/content-views/ContactCardView";

// Registers the same presentational components the real routes render as
// Decap CMS preview templates, so a markup/style change to one of those
// components (src/components/content-views/*) updates the live site AND
// the CMS preview together — there is no second copy of the markup to
// remember to keep in sync (see docs/dev-backlog.md, CMS preview strategy).
//
// Known limits, surfaced in the preview panes themselves:
// - No shared header/footer around the preview.
// - No "related items" (similar programs, more news) — those depend on
//   sitewide data, not just the one entry being edited.
// - The `pages` collection preview only reflects the small part of some
//   real pages it actually controls (e.g. Home's hero heading/intro).

// Decap's entry/getAsset types come through as `any` from the untyped
// decap-cms-app package — narrowed locally instead of widening call sites.
type Entry = { getIn: (path: string[]) => unknown };
type GetAsset = (path: string) => { toString(): string };
type PreviewProps = {
  entry: Entry;
  widgetFor: (field: string) => React.ReactNode;
  getAsset: GetAsset;
};

function text(entry: Entry, field: string, fallback = ""): string {
  const v = entry.getIn(["data", field]);
  return v === undefined || v === null || v === "" ? fallback : String(v);
}

function optionalText(entry: Entry, field: string): string | undefined {
  const v = entry.getIn(["data", field]);
  return v === undefined || v === null || v === "" ? undefined : String(v);
}

function resolveImage(entry: Entry, getAsset: GetAsset): ImageWithAlt | undefined {
  const path = entry.getIn(["data", "image"]);
  if (!path || typeof path !== "string") return undefined;
  return { src: getAsset(path).toString(), alt: text(entry, "image_alt", "") };
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-900">
      {children}
    </div>
  );
}

// Minimal typing for the CMS registration surface we use — decap-cms-app
// ships no first-party types.
type CmsRegistrar = {
  registerPreviewTemplate: (name: string, component: (props: PreviewProps) => React.ReactElement) => void;
};

export function registerPreviewTemplates(CMS: CmsRegistrar) {
  CMS.registerPreviewTemplate("pages", (props) => (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Note>
        Preview of the title and body text only. On the live page these sit inside a larger template —
        other sections (stats, photos, timelines, related content) are fixed and not editable here.
      </Note>
      <PageTitleBody title={text(props.entry, "title", "Untitled page")} body={props.widgetFor("body")} />
    </div>
  ));

  CMS.registerPreviewTemplate("posts", (props) => (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Note>
        This &ldquo;Posts&rdquo; collection predates &ldquo;News&rdquo; and isn&apos;t linked anywhere on
        the live site — check with your developer before adding content here.
      </Note>
      <PostDetailCore
        title={text(props.entry, "title", "Untitled post")}
        date={optionalText(props.entry, "date")}
        body={props.widgetFor("body")}
      />
    </div>
  ));

  CMS.registerPreviewTemplate("programs", (props) => (
    <ProgramDetailCore
      slug="preview"
      title={text(props.entry, "title", "Untitled program")}
      category={text(props.entry, "category", "Category")}
      image={resolveImage(props.entry, props.getAsset)}
      body={props.widgetFor("body")}
    />
  ));

  CMS.registerPreviewTemplate("news", (props) => (
    <NewsDetailCore
      title={text(props.entry, "title", "Untitled article")}
      date={optionalText(props.entry, "date")}
      image={resolveImage(props.entry, props.getAsset)}
      body={props.widgetFor("body")}
    />
  ));

  CMS.registerPreviewTemplate("gallery", (props) => {
    const rawImages = props.entry.getIn(["data", "images"]) as
      | { toJS: () => { src?: string; alt?: string }[] }
      | undefined;
    const images: ImageWithAlt[] = rawImages
      ? rawImages.toJS().map((img) => ({
          src: img.src ? props.getAsset(img.src).toString() : "",
          alt: img.alt ?? "",
        }))
      : [];
    return (
      <GalleryDetailCore
        title={text(props.entry, "title", "Untitled event")}
        date={optionalText(props.entry, "date")}
        images={images}
        body={props.widgetFor("body")}
      />
    );
  });

  CMS.registerPreviewTemplate("testimonials", (props) => (
    <div className="mx-auto max-w-sm px-6 py-10">
      <TestimonialCardView
        quote={text(props.entry, "quote", "Quote goes here")}
        name={text(props.entry, "name", "")}
        image={resolveImage(props.entry, props.getAsset)}
      />
    </div>
  ));

  CMS.registerPreviewTemplate("reports", (props) => (
    <div className="px-6 py-10">
      <ReportsTable
        reports={[
          {
            slug: "preview",
            year: Number(text(props.entry, "year", "0")) || 0,
            type: text(props.entry, "type", "—"),
            file: text(props.entry, "file", ""),
          },
        ]}
      />
    </div>
  ));

  CMS.registerPreviewTemplate("newsletters", (props) => (
    <div className="px-6 py-10">
      <NewsletterRow
        title={text(props.entry, "title", "Untitled issue")}
        date={optionalText(props.entry, "date")}
        file={optionalText(props.entry, "file")}
      />
    </div>
  ));

  CMS.registerPreviewTemplate("contacts", (props) => (
    <div className="max-w-sm px-6 py-10">
      <ContactCardView
        region={text(props.entry, "region", "Region name")}
        name={optionalText(props.entry, "name")}
        address={optionalText(props.entry, "address")}
        phone={optionalText(props.entry, "phone")}
        email={optionalText(props.entry, "email")}
      />
    </div>
  ));
}
