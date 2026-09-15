"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { ImageWithAlt, RegionalContact } from "@/lib/content";

// /admin is the Decap CMS app, not a site page — it must not be wrapped in
// the site's own header/footer. Next's App Router applies one root layout
// to every route by default, so this gates the chrome by pathname instead
// of restructuring routing into multiple root layouts.
export function ChromeGate({
  children,
  hq,
  logo,
}: {
  children: React.ReactNode;
  hq?: RegionalContact;
  logo?: ImageWithAlt;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader hq={hq} logo={logo} />
      {children}
      <SiteFooter hq={hq} />
    </>
  );
}
