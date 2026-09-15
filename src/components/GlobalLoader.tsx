"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// A thin top-of-page progress bar for client-side navigations, the same
// idea as GitHub/YouTube's nav loader. Next's App Router doesn't expose a
// public "navigation started" event, so this starts on the actual click
// (any left-click on a same-origin, same-tab, non-hash anchor — which is
// exactly what a next/link renders down to) rather than waiting for
// something to observably change, and stops once usePathname/
// useSearchParams report the new route — the only reliable "navigation
// finished" signal available. Deliberately no real percentage: it eases
// toward ~85% while waiting and snaps to 100% on completion, purely to
// communicate "something is happening" during the SSR round-trip.
function isNavigationClick(e: MouseEvent): HTMLAnchorElement | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const anchor = (e.target as HTMLElement)?.closest?.("a");
  if (!anchor || !(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return null;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname + url.search === window.location.pathname + window.location.search) return null;
    return anchor;
  } catch {
    return null;
  }
}

export function GlobalLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeKeyRef = useRef(`${pathname}?${searchParams.toString()}`);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!isNavigationClick(e)) return;
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setVisible(true);
      setProgress(15);
      intervalRef.current = setInterval(() => {
        setProgress((p) => (p < 85 ? p + (85 - p) * 0.15 : p));
      }, 180);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const key = `${pathname}?${searchParams.toString()}`;
    if (key === routeKeyRef.current) return;
    routeKeyRef.current = key;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 top-0 z-[70] h-[3px] w-full motion-reduce:hidden" aria-hidden="true">
      <div className="h-full bg-coral transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}
