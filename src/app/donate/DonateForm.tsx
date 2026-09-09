"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { validateDonationFields, type DonationFieldErrors } from "@/lib/donationValidation";

// Google's own published test key pair — always verifies successfully, so
// the form works out of the box in dev/preview before real keys exist.
// NEXT_PUBLIC_RECAPTCHA_SITE_KEY must be set to the real (v3-type) site key
// before launch (see docs/dev-backlog.md — bot-prevention item), or every
// visitor sails through unchallenged. v3 is invisible — no checkbox, no
// visible challenge — so the only UI is the small floating badge Google's
// script injects itself; do not hide that badge without adding the
// attribution text their terms require in its place.
const RECAPTCHA_TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const RECAPTCHA_ACTION = "donate";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function impactFor(amount: number) {
  if (amount <= 500) return "provides a month of school supplies for one child.";
  if (amount <= 1000) return "covers a week of nutritious meals for five children.";
  if (amount <= 2500) return "supports a month of medical care at Krishnabai Memorial Hospital.";
  return "funds a month of vocational training for one resident.";
}

type Errors = DonationFieldErrors & { captcha?: string };

// One field = one place that owns the label/input/error markup, so adding
// or restyling a field doesn't mean touching five near-identical blocks.
function TextField({
  id,
  label,
  error,
  className,
  ...inputProps
}: {
  id: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-ink ${
          error ? "border-red-400" : "border-black/15"
        }`}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function DonateForm({
  causes,
  initialCause,
}: {
  causes: { slug: string; title: string }[];
  initialCause?: string;
}) {
  const [cause, setCause] = useState(
    initialCause && causes.some((c) => c.slug === initialCause) ? initialCause : "general"
  );
  const [otherCause, setOtherCause] = useState("");
  const [amount, setAmount] = useState(1000);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pan, setPan] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const captchaFieldRef = useRef<HTMLInputElement>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || RECAPTCHA_TEST_SITE_KEY;

  const total = `₹${amount.toLocaleString("en-IN")}`;

  function validate(): Errors {
    return validateDonationFields({ amount, cause, otherCause, fullName, email, phone, address, pan });
  }

  // v3 has no checkbox to have already completed by submit time — a fresh,
  // single-use token has to be fetched right now, tied to this specific
  // action. That's inherently async, so this always preventDefaults first;
  // once a token comes back it's written into the hidden field and the
  // form is submitted via the DOM's own .submit() (not requestSubmit),
  // which bypasses React's onSubmit entirely and does a genuine browser
  // POST to /api/payu/initiate/ carrying every current field value.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!window.grecaptcha) {
      setErrors((prev) => ({ ...prev, captcha: "Verification hasn't finished loading — please try again." }));
      return;
    }

    setSubmitting(true);
    try {
      const token = await new Promise<string>((resolve, reject) => {
        window.grecaptcha!.ready(() => {
          window.grecaptcha!.execute(siteKey, { action: RECAPTCHA_ACTION }).then(resolve).catch(reject);
        });
      });
      if (captchaFieldRef.current) captchaFieldRef.current.value = token;
      formRef.current?.submit();
    } catch {
      setErrors((prev) => ({ ...prev, captcha: "Verification failed. Please refresh the page and try again." }));
      setSubmitting(false);
    }
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        strategy="afterInteractive"
      />
      <form
        ref={formRef}
        method="POST"
        action="/api/payu/initiate/"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5 md:flex-row md:items-start"
      >
        <input ref={captchaFieldRef} type="hidden" name="g-recaptcha-response" />
        <div className="flex flex-col gap-5 md:flex-[2]">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="font-serif text-lg">Your Details</h2>

            <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="donate-cause"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-ink-soft"
                >
                  Donating To
                </label>
                <select
                  id="donate-cause"
                  name="cause"
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  className="w-full rounded-md border border-black/15 bg-white px-3.5 py-2.5 text-sm text-ink"
                >
                  <option value="general">General Fund</option>
                  {causes.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>

              {cause === "other" && (
                <TextField
                  id="donate-other-cause"
                  label="Please specify"
                  name="otherCause"
                  value={otherCause}
                  onChange={(e) => setOtherCause(e.target.value)}
                  error={errors.otherCause}
                  className="sm:col-span-2"
                />
              )}

              <TextField
                id="donate-amount"
                label="Amount (₹)"
                name="amount"
                type="number"
                min={1}
                step={1}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                error={errors.amount}
                className="sm:col-span-2"
              />

              <TextField
                id="donate-name"
                label="Full name"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
              />
              <TextField
                id="donate-email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <TextField
                id="donate-phone"
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
              />
              <TextField
                id="donate-address"
                label="Address"
                name="address"
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={errors.address}
              />
            </div>
            <p className="mt-4 border-t border-black/10 pt-3.5 text-xs text-ink-soft">
              Donations are non-refundable once processed — see our{" "}
              <a href="/privacy-policy/" className="underline">
                donation policy
              </a>
              .
            </p>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="font-serif text-lg">Payment Details</h2>
            <TextField
              id="donate-pan"
              label="PAN number (optional)"
              name="pan"
              maxLength={10}
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              error={errors.pan}
              className="mt-3 max-w-xs"
            />
            <p className="mt-2 text-xs text-ink-soft">
              Required by Income Tax rules to issue an 80G receipt for donations above &#8377;[amount —
              confirm threshold with client]. Handled via our secure payment partner — not stored on this
              form.
            </p>

            {errors.captcha && <p className="mt-3 text-xs text-red-600">{errors.captcha}</p>}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3.5 border-t border-black/10 pt-4">
              <div className="text-sm">
                Total: <strong>{total}</strong>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 018 0v4" />
                  </svg>
                  SSL Encrypted
                </span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-coral px-6 py-3 text-sm font-semibold text-white hover:bg-coral-dark disabled:cursor-wait disabled:opacity-70"
                >
                  {submitting ? "Verifying…" : <>Proceed to Secure Payment &rarr;</>}
                </button>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-ink-soft">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" className="underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" className="underline">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-1">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h3 className="font-semibold">Your Impact</h3>
            <p className="mt-2 text-sm">
              {total} {impactFor(amount)}
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h3 className="font-semibold">Secure &amp; Compliant</h3>
            <p className="mt-2 text-sm text-ink-soft">
              256-bit encrypted checkout via PayU, India&rsquo;s PCI-DSS compliant payment gateway.
            </p>
          </div>
        </div>
      </form>
    </>
  );
}
