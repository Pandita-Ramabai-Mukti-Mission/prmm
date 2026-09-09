# Progress log — prmm.org.in rebuild

Session handoff notes. Not a task list (that's `dev-backlog.md`) or a
decisions doc (that's `migration-plan.md`) — this is "what happened, what's
live, where to pick up," kept short and dated.

## 2026-09-09 — Google Sheets credentials live, verified

User provided real service-account credentials
(`sheets-integration@prmm-website.iam.gserviceaccount.com`) and the target
spreadsheet ID in chat — written straight to `.env.local` (gitignored,
confirmed via `git check-ignore`), never committed, not re-displayed after
the initial write. Flagged once that pasting a live private key into chat
means it now lives in conversation history too; rotating it at some point
is the user's call, not urgent.

First test attempt failed with `403 PERMISSION_DENIED` — auth itself
succeeded (real handshake with Google), but the spreadsheet hadn't been
shared with the service account yet. User shared it as Editor and added the
`Donations` tab; re-running the same test then succeeded: a
clearly-labeled test row (`TEST_<timestamp>`) was appended and then had its
status updated, both against the real live sheet, confirming
`appendDonationRow`/`updateDonationStatus` genuinely work end-to-end, not
just that they fail gracefully. Tested via a standalone `tsx --env-file`
script importing `src/lib/googleSheets.ts` directly, since the real
`/api/payu/initiate` route only calls it after PayU's own config check
passes — with PayU still unconfigured, the real form can't reach this code
path yet (see dev-backlog #13/#14).

## 2026-09-09 — branch protection dropped (solo developer)

User confirmed they're the only developer on this repo and asked to drop
branch protection (dev-backlog #1) entirely rather than keep chasing admin
access to apply it. Nothing needed undoing on GitHub — confirmed via `gh
api` that neither `main` nor `develop` ever actually had protection
configured, so this was a documentation change only (dev-backlog.md,
migration-plan.md). `.github/CODEOWNERS` stays as an informational note
(the config.yml/content.ts pairing still matters), just unenforced.
Revisit both if a second developer is ever added.

## 2026-09-09 — session summary (donate form: functional, validated, PayU + reCAPTCHA wired)

**Client decisions landed this session**: PayU is the payment gateway
(dev-backlog #13); the current WordPress site's ongoing spam compromise
(see below) is the reason bot-prevention (reCAPTCHA) was requested for this
form specifically, ahead of contact-form (#15) and newsletter-signup (#16),
which will need the same treatment once their backends are chosen.

**Done, on `feature/decap-cms-ux`:**
- `DonateForm.tsx` rebuilt: removed the cause/frequency/amount chip UI from
  the prior session's simplification pass in favor of real, clickable
  inputs (name, email, phone, address, PAN) plus a "Donating To" `<select>`
  (General Fund / each program / Other-with-a-required-specify-field) — the
  dropdown the user asked to bring back, now a real form control rather
  than a chip picker.
- Client + server validation sharing one rule set
  (`src/lib/donationValidation.ts`) — required fields, email/phone/PAN
  format — so the browser gives instant feedback and the API route
  (reachable directly, not just via the form) re-checks the same rules
  rather than trusting the client.
- reCAPTCHA **v3** (invisible, score-based — user explicitly wanted no
  visible checkbox) added (`src/lib/recaptcha.ts` verifies server-side
  against `https://www.google.com/recaptcha/api/siteverify`, rejecting
  scores below 0.5 or an `action` mismatch), currently on Google's published
  test key pair (always passes) — **must be swapped for a real v3-type site
  key/secret before launch** (dev-backlog #17) or it verifies nothing.
  Confirmed empirically (not assumed) that the v2 test key pair also works
  through v3's `execute()` API, but its siteverify response omits
  `score`/`action` entirely — `recaptcha.ts` only enforces those when
  Google actually returns them, so the always-pass test behavior isn't
  accidentally broken by the new score check. Client-side, v3 requires a
  fresh single-use token fetched asynchronously right before submit —
  `DonateForm.tsx`'s submit handler now always `preventDefault`s, awaits
  `grecaptcha.execute()`, writes the token into a hidden field, then calls
  the DOM form's own `.submit()` (bypassing React's `onSubmit`, avoiding
  re-entering this same handler) for a genuine browser POST. (Started the
  session on hCaptcha, then Google reCAPTCHA v2 checkbox, then v3 at the
  user's request — no hCaptcha or v2-checkbox code remains.)
- PayU hosted-checkout integration: `src/lib/payu.ts` (request/response hash
  formulas — fetched from PayU's own docs this session, not reconstructed
  from memory, since a wrong field order silently breaks or fakes a
  payment), `src/app/api/payu/initiate/route.ts` (re-validates, verifies
  captcha, signs, auto-submits to PayU), `src/app/api/payu/callback/route.ts`
  (verifies PayU's response hash before trusting `status`, redirects to a
  new `/donate/thank-you/` result page). **Fails closed** with a clear
  "gateway not configured" page when `PAYU_MERCHANT_KEY`/`PAYU_SALT` aren't
  set (they aren't yet — no real credentials exist) — verified end-to-end
  in a real browser up to that point (fill form → pass captcha → server
  validates → reaches the not-configured stop), so the only missing piece
  is real credentials, not untested code.
- Donation record-keeping decided: a **Google Sheet**, not a database — user
  explicitly rejected storing this in Decap CMS (right call: Decap has no
  server-side write path, and PII/PAN in git history is close to a
  compliance problem, not just a style issue) and picked Sheets over
  Supabase for cost/familiarity given non-technical NGO staff.
  `src/lib/googleSheets.ts` (service-account JWT auth via
  `google-auth-library`, added as a real dependency — installed with
  `--legacy-peer-deps`, same pre-existing decap-cms-app peer conflict as
  last session, not a new issue) appends a full donor-detail row from
  `/api/payu/initiate` (the only point phone/address are trustworthy — not
  part of PayU's signed hash) and reconciles just the status from
  `/api/payu/callback` after hash verification. Fails silently (logs
  server-side, never blocks the payment) without
  `GOOGLE_SHEETS_SPREADSHEET_ID`/`GOOGLE_SHEETS_CLIENT_EMAIL`/
  `GOOGLE_SHEETS_PRIVATE_KEY` set, same as PayU/reCAPTCHA — verified this
  still reaches the same "gateway not configured" stop end-to-end with
  Sheets unconfigured.
- Build, lint, and `tsc --noEmit` all clean.

**Not yet done**: real PayU, reCAPTCHA, and Google Sheets credentials (none
exist yet — a Google Cloud service account needs creating and sharing onto
a real spreadsheet, dev-backlog #14); actual receipt generation/emailing
from the sheet isn't built, only getting data into it; deciding the PAN/80G
threshold (still a bracketed placeholder in the UI copy).

## 2026-09-09 — session summary (blank /admin bug — FIXED)

**Root cause found and fixed** (see prior entry below for full context on
what this refactor is and why): the bug was a React 18 Strict Mode
dev-only double-effect race in `src/app/admin/page.tsx`, not a
`decap-cms-app` API mismatch. Sequence: mount #1 sets `initialized.current
= true` and starts the async `import()` chain with a `cancelled` flag
closed over as `false`; its cleanup (fired immediately by Strict Mode's
mount→cleanup→mount) flips *that* closure's `cancelled` to `true`; mount #2
sees `initialized.current` already `true` and no-ops. Mount #1's async
chain then resolves with `cancelled` now `true`, so `CMS.init()` is never
called — `decap-cms-app`'s version log still fires (confirming the module
loaded), but `decap-cms-core`'s bootstrap log never does, and `#nc-root`
never appears. Fix: drop the `cancelled`/cleanup pair entirely — the
`initialized` ref alone already prevents double-init, so the surviving
in-flight run just finishes uninterrupted (`src/app/admin/page.tsx`,
commit `67c61b7`).

**Verified in a real headless-browser session** (Playwright, ad hoc, not
committed as a test): `/admin` boots, `#nc-root` mounts, login works, all 9
collections list correctly, and opening a Programs entry shows the live
preview rendering through the shared `content-views` components
(`ProgramDetailCore` — title, category, donate CTA, description all
correct). The component-reuse architecture is confirmed working end to
end, not just building cleanly.

**Still not done** (carried forward from the entry below, unchanged):
re-verify the other 8 collections' previews individually (only Programs
spot-checked this session); decide on the `next/image` warning in
`PhotoBox`; keep `local_backend: true` commented in any commit.

## 2026-09-09 — session summary (CMS component-reuse refactor — IN PROGRESS, BROKEN)

**Context:** after shipping the hand-maintained CSS preview (previous entry
below), verified it in a real browser and immediately found it had been
silently broken since day one (`React.createElement` doesn't exist in
Decap's runtime — fixed separately). That prompted you to ask for the
"real" fix: CMS previews built from the *same* components the live pages
render, so a markup change can't drift the two apart. This entry is that
attempt — **left mid-refactor, not working, do not merge as-is.**

**Done, uncommitted-to-develop, all on `feature/decap-cms-ux`:**
- Extracted presentational components under `src/components/content-views/`
  (`PhotoBox`, `DonateCta`, `ProgramDetailCore`, `NewsDetailCore`,
  `GalleryDetailCore`, `TestimonialCardView`, `ReportsTable`,
  `NewsletterRow`, `ContactCardView`, `PageTitleBody`, `PostDetailCore`).
  Rewired every real page (`programs/[slug]`, `news/[slug]`,
  `happenings-at-mukti/[slug]` + its index, `testimonials`, `reports`,
  `mukti-kiran`, `contact`, `terms-of-use`, `privacy-policy`, `reach`,
  `about-pandita-ramabai`, `posts/[slug]`) to render these instead of
  inline JSX. **Real bug fixed as a byproduct**: the live site never
  actually rendered uploaded photos anywhere — every image slot was a
  permanent placeholder box showing only alt text, even with a real photo
  uploaded. `PhotoBox` now renders the real `<img>` when one exists.
- Added `ChromeGate` (`src/components/ChromeGate.tsx`) so `/admin` renders
  without `SiteHeader`/`SiteFooter` — gates by `usePathname()` rather than
  restructuring routing into multiple root layouts.
- Migrated the CMS off the static CDN script (`public/admin/index.html`,
  now deleted) onto `decap-cms-app` (npm), mounted from a real route
  (`src/app/admin/page.tsx` + `layout.tsx`), so `src/lib/cms-preview-
  templates.tsx` can `import` the exact same `content-views` components as
  the real pages — one component, two callers, by construction.
- **Upstream packaging bugs hit and worked around** via scoped
  `package.json` `overrides` (nested under `decap-cms-app` so they don't
  touch eslint's own dependency tree): `decap-cms-lib-widgets@3.4.1`,
  `decap-cms-lib-util@3.8.1`, and `decap-cms-editor-component-image@3.4.1`
  all ship a literal `"catalog:"` pnpm-workspace reference in their
  published `package.json`, which plain npm can't resolve — pinned each to
  the last clean version instead. Also needed `--legacy-peer-deps` (a
  stale `immutable: ^3.7.6` peer range in `decap-cms-lib-widgets` conflicts
  with `decap-cms-core`'s `^4.3.9`). This added ~570 packages — a real
  weight cost of this approach, not hidden.
- `npm run build` and `npm run lint` both pass; `/admin` is a real
  server-rendered route (200, correct `<title>`) in production build.

**BROKEN — where this was left:** in dev (`npm run dev` + `npx decap-
server@3.10.0` + `local_backend: true`), `/admin` returns 200 with the
correct title, `decap-cms-app 3.16.1` logs to console confirming the
module loaded and ran, **zero console errors, zero failed network
requests** — but the page renders completely blank. No `#nc-root` (or any
CMS DOM) ever appears. Not yet diagnosed. Candidate causes to check next
session, in likely-first order:
1. `CMS.init()` may need an explicit mount target/config object via
   `decap-cms-app`'s actual API rather than relying on the CDN bundle's
   auto-mount-to-`document.body` behavior — the two packages may not
   behave identically despite same version number scheme. Read
   `node_modules/decap-cms-app/dist/esm/index.js` and
   `decap-cms-core`'s `bootstrap.js` directly rather than assuming parity
   with the CDN script.
2. The `<link rel="cms-config-url">` tag is appended in a `useEffect` that
   also kicks off the dynamic `import()` in the same effect body — a race
   is possible if Decap reads that tag synchronously before it's actually
   in the DOM, depending on exactly when React commits vs. when the effect
   body runs relative to the import's async boundary. Try appending the
   link and awaiting a microtask/rAF before importing, or pass config
   directly as a JS object to `CMS.init({ config })` instead of the link-
   tag mechanism, to rule this out.
3. Emotion (`@emotion/react`) or another CSS-in-JS dependency Decap uses
   internally may need an `<CacheProvider>`/style-injection point this
   client component doesn't provide — check for silently-swallowed style
   injection errors, not just thrown JS errors.
4. Worth a byte-for-byte diff of what `decap-cms-app` actually exports
   (`Object.keys(CMS)`) against what the CDN `window.CMS` exposed, in case
   `.init` isn't actually the right entry point for this package version.

**Do not spend time re-deciding the architecture** — the component-reuse
approach itself is sound and mostly built (all 11 shared components +
route wiring + real-page rewiring is done and building cleanly); this is
a specific, narrow "why is the mount blank" bug in the last ~10% of one
new file (`src/app/admin/page.tsx`). Fix that, not the design.

**Not yet done regardless of the above bug:** re-verify all 9 collections'
previews render correctly through the real components (previously verified
individually against the old hand-CSS version, not against this rewrite);
decide whether to keep `next/image` warning as-is or address it in
`PhotoBox`; the `local_backend: true` line in `config.yml` must stay
commented in any commit (only uncomment for local testing, never merge it
on).

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
