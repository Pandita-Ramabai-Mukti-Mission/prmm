<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ClickUp task linking

Work on this project is tracked in ClickUp under Development → PRMM Website → Development Log. When a commit addresses a specific ClickUp task, include that task's ID (from its URL, e.g. `app.clickup.com/t/14yj85nyb22` → `14yj85nyb22`) somewhere in the commit message body, e.g.:

```
Ref: 14yj85nyb22
```

Use `Closes #<id>` / `Fixes #<id>` instead if the commit completes the task — ClickUp's GitHub integration will auto-transition its status on merge. This only takes effect once the GitHub integration is connected in ClickUp's workspace settings.
