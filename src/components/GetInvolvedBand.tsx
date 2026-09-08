import Link from "next/link";

// Donate is deliberately the dominant tile here, not one of four equal
// actions — donations are this NGO's primary income source. See
// docs/site-audit.md and the wireframe canvas for the reasoning.
const SECONDARY_ACTIONS = [
  {
    href: "/volunteer/",
    label: "Volunteer",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </>
    ),
  },
  {
    href: "/share/",
    label: "Spread the Word",
    icon: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 3.9M15.4 6.5L8.6 10.4" />
      </>
    ),
  },
  {
    href: "/contact/",
    label: "Contact Us",
    icon: (
      <>
        <path d="M22 6l-10 7L2 6" />
        <rect x="2" y="4" width="20" height="16" rx="2" />
      </>
    ),
  },
];

export function GetInvolvedBand() {
  return (
    <div className="flex items-center gap-4 bg-slate px-6 py-3.5 sm:px-12">
      <Link
        href="/donate/"
        className="flex flex-[1.3] items-center justify-center gap-3 rounded-lg bg-coral px-4 py-4 font-bold text-white hover:bg-coral-dark"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
          <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 5.5 5.5 5.5 0 0121.5 12c-2.5 4.5-9.5 9-9.5 9z" />
        </svg>
        Donate Now
      </Link>
      <div className="flex flex-[2]">
        {SECONDARY_ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex flex-1 flex-col items-center gap-2 px-3 py-3.5 text-center opacity-85 hover:opacity-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                {a.icon}
              </svg>
            </span>
            <span className="text-xs font-medium text-white">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
