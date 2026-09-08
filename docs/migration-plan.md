# Migration plan — prmm.org.in → Next.js + Decap CMS

Living document — update as decisions are made. Source material:
[`site-audit.md`](./site-audit.md) (2026-09 crawl of the current WordPress site).

## Sequence

1. Content/feature audit of current site — **done**, see `site-audit.md`.
2. IA/CMS collection plan — draft below, pending client confirmation.
3. Wireframes / UX flow per page (Claude Design artboards).
4. Component build in Next.js, `src/lib/content.ts` + `public/admin/config.yml`
   extended together.
5. Visual/brand pass.
6. Content migration into new schema (manual for `news`/`gallery` — see
   security note).
7. QA, then launch.

## Blocking items — need client input before proceeding

- **Security incident** (site-audit.md): WordPress compromised, 100+ spam
  posts live. Client needs to rotate admin credentials / audit plugins now,
  independent of rebuild timeline.
- **Donate flow**: confirm whether the current form actually reaches a
  working payment processor (no gateway script detected). Decide on a real
  gateway for the rebuild (Razorpay/Instamojo/PayU are standard for Indian
  nonprofits with 80G receipting) — this is a backend integration
  workstream, not part of the Decap content migration.
- **PAN number handling**: currently collected in plaintext via a generic
  form. Must go through a compliant flow in the rebuild, not a
  contact-form-style pipeline.
- **Brand assets**: no vector logo exists on the current front end (two
  inconsistent raster files, wordmark baked in). Request original
  vector/print files from the client rather than re-deriving from the JPG.
- **Stale content**: newsletters stop at Aug 2022, gallery at 2019–2022,
  Reports missing Accounts 2023, homepage stats have no source/date,
  founding date stated two inconsistent ways. Client needs to supply current
  figures/content — this is not a migration task.
- **`/news-and-updates/`**: do not migrate programmatically. Genuine posts
  must be manually separated from injected spam first.

## Proposed Decap collections

| Collection | Maps from | Notes |
|---|---|---|
| `pages` (existing) | Home, About Ramabai, About Mukti, Reach, Testimonials, Terms, Privacy | Singleton-style markdown pages, as today. |
| `programs` | 14 Impact entries | Fields: title, category (drives the filter grid), photo, description, body. "Shaping the…" grouping becomes a tag/theme field on top of category, not a separate collection. |
| `news` | Genuine posts only from News & Updates | Split from `gallery` — different field shape (text + date vs. image array). |
| `gallery` | Happenings at Mukti posts | Title, date, image array. |
| `reports` | Reports page PDFs | Fields: file, year, type (Accounts/Certificate) — makes missing-year gaps visible as empty entries instead of silent omissions. |
| `newsletters` | Mukti Kiran PDFs | File + issue date. |
| `contacts` | 6 regional contacts | Structured: name, address, phone, email — fixes today's inconsistent per-region formatting. |
| `testimonials` | Testimonials page | Added when the Testimonials page was scaffolded — missing from the original plan; quote, name, optional photo. |
| `donate` | Donate page | Likely a page + separate payment integration, not pure markdown (see blocking items). |

## Branching strategy

- `main` = production, protected, Vercel production deploy.
- `develop` = integration branch for code/design work, deployed to a Vercel
  preview alias for client review.
- Feature branches → PR into `develop` → PR into `main`.
- Decap CMS backend points at `main` with **Editorial Workflow** enabled
  (draft → review → publish through Decap's UI), not direct commits.
- Risk to manage: content lives as markdown in the repo, so concurrent CMS
  edits on `main` and schema work on `develop` can conflict. Mitigate by
  freezing CMS edits during active rebuild work, or holding the new content
  schema on its own branch until a single migration merge rather than an
  ongoing rebase.
- `CODEOWNERS` entry for `public/admin/config.yml` and `src/lib/content.ts`
  — these two files must change together; any PR touching either requires
  sign-off from whoever owns the content-schema pairing. **Currently lists
  only @vinay-avadhutatech** (the sole collaborator on the repo as of
  2026-09) — do not turn on "Require review from Code Owners" branch
  protection until a second developer is added, or every PR touching either
  file deadlocks (GitHub blocks self-approval).
- **Branch protection status (2026-09): not yet applied.** The GitHub
  account used from this session (`vinay-avadhutatech`) has write access to
  the repo, not admin — branch protection is an admin-only setting and the
  API call was refused. Needs to be set up manually (Settings → Branches)
  or by granting that account admin. Target config for both `main` and
  `develop`, given it's a solo developer for now:
  - Require a pull request before merging — **on**.
  - Require approvals (1) — **on**.
  - "Do not allow bypassing the above settings" — **off**. With it off, the
    repo admin can still merge their own PRs (GitHub can't enforce a
    second approver when none exists); checking it would lock out the only
    developer entirely.
  - "Require review from Code Owners" — **off**, per the CODEOWNERS note
    above.
  - **When a second developer is added**: revisit both — check "Do not
    allow bypassing" so the rule actually binds admins too, and turn on
    "Require review from Code Owners" now that CODEOWNERS review is
    enforceable.
- Tags: reserve for (a) immediately before/after any change to the
  `config.yml`/`content.ts` schema pairing, so a broken CMS can be bisected
  quickly, and (b) client-facing milestones (e.g. `v1.0-launch`). Skip
  automated semver/changelog tooling — no external consumer needs it.

## Design tooling

No Figma or Google Stitch MCP connector is available in this environment.
Wireframes/mockups are drafted directly as Claude Design artboards. Figma is
only worth introducing if an external designer needs to hand-tweak visually.
