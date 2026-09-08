import Link from "next/link";

// Social hrefs point at each platform's root, not a specific handle —
// swap in the org's real profile URLs before launch. A wrong specific
// URL would send visitors to an unrelated real page, which is worse
// than a generic one.
const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="M10 9l5 3-5 3z" fill="#d9dee5" stroke="none" />
      </>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#2b3541] px-6 pb-6 pt-14 text-[#d9dee5] sm:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-9 sm:grid-cols-4">
        <FooterColumn title="Quick Links">
          <FooterLink href="/about-pandita-ramabai/">About Pandita Ramabai</FooterLink>
          <FooterLink href="/news/">News &amp; Updates</FooterLink>
          <FooterLink href="/testimonials/">Testimonials</FooterLink>
          <FooterLink href="/reports/">Reports</FooterLink>
          <FooterLink href="/contact/">Contact Us</FooterLink>
        </FooterColumn>
        <FooterColumn title="Programs">
          <FooterLink href="/programs/">View all programs</FooterLink>
          <FooterLink href="/shaping-the-mind/">Shaping the Mind</FooterLink>
          <FooterLink href="/shaping-the-spirit/">Shaping the Spirit</FooterLink>
          <FooterLink href="/shaping-the-heart/">Shaping the Heart</FooterLink>
        </FooterColumn>
        <FooterColumn title="Get Involved">
          <FooterLink href="/donate/">Donate</FooterLink>
          <FooterLink href="/mukti-kiran/">Mukti Kiran Newsletter</FooterLink>
          <FooterLink href="/contact/">Partner With Us</FooterLink>
        </FooterColumn>
        <FooterColumn title="Legal">
          <FooterLink href="/terms-of-use/">Terms of Use</FooterLink>
          <FooterLink href="/privacy-policy/">Privacy Policy</FooterLink>
          <FooterLink href="/site-map/">Sitemap</FooterLink>
        </FooterColumn>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-[#435061] pt-6">
        <p className="max-w-prose text-xs text-[#8b96a3]">
          Registered under the Societies Registration Act (1950) &amp; Bombay
          Public Trust Act (1950). Donations are tax-exempt under Section 80G.
        </p>
        <div className="flex gap-2.5">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#4b5a6c] hover:border-white"
            >
              <span className="sr-only">{s.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d9dee5" strokeWidth={2}>
                {s.icon}
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wide text-[#9aa6b4]">
        {title}
      </h4>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-[#d9dee5] hover:text-white hover:underline">
        {children}
      </Link>
    </li>
  );
}
