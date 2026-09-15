"use client";

import { useState } from "react";

// Real locations transcribed from the org's own map graphic
// (public/images/uploads/where-we-work-map.png) — not invented. Marker
// positions are eyeballed against that image (percentage of its width/
// height), not real geocoding, since no lat/long data exists for these
// places; a few that cluster tightly on the source map (Satifal, Sapeda,
// Bandharpada) are fanned out slightly here so each stays individually
// clickable instead of stacking.
type Category = "hq" | "girls" | "boys" | "day-care";

type MapLocation = {
  id: string;
  name: string;
  detail: string;
  categories: Category[];
  xPct: number;
  yPct: number;
};

const LOCATIONS: MapLocation[] = [
  { id: "kedgaon", name: "Kedgaon (Ahmednagar)", detail: "Mukti Mission headquarters — Girls & Boys", categories: ["hq", "girls", "boys"], xPct: 42.5, yPct: 65.4 },
  { id: "mount-abu", name: "Mount Abu", detail: "Girls & Boys", categories: ["girls", "boys"], xPct: 36.8, yPct: 19.8 },
  { id: "delhi", name: "Delhi", detail: "Day Care", categories: ["day-care"], xPct: 48.8, yPct: 31.2 },
  { id: "satifal", name: "Satifal", detail: "Day Care", categories: ["day-care"], xPct: 33.4, yPct: 44.9 },
  { id: "sapeda", name: "Sapeda", detail: "Day Care", categories: ["day-care"], xPct: 32.0, yPct: 47.8 },
  { id: "bandharpada", name: "Bandharpada (Nasik)", detail: "Girls", categories: ["girls"], xPct: 30.6, yPct: 50.7 },
  { id: "nerul", name: "Nerul (Mumbai)", detail: "Girls", categories: ["girls"], xPct: 36.3, yPct: 60.9 },
  { id: "supa", name: "Supa", detail: "Girls & Day Care", categories: ["girls", "day-care"], xPct: 48.8, yPct: 70.0 },
  { id: "miraj", name: "Miraj", detail: "Boys", categories: ["boys"], xPct: 52.2, yPct: 72.3 },
  { id: "chikaldhara", name: "Chikaldhara", detail: "Girls & Boys", categories: ["girls", "boys"], xPct: 55.6, yPct: 63.9 },
  { id: "banjar", name: "Banjar", detail: "Girls", categories: ["girls"], xPct: 56.7, yPct: 60.1 },
  { id: "jagdalpur", name: "Jagdalpur", detail: "Girls & Boys", categories: ["girls", "boys"], xPct: 59.0, yPct: 57.1 },
  { id: "narainpur", name: "Narainpur", detail: "Girls & Boys", categories: ["girls", "boys"], xPct: 57.8, yPct: 54.5 },
];

const FILTERS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All Locations" },
  { id: "hq", label: "Headquarters" },
  { id: "girls", label: "Girls" },
  { id: "boys", label: "Boys" },
  { id: "day-care", label: "Day Care" },
];

function markerColor(loc: MapLocation) {
  return loc.categories.includes("hq") ? "#c74646" : "#2d5c6b";
}

// A pin, not a plain dot — point anchored exactly on the location, drawn
// as an original shape (not a copied icon-library glyph), matching the
// site's existing hand-drawn-icon convention.
function Pin({ color, active }: { color: string; active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 32"
      width={active ? 30 : 24}
      height={active ? 40 : 32}
      className="drop-shadow-md transition-all"
      style={{ filter: "drop-shadow(0 2px 3px rgb(0 0 0 / 0.35))" }}
    >
      <path
        d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z"
        fill={color}
        stroke="white"
        strokeWidth={1.5}
      />
      <circle cx="12" cy="12" r="4.5" fill="white" />
    </svg>
  );
}

export function WhereWeWorkMap({ mapSrc, mapAlt }: { mapSrc: string; mapAlt: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");

  const activeId = hoverId ?? selectedId;
  const activeLoc = LOCATIONS.find((l) => l.id === activeId);
  const hoverLoc = LOCATIONS.find((l) => l.id === hoverId);
  const visible = (loc: MapLocation) => filter === "all" || loc.categories.includes(filter);

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-md sm:p-7">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
              filter === f.id ? "bg-coral text-white" : "border border-black/15 bg-white text-ink hover:border-coral/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="relative mt-5 aspect-[882/657] w-full overflow-hidden rounded-lg bg-[#f3efe7]">
        {/* The source map's own rainbow state-fill colors and printed
            arrows/labels read as generic clip-art once real interactive
            markers exist — desaturated and tan-tinted here so it recedes
            into a texture the coral pins pop against, instead of
            competing with them. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS-uploaded path, matches PhotoBox's own plain <img> approach. */}
        <img
          src={mapSrc}
          alt={mapAlt}
          className="absolute inset-0 h-full w-full object-contain opacity-[0.55] mix-blend-luminosity"
          style={{ filter: "grayscale(1) sepia(0.35) contrast(0.9)" }}
        />

        {LOCATIONS.map((loc) => {
          const isActive = activeId === loc.id;
          const isVisible = visible(loc);
          return (
            <button
              key={loc.id}
              type="button"
              onMouseEnter={() => setHoverId(loc.id)}
              onMouseLeave={() => setHoverId(null)}
              onFocus={() => setHoverId(loc.id)}
              onBlur={() => setHoverId(null)}
              onClick={() => setSelectedId(loc.id)}
              aria-label={`${loc.name} — ${loc.detail}`}
              aria-pressed={selectedId === loc.id}
              disabled={!isVisible}
              style={{ left: `${loc.xPct}%`, top: `${loc.yPct}%` }}
              className={`absolute -translate-x-1/2 -translate-y-full transition-opacity duration-200 ${
                isVisible ? "opacity-100" : "pointer-events-none opacity-20"
              }`}
            >
              {isActive && isVisible && (
                <span
                  className="absolute -bottom-3 left-1/2 h-3 w-3 -translate-x-1/2 animate-ping rounded-full motion-reduce:animate-none"
                  style={{ backgroundColor: markerColor(loc) }}
                  aria-hidden="true"
                />
              )}
              <Pin color={markerColor(loc)} active={isActive} />

              {hoverId === loc.id && (
                <div
                  role="tooltip"
                  className={`pointer-events-none absolute left-1/2 z-10 w-max max-w-[160px] -translate-x-1/2 rounded-md bg-ink px-2.5 py-1.5 text-center text-[11px] font-medium leading-snug text-white shadow-lg ${
                    loc.yPct < 16 ? "top-full mt-2" : "bottom-full mb-2"
                  }`}
                >
                  <div className="font-semibold">{loc.name}</div>
                  <div className="text-white/75">{loc.detail}</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-ink-soft sm:hidden">Tap a pin or a location below for details.</p>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {LOCATIONS.filter(visible).map((loc) => (
          <button
            key={loc.id}
            type="button"
            onMouseEnter={() => setHoverId(loc.id)}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => setSelectedId(loc.id)}
            aria-pressed={selectedId === loc.id}
            className={`flex items-center gap-2.5 rounded-lg border p-3 text-left transition-colors ${
              activeId === loc.id ? "border-coral bg-[#fff4f2]" : "border-black/10 bg-white hover:border-coral/40"
            }`}
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: markerColor(loc) }}
              aria-hidden="true"
            />
            <span>
              <span className="block text-sm font-semibold">{loc.name}</span>
              <span className="block text-xs text-ink-soft">{loc.detail}</span>
            </span>
          </button>
        ))}
      </div>

      {activeLoc && !hoverLoc && (
        <div className="mt-4 rounded-lg border border-coral/30 bg-[#fff4f2] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            {activeLoc.name}
            {activeLoc.categories.includes("hq") && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                Headquarters
              </span>
            )}
          </div>
          <div className="mt-1 text-sm text-ink-soft">{activeLoc.detail}</div>
        </div>
      )}
    </div>
  );
}
