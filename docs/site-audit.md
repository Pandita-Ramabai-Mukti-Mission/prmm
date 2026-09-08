# prmm.org.in — Site Audit (2026-09)

Snapshot from a crawl of the live WordPress site, done via Claude for Chrome
(direct fetch is blocked — the domain 403s all non-browser requests). This is
a point-in-time record, not a living document — re-audit if a long gap passes
before the rebuild starts.

Current CMS: WordPress 5.3 (released Nov 2019, unpatched). Custom `prmm` theme.

## Security — handle independently of the rebuild timeline

The site is compromised. `/news-and-updates/` and the post system have 100+
injected spam posts (gambling/"non-Gamstop casino" and AI-companion content),
dated as recently as 2026-09-05/06, authored under the "PRMM" byline, with
their own live permalinks off the domain root (e.g.
`/why-non-gamstop-casinos-are-winning-over-uk-113/`). This requires
CMS-table/permalink write access — consistent with an unpatched
WordPress 5.3 core or plugin exploit, not a one-off defacement.

Action needed now, not at rebuild time: rotate WordPress admin credentials,
audit installed plugins, treat this as an argument for accelerating cutover.
**Do not migrate `/news-and-updates/` content without manually separating
genuine posts from injected ones first.**

## Global navigation (identical header/footer on every page)

**Header main nav:** Home · About ▾ (Pandita Ramabai, Mukti Mission) ·
Impact · News and Updates · Mukti Kiran · Happenings at Mukti · Contact Us.
Utility bar: phone, Donate button. Social icons: only Facebook is live;
3 others are dead (`href="#"`).

**Footer:** Quick Links (About Ramabai, Reach, News, Testimonial, Happenings,
Contact, Reports) · Impact (only 4 of 14 real programs) · Operations of Mukti
Ministry (the 5 "Shaping the…" pages) · Legal (Terms, Privacy, Sitemap).

**Get-involved band** (every inner page, above footer): Donate · Sign Up ·
Spread the word (mostly dead share icons) · Contact us · email subscribe form.

## Page inventory

### Core pages
| Page | URL | Notes |
|---|---|---|
| Home | `/` | Hero carousel, 6-tile stats strip, Vision/Mission/Basis, single-project donate CTA, Ramabai bio carousel, 4-up "Latest Projects", newsletter-download form, "Latest News" feed (currently 100% spam), "Happenings at Mukti" teaser. Founding date stated two inconsistent ways ("since 1889" vs. Ramabai's 1858–1922 dates). Stat tiles have no source/date. |
| About Pandita Ramabai | `/about-pandita-ramabai/` | Long-form bio prose, no structured fields. |
| About Mukti Mission | `/about-mukti-mission/` | Densest page: Vision/Mission/Basis, Why We Exist, 3-person Leadership (names/titles only, no bios/photos), Isaiah 61 citation (repeats on all 5 "Shaping the…" pages). |
| Impact | `/impact/` | The **real IA**: filterable grid of all 14 programs (categories: All, Boys Home, Church and Bible College, Farming, Home for Aged and Blind, Hospital, School). Nav only surfaces 4 of these 14. |
| Donate | `/donate/` | Form fields: Name, Email, Subject, Address, Cause, **PAN number**, Amount. No payment-gateway script detected (checked Razorpay/Instamojo/PayU/CCAvenue/PayPal/BillDesk) — unclear if it currently processes real payments. PAN collected in plaintext via a generic form — compliance/security risk. ₹100 minimum stated. Cites 80G, Societies Registration Act 1950, Bombay Public Trust Act 1950, Women's & Children's Institutions Licensing Act 1956. |
| Contact Us | `/contact-us/` | Contact form (first/last name, email, subject, message) + Google Maps iframe + 6 regional contacts (Bangalore, Chennai, Delhi & North India, Hyderabad, Cochin, Mumbai & Maharashtra) — inconsistent formatting between regions. |
| News and Updates | `/news-and-updates/` | 100% spam at crawl time (see security section). No genuine content visible in first ~100 posts. |

### Secondary pages
| Page | URL | Notes |
|---|---|---|
| Mukti Kiran | `/mukti-kiran/` | Newsletter archive, 6 PDFs, most recent Aug 2022 — stale. |
| Happenings at Mukti | `/happenings-at-mukti/` | Gallery index, 3 dated posts (2019–2022). |
| Reach | `/reach/` | Thin — likely meant to hold a map/graphic that isn't text-extractable; check visually. |
| Testimonials | `/testimonials/` | Quote-format, name-only attribution, no photos. |
| Reports | `/reports/` | 10 PDFs (Accounts, Certificates). Missing Accounts 2023. Good transparency material, needs completing. |
| Terms of Use | `/terms-of-use/` | Standard boilerplate. |
| Privacy Policy | `/privacy-policy/` | Describes data collected on donation/signup/download (name, email, address, phone, payment details) — revisit against real data flows, especially PAN on Donate. |
| Site Map | `/site-map/` | Flat list mirroring old nav; already out of sync with real structure (missing 14 Impact projects, gallery posts). |

### Programs (14 total; 4 crawled individually, 10 templated)
Shared template: title, single photo, 1–2 paragraphs, share row, "Similar Projects" strip.

Crawled: The Boys Home (`/projects/the-boys-home/`), Manorama Memorial English
Medium School, Agape Bible Institute, Pandita Ramabai Mukti Mission Church.

Not yet individually crawled (same template, listed on `/impact/`): Mukti
Goat Farming, Mukti Dairy, Mukti Farm, Bartimi Sadan (Home for the Blind),
Priti Sadan (Home for the Aged), Krupa Sadan, Krishnabai Memorial Hospital,
Special Needs School, Manorama Memorial High School & Junior College, Sharada
Sadan Primary School.

### "Shaping the…" theme pages
Thematic grouping of the 14 programs, tied to Ramabai's philosophy — a
narrative layer, not a separate content type.

| Page | Theme / linked projects |
|---|---|
| Shaping the Mind (`/shaping-the-mind/`) | Education — Sharada Sadan, Manorama Memorial schools |
| Shaping the Spirit (`/shaping-the-spirit/`) | Health — Krishnabai Memorial Hospital |
| Shaping the Heart (`/shaping-the-heart/`) | Care for the vulnerable — Bartimi Sadan |
| Shaping the Environment (`/shaping-the-environment/`) | Agriculture — Mukti Goat Farming, Mukti Farm/Dairy |
| Shaping the Destiny (`/shaping-the-destiny/`) | Spiritual formation — Agape Bible Institute, the Church |

### Gallery posts (all stale — 2019–2022)
- Launch of Dr. Keith White's book (`/gallery/launch-of-dr-keith-whites-book…/`), Jul 2022
- Remembering "Moushie" (`/gallery/remebering-moushie/` — URL has a typo), Dec 2019
- Dr. Lorraine Francis honorary doctorate (`/gallery/dr-lorraine-francis-was-conferred…/`), Dec 2019

## Brand & visual material

**Logo:** two inconsistent raster files in active use, no vector master:
- `/wp-content/themes/prmm/images/PRRM.png` — header mark, some templates
- `/wp-content/themes/prmm/images/new-logo-of-PRMM5.jpg` — main sitewide logo, visible JPG compression, wordmark baked into the raster (can't recolor/resize/reflow for dark backgrounds)
- `/wp-content/themes/prmm/favicon.ico`

**Recommendation:** request original vector/print files from the client rather than re-deriving from the JPG.

**Color** (sampled from computed styles, no documented token system):
| Name | Hex | Used for |
|---|---|---|
| Coral (primary) | `#F66867` | h1 text, hero headings |
| Coral (button) | `#DB5E5E` | donate link text |
| Slate blue (footer) | `#91A1B4` | footer background |
| Ink blue (links) | `#435061` | "learn more" links |
| Body text | `#333333` | default copy |
| Ground | `#FFFFFF` | page background |

Coral repeats consistently enough to read as intentional but is applied via
at least two slightly different hex values — standardize to one token each
for the rebuild.

**Typography:** Helvetica Neue/Arial system stack throughout, no webfont.
Heavy weight (900) at small sizes (28px h1). Heading hierarchy is broken
sitewide — most page titles render as H3; only two true H1s exist site-wide
(both on the homepage, neither carrying real title text). Buttons/"read
more" labels use Montserrat, bold, uppercase, letter-spaced — the one
deliberate typographic accent.

**Visual tone:** documentary/candid photography (no stock or illustration),
inconsistent quality (phone snapshots next to composed shots), some awkward
template cropping. Warm but restrained mood — coral + white + slate-blue;
long-form scripture/mission copy gives it a devotional register distinct
from typical NGO sites.

**Layout patterns worth preserving as mechanics** (not literal CSS):
- Homepage 6-tile stats strip — single most effective element; keep the
  mechanic, refresh the numbers, add a source/date note.
- `/impact/` category-filtered grid — the real sitemap of the mission's
  work; promote it in the new IA instead of leaving it one level down.
- "Shaping the Mind/Spirit/Heart/Environment/Destiny" narrative framing —
  distinctive, tied to Ramabai's philosophy, worth keeping as a storytelling
  layer even if the underlying taxonomy changes.
- Get-involved footer band (Donate/Sign Up/Spread the word/Contact) — sound
  mechanic, broken execution (dead share icons, "Sign Up" with no
  destination) — needs rebuilding, not copying.

## Accessibility issues (sitewide)

- **24 of 25 homepage images have empty `alt=""`** — same pattern site-wide,
  including content-bearing images (leadership photos, gallery event
  photos). Highest-leverage fix: make alt text required at the CMS/component
  level, not left to per-page discipline.
- Heading hierarchy broken sitewide (most titles are H3; only two real H1s,
  both empty of distinguishing text).
- Dead links presented as functional (3 of 4 social icons, "Sign Up",
  Google+ share all point to `href="#"`).
- No skip-navigation link.
- Embedded Google Map (Contact Us) has no text alternative for the location.
- Positive: `<html lang="en">` correctly set; viewport meta present and correct.
