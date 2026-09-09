"use client";

import { useState } from "react";
import Link from "next/link";

// Generic, evergreen "help us spread the word" copy — no org-specific
// claims/stats here, so nothing to verify. Uses the page's own live origin
// at click time rather than a hardcoded domain, since the production URL
// isn't finalized yet (Vercel setup on hold — see docs/progress-log.md).
const SHARE_TEXT =
  "Pandita Ramabai Mukti Mission cares for orphaned, destitute and vulnerable women and children across 14 ministries in India. Take a look:";

function shareTargets(url: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(SHARE_TEXT);
  return [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X (Twitter)", href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}` },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent("Worth a look")}&body=${encodedText}%20${encodedUrl}` },
  ];
}

export default function SpreadTheWord() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions, insecure context) — the link
      // is still shown as plain text below for a manual copy either way.
    }
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:px-12">
      <div className="text-sm text-ink-soft">
        <Link href="/">Home</Link> / Spread the Word
      </div>
      <h1 className="mt-3 text-4xl">Spread the Word</h1>
      <p className="mt-2 max-w-[60ch] text-ink-soft">
        The easiest way to help costs nothing: share this site with someone who might want to
        support the work, volunteer, or just learn about Pandita Ramabai&apos;s story.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {shareTargets(url).map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-black/15 px-5 py-2.5 text-sm font-semibold hover:border-coral hover:text-coral"
          >
            Share on {s.label}
          </a>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-md border border-black/10 bg-white px-4 py-3">
        <span className="flex-1 truncate text-sm text-ink-soft">{url}</span>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white hover:bg-coral-dark"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </main>
  );
}
