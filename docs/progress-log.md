# Progress log — prmm.org.in rebuild

Session handoff notes. Not a task list (that's `dev-backlog.md`) or a
decisions doc (that's `migration-plan.md`) — this is "what happened, what's
live, where to pick up," kept short and dated.

## 2026-09-09 — session summary

**Done:**
- Phase 4 accessibility items (dev-backlog #35-37): survey found the "most
  titles are h3" and "dead `href=\"#\"` links" issues described in
  `site-audit.md` were specific to the **old WordPress site** — the Next.js
  codebase already had a real `h1` per page and the skip-link (`SiteHeader`)
  was already implemented. Fixed the real remaining gaps: heading-level
  skips (h1 → h3 with no h2) in card grids on `programs`, `news`,
  `happenings-at-mukti`, `site-map`, and `SiteFooter`'s `h4` column
  headings; a missing `id="main-content"` on the orphan `posts/[slug]`
  route; and a dead `/share/` link on the "Spread the Word" tile
  (`GetInvolvedBand`), now a `mailto:` referral pending a real domain.
- Lint clean, production build green after changes.

**New finding, not yet actioned:**
- `src/app/posts/[slug]/page.tsx` + the `posts` Decap collection look like a
  pre-Phase-1 leftover, superseded by `news` — unstyled, unlinked from
  nav/footer/sitemap. Filed as dev-backlog #39; needs your call on
  delete vs. repurpose before anyone touches it.

**Still open:** #38 (founding-date inconsistency) is a content decision,
not code — flagged to client, unchanged this session.

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
