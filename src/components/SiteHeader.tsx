"use client";

import { useState } from "react";
import Link from "next/link";
import type { RegionalContact } from "@/lib/content";
import { SocialIcon, VERIFIED_SOCIAL_LINKS } from "@/components/socialLinks";

type NavChild = { href: string; label: string };
type NavItem = { label: string; href?: string; children?: NavChild[] };

// Expanded from a flat 5-item nav back toward the original site's density,
// but fixing the two specific IA problems site-audit.md flagged rather than
// reverting to them: "Our Work" surfaces every program/theme page instead
// of only 4 of the real 14 (the original nav's actual bug), and News/Mukti
// Kiran/Happenings — three scattered top-level items on the original —
// consolidate into one "News & Media" group instead of cluttering the bar.
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  {
    label: "About",
    href: "/about-mukti-mission/",
    children: [
      { href: "/about-mukti-mission/", label: "About Mukti Mission" },
      { href: "/about-pandita-ramabai/", label: "About Pandita Ramabai" },
      { href: "/reports/", label: "Reports & Transparency" },
    ],
  },
  {
    label: "Our Work",
    href: "/programs/",
    children: [
      { href: "/programs/", label: "All Programs" },
      { href: "/shaping-the-mind/", label: "Shaping the Mind" },
      { href: "/shaping-the-spirit/", label: "Shaping the Spirit" },
      { href: "/shaping-the-heart/", label: "Shaping the Heart" },
      { href: "/shaping-the-environment/", label: "Shaping the Environment" },
      { href: "/shaping-the-destiny/", label: "Shaping the Destiny" },
    ],
  },
  {
    label: "News & Media",
    href: "/news/",
    children: [
      { href: "/news/", label: "News & Updates" },
      { href: "/happenings-at-mukti/", label: "Happenings at Mukti" },
      { href: "/mukti-kiran/", label: "Mukti Kiran Newsletter" },
    ],
  },
  { href: "/reach/", label: "Where We Work" },
  { href: "/testimonials/", label: "Testimonials" },
  { href: "/contact/", label: "Contact" },
];

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SiteHeader({ hq }: { hq?: RegionalContact }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a
        href="#main-content"
        className="absolute left-0 top-0 z-50 -translate-y-full rounded-br-md bg-ink px-4 py-2 text-sm text-white transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <header className="border-b border-black/10">
        {/* Thin utility micro-strip, desktop only — real contact info +
            verified social, not the login/subscribe links a reference site
            (isha.sadhguru.org) uses; there's no donor-account system on this
            site, so this row carries what we actually have instead of
            copying that row's specific content. */}
        <div className="hidden items-center justify-between bg-paper px-6 py-1.5 text-xs text-ink-soft sm:px-12 md:flex">
          <div className="flex items-center gap-4">
            {hq?.phone && (
              <a href={`tel:${hq.phone.replace(/\s+/g, "")}`} className="hover:text-coral">
                {hq.phone}
              </a>
            )}
            {hq?.email && (
              <a href={`mailto:${hq.email}`} className="hover:text-coral">
                {hq.email}
              </a>
            )}
          </div>
          <div className="flex gap-2">
            {VERIFIED_SOCIAL_LINKS.map((s) => (
              <SocialIcon key={s.label} link={s} className="text-ink-soft hover:text-coral" />
            ))}
          </div>
        </div>

        {/* One dense combined bar — logo, nav, and Donate together in a
            single row. Logo gets real space here (h-14, not h-8): the mark
            is meant to hold a photographic portrait (Pandita Ramabai), and
            a face crops illegibly at icon-sized dimensions — a photo mark
            needs the room a wordmark/icon wouldn't. Typography: unified to
            the sitewide sans (Geist) — the previous font-serif heading
            style fell back to the browser's generic system serif (no real
            serif webfont was ever loaded), which read as less polished than
            a deliberate single-family system. Removed sitewide, not just
            here — see dev-backlog.md #60. Nav items sized up from the
            previous pass's 13px for legibility on a colored bar. */}
        <div className="flex items-center justify-between gap-6 bg-coral px-6 py-4 sm:px-12">
          <Link href="/" className="flex flex-shrink-0 items-center gap-3.5">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/70 bg-white/10 text-center text-[10px] font-medium text-white/90">
              PHOTO
            </span>
            <span className="whitespace-nowrap text-lg font-bold leading-tight text-white">
              Pandita Ramabai
              <br />
              Mukti Mission
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-end gap-7 text-[15px] font-semibold tracking-normal text-white md:flex">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.label} className="group relative">
                  <Link href={item.href!} className="flex items-center gap-1 py-2 hover:text-white/75">
                    {item.label}
                    <ChevronDown />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-20 min-w-[220px] rounded-md border border-black/10 bg-white py-2 opacity-0 shadow-lg transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block px-4 py-2 text-sm font-medium text-ink hover:bg-paper hover:text-coral"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href!} className="py-2 hover:text-white/75">
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/donate/"
              className="ml-2 flex-shrink-0 rounded-md bg-white px-5 py-2 font-semibold text-coral hover:bg-white/90"
            >
              Donate
            </Link>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <Link href="/donate/" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-coral">
              Donate
            </Link>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/40 text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-nav" className="flex flex-col gap-1 border-t border-black/10 bg-white px-2 py-3 md:hidden">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href ?? item.children![0].href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-semibold text-ink hover:bg-paper hover:text-coral"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 flex flex-col gap-0.5 border-l border-black/10 pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-md px-2 py-2 text-sm text-ink-soft hover:bg-paper hover:text-coral"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {hq?.phone && (
              <a
                href={`tel:${hq.phone.replace(/\s+/g, "")}`}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper hover:text-coral"
              >
                Call {hq.phone}
              </a>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
