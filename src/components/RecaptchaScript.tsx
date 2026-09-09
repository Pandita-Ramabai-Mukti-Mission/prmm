"use client";

import Script from "next/script";
import { RECAPTCHA_SITE_KEY } from "@/lib/recaptchaClient";

// Loaded once, sitewide, from the root layout — every form that calls
// useRecaptchaToken() (src/lib/recaptchaClient.ts) shares this single
// script load instead of each one injecting its own <Script> tag.
export function RecaptchaScript() {
  return <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />;
}
