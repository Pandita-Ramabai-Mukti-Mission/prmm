import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ChromeGate } from "@/components/ChromeGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <ChromeGate>{children}</ChromeGate>
      </body>
    </html>
  );
}
