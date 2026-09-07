This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Content & Decap CMS

Markdown content lives in `content/pages` and `content/posts` and is rendered by the App Router pages in `src/app`. Editors manage it through [Decap CMS](https://decapcms.org) at `/admin`, backed by the GitHub backend (commits go straight to your repo).

### 1. Push to GitHub

Decap's GitHub backend needs a real repo to read/write content from. Create one and push this project to it.

### 2. Update `public/admin/config.yml`

Replace the placeholders:

```yaml
backend:
  name: github
  repo: your-org/your-repo # <- your GitHub owner/repo
  branch: main
  base_url: https://your-vercel-app.vercel.app # <- your deployed URL
  auth_endpoint: api/decap/auth
```

### 3. Create a GitHub OAuth App

At https://github.com/settings/developers, create an OAuth App:

- **Homepage URL**: `https://your-vercel-app.vercel.app`
- **Authorization callback URL**: `https://your-vercel-app.vercel.app/api/decap/callback`

Copy the generated Client ID and Client Secret.

### 4. Set environment variables

Locally, copy `.env.example` to `.env.local` and fill in the values. On Vercel, add the same two variables (`GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`) under Project Settings → Environment Variables.

The OAuth provider is implemented as two route handlers, so no separate service is needed:

- [`src/app/api/decap/auth/route.ts`](src/app/api/decap/auth/route.ts) — starts the GitHub OAuth flow
- [`src/app/api/decap/callback/route.ts`](src/app/api/decap/callback/route.ts) — exchanges the code for a token and hands it back to the CMS popup

### 5. Log in

Deploy to Vercel, then visit `/admin` on your deployed site and log in with GitHub. New/edited content is committed directly to your repo, which triggers a new Vercel deployment.

### Editing content locally without GitHub auth

Run the optional Decap proxy server alongside `npm run dev`:

```bash
npx decap-server
```

Then uncomment `local_backend: true` in `public/admin/config.yml`.
