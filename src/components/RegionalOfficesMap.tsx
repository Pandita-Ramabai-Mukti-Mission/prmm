"use client";

import { useState } from "react";
import type { RegionalContact } from "@/lib/content";

// Two attempts at a custom-drawn India outline (straight-line polygon,
// then a smoothed Bézier version) both came out unrecognizable without a
// real design tool to iterate against — see git history for what didn't
// work and why. Dropped the map entirely rather than ship a third guess;
// this is a plain interactive directory (click a card, see full details)
// instead. Revisit with a real India outline asset if one becomes
// available, per the client's own call on 2026-09-15.
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function RegionalOfficesMap({ regions }: { regions: RegionalContact[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(regions[0]?.slug ?? null);
  const selected = regions.find((r) => r.slug === selectedSlug);

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-md sm:p-7">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:col-span-3 md:grid-cols-2">
          {regions.map((r) => (
            <button
              key={r.slug}
              type="button"
              onClick={() => setSelectedSlug(r.slug)}
              aria-pressed={selectedSlug === r.slug}
              className={`flex items-start gap-2.5 rounded-lg border p-3.5 text-left transition-colors ${
                selectedSlug === r.slug
                  ? "border-coral bg-[#fff4f2]"
                  : "border-black/10 bg-white hover:border-coral/40"
              }`}
            >
              <span
                className={`mt-0.5 flex-shrink-0 ${selectedSlug === r.slug ? "text-coral" : "text-ink-soft"}`}
              >
                <PinIcon />
              </span>
              <span>
                <span className="block text-sm font-semibold">{r.region}</span>
                {r.name && <span className="block text-xs text-ink-soft">{r.name}</span>}
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-coral/30 bg-[#fff4f2] p-5 md:col-span-2">
          {selected ? (
            <>
              <div className="text-xs font-semibold uppercase tracking-wide text-coral">{selected.region}</div>
              {selected.name && <div className="mt-1.5 text-sm font-semibold">{selected.name}</div>}
              {selected.address && <p className="mt-1 text-sm text-ink-soft">{selected.address}</p>}
              <div className="mt-3 flex flex-col gap-1 text-sm">
                {selected.phone && (
                  <a href={`tel:${selected.phone.replace(/\s+/g, "")}`} className="font-medium text-ink hover:text-coral">
                    {selected.phone}
                  </a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="font-medium text-ink hover:text-coral">
                    {selected.email}
                  </a>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-ink-soft">Select a region to see contact details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
