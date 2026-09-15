import type { Metadata } from "next";
import { Suspense } from "react";
import { IBM_Plex_Sans, Source_Serif_4, Geist_Mono } from "next/font/google";
import { ChromeGate } from "@/components/ChromeGate";
import { RecaptchaScript } from "@/components/RecaptchaScript";
import { GlobalLoader } from "@/components/GlobalLoader";
import { getHeadquartersContact, getSiteBranding } from "@/lib/content";
import "./globals.css";

// Two-family system (replaced the single-family Geist Sans decision,
// 2026-09-10 — see docs/design-system.md's Typography section for why
// that decision existed and why it's being reversed here): Source Serif 4
// for headings, IBM Plex Sans for body/UI — the same pairing explored in
// the wireframe canvas, now loaded as real webfonts via next/font/google
// (not the earlier font-serif regression, which fell back to the
// browser's generic system serif because no real serif was ever loaded).
const bodySans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const headingSerif = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pandita Ramabai Mukti Mission",
  description:
    "Caring for orphaned, destitute and vulnerable women and children across 14 ministries in Kedgaon and beyond, since 1889.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const hq = getHeadquartersContact();
  const { logo } = getSiteBranding();

  return (
    <html
      lang="en"
      className={`${bodySans.variable} ${headingSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <RecaptchaScript />
        {/* useSearchParams requires a Suspense boundary; an empty fallback
            is correct here since the loader has nothing to show until it
            mounts anyway. */}
        <Suspense fallback={null}>
          <GlobalLoader />
        </Suspense>
        <ChromeGate hq={hq} logo={logo}>{children}</ChromeGate>
      </body>
    </html>
  );
}
