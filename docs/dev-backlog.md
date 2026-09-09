# Dev backlog — prmm.org.in rebuild

Numbered so tasks can be claimed directly. Each item links back to
[`site-audit.md`](./site-audit.md) / [`migration-plan.md`](./migration-plan.md)
for rationale instead of repeating it — read the linked section only if the
one-line description isn't enough.

Status legend: **Ready** (can start now) · **Blocked** (needs a decision or
client input listed) · **Depends on #N**.

## Phase 0 — Infra & repo setup

1. **Dropped** — Branch protection (PR review required) was only ever
   valuable with more than one contributor; user is the sole developer on
   this repo, so it's not being applied. Confirmed neither `main` nor
   `develop` currently has protection configured on GitHub (checked via
   `gh api .../branches/<branch>/protection`, both 404) — nothing to turn
   off, this just removes the item from the plan.
2. **Done, now informational only** — `.github/CODEOWNERS` still documents
   that `public/admin/config.yml` and `src/lib/content.ts` must change
   together (*migration-plan.md, Branching strategy*), but with #1 dropped
   there's no PR-review gate to enforce it — it's a comment for future-you,
   not a control.
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
    row's status once PayU's response hash is verified. **Google Sheets
    logging is done and verified (2026-09-09)** — service account created,
    spreadsheet shared with it, `Donations` tab set up, all three env vars
    (`GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SHEETS_CLIENT_EMAIL`,
    `GOOGLE_SHEETS_PRIVATE_KEY`) set in local `.env.local` (never committed
    — see `.gitignore`) and confirmed working with a real test row
    (append + status update both succeeded against the live sheet, then
    deleted). **Still blocked**: PayU itself (`PAYU_MERCHANT_KEY`/
    `PAYU_SALT`, item #13 above) — Sheets logging only runs after PayU
    config is confirmed present, so it can't be exercised through the real
    form yet, only verified directly. Also still open regardless of PayU:
    same env vars need setting in Vercel for any deployed environment, not
    just local; and actual receipt *generation and emailing* isn't built —
    this only gets the data into a sheet someone can work from.
15. **Decided, blocked on setup** — Serverless function (own Next.js API
    route) + transactional email API, not a third-party form service —
    keeps everything first-party (no embedded third-party script/origin on
    the page), reuses the same reCAPTCHA v3 + server-side validation
    pattern already proven on Donate. Email vendor: **MSG91**, client's
    call (they likely already use it for SMS/OTP elsewhere; consolidating
    vendors rather than adding a new one). **Currently blocked twice
    over**: (a) MSG91 account creation itself is stuck waiting on an OTP
    from the client, so no API key/template exists yet; (b) MSG91's Email
    API technical reference couldn't be verified even once an account
    exists — their docs site is a JS-rendered SPA that only returned
    navigation shell content on every URL tried (docs.msg91.com/*,
    msg91.com/help/*, their linked docs.msg91.com/p/... page), and no
    official Email SDK exists on GitHub to read the request shape from
    code instead (their public repos are all SMS/OTP-only). **Do not guess
    MSG91's request shape** (endpoint, auth header, field names) — same
    standard applied to PayU's hash formula, verified from real docs rather
    than reconstructed from memory. Next session needs either the account
    unblocked so the dashboard's generated code snippet can be copied
    directly, or the actual API reference page content pasted in manually.
16. **Blocked — client discussion pending.** Confirmed the old site's
    "email subscribe form" was never wired to any real ESP (no vendor to
    migrate from — a genuinely open choice, like the old Donate form's
    missing payment gateway). Candidates discussed: **MailerLite**
    (verified this session — 250 contacts/2,500 emails-month free, real
    documented API, campaign composer included) vs. **Brevo** (couldn't
    verify current free-tier limits — pricing page is JS-rendered like
    MSG91's docs, didn't render for automated fetching) vs. Mailchimp
    (free tier publicly known to have shrunk significantly, weaker fit) vs.
    MSG91 Segmento (not really free, usage-based; same doc-access problems
    already hit for their transactional Email API). Planned integration
    shape regardless of vendor: our own subscribe form (styled to match the
    site, same reCAPTCHA v3 + validation pattern as Donate/Contact) posting
    to our own API route, which calls the ESP's API server-side — not an
    embedded third-party signup form/iframe. User is taking the vendor
    choice to the client rather than deciding now.
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
    regardless). **Real v3 credentials live and verified (2026-09-09)** —
    registered a v3-type site in the reCAPTCHA admin console (no Google
    Cloud project/billing needed, confirmed empirically — the registration
    page just redirects to a normal Google account sign-in), both keys set
    in `.env.local` (never committed). Tested a real token end-to-end: a
    live browser-generated token verified against Google's siteverify API
    returned `success: true, score: 0.9, action: "donate"` — well clear of
    the 0.5 threshold — and the same token passed through the actual
    `/api/payu/initiate/` route in a real browser session (reached the
    PayU-not-configured stop, one step *after* the captcha check, proving
    verification genuinely passed rather than short-circuiting). Same env
    vars still need setting in Vercel for any deployed environment, not
    just local.
    **Made sitewide-reusable (2026-09-09)**, not Donate-only: the token-
    fetch logic is now `useRecaptchaToken()` (`src/lib/recaptchaClient.ts`),
    the script load is a single `<RecaptchaScript />` in the root layout
    (`src/app/layout.tsx`, confirmed present on every page, not just
    Donate), and the required attribution text is
    `<RecaptchaAttribution />` (`src/components/RecaptchaAttribution.tsx`).
    `DonateForm.tsx` now consumes all three instead of owning its own copy.
    Contact form (#15) and newsletter signup (#16) can wire in real
    protection with a couple of lines each the moment their backends exist
    — no need to re-derive the pattern, just import the hook/components and
    call `verifyRecaptcha(token, { expectedAction: "contact" })` /
    `"newsletter"` server-side (`src/lib/recaptcha.ts`, already generic).
    Did **not** add captcha UI to Contact/Newsletter themselves yet — both
    are still non-functional stubs (placeholder fields, no server route),
    so there's nothing for a token to protect until #15/#16 unblock.

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
19. **Mostly done.** Programs index with category filter — URL-shareable
    (`?category=`, not anchor-based like the current `/impact/`) — done. Per-card
    "Donate" link (pre-filtered cause) — done. **Done 2026-09-09**: the
    "most urgent need" banner above the grid — reuses the same `featured`
    flag as the homepage spotlight (dev-backlog.md #49) rather than a
    second flag, so one CMS switch drives both. Shows nothing (not a
    generic program) when no cause is flagged, same no-fake-urgency rule as
    #49. Also added a breadth line ("N of our 14 real ministries migrated
    so far") using the same verified "14" figure used elsewhere on the site.
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
24. **Mostly built, one gap deliberately not faked.** Donate page — depends
    on #14. Cause + amount selection: done. No-refund disclosure correctly
    sits in the first ("Your Details") card, not beside the payment button —
    already satisfies the "at Step 1" requirement. Trust badges (SSL
    Encrypted, PayU/PCI-DSS line) already sit right next to the payment CTA.
    Live impact framing: done as a generic statement, not amount-tiered (see
    #55 — the amount-tiered version had fabricated unit costs, removed).
    **Frequency (one-time/monthly) was never built** — and shouldn't be
    added as a cosmetic toggle: `src/lib/payu.ts` only implements one-time
    hosted-checkout (dev-backlog.md #13); a "Monthly" option with no real
    recurring-billing integration behind it would claim a capability that
    doesn't exist, the same category of problem as #55's fabricated claims,
    just in UI-affordance form instead of copy. Needs PayU's actual
    recurring/subscription API integrated first, not just a UI radio button.
    **Open question for the client, still unresolved**: do donors need
    accounts to retrieve past 80G receipts, or is every gift anonymous with
    an emailed receipt? Also still open: the real PAN-required-above-₹X
    threshold — currently correctly shown as "[amount — confirm threshold
    with client]" in the UI rather than a guessed number, but flagging here
    too since it's the kind of thing easy to lose track of outside the code.
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
32. **Done (2026-09-09)** — Sitemap page now generates its Programs and
    News & Media columns from `getAllProgramsMeta`/`getAllNewsMeta`/the new
    `getAllGalleryMeta` (`src/lib/content.ts`) at build time, listing every
    real program/news/gallery entry individually rather than just a
    program count next to hand-authored category links (which is all the
    prior version actually did, despite its own comment claiming otherwise —
    caught during a doc-vs-code audit, not reported by anyone). Static
    structural pages (About, Legal, etc.) stay hand-listed since there's no
    collection backing them.
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

## Phase 5 — Homepage trust/brand rework (2026-09-09 UI/UX audit vs. live site)

Full old-vs-new comparison done section by section (header through footer)
against a real screenshot of the live `prmm.org.in` homepage, not just the
prior text-crawl in `site-audit.md` (which missed several visual-only
elements — logo, subtitle, phone/location placement — that only showed up
in the screenshot). Findings and what's now fixed vs. still open:

44. **Done** — Sitewide headquarters contact (address, phone, email) added
    as a real, CMS-editable `contacts` entry (`content/contacts/
    headquarters.md`, flagged `is_headquarters: true`, schema added to both
    `content.ts` and `config.yml` per the CODEOWNERS pairing) instead of a
    hardcoded string. Values are the real ones visible on the current live
    site's header/footer (02119 223122, mdlprmm@gmail.com, the Kedgaon
    postal address) — verified against a screenshot of the actual site, not
    invented. Wired into both `SiteHeader` (tap-to-call, desktop + mobile
    menu) and `SiteFooter` (full contact column), via `getHeadquartersContact()`
    fetched server-side in `layout.tsx` and passed down through `ChromeGate`.
    **Still open**: reconfirm these are still current before launch — a
    screenshot is a point-in-time source, same caveat as `site-audit.md`.
45. **Done** — Mobile nav bug fixed. Previously `SiteHeader` hid the entire
    nav below the `md` breakpoint with only the Donate button visible and no
    hamburger/drawer — Home/About/Programs/News/Contact were completely
    unreachable on a phone. `SiteHeader.tsx` is now a client component with
    a working disclosure menu (button + `aria-expanded`, closes on link
    click). This was a launch-blocking accessibility/usability bug, not a
    design preference — untracked anywhere before this entry.
46. **Done** — Footer `Our Ministries` column was only listing 3 of the 5
    "Shaping the…" pages (Environment and Destiny were missing, despite
    both pages already existing per #23) — fixed to list all 5.
47. **Done** — Footer no longer has a duplicate, weaker "Get Involved"
    column sitting right below the dedicated `GetInvolvedBand` component
    (Donate/Mukti Kiran only remain in the footer version; Volunteer/Spread
    the Word/Contact stay exclusively in the band so there's one "how to
    help" pattern, not two competing ones). Terms/Privacy/Sitemap moved out
    of their own "Legal" column into the bottom utility row alongside the
    80G/registration line and social icons, since three legal links didn't
    need a full column to themselves.
48. **Done** — Homepage reordered into an explicit trust funnel: Hero →
    Stats → **Ramabai legacy** (new section, reuses the real About Pandita
    Ramabai copy via `getPageBySlug`, not restated ad hoc — her story is the
    site's strongest, most distinctive brand asset per the client's own
    "brand mark as marketing point" framing) → Mission teaser (now pulls the
    real first paragraph from About Mukti Mission instead of a `[placeholder]`
    string) → **featured-cause spotlight** (new, see #49) → Our Work →
    Get Involved band → News. The old inline "Download Newsletter" form
    (Name + Email + Download, no real backend, non-functional stub) was
    removed rather than left in a broken state — proper version depends on
    #16 (ESP decision) below.
49. **Done, needs content** — Added a `featured` boolean field to the
    `programs` collection (mirrors the original site's single-cause "How Can
    You Help Us" section, e.g. its Boys Home spotlight — the most
    trust-effective section on the original per the UI/UX audit, and the one
    thing fully dropped in the initial rebuild). Homepage shows whichever
    program has `featured: true` with its own Donate CTA; shows an honest
    empty state ("No cause is currently featured") if none is flagged,
    rather than fabricating urgency around a placeholder program. **Needs a
    real editor decision**: mark one real, current, specific need as
    featured once real program content exists — do not flip this on for a
    lorem-ipsum stub.
50. **Partially resolved (2026-09-09) / blocked — client input, do not
    fabricate.** Several homepage elements still can't be finished honestly
    without real facts from the client:
    - ~~Stats strip: every value is still `[as of — confirm]`~~ **Resolved**
      — client direction: use whatever is already published on the current
      live site rather than waiting on new figures. All six values are
      exactly what's on prmm.org.in today (verified against a screenshot),
      so the per-tile `[as of — confirm]` placeholders (dev scaffolding that
      should never have been visible to real visitors) are gone. The
      underlying limitation — the live site itself never dates or sources
      these numbers (site-audit.md) — is inherited, not solved; still worth
      the client re-confirming they're current next time the source figures
      change.
    - Hero photo/story: still a placeholder box ("specific beneficiary
      photo/story, not a generic campus shot") — intentionally left
      unpopulated rather than filled with a generic stock-feeling image.
    - Real logo: still blocked on the client supplying a vector master of
      the Ramabai-portrait mark (`migration-plan.md`, Brand assets) — the
      rebuild currently uses a generic placeholder circle where the
      original used a distinctive photo-based mark; this is a genuine
      brand-equity loss versus the original, not a neutral simplification,
      and should stay escalated until real assets arrive.
    - Testimonials: `content/testimonials/` is still 2 lorem-ipsum stubs.
      Deliberately **not** added to the homepage yet — fake-looking
      testimonial quotes are actively worse than no social proof on a
      donation site (reads as fabricated). Add to homepage only once real
      testimonials exist.
    - Newsletter signup: needs #16 (ESP vendor decision) before a working
      version replaces the removed stub form.
    - Second circular badge/seal on the original header: still unidentified
      — ask the client what it is (accreditation mark vs. decoration)
      before deciding whether it belongs back on the rebuild at all.
51. **Deferred — needs a real photo first.** Hero image placeholder is
    currently a flat dashed-border box. The original's hero, for all its
    other faults (see #50's carousel note above), used a deliberate frame —
    white border, inset over a tinted background — that gave it more
    emotional weight than today's flat box. Don't just drop a real photo
    into the current plain container once one exists: give it equivalent
    deliberate framing (border/inset treatment, or a subtle tint behind the
    text column) so the hero doesn't end up visually flatter than the site
    it's replacing. Blocked on the same real beneficiary photo/story this
    section is already waiting on (#50) — a styling task, not a content one,
    but can't be done until that asset exists.
52. **Done** — Get Involved band's "Volunteer" and "Spread the Word" tiles
    (`GetInvolvedBand.tsx`) linked to `/volunteer/` and `/share/`, neither of
    which existed — both 404'd on every page that renders the band (every
    homepage visit, since Home always includes it). Root cause: "Volunteer"
    was invented fresh at the wireframe stage with no backing content
    anywhere (not in `site-audit.md` — the original site never had a real
    volunteer program/page either, only an ambiguous "Sign Up" tile) and
    wired to a page that was never built. Fixed:
    - `/share/` now exists — a real, generic "help us spread the word" page
      (share links to WhatsApp/Facebook/X/Email + copy-link). No org-specific
      claims beyond the one sentence already used in `home.md`/about copy, so
      nothing new to verify.
    - "Volunteer" now routes to `/contact/?interest=volunteer` instead of a
      fabricated dedicated page — Contact shows a short honest note
      ("no separate volunteer form yet, mention it in your message") rather
      than inventing volunteer requirements/process that don't exist yet.
      **Still open**: a real Volunteer page/process once the client actually
      defines one — don't build past this stopgap without real input.
    - Side effect caught while fixing this: adding the `is_headquarters`
      contact entry (#44) had leaked into `contact/page.tsx`'s and
      `reach/page.tsx`'s regional-contacts lists as a bogus extra "region."
      Added `getRegionalContacts()` (filters out the HQ entry) and switched
      both pages to it; also used the real HQ contact to fill in
      `contact/page.tsx`'s `[full postal address], [phone], [email]`
      placeholder, and dropped an unverifiable "~40km from Pune, accessible
      via Daund Road" distance claim that had no source anywhere.
53. **Done** — Removed an unsourced micro-CTA under the stats strip ("₹500
    provides a month of school supplies for one child"). Unlike the stats
    themselves (#50, now resolved from the live site), this specific "₹X
    buys Y" claim had no source anywhere — not the live site, not any doc —
    and it's a riskier kind of claim than a headline stat: it's a checkable
    statement about exactly how a donation gets spent. Replaced with a plain
    "Donate now" link. **Open**: add a real per-rupee impact statement back
    once the client can confirm one (e.g. an actual per-child program cost),
    rather than leaving the section without any micro-CTA indefinitely.
54. **Done — important correction.** The homepage's "use whatever is
    already on the current site" direction (applied to #50's stats) does
    **not** apply to News & Updates — the current live site's news feed is
    the confirmed spam compromise itself (site-audit.md, Security), so
    "what's currently there" is gambling/AI-companion spam, not real
    content. That's exactly why #39 already blocks on manual curation.
    Found while reviewing this section that the policy wasn't actually in
    effect: `content/news/` held 2 lorem-ipsum stub posts (explicitly headed
    "Placeholder content — replace before launch") that made `news.length >
    0`, so both the homepage and `/news/` were showing fake "Lorem Ipsum
    Milestone Reached"-style cards to real visitors instead of the honest
    empty state #39 was specifically designed to show during this gap.
    Removed both stub files — the empty state now renders correctly on both
    pages. Also fixed: the homepage's News cards had no link at all (dead
    ends — no `<Link>`, no "Read more"), unlike `/news/`'s own index which
    correctly wraps each card in a link to `/news/{slug}/`. Homepage cards
    now match that pattern, plus a "View all news →" link next to the
    heading (present on Our Work already, was missing here).
55. **Done — the most serious unsourced-claim finding so far.** The Donate
    page's "Your Impact" panel (`DonateForm.tsx`'s `impactFor()`) invented
    four specific "₹X buys Y" unit-cost claims tied to the entered amount —
    school supplies, a week of meals for five children, and "supports a
    month of medical care at Krishnabai Memorial Hospital." The hospital
    itself is real (site-audit.md confirms it from the live site's Impact
    page), which is exactly the problem: a real, verifiable facility name
    was lending credibility to a completely invented cost-equivalence
    nobody confirmed. This is worse than the homepage's #53 finding — same
    category of claim, but live on the highest-stakes page on the site,
    where a donor is actively deciding whether to hand over money and a PAN
    number. Replaced with a generic, non-quantified impact statement (reuses
    the same verified sentence already used elsewhere: "goes directly
    toward Mukti Mission's work... across 14 ministries"). **Open**: dev-
    backlog.md #24 specifically wants "live impact framing tied to the
    selected amount" — building that honestly needs real per-unit costs
    from the client (actual cost of a meal, a month of schooling, etc.).
    Don't restore amount-tiered claims without those numbers.
    - Same pass caught the same category of issue in `ShapingThemeTemplate.tsx`:
      "Education has been central to Mukti Mission since Sharada Sadan
      opened in **1891**" — a specific, checkable date with no source
      anywhere (Sharada Sadan itself is real per site-audit.md; the "1891"
      figure isn't). Changed to "Sharada Sadan's earliest days" — still
      true, no invented precision.
56. **Done — scroll-reveal, stat count-up, and a corrected background-
    decoration attempt.** Added `Reveal.tsx` (fade+slide-up on scroll,
    wraps every homepage section) and `CountUp.tsx` (animates the Stats
    strip's numbers up from 0 on scroll — same verified values, animation
    only changes how they arrive, not what's claimed). Both honor
    `prefers-reduced-motion`.
    - First attempt at "subtle background icons" (requested after seeing
      isha.sadhguru.org) used four scattered generic line icons
      (heart/book/home/family) behind the Hero at 7% opacity — client
      feedback: doesn't match, correctly. Reviewing the actual reference
      screenshot: that site's richness comes from large-format real
      photography (a Man/Mystic/Mission photo triptych, photo grids
      throughout), not icons — icons only appear as colored platform badges
      next to *real, large* follower counts, and one single restrained
      motif near one heading. Four scattered abstract icons was the wrong
      category of fix for the wrong problem: the actual gap versus that
      reference is real photography (already blocked on the client, #50/
      #51), not icon styling. Removed `BackgroundIcons.tsx` entirely rather
      than iterate on opacity/placement — don't keep polishing decoration
      as a substitute for the real content gap.
    - Built the one honest piece of that reference that *is* buildable now:
      a small "Follow Our Work" band (`socialLinks.tsx`, shared between it
      and the footer) — but with only Facebook, the one channel
      site-audit.md actually confirms is live on the original site, and
      **no follower count**, since we have no verified number (unlike the
      reference's real 31M/22.8M/18M). Also fixed a related inconsistency
      found while building this: the footer had Instagram and YouTube icons
      with placeholder root URLs and no confirmation the org has real
      active accounts on either — removed both rather than leave two
      unverified "maybe" channels standing. **Open**: add Instagram/YouTube
      (and a real follower count if worth showing) back to both places once
      the client confirms real handles/numbers.
57. **Done — header nav expanded back out, and two homepage sections
    color-blocked, both after client feedback that the redesign wasn't
    reading as different enough from the placeholder-flat starting point.**
    - Header nav (`SiteHeader.tsx`) went from the flat 5-item version (#—
      the earlier simplification) back to 7 top-level items with two
      dropdown groups — deliberately not a revert to the original site's
      structure, but a rebuild that fixes the two specific problems
      site-audit.md flagged in it: "Our Work" now surfaces every program/
      theme page (all 5 "Shaping the…" pages + full Programs index) instead
      of the original's 4-of-14 gap, and "News & Media" consolidates what
      were three scattered top-level items (News, Mukti Kiran, Happenings)
      into one group instead of cluttering the bar. "About" gained a third
      child (Reports & Transparency) alongside the two bio pages. Verified
      every linked route resolves at 200 — no repeat of the #52 dead-link
      mistake. Visual treatment: a bold coral nav bar (desktop only, CSS
      `group-hover`/`group-focus-within` dropdowns) below the white logo
      row, echoing isha.sadhguru.org's colored nav-bar pattern with our own
      brand color rather than copying theirs. Mobile menu unchanged in
      spirit (flat list) but now shows each group's children indented under
      its parent.
    - Homepage got two sections converted from plain white to bold
      full-bleed color bands (Stats → `bg-ink`, Featured Cause → `bg-coral`
      with the existing white card floating on it) — a real, decoration-
      only lever for visual richness that doesn't depend on real photography
      (still blocked, #50/#51) or fabricate anything. Matches the
      alternating-band rhythm the reference site uses structurally, not its
      specific colors.
58. **Done — header rework, #57's attempt didn't land.** Client feedback
    after #57: the two-row header (spacious white logo row + separate bold
    coral nav row below) still didn't read like the isha.sadhguru.org
    reference. Re-examined the reference more carefully: the actual
    structural difference is that its header is **one dense combined bar**
    (logo + nav + icons together, compact spacing, small text) sitting below
    a thin utility micro-strip — not two spacious separate rows. #57 got the
    color right but the density/layout wrong. Rebuilt `SiteHeader.tsx`
    accordingly: a slim utility strip (real phone/email from the HQ contact,
    real Facebook icon via `socialLinks.tsx` — not the reference's login/
    subscribe links, since this site has no donor-account system to link to)
    sits above one dense bar combining a small inline logo, all nav items,
    and the Donate button, all on `bg-coral`. Same nav structure/routes as
    #57, unchanged. Verified rendering and routes still resolve correctly.

59. **Done — header typography/logo sizing, #58 over-corrected on
    density.** Client feedback: #58's combined bar was too compact — logo
    too small for a mark that's meant to hold a photographic portrait
    (Pandita Ramabai), not a wordmark/icon; a face crops illegibly at small
    sizes. Reworked `SiteHeader.tsx`: logo circle 8→14 (h-14 w-14, solid
    border instead of dashed, labeled "PHOTO" not "LOGO" as a clearer hint
    of what's expected there), brand name switched to `font-serif` at
    `text-lg` (matches every heading elsewhere on the site, was `text-sm`
    sans) and back to two lines (pairs better height-wise with a 56px mark
    than one long single line), nav items 13px→15px and `font-medium`→
    `font-semibold` for legibility on the colored bar, bar padding
    `py-2.5`→`py-4` to give the larger logo room. Same combined-single-bar
    structure and nav content as #58 — this was a scale/weight correction,
    not another structural rework.
60. **Done — unified typography sitewide, per client request to compare
    fonts against isha.sadhguru.org.** Couldn't verify Isha's actual
    font-family via WebFetch (their fonts load through bundled stylesheets
    a markdown-conversion fetch doesn't see) — didn't guess a specific name
    to sound authoritative. What was verifiable and real: every heading
    sitewide used Tailwind's `font-serif` utility, which was never paired
    with an actual loaded webfont (`globals.css` only registers Geist Sans/
    Mono) — so every `h1`/`h2` was silently falling back to the browser's
    generic system serif (Georgia/Times-like), not a deliberate typeface.
    That's very likely the real readability gap, independent of whatever
    Isha specifically uses. Removed `font-serif` from all 24 files that had
    it (bulk `sed` across `src/**/*.tsx`, verified no malformed className
    strings resulted, spot-checked 7 pages at 200 after) — headings now use
    the same loaded Geist Sans as body text, one deliberate family sitewide
    instead of a real font + an unstyled fallback.
61. **Done (partial) — angled section edges, letter-spacing, line-height;
    remaining items need a real screenshot, not more guessing from memory.**
    Client feedback listed several more gaps vs. isha.sadhguru.org: bg
    icons blending into sections, typography, line-height, angled/slanted
    section color transitions, letter-spacing. Fixed the concrete,
    well-defined ones: both bold-color bands (Stats, Featured Cause) now
    have angled top/bottom edges via `clip-path: polygon(...)` instead of a
    straight cut (opposite diagonal direction on each so consecutive bands
    don't look identical), header nav letter-spacing changed from
    `tracking-wide` (a guess, likely wrong direction per this feedback) to
    `tracking-normal`, and tightened `leading-*` on Stats/Featured-Cause
    headings and labels. **Deliberately not touched**: background icons —
    the client explicitly chose "remove entirely" for these earlier this
    session (see #56) after the first attempt didn't match; re-adding them
    on the same one-screenshot memory basis risks a repeat wrong guess
    rather than progress. Flagged back to the client: further visual
    comparison needs an actual current screenshot of the running site, not
    another pass working from memory of one reference image — three
    consecutive header reworks (#57, #58, #59) already came from guessing
    at that same screenshot's details from memory.
62. **Done — angled sections fixed, one purposeful icon added, both from
    real screenshots this time (not memory).** Client supplied a fresh Isha
    screenshot plus one of our own running site side by side, confirming
    #61's angled bands looked "patchy": both had a double-sided parallelogram
    cut (top and bottom angled the same direction), creating two hard
    triangular notches into the neighboring plain sections. Fixed to a
    single angled edge per band (straight top merging with the section
    above, shallow angled bottom flowing into the section below) — same
    rule applied to both bold bands (Stats, Featured Cause) for one
    repeating diagonal rhythm instead of a different shape per section.
    Also: the client asked for icons back, but "designed to suit our site,
    not random ones" — #56's four scattered generic icons were the wrong
    pattern (confirmed against the real Isha screenshot: it uses one large,
    purposeful motif near one heading, not scattered decoration). Added
    `LegacyMotif.tsx` — one large, low-opacity concentric-rings/radiating-
    rays motif placed once, behind the Legacy/Ramabai section. Deliberately
    not a lotus/mandala/chakra: Mukti Mission is a Christian faith mission
    (Isaiah 61 citation, `about-mukti-mission.md`), so a Hindu/Buddhist-coded
    symbol would be a real mismatch for this specific org. Saved a
    persistent memory (`isha_design_reference.md`, outside this repo) of
    Isha's actual verified design characteristics from both screenshots, so
    a future session doesn't repeat the same guess-from-memory mistake this
    session made three times over (#57–#59) before real screenshots arrived.
63. **Done — fixed the actual root cause of the "patchy" seam, plus card
    shadows, angled card-image corners, and larger fonts sitewide-ish.**
    - **Root cause of the seam bug**: `clip-path` applied directly to a
      bold-colored section only hides part of *that section's own* painted
      box — it doesn't pull the next section up into the gap. The revealed
      area showed the page's own background (`bg-paper`, off-white)
      instead of the next section's real tan color, so the seam showed
      three colors (bold color → white sliver → tan) instead of a clean
      two-color diagonal. That's exactly what got reported as "two
      different colors along with white in the middle." Fixed by replacing
      `clip-path` with a new `AngledDivider.tsx` — an SVG polygon overlay,
      absolutely positioned at the bottom of the bold section, filled with
      the *exact* next section's color (`currentColor` via a `text-*`
      class) — so nothing is ever revealed except that real color. No gap
      is structurally possible with this approach, unlike clip-path.
    - **Cards**: added `shadow-md` to the one recurring card pattern
      (`rounded-lg border border-black/10 bg-white`, bulk-`sed` across all
      20 occurrences sitewide) — `design-system.md`'s "no shadows anywhere"
      note is now stale, updated alongside this.
    - **Angled card images**: `PhotoBox.tsx` (the single shared photo/
      placeholder component every card uses) now clips its bottom-right
      corner via `clip-path` — applies sitewide by construction since
      everything already goes through this one component, no per-card class
      to remember. Echoes the same angled-section motif at card scale.
    - **Font sizes**: bumped across the homepage — h2s 2xl→3xl, card/body
      text sm→base, stat numbers 2xl→3xl. Client feedback was "still feels
      small" even after #59's header-only sizing pass; this extends it to
      body copy and section headings, not just the header.
64. **Done — angled sections reverted entirely, per client call.** Even
    after #63 fixed the actual seam-color bug (the `AngledDivider` overlay
    technique), the client decided the angled-section look itself wasn't
    working and asked to undo it. Reverted both bold bands (Stats, Featured
    Cause) to plain straight-edged full-bleed sections, deleted
    `AngledDivider.tsx` (unused now), removed the stale in-code comments
    referencing it. **Not reverted**: card shadows, `PhotoBox`'s angled
    card-image corner, the larger font sizes, or the Legacy motif — the
    client's ask was specifically about full-section diagonal cuts, not
    these other changes from the same round. `design-system.md`'s "Angled
    section transitions" note now documents both attempts and the revert,
    so this doesn't get rediscovered/re-tried from scratch without knowing
    it was already tried and pulled back once.
65. **Done — consolidated three different dark colors into one.** Client
    feedback: the Stats strip, Get Involved band, and footer each used a
    visibly different dark color (`bg-ink` `#262523`, `bg-slate` `#2d5c6b`,
    and the footer's own one-off `bg-[#2b3541]` — never even promoted to a
    token), reading as mismatched rather than one cohesive dark identity.
    All three now use `bg-ink` consistently (footer, Get Involved band, and
    a "View Reports" button on `/about-mukti-mission/` that also used
    `bg-slate`). `slate` was fully unused after this — removed the token
    from `globals.css`'s `@theme` block rather than leave a dead color
    definition around.

## Phase 6 — Migration & launch

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
