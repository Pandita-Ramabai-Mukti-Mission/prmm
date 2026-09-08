# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (Next.js App Router, Turbopack)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)

There is no test suite configured in this repo.

## Architecture

This is a Next.js (App Router) site whose content is authored through **Decap CMS** rather than hardcoded in components.

- **Content storage**: Markdown + frontmatter files under `content/pages/*.md` (singleton pages, e.g. `home.md`) and `content/posts/*.md` (blog posts, filename-dated slugs like `2026-01-01-hello-world.md`).
- **Content loading**: `src/lib/content.ts` is the single place that reads/parses content — `gray-matter` for frontmatter, `remark`/`remark-html` to render markdown to HTML. Pages call `getPageBySlug`, `getAllPostsMeta`, `getAllPostSlugs`, `getPostBySlug`. Post/page rendering (`src/app/page.tsx`, `src/app/posts/[slug]/page.tsx`) injects the resulting HTML via `dangerouslySetInnerHTML` — any new field added to a markdown collection needs a matching read in `content.ts` before a page can use it.
- **CMS admin UI**: `public/admin/index.html` + `public/admin/config.yml` (static Decap CMS, served at `/admin`). `config.yml` defines the `pages` and `posts` collections and their fields — this is the schema authors see; it must stay in sync with what `content.ts` and the page components expect. It also points at `repo`/`branch`/`base_url` for the GitHub backend, so those need updating if the repo, default branch, or deployment URL change.
- **Decap GitHub OAuth**: implemented as two Next.js route handlers instead of a separate OAuth service — `src/app/api/decap/auth/route.ts` (starts the flow, sets a short-lived `decap_oauth_state` cookie) and `src/app/api/decap/callback/route.ts` (validates state, exchanges the code for a token, `postMessage`s it back to the CMS popup window). Requires `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET` env vars.
- For local content editing without GitHub auth, run `npx decap-server` alongside `npm run dev` and uncomment `local_backend: true` in `public/admin/config.yml`.

## Next.js version note

This project pins a Next.js version whose APIs/conventions may differ from training data (see `node_modules/next/dist/docs/` for the version-specific guide, resolved relative to this repo — not the monorepo root if there is one).
