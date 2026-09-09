"use client";

import { useEffect, useRef } from "react";

// Decap CMS mounted from inside the Next.js build (decap-cms-app) instead
// of the static CDN <script> this project started with. Doing it this way
// lets the CMS preview panes import the exact same components the real
// site renders (src/lib/cms-preview-templates.tsx), instead of a hand-
// maintained parallel CSS/JS copy of the site's look that can silently
// drift out of sync — see docs/dev-backlog.md.
//
// Decap creates and mounts into its own #nc-root div appended to
// document.body; it does not render into anything React returns from this
// component, so this intentionally renders nothing itself.
export default function AdminPage() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const configLink = document.createElement("link");
    configLink.rel = "cms-config-url";
    configLink.href = "/admin/config.yml";
    document.head.appendChild(configLink);

    (async () => {
      const [{ default: CMS }, { registerPreviewTemplates }] = await Promise.all([
        import("decap-cms-app"),
        import("@/lib/cms-preview-templates"),
      ]);
      // No cancellation check here: `initialized` (not a per-run local) is
      // the only guard, so React 18 Strict Mode's dev-only double-invoke
      // (mount -> cleanup -> mount) can't race this against itself — the
      // second mount sees initialized.current already true and no-ops,
      // leaving this in-flight run as the sole one to call CMS.init().
      registerPreviewTemplates(CMS as unknown as Parameters<typeof registerPreviewTemplates>[0]);
      CMS.init();
    })();
  }, []);

  return null;
}
