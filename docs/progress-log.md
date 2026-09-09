# Progress log — prmm.org.in rebuild

Session handoff notes. Not a task list (that's `dev-backlog.md`) or a
decisions doc (that's `migration-plan.md`) — this is "what happened, what's
live, where to pick up," kept short and dated.

## 2026-09-09 — session summary (CMS editor UX)

**Done, on `feature/decap-cms-ux` (separate from the Phase 4 accessibility
branch/PR):**
- Flattened the nested "Photo" object field (`programs`, `news`,
  `testimonials`) into two plain top-level fields (Photo, Photo Description)
  in `config.yml` — no more collapsible sub-form for a non-technical editor
  to discover. `gallery`'s photo list stays a repeating list (inherent to
  "multiple photos each with a caption") but now defaults expanded with a
  descriptive summary per row. `content.ts` updated to match the new flat
  frontmatter shape (`image` + `image_alt` instead of a nested `image: {src,
  alt}` object) — safe with no migration needed since no real content
  existed yet in these collections.
- Added Decap CMS live preview templates (`public/admin/preview-templates.js`
  + `preview.css`) for all 9 collections, approximating the real site's look
  (colors/fonts hand-matched to `globals.css`) so editors see roughly what
  they're publishing before they publish. Built as plain JS/React.createElement
  (no build step — `/admin` is static, outside the Next.js build), with hand
  written CSS rather than a Tailwind CDN, since `/admin` doesn't get the
  app's compiled Tailwind v4 styles.
- **Known limits, called out in the preview UI itself**: no shared header/
  footer around the preview; no "related items" (depends on sitewide data,
  not just the one entry); the generic `pages` collection preview only
  covers the small part of some pages it actually controls (e.g. Home's
  hero heading/intro) — most of Home, About Mukti Mission's history/
  leadership sections, and all 5 "Shaping the…" pages are hardcoded in TSX,
  not CMS-editable at all. That last point is a real gap, not just a
  preview limitation — flagged to the user, not yet actioned.
- Added Lorem-ipsum placeholder entries to every previously-empty collection
  (`programs`, `news`, `gallery`, `reports`, `newsletters`, `contacts`,
  `testimonials`) at the user's request, so listing pages and the new
  preview templates have something real to render against instead of just
  empty states. All clearly marked "Lorem Ipsum" / "placeholder" in title
  and body — must be deleted before launch, not mistaken for real content.

## 2026-09-08 — session summary

**Done:**
- Site audit of the current WordPress site (`site-audit.md`), migration plan
  and Decap collection design (`migration-plan.md`), numbered dev backlog
  (`dev-backlog.md`).
- Full wireframe set (19 pages) on the [PRMM Wireframes canvas](https://claude.ai/code/artifact/9e22ee6e-180e-436f-8701-37b150ee2def),
  including a donation-conversion UX pass.
- Phase 0 (partial): `develop` branch created, `.github/CODEOWNERS` added,
  Decap editorial workflow enabled. Branch protection **not** applied — see
  Blockers below.
- Phase 1: all 7 Decap collections added (`programs`, `news`, `gallery`,
  `reports`, `newsletters`, `contacts`, `testimonials`) with `content.ts`
  getters to match, alt text required by construction on every image field.
- Phase 3: all 19 wireframed pages scaffolded and merged into `develop`
  across two PRs (#2 core, #3 content/legacy) — real build (26 routes),
  ESLint clean, every route curl-verified against a live dev server.

**Current state:**
- `develop` has the full scaffolded site. `master` is one commit set behind
  (still at the docs/config commits — `e9d74aa`), not yet caught up with
  the page-scaffolding work, which is correct: nothing has been deployed
  or deemed release-ready yet.
- Not deployed anywhere for visual review — Vercel setup (dev-backlog #4)
  is on hold at your request.
- All new collections (`programs`, `news`, `gallery`, `reports`,
  `newsletters`, `contacts`, `testimonials`) are schema-only, no real
  content — every listing page renders an honest empty state by design.

## Blockers / open decisions carried forward

- **Branch protection** (dev-backlog #1): can't apply — the GitHub account
  used from this session has write access, not admin, on the repo. Target
  config is documented in `migration-plan.md`, Branching strategy. Needs
  either admin access granted, or you configuring it manually in
  Settings → Branches.
- **Vercel preview alias** (dev-backlog #4): on hold, per your instruction.
- **Payment gateway** (dev-backlog #13): not chosen. Donate page's "Proceed
  to Secure Payment" is a disabled stub.
- **Contact-form backend** (dev-backlog #15) and **newsletter ESP**
  (dev-backlog #16): not chosen. Both forms render as disabled stubs.
- **Security incident**: WordPress compromise (spam posts) — status unknown
  from this side; confirm with the client it's been handled.
- **Client confirmations still needed**: original vector logo/brand files,
  current stats/figures (homepage stat strip has no real source yet),
  whether `/reach/` should actually be renamed "Where We Work," donor
  account/receipt-retrieval model for Donate, expected report calendar (for
  Reports gap-highlighting).

## Where to pick up tomorrow

1. If a decision on any of the above blockers comes in, that unblocks the
   matching backlog item directly — no re-derivation needed, just implement.
2. Otherwise, reasonable next steps in order of value:
   - Review the scaffolded pages in a real browser (`npm run dev`) before
     going further — nothing's been manually clicked through yet, only
     curl-verified.
   - Seed a handful of real CMS entries (one program, one news post) through
     `/admin` locally to confirm the editorial workflow and schema actually
     work end-to-end from an editor's perspective, not just that the code
     compiles.
   - Decide the Phase 2 items (payment gateway, contact-form backend,
     newsletter ESP) — everything else is now waiting on these.
