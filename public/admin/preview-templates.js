/* Custom Decap CMS preview templates so editors see an approximation of
   the real page while they write, instead of Decap's generic default
   preview. This file is plain ES5-ish JS (no build step — it's loaded
   directly by the static /admin page), using React.createElement instead
   of JSX. Keep new templates in the same style.

   Known limits (call these out in the UI, don't let them surprise editors):
   - No shared header/footer/navigation around the preview.
   - "Related items" (similar programs, more news) are never shown — they
     depend on the rest of the site's real content, not just this entry.
   - The `pages` collection only controls a small part of some pages (e.g.
     Home's hero heading/intro) — the rest is fixed template content. */

CMS.registerPreviewStyle("preview.css");

var h = React.createElement;

function text(entry, field, fallback) {
  var v = entry.getIn(["data", field]);
  return v === undefined || v === null || v === "" ? fallback || "" : v;
}

function formatDate(value) {
  if (!value) return "";
  var d = new Date(value);
  return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
}

function Photo(props) {
  // props: { path, alt, getAsset }
  if (!props.path) {
    return h(
      "div",
      { className: "pv-photo-placeholder" },
      props.alt || "Photo"
    );
  }
  var src = props.getAsset(props.path).toString();
  return h("img", { className: "pv-photo", src: src, alt: props.alt || "" });
}

function Note(text) {
  return h("div", { className: "pv-note" }, text);
}

function Crumb(text) {
  return h("div", { className: "pv-crumb" }, text);
}

// ---- pages (Home, About Mukti Mission, About Pandita Ramabai, Where We
// Work, Terms of Use, Privacy Policy) ------------------------------------
function PagePreview(props) {
  var entry = props.entry;
  return h(
    "div",
    { className: "pv" },
    Note(
      "Preview of the title and body text only. On the live page these sit inside a larger template — other sections (stats, photos, timelines, related content) are fixed and not editable here."
    ),
    h("h1", { className: "pv-h1" }, text(entry, "title", "Untitled page")),
    h("div", { className: "pv-body" }, props.widgetFor("body"))
  );
}

// ---- posts (legacy collection, not linked from the live site) ----------
function PostPreview(props) {
  var entry = props.entry;
  return h(
    "div",
    { className: "pv" },
    Note(
      "This 'Posts' collection predates the 'News' collection and isn't linked anywhere on the live site — check with your developer before adding content here."
    ),
    h("h1", { className: "pv-h1" }, text(entry, "title", "Untitled post")),
    entry.getIn(["data", "date"]) &&
      h("div", { className: "pv-meta" }, formatDate(entry.getIn(["data", "date"]))),
    h("div", { className: "pv-body" }, props.widgetFor("body"))
  );
}

// ---- programs ------------------------------------------------------------
function ProgramPreview(props) {
  var entry = props.entry;
  return h(
    "div",
    { className: "pv" },
    Crumb("Home / Programs / " + text(entry, "title", "…")),
    h("span", { className: "pv-tag" }, text(entry, "category", "Category")),
    h("h1", { className: "pv-h1" }, text(entry, "title", "Untitled program")),
    Photo({
      path: entry.getIn(["data", "image"]),
      alt: text(entry, "image_alt", "Program photograph"),
      getAsset: props.getAsset,
    }),
    h("div", { className: "pv-body" }, props.widgetFor("body")),
    h(
      "div",
      { className: "pv-donate-cta" },
      h("span", null, "Support " + text(entry, "title", "this program") + " directly"),
      h("a", null, "Donate to This Program →")
    )
  );
}

// ---- news ------------------------------------------------------------
function NewsPreview(props) {
  var entry = props.entry;
  return h(
    "div",
    { className: "pv" },
    Crumb("Home / News / " + text(entry, "title", "…")),
    h("h1", { className: "pv-h1" }, text(entry, "title", "Untitled article")),
    h(
      "div",
      { className: "pv-meta" },
      formatDate(entry.getIn(["data", "date"])) + " · Pandita Ramabai Mukti Mission"
    ),
    Photo({
      path: entry.getIn(["data", "image"]),
      alt: text(entry, "image_alt", "Article photo"),
      getAsset: props.getAsset,
    }),
    h("div", { className: "pv-body" }, props.widgetFor("body"))
  );
}

// ---- gallery (Happenings at Mukti) ---------------------------------------
function GalleryPreview(props) {
  var entry = props.entry;
  var images = entry.getIn(["data", "images"]);
  var photos = [];
  if (images) {
    images.forEach(function (img, i) {
      photos.push(
        h(
          "div",
          { key: i, className: "pv-photo-placeholder", style: { height: "90px", margin: 0 } },
          img.get("alt") || "Photo"
        )
      );
    });
  }
  return h(
    "div",
    { className: "pv" },
    Crumb("Home / Happenings at Mukti / " + text(entry, "title", "…")),
    h("h1", { className: "pv-h1" }, text(entry, "title", "Untitled event")),
    h("div", { className: "pv-meta" }, formatDate(entry.getIn(["data", "date"]))),
    h("div", { className: "pv-body" }, props.widgetFor("body")),
    photos.length > 0 && h("div", { className: "pv-gallery-grid" }, photos)
  );
}

// ---- reports ---------------------------------------------------------
function ReportPreview(props) {
  var entry = props.entry;
  return h(
    "div",
    { className: "pv" },
    Crumb("Home / Reports"),
    h("h1", { className: "pv-h1" }, "Reports & Transparency"),
    h(
      "table",
      { className: "pv-table" },
      h(
        "thead",
        null,
        h("tr", null, h("th", null, "Year"), h("th", null, "Type"), h("th", null, "File"))
      ),
      h(
        "tbody",
        null,
        h(
          "tr",
          null,
          h("td", null, text(entry, "year", "—")),
          h("td", null, text(entry, "type", "—")),
          h("td", null, entry.getIn(["data", "file"]) ? "Download PDF" : "(no file uploaded)")
        )
      )
    )
  );
}

// ---- newsletters (Mukti Kiran) ---------------------------------------
function NewsletterPreview(props) {
  var entry = props.entry;
  return h(
    "div",
    { className: "pv" },
    Crumb("Home / Mukti Kiran / Archive"),
    h(
      "div",
      { className: "pv-card" },
      h("div", { style: { fontWeight: 600, fontSize: "14px" } }, text(entry, "title", "Untitled issue")),
      h("div", { className: "pv-meta" }, formatDate(entry.getIn(["data", "date"]))),
      h(
        "div",
        { style: { marginTop: "8px", fontSize: "13px" } },
        entry.getIn(["data", "file"]) ? "Download PDF →" : "(no file uploaded)"
      )
    )
  );
}

// ---- contacts (Regional Contacts) ---------------------------------------
function ContactPreview(props) {
  var entry = props.entry;
  return h(
    "div",
    { className: "pv" },
    Crumb("Home / Contact / Our Regional Representatives"),
    h(
      "div",
      { className: "pv-card" },
      h("div", { style: { fontWeight: 600 } }, text(entry, "region", "Region name")),
      h("p", { style: { margin: "8px 0 0", fontSize: "14px", color: "#6b6862" } }, text(entry, "name", "")),
      h("p", { style: { margin: "2px 0 0", fontSize: "14px", color: "#6b6862" } }, text(entry, "address", "")),
      h(
        "p",
        { style: { margin: "2px 0 0", fontSize: "14px", color: "#6b6862" } },
        text(entry, "phone", "") + " · " + text(entry, "email", "")
      )
    )
  );
}

// ---- testimonials ---------------------------------------------------------
function TestimonialPreview(props) {
  var entry = props.entry;
  return h(
    "div",
    { className: "pv" },
    Crumb("Home / Testimonials"),
    h(
      "div",
      { className: "pv-card", style: { maxWidth: "320px" } },
      Photo({
        path: entry.getIn(["data", "image"]),
        alt: text(entry, "image_alt", "Photo"),
        getAsset: props.getAsset,
      }),
      h("p", { className: "pv-quote" }, "“" + text(entry, "quote", "Quote goes here") + "”"),
      h("div", { style: { marginTop: "10px", fontWeight: 600, fontSize: "14px" } }, text(entry, "name", ""))
    )
  );
}

CMS.registerPreviewTemplate("pages", PagePreview);
CMS.registerPreviewTemplate("posts", PostPreview);
CMS.registerPreviewTemplate("programs", ProgramPreview);
CMS.registerPreviewTemplate("news", NewsPreview);
CMS.registerPreviewTemplate("gallery", GalleryPreview);
CMS.registerPreviewTemplate("reports", ReportPreview);
CMS.registerPreviewTemplate("newsletters", NewsletterPreview);
CMS.registerPreviewTemplate("contacts", ContactPreview);
CMS.registerPreviewTemplate("testimonials", TestimonialPreview);
