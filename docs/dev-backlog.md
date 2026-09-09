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

13. **Done** — Gateway chosen: **PayU**. Hosted-checkout redirect flow built
    (`src/app/api/payu/initiate/route.ts` signs and redirects to PayU;
    `src/app/api/payu/callback/route.ts` verifies PayU's response hash and
    hands off to `/donate/thank-you/`) — see `src/lib/payu.ts` for the hash
    formulas, sourced from PayU's docs directly, not memory. **Blocked on
    client/ops**: needs real `PAYU_MERCHANT_KEY` / `PAYU_SALT` (and
    `PAYU_MODE=production` when ready) set as env vars — without them the
    flow fails closed with a clear "gateway not configured" page rather than
    silently pretending to work.
14. **Depends on #13, mostly done** — PAN is now a real (optional,
    format-validated) form field, sent to PayU as `udf1` rather than through
    a contact-form-style pipeline. Storage decided: a **Google Sheet**
    (`src/lib/googleSheets.ts`), not a database — a fuller-fledged donor
    account/receipt system was judged overkill for this NGO's scale and
    non-technical staff. `/api/payu/initiate` appends a row with the full
    donor-submitted fields (only trustworthy point for phone/address, which
    aren't part of PayU's signed hash); `/api/payu/callback` reconciles that
    row's status once PayU's response hash is verified. **Blocked on
    client/ops**: needs a Google Cloud service account (Sheets API enabled,
    shared onto the target spreadsheet — restrict sharing to specific staff,
    not "anyone with link," given PAN/address/phone are in every row) and
    three env vars (`GOOGLE_SHEETS_SPREADSHEET_ID`,
    `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`) — without
    them, logging is silently skipped (checkout itself still works; see
    `docs/progress-log.md`). **Still open even once configured**: actual
    receipt *generation and emailing* isn't built — this only gets the data
    into a sheet someone can work from.
15. **Blocked — decision needed** — Pick contact-form backend (serverless
    function + email API vs. third-party form service).
16. **Blocked — decision needed** — Pick newsletter-signup provider (ESP vs.
    custom) — current form has no visible ESP integration.
17. **Depends on #13, partially done** — Bot/spam prevention: Google
    reCAPTCHA **v3** (invisible — no checkbox, scores each submission
    0.0–1.0 in the background) added to the donate form and verified
    server-side (`src/app/api/payu/initiate/route.ts` calls
    `src/lib/recaptcha.ts`, which enforces a minimum score of 0.5 and checks
    the `action` name matches) given the current WordPress site's spam
    compromise (*progress-log.md*). The only visible trace is the small
    floating badge Google's script injects itself — **do not remove or hide
    that badge without adding the attribution text their Terms of Service
    require in its place** (already present as a fallback line in the form
    regardless). Currently running on Google's published test key pair,
    which always passes — **blocked on client/ops** for a real v3 site key +
    secret (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET`, both must
    be registered as **v3 type** in the reCAPTCHA admin console, not v2)
    before launch, or it verifies nothing against real traffic. Contact form
    (#15) and newsletter signup (#16) will need the same treatment once
    their backends are chosen.

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

35. Fix heading hierarchy — real `h1` per page, proper nesting (currently
    most titles render as `h3`).
36. Add skip-navigation link.
37. Remove or fix dead social/share links (`href="#"`) instead of porting them.
38. Reconcile founding-date inconsistency ("since 1889" vs. Ramabai's dates)
    — content decision, flag to client.

## Phase 5 — Migration & launch

39. **Blocked — client review** — Manually curate genuine posts from WP
    `/news-and-updates/` before import; exclude injected spam entirely
    (*site-audit.md, Security* — do not automate this step).
40. **Ready to plan, execute near launch** — Build a redirect map: every
    indexed WordPress URL → its new route, as 301s. IA is changing (e.g.
    `programs` replacing the scattered `/impact/` + footer structure), so
    without this the site loses existing SEO/backlinks on cutover.
41. Content freeze window plan for cutover (coordinate with Decap Editorial
    Workflow, #3).
42. DNS/domain cutover to Vercel production.
43. Post-launch: verify redirects (#40) resolve correctly, verify donation
    flow (#14) end-to-end with a real test transaction.
