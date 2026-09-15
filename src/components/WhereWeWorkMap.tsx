"use client";

import { useState } from "react";

// Real locations transcribed from the org's own map graphic
// (public/images/uploads/where-we-work-map.png) — not invented. Marker
// positions are eyeballed against that image (percentage of its width/
// height), not real geocoding, since no lat/long data exists for these
// places; a few that cluster tightly on the source map (Satifal, Sapeda,
// Bandharpada) are fanned out slightly here so each stays individually
// clickable instead of stacking into one unclickable point.
type MapLocation = {
  id: string;
  name: string;
  type: string;
  hq?: boolean;
  xPct: number;
  yPct: number;
};

const LOCATIONS: MapLocation[] = [
  { id: "mount-abu", name: "Mount Abu", type: "Girls & Boys", xPct: 36.8, yPct: 19.8 },
  { id: "delhi", name: "Delhi", type: "Day Care", xPct: 48.8, yPct: 31.2 },
  { id: "satifal", name: "Satifal", type: "Day Care", xPct: 33.4, yPct: 44.9 },
  { id: "sapeda", name: "Sapeda", type: "Day Care", xPct: 32.0, yPct: 47.8 },
  { id: "bandharpada", name: "Bandharpada (Nasik)", type: "Girls", xPct: 30.6, yPct: 50.7 },
  { id: "nerul", name: "Nerul (Mumbai)", type: "Girls", xPct: 36.3, yPct: 60.9 },
  { id: "kedgaon", name: "Kedgaon (Ahmednagar)", type: "Mukti Mission headquarters — Girls & Boys", hq: true, xPct: 42.5, yPct: 65.4 },
  { id: "supa", name: "Supa", type: "Girls & Day Care", xPct: 48.8, yPct: 70.0 },
  { id: "miraj", name: "Miraj", type: "Boys", xPct: 52.2, yPct: 72.3 },
  { id: "chikaldhara", name: "Chikaldhara", type: "Girls & Boys", xPct: 55.6, yPct: 63.9 },
  { id: "banjar", name: "Banjar", type: "Girls", xPct: 56.7, yPct: 60.1 },
  { id: "jagdalpur", name: "Jagdalpur", type: "Girls & Boys", xPct: 59.0, yPct: 57.1 },
  { id: "narainpur", name: "Narainpur", type: "Girls & Boys", xPct: 57.8, yPct: 54.5 },
];

export function WhereWeWorkMap({ mapSrc, mapAlt }: { mapSrc: string; mapAlt: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = LOCATIONS.find((l) => l.id === selectedId);

  return (
    <div>
      <div className="relative aspect-[882/657] w-full overflow-hidden rounded-xl border border-black/10 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS-uploaded path, matches PhotoBox's own plain <img> approach. */}
        <img src={mapSrc} alt={mapAlt} className="absolute inset-0 h-full w-full object-contain" />
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onMouseEnter={() => setSelectedId(loc.id)}
            onFocus={() => setSelectedId(loc.id)}
            onClick={() => setSelectedId(loc.id)}
            aria-label={`${loc.name} — ${loc.type}`}
            aria-pressed={selectedId === loc.id}
            style={{ left: `${loc.xPct}%`, top: `${loc.yPct}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow transition-all ${
              loc.hq ? "h-4 w-4" : "h-3 w-3"
            } ${
              selectedId === loc.id
                ? "scale-125 bg-coral"
                : loc.hq
                  ? "bg-red-600 hover:scale-125"
                  : "bg-[#2d5c6b] hover:scale-125"
            }`}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-white bg-red-600 shadow" /> Mukti Mission HQ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-[#2d5c6b] shadow" /> Ministry location
        </span>
        <span className="ml-auto">Hover or tap a point on the map for details.</span>
      </div>

      <div className="mt-4 min-h-[76px] rounded-lg border border-black/10 bg-white p-4 shadow-md">
        {selected ? (
          <>
            <div className="text-sm font-semibold">
              {selected.name}
              {selected.hq && (
                <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                  Headquarters
                </span>
              )}
            </div>
            <div className="mt-1 text-sm text-ink-soft">{selected.type}</div>
          </>
        ) : (
          <p className="text-sm text-ink-soft">Select a location on the map to see what it serves.</p>
        )}
      </div>
    </div>
  );
}
