# Design system reference

Living document recording the visual/interaction conventions this rebuild
actually uses, so new pages/components match instead of drifting. Written
from what's really in the code (verified below), not aspirational — update
this file in the same commit whenever a convention changes, the way
`config.yml`/`content.ts` are kept paired.

## Color tokens

Single source of truth: `src/app/globals.css`'s `@theme inline` block.
Never hardcode a hex value that duplicates one of these — reference the
Tailwind utility (`bg-coral`, `text-ink-soft`, etc.) so a palette change is
one edit, not a grep-and-replace.

| Token | Hex | Use |
|---|---|---|
| `coral` | `#db5e5e` | Primary action color — Donate buttons, links-on-hover, stat numbers |
| `coral-dark` | `#c74646` | Hover state for coral buttons |
| `paper` | `#faf7f3` | Page background |
| `ink` | `#2e2620` | Primary text, **and the one dark background color sitewide** (Stats strip, Get Involved band, footer, skip-link, Our Foundation band) |
| `ink-soft` | `#6b5d4f` | Secondary/muted text |
| `tertiary` | `#d97b2b` | Reserved warm accent — not yet placed in any section; use sparingly if a highlight color distinct from coral is ever needed |

Retuned 2026-09-10 to the client's brand palette (Primary `#db5e5e` /
Secondary `#6b5d4f` / Tertiary `#d97b2b` / Neutral `#2e2620`) — the prior
`ink` (`#262523`) read as a flat near-black, which felt off against the
warm palette everywhere else; `#2e2620` is the same role (one dark
background/text color sitewide) but warmed to match.

**One dark color only.** Until 2026-09-09 there were three different dark
backgrounds in use — `ink`, a `slate` token (#2d5c6b, Get
Involved band), and the footer's own one-off `#2b3541` (never even a
token) — which read as mismatched rather than one cohesive dark identity
(client feedback). Consolidated everything to `bg-ink`; `slate` was
removed from `globals.css` entirely once nothing referenced it anymore.
**Don't introduce a second dark background color** — every "this needs a
bold dark band" instinct should reach for `bg-ink`, not a new hex.

**Bold color-blocked sections** (added 2026-09-09, after client feedback that
the homepage read as too visually flat): alternate full-bleed section
backgrounds — `bg-ink`, `bg-coral`, the `#f3efe7` tan tint, and plain
white/paper — to create visual rhythm across the page, the same structural
technique a photography-heavy reference site (isha.sadhguru.org) uses with
its own palette. When a section uses a bold background, any card/panel
inside it should stay `bg-white` (never transparent) so it visibly floats
on the band rather than the text sitting directly on a busy background.
Don't make every section bold — alternate with neutral/tan sections the way
Hero, Legacy, Mission teaser, and News currently stay plain; an all-bold
page is as flat-reading as an all-white one, just loud instead of quiet.

A few section backgrounds use one-off hex values not promoted to tokens yet
(`#f3efe7` alternating section tint, `#e7ecf1` category pill background) —
promote to named tokens if they start recurring beyond their current single
use each.

## Typography

**Two families as of 2026-09-10: Source Serif 4 (headings, h1-h3) + IBM Plex Sans (body/UI)** — both loaded via `next/font/google` in `layout.tsx` and registered as `--font-serif`/`--font-sans` in `globals.css`'s `@theme` block. This **reverses** the 2026-09-09 single-family decision below; the reversal is deliberate, not a regression back to the mistake that decision fixed — the difference is that a real serif webfont is now actually loaded and registered, so headings render the intended typeface rather than falling back to the browser's generic system serif. Client explicitly requested this pairing (matching a wireframe-canvas exploration) on 2026-09-10.

~~**One family sitewide: Geist Sans**~~ (superseded above). `font-serif` was removed sitewide 2026-09-09 (`dev-backlog.md` #60) because it had never been paired with an actual loaded serif webfont — every heading was silently falling back to the browser's generic system serif rather than a deliberate typeface. The rule stands for any *future* font change: **don't reintroduce a font utility without loading a real font via `next/font/google` first and registering it in `globals.css`'s `@theme` block** — an unstyled fallback is worse than no heading-style rule at all.

- Headings: `text-4xl`/`text-5xl` for `h1`, `text-3xl` for section `h2` (bumped from `text-2xl` 2026-09-09 — client feedback that the whole page read as too small, not just the header), `text-lg`/`text-xl` for card-level `h3`.
- Body: `text-base` is the default body/description size on the homepage as of the same pass (was `text-sm` — bumped for the same reason); `text-xs` stays for genuine meta text (dates, captions, fine print) only, not for anything a visitor is meant to actually read as content. Other pages built before this pass may still be on the older `text-sm` scale — bring them up to `text-base` if you're touching them anyway, but that's not yet a completed sitewide sweep.
- Long-form content (page/post bodies rendered from markdown via `dangerouslySetInnerHTML`): wrap in Tailwind Typography's `prose` (not `prose-sm` — that tighter variant was dropped from the homepage's Legacy/Mission sections in the same sizing pass) rather than hand-styling markdown output.

## Cards

Convention used everywhere (program cards, news cards, contact cards, the
Featured Cause panel): `rounded-lg border border-black/10 bg-white
shadow-md`, internal padding `p-4`–`p-6` depending on density. `shadow-md`
was added sitewide 2026-09-09 (bulk edit across all 20 occurrences of the
pattern, `dev-backlog.md` #63) after client feedback that cards read too
flat compared to the reference site — this **supersedes** the earlier
"no box-shadow anywhere" note that lived here; don't add a new card without
`shadow-md`; don't remove it from an existing one without updating this
section again.

**Card images get an angled bottom-right corner** — `PhotoBox.tsx` (the one
shared photo/placeholder component every card uses) applies a small
`clip-path` corner-cut by construction, so this is automatic sitewide, not
a per-card class to remember. Echoes the sectional angled-divider motif
(below) at card scale — one consistent "angled" language at two sizes,
not two unrelated decorative ideas.

## Angled section transitions — tried and reverted, don't reintroduce

Bold full-bleed sections (Stats, Featured Cause) briefly had diagonal
seams into whatever section followed. First attempt: `clip-path` directly
on the section — broke, because clip-path only hides part of *that
section's own* painted box rather than pulling the next section into the
gap, so the gap showed the page's own background (`bg-paper`) instead of
the next section's real color — a three-color "patchy" seam. Second
attempt: an `AngledDivider` component painting the next section's exact
color as an SVG overlay at the seam, fixing the color-gap bug — but the
client still wasn't happy with the angled look overall and asked to revert
it entirely (`dev-backlog.md` #64). **Current state: plain straight-edged
sections, no angling anywhere** — `AngledDivider.tsx` was deleted. If this
gets requested again, both prior attempts (and why the first broke) are
recorded here and in `dev-backlog.md` #63/#64 — don't rediscover the
clip-path bug from scratch, but also don't assume angling is wanted by
default; confirm first, since it's been tried and pulled back once already.

## Motion

- `src/components/Reveal.tsx` — fade + slide-up when a section scrolls into
  view (`IntersectionObserver`, one-shot). Wraps whole `<section>`s on the
  homepage. Honors `prefers-reduced-motion` via the `motion-reduce:` Tailwind
  variant baked into the component — don't re-implement the reduced-motion
  check per call site.
- `src/components/CountUp.tsx` — animates a stat's leading number up from 0
  on scroll. Parses whatever numeric prefix is already in the string (so it
  never changes the value shown, only how it arrives) and also honors
  `prefers-reduced-motion`.
- Both are deliberately restrained (one fade, one count-up) rather than a
  full animation library — match that register for anything added later;
  this is a donation-trust site, not a marketing microsite, and heavy
  motion competes with the "does this org feel credible" question a visitor
  is actually there to answer.

## Decorative elements — imagery and icons

**AI-generated imagery is allowed only for non-representational, decorative
elements** — abstract textures, background patterns, illustrative icon
sets, empty-state graphics. It is **not allowed** as a stand-in for
anything a visitor would reasonably read as documentary: beneficiary
photos, the Pandita Ramabai portrait/logo mark, program/facility photos,
testimonial photos, or anything currently marked as a placeholder box
awaiting a *real* photo (see `dev-backlog.md` #50/#51). A photo carries an
implicit claim of "this is real" that decorative art doesn't — using a
generated image there is the same category of problem as the fabricated
stats/testimonials/impact-claims already removed this session
(`dev-backlog.md` #53, #55, #56), just in image form, and arguably worse
because photos are more persuasive and the deception is harder to walk
back once a donor has seen a real facility later. When in doubt about
whether a given image use crosses that line, treat it as documentary and
don't generate it.

One reviewed attempt at decorative background icons (four scattered line
icons behind the hero, echoing a wellness-site reference) was tried and
reverted — see `dev-backlog.md` #56 for what didn't work and why: the
reference site's actual richness came from real large-format photography,
not icon decoration, so icon styling was the wrong lever for closing that
gap. Any future decorative pass should study what's actually structural
about a reference (photography density, color, real content) versus what's
merely decorative (a single restrained motif, platform icons next to real
numbers) before copying surface elements.

## Social proof

Only show what's verified. `src/components/socialLinks.tsx` holds the one
shared list (currently: Facebook only, the one channel `site-audit.md`
confirms is actually live on the original site) used by both the footer and
the homepage "Follow Our Work" band — don't fork a second list. Never show
a follower/subscriber count without a real, current, client-confirmed
number; a platform icon alone is fine, an invented number next to it is not.
