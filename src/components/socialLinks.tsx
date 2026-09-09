import type { ReactNode } from "react";

export type SocialLink = { label: string; href: string; icon: ReactNode };

// Only Facebook is a confirmed-live channel — site-audit.md's crawl of the
// original site found Facebook working and three other platforms dead
// (`href="#"`). Instagram/YouTube previously sat in the footer as
// placeholder links with no confirmation the org has real active accounts
// on either — removed rather than kept as unverified "maybe" links. Add
// back once the client confirms real handles (dev-backlog.md #56). Shared
// here (not duplicated in footer + homepage) so both stay in sync by
// construction if this list ever changes.
export const VERIFIED_SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
];

export function SocialIcon({ link, className }: { link: SocialLink; className?: string }) {
  return (
    <a href={link.href} aria-label={link.label} className={className}>
      <span className="sr-only">{link.label}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        {link.icon}
      </svg>
    </a>
  );
}
