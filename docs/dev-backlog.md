# Dev backlog — prmm.org.in rebuild

Numbered so tasks can be claimed directly. Each item links back to
[`site-audit.md`](./site-audit.md) / [`migration-plan.md`](./migration-plan.md)
for rationale instead of repeating it — read the linked section only if the
one-line description isn't enough.

Status legend: **Ready** (can start now) · **Blocked** (needs a decision or
client input listed) · **Depends on #N**.

## Phase 0 — Infra & repo setup

1. **Ready** — Add branch protection on `main` + `develop` (PR review required).
2. **Ready** — Add `CODEOWNERS` entry for `public/admin/config.yml` and
   `src/lib/content.ts` (must change together — *migration-plan.md, Branching strategy*).
3. **Ready** — Enable Decap `publish_mode: editorial_workflow` in `config.yml`,
   pointed at `main`.
4. **Ready** — Set up a Vercel preview alias for `develop` for client review.
5. **Blocked — client** — Confirm WordPress admin credentials rotated /
   plugins audited (*site-audit.md, Security*). Tracking item, not code work.

## Phase 1 — Content model (extend `content.ts` + `config.yml` together, per #2)

6. **Ready** — Add `programs` collection: title, category, photo, description,
   body, theme tag (for "Shaping the…" grouping). 14 entries expected.
7. **Ready** — Add `news` collection, separate from `gallery` (different field
   shapes — *site-audit.md, Page inventory*).
8. **Ready** — Add `gallery` collection: title, date, image array.
9. **Ready** — Add `reports` collection: file, year, type (Accounts/Certificate).
10. **Ready** — Add `newsletters` collection: file, issue date.
11. **Ready** — Add `contacts` collection: name, address, phone, email
    (structured — fixes today's inconsistent per-region formatting).
12. **Depends on #6–11** — Enforce required `alt` field on every image field
    across all collections, at the schema level (*site-audit.md,
    Accessibility* — highest-leverage a11y fix, close it by construction).

## Phase 2 — Integrations (blocked on client/product decisions)

13. **Blocked — client decision** — Confirm whether the current donate form
    reaches a working payment processor at all; pick a gateway (Razorpay/
    Instamojo/PayU) for the rebuild.
14. **Depends on #13** — Build compliant donation flow, incl. PAN field
    handling (no plaintext-through-contact-form pipeline).
15. **Blocked — decision needed** — Pick contact-form backend (serverless
    function + email API vs. third-party form service).
16. **Blocked — decision needed** — Pick newsletter-signup provider (ESP vs.
    custom) — current form has no visible ESP integration.

## Phase 3 — Pages

Wireframed — see the [PRMM Wireframes canvas](https://claude.ai/code/artifact/9e22ee6e-180e-436f-8701-37b150ee2def)
("Core & Conversion" and "Content & Legacy" pages). Build against those, not
from scratch — several items below are shared components/templates on the
canvas (Header, Footer, Get Involved band, Program Detail, "Shaping the…"),
so implement once and reuse rather than per-page.

17. Homepage: hero (single primary CTA), stats strip (dated/sourced this
    time, with a micro-CTA under it), mission teaser, latest programs (with
    a per-card "Support this program" link), latest news (needs a real
    empty-state, not just an assumption of fresh content), Get Involved band.
18. Get Involved band as a shared component — Donate visually dominant,
    Volunteer/Spread the Word/Contact present but subordinate. Reused on
    Home, Program Detail and About.
19. Programs index with category filter — make it URL-shareable, not
    anchor-based like the current `/impact/`. Include a "most urgent need"
    banner above the grid and a "Donate" link per card (pre-filtered cause).
20. Program detail template (title, photo, description, related programs,
    inline pre-filtered "Donate to This Program" CTA — highest-intent page
    on the site, don't bury the ask at the bottom).
21. About Mukti Mission page (Vision/Mission/Basis, history timeline —
    resolves the "since 1889" vs. Ramabai's 1858–1922 dates inconsistency,
    Leadership section with bios, Transparency & Accountability callout
    linking to Reports).
22. About Pandita Ramabai page (distinct from #21 — biography, not a
    duplicate).
23. "Shaping the…" template (Mind/Spirit/Heart/Environment/Destiny) — one
    shared layout, same approach as #20.
24. Donate page — depends on #14. Cause + frequency (one-time/monthly) +
    amount selection, live impact framing tied to the selected amount,
    no-refund disclosure at Step 1 (not beside the payment button), trust
    badges beside the actual payment CTA. **Open question for the client**:
    do donors need accounts to retrieve past 80G receipts, or is every gift
    anonymous with an emailed receipt? Not decided in the wireframe.
25. Contact page — structured regional contacts (#11) + form (#15) + map
    with a text alternative for the location + a "prefer to give directly"
    donate nudge.
26. News index + detail (genuine posts only — see #31 on curation).
27. Gallery index + detail (Happenings at Mukti).
28. Newsletters archive page (Mukti Kiran) — add an ESP-backed subscribe
    form; the current archive has no signup at all.
29. Testimonials page.
30. Reports page — missing years render as visible empty rows (e.g. the
    2023 Accounts gap), not silently omitted.
31. "Where We Work" page, repurposing the current `/reach/`, which is
    near-empty on the live site. **Flag to client**: confirm the rename/
    repurpose rather than assuming it.
32. Sitemap page — generated from the real IA at build time, not
    hand-maintained, so it can't drift out of sync the way the current one
    has (it's already missing all 14 programs and the gallery posts).
33. Terms of Use page — straight content port, no layout decisions.
34. Privacy Policy page — **not** a straight port: needs legal review
    against the actual rebuilt data flows, especially the Donate PAN field
    now going through a payment-partner redirect instead of a plain form
    field.

## Phase 4 — Accessibility & quality (close sitewide issues from the audit)

35. **Done** — Fix heading hierarchy. The `h3`-titles issue was specific to
    the old WordPress site (*site-audit.md*); the Next.js codebase already
    had a real `h1` per page. Fixed heading-level skips (h1 → h3 with no h2)
    in card grids on `programs`, `news`, `happenings-at-mukti`, `site-map`,
    and in `SiteFooter`'s column headings (`h4` → `h2`).
36. **Done** — Skip-navigation link. Already implemented in `SiteHeader`;
    fixed one gap — the orphan `posts/[slug]` route had no `id="main-content"`
    target (see note below on that route).
37. **Done** — Dead social/share links. No literal `href="#"` remained (that
    was WP-site-specific too). Found and fixed one equivalent: the "Spread
    the Word" tile in `GetInvolvedBand` linked to a nonexistent `/share/`
    route (404). Pointed it at a `mailto:` referral for now — swap for real
    share-intent URLs once a production domain exists (blocked on Vercel
    setup, see progress-log.md).
38. **Blocked — client decision** — Reconcile founding-date inconsistency
    ("since 1889" vs. Ramabai's 1858–1922 dates). `about-mukti-mission`'s
    History timeline still asserts 1889 as founding year independent of
    the "since 1889" copy in `layout.tsx` metadata and the homepage stats
    tile — not resolved, needs a client-confirmed date/framing.
39. **New, ready** — `src/app/posts/[slug]/page.tsx` + the `posts` content
    collection appear to be a leftover from before the `news` collection was
    added in Phase 1 (unstyled, not linked from nav/footer/sitemap, uses
    demo-scaffold styling unlike the rest of the site). Confirm with the
    user whether to delete it or repurpose it — don't delete unilaterally.

## Phase 5 — Migration & launch

40. **Blocked — client review** — Manually curate genuine posts from WP
    `/news-and-updates/` before import; exclude injected spam entirely
    (*site-audit.md, Security* — do not automate this step).
41. **Ready to plan, execute near launch** — Build a redirect map: every
    indexed WordPress URL → its new route, as 301s. IA is changing (e.g.
    `programs` replacing the scattered `/impact/` + footer structure), so
    without this the site loses existing SEO/backlinks on cutover.
42. Content freeze window plan for cutover (coordinate with Decap Editorial
    Workflow, #3).
43. DNS/domain cutover to Vercel production.
44. Post-launch: verify redirects (#41) resolve correctly, verify donation
    flow (#14) end-to-end with a real test transaction.
