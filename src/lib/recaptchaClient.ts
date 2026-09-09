"use client";

import { useCallback } from "react";

// Google's own published test key pair — always verifies successfully, so
// every form using this works out of the box in dev/preview before real
// keys exist. NEXT_PUBLIC_RECAPTCHA_SITE_KEY must be set to the real
// (v3-type) site key before launch (see docs/dev-backlog.md — bot-
// prevention item), or every visitor sails through unchallenged.
const RECAPTCHA_TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || RECAPTCHA_TEST_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// Shared by every public form on the site that needs bot protection
// (Donate today; Contact and the Newsletter signup once their backends
// exist — see docs/dev-backlog.md #15/#16) so the v3 token-fetch dance
// (async, tied to a named action, no visible challenge) is written once
// instead of re-derived per form. Pair with <RecaptchaScript /> in the
// root layout, which loads the underlying grecaptcha script sitewide.
export function useRecaptchaToken() {
  return useCallback((action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error("reCAPTCHA hasn't finished loading yet."));
        return;
      }
      window.grecaptcha.ready(() => {
        window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action }).then(resolve).catch(reject);
      });
    });
  }, []);
}
