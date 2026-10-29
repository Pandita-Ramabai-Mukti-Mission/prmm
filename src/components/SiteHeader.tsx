"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ImageWithAlt, RegionalContact } from "@/lib/content";
import { SocialIcon, VERIFIED_SOCIAL_LINKS } from "@/components/socialLinks";

type NavChild = { href: string; label: string };
type NavItem = { label: string; href?: string; children?: NavChild[] };

// Mirrors the production prmm.org.in header's top-level items, labels and
// order exactly. Production's About dropdown only has the two About pages
// and Impact is a single page; the extra children here (Reports, Where We
// Work, the Shaping pages) are pages that only exist on this rebuild and
// would otherwise have no nav entry — they live in dropdowns so the visible
// bar still matches production.
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  {
    label: "About",
    href: "/about-mukti-mission/",
    children: [
      { href: "/about-pandita-ramabai/", label: "Pandita Ramabai" },
      { href: "/about-mukti-mission/", label: "Mukti Mission" },
      { href: "/reach/", label: "Where We Work" },
      { href: "/reports/", label: "Reports & Transparency" },
    ],
  },
  {
    label: "Impact",
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
  { href: "/news/", label: "News and Updates" },
  { href: "/mukti-kiran/", label: "Mukti Kiran" },
  { href: "/happenings-at-mukti/", label: "Happenings at Mukti" },
  { href: "/contact/", label: "Contact Us" },
];

// Production links "We are here" to this Google Maps pin for the Kedgaon campus.
const MAP_URL = "https://goo.gl/maps/RsWDPNYJiqP1zaGb7";
const FALLBACK_PHONE = "02119 223 122";

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 32" className="h-[34px] w-[26px] lg:h-7 lg:w-5 xl:h-[34px] xl:w-[26px]" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0zm0 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[34px] w-[26px] lg:h-7 lg:w-5 xl:h-[34px] xl:w-[26px]" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

export function SiteHeader({ hq, logo }: { hq?: RegionalContact; logo?: ImageWithAlt }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  // After the reset below, the browser re-evaluates which element is under
  // the (unmoved) cursor once the page's DOM/layout changes post-navigation
  // and fires a fresh, purely synthetic `mouseenter` even though the mouse
  // never actually moved — which immediately reopens the dropdown right
  // back up. This timestamp lets onMouseEnter ignore any such event that
  // fires in the same instant as a navigation-triggered close; a real
  // hover shortly after still opens it normally.
  const suppressHoverUntilRef = useRef(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The header is part of the shared layout, so it never unmounts across a
  // client-side navigation — clicking a submenu link doesn't move the
  // mouse, so pure CSS `:hover` has no way to know the dropdown should
  // close. Resetting during render when the route actually changes (React's
  // documented pattern for "adjust state when a prop changes") covers both
  // that case and the equivalent keyboard/focus one, regardless of whether
  // the cursor or focus is still sitting on the trigger — and avoids the
  // extra render pass a useEffect-based reset would cost here.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenDropdown(null);
    setMenuOpen(false);
  }

  // Closing on click (not just the pathname-diff reset above) handles the
  // common case synchronously, in a normal event-handler context where
  // mutating a ref/reading the clock is allowed.
  function closeDropdownForNavigation() {
    setOpenDropdown(null);
    suppressHoverUntilRef.current = Date.now() + 400;
  }

  const phone = hq?.phone ?? FALLBACK_PHONE;

  return (
    <>
      <a
        href="#main-content"
        className="absolute left-0 top-0 z-50 -translate-y-full rounded-br-md bg-ink px-4 py-2 text-sm text-white transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      {/* Coral nav bar — same layout as production: uppercase nav, social
          icons on the right. Sticky on its own (the white brand band below
          is a separate sibling that scrolls away), so the page keeps a
          pinned nav without a ~180px header eating the viewport. Only
          Facebook is shown: production's Twitter/Google+/LinkedIn icons all
          point at `#` (see socialLinks.tsx). */}
      <nav
        aria-label="Main"
        className={`sticky top-0 z-40 bg-coral text-white ${isScrolled ? "shadow-md" : ""}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:justify-center">
          <ul className="hidden items-center text-[13px] font-bold uppercase lg:flex xl:text-sm 2xl:text-[15px]">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (Date.now() < suppressHoverUntilRef.current) return;
                    setOpenDropdown(item.label);
                  }}
                  onMouseLeave={() => setOpenDropdown(null)}
                  onFocus={() => setOpenDropdown(item.label)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenDropdown(null);
                  }}
                >
                  <Link
                    href={item.href!}
                    onClick={closeDropdownForNavigation}
                    className="block px-3 py-5 hover:bg-coral-dark xl:px-5 2xl:px-6"
                  >
                    {item.label}
                  </Link>
                  <div
                    className={`absolute left-0 top-full z-20 min-w-[230px] bg-white py-2 shadow-lg transition-opacity ${
                      openDropdown === item.label ? "visible opacity-100" : "invisible opacity-0"
                    }`}
                  >
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={closeDropdownForNavigation}
                        className="block px-4 py-2 text-sm font-semibold normal-case text-ink hover:bg-paper hover:text-coral"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href!} className="block px-3 py-5 hover:bg-coral-dark xl:px-5 2xl:px-6">
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="ml-3 hidden items-center gap-6 lg:flex xl:ml-6">
            {VERIFIED_SOCIAL_LINKS.map((s) => (
              <SocialIcon key={s.label} link={s} className="text-white hover:text-white/75" />
            ))}
          </div>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="my-2 flex h-10 w-10 items-center justify-center rounded-md border border-white/40 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
          <div className="flex items-center gap-4 lg:hidden">
            {VERIFIED_SOCIAL_LINKS.map((s) => (
              <SocialIcon key={s.label} link={s} className="text-white" />
            ))}
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-nav" className="flex flex-col gap-1 border-t border-white/20 bg-white px-2 py-3 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href ?? item.children![0].href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm font-bold uppercase text-ink hover:bg-paper hover:text-coral"
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
          </div>
        )}
      </nav>

      {/* White brand band — production's second row: portrait logo, org
          name + tagline, location and phone, outlined Donate, and the
          "Shaping lives" emblem. One row from lg (1024px) up, with type and
          spacing stepping down at lg/xl so everything still fits on that
          row; below lg it splits into brand on top and contact/Donate/emblem
          underneath. The name and tagline are each held to a single line
          (whitespace-nowrap), with phone-width sizes in vw so they shrink
          instead of wrapping. */}
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:flex lg:items-center lg:gap-4 xl:gap-6 2xl:gap-8">
          <Link
            href="/"
            className="flex min-w-0 flex-col items-center gap-3 text-center sm:flex-row sm:gap-6 sm:text-left lg:flex-1 lg:gap-3 xl:gap-5"
          >
            {logo?.src ? (
              // site-logo.png already includes the oval black frame, so it's
              // shown as-is rather than cropped into a circle.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-20 w-auto flex-shrink-0 sm:h-[106px] lg:h-[72px] xl:h-[90px] 2xl:h-[106px]"
              />
            ) : null}
            <span className="min-w-0">
              <span className="block whitespace-nowrap font-serif text-[5vw] font-bold uppercase leading-tight text-coral sm:text-[28px] md:text-[32px] lg:text-[19px] xl:text-[24px] 2xl:text-[30px]">
                Pandita Ramabai Mukti Mission
              </span>
              <span className="mt-1 block whitespace-nowrap text-[3vw] text-ink-soft sm:text-sm md:text-base lg:text-xs xl:text-sm 2xl:text-base">
                An NGO Committed to Empowering Women and Children since 1889
              </span>
            </span>
          </Link>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:justify-start lg:mt-0 lg:flex-shrink-0 lg:flex-nowrap lg:justify-end lg:gap-x-4 xl:gap-x-6 2xl:gap-x-8">
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[#8a96a3] lg:gap-2 xl:gap-3"
            >
              <MapPinIcon />
              <span className="leading-tight">
                <span className="block text-sm uppercase lg:text-[11px] xl:text-xs 2xl:text-sm">We are here</span>
                <span className="block whitespace-nowrap text-lg font-bold uppercase text-ink lg:text-sm xl:text-base 2xl:text-lg">
                  Pune, India
                </span>
              </span>
            </a>
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-3 text-[#8a96a3] sm:border-l sm:border-black/10 sm:pl-6 lg:gap-2 lg:pl-4 xl:gap-3 xl:pl-6 2xl:pl-8"
            >
              <PhoneIcon />
              <span className="leading-tight">
                <span className="block text-sm uppercase lg:text-[11px] xl:text-xs 2xl:text-sm">Call us now</span>
                <span className="block whitespace-nowrap text-xl font-bold text-ink sm:text-2xl lg:text-base xl:text-xl 2xl:text-2xl">
                  {phone}
                </span>
              </span>
            </a>
            <Link
              href="/donate/"
              className="w-full flex-shrink-0 border border-coral px-6 py-3 text-center text-base font-bold uppercase text-coral transition-colors hover:bg-coral hover:text-white sm:w-auto sm:py-4 lg:px-4 lg:py-2.5 lg:text-sm xl:px-6 xl:py-3 xl:text-base 2xl:px-9 2xl:py-4"
            >
              Donate
            </Link>
            <Link href="/" className="hidden flex-shrink-0 md:block" aria-label="Shaping lives — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/uploads/shaping-lives.jpg"
                alt="Shaping lives: shaping the mind, heart, spirit, environment and destiny"
                className="h-24 w-[110px] border border-coral object-fill lg:h-[72px] lg:w-[84px] xl:h-24 xl:w-[110px] 2xl:h-[144px] 2xl:w-[172px]"
              />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
