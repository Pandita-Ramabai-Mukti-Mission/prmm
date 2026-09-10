"use client";

import { useRef, useState } from "react";
import { validateDonationFields, type DonationFieldErrors } from "@/lib/donationValidation";
import { useRecaptchaToken } from "@/lib/recaptchaClient";
import { RecaptchaAttribution } from "@/components/RecaptchaAttribution";
import { RootGrowthMotif } from "@/components/RootGrowthMotif";

// v3 is invisible — no checkbox, no visible challenge — so the only UI is
// the small floating badge Google's script injects itself; do not hide
// that badge without keeping <RecaptchaAttribution /> visible somewhere,
// which their Terms of Service require regardless.
const RECAPTCHA_ACTION = "donate";

// No specific "₹X buys Y" unit-cost claims here — the amount-tiered
// versions this replaced (school supplies, meals, a named hospital's
// "month of medical care") had no source anywhere: not the live site, not
// any doc. Naming a real facility (Krishnabai Memorial Hospital is real,
// per site-audit.md) doesn't make an invented cost-per-rupee figure real.
// A genuine amount-tied version needs actual unit costs from the client
// first — see dev-backlog.md #55.
const IMPACT_STATEMENT =
  "goes directly toward Mukti Mission's work caring for orphaned, destitute and vulnerable women and children across 14 ministries in Kedgaon and beyond.";

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
  causes: { slug: string; title: string; donateVerb?: string }[];
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
  const getRecaptchaToken = useRecaptchaToken();

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

    setSubmitting(true);
    try {
      const token = await getRecaptchaToken(RECAPTCHA_ACTION);
      if (captchaFieldRef.current) captchaFieldRef.current.value = token;
      formRef.current?.submit();
    } catch {
      setErrors((prev) => ({ ...prev, captcha: "Verification failed. Please refresh the page and try again." }));
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        ref={formRef}
        method="POST"
        action="/api/payu/initiate/"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-7 md:flex-row md:items-start"
      >
        <input ref={captchaFieldRef} type="hidden" name="g-recaptcha-response" />
        <div className="flex flex-col gap-7 md:flex-[2]">
          <div className="rounded-lg border border-black/10 bg-white shadow-md p-7">
            <h2 className="text-lg">Your Details</h2>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span
                  id="donate-cause-label"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-ink-soft"
                >
                  Donating To
                </span>
                {/* Outcome-framed chips, not a plain dropdown listing program
                    titles — isha.sadhguru.org's donation hub segments giving
                    by specific outcome ("Educate a Child") rather than
                    repeating a generic label across every cause. Each
                    program's `donateVerb` (Decap field `donate_verb`) is
                    optional and falls back to "Support {title}" so a new
                    program never blocks this UI. A real <select name="cause">
                    stays behind the chips (visually hidden, not display:none)
                    so /api/payu/initiate/ keeps receiving `cause` as a plain
                    form field — no client-side JS required server-side. */}
                <div role="radiogroup" aria-labelledby="donate-cause-label" className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={cause === "general"}
                    onClick={() => setCause("general")}
                    className={`rounded-md border px-4 py-2 text-sm font-semibold ${
                      cause === "general"
                        ? "border-coral bg-coral text-white"
                        : "border-black/15 bg-white text-ink hover:border-coral/50"
                    }`}
                  >
                    Where Most Needed
                  </button>
                  {causes.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      role="radio"
                      aria-checked={cause === c.slug}
                      onClick={() => setCause(c.slug)}
                      className={`rounded-md border px-4 py-2 text-sm font-semibold ${
                        cause === c.slug
                          ? "border-coral bg-coral text-white"
                          : "border-black/15 bg-white text-ink hover:border-coral/50"
                      }`}
                    >
                      {c.donateVerb || `Support ${c.title}`}
                    </button>
                  ))}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={cause === "other"}
                    onClick={() => setCause("other")}
                    className={`rounded-md border px-4 py-2 text-sm font-semibold ${
                      cause === "other"
                        ? "border-coral bg-coral text-white"
                        : "border-black/15 bg-white text-ink hover:border-coral/50"
                    }`}
                  >
                    Other
                  </button>
                </div>
                <select
                  aria-hidden
                  tabIndex={-1}
                  name="cause"
                  value={cause}
                  onChange={() => {}}
                  className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
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

          <div className="rounded-lg border border-black/10 bg-white shadow-md p-7">
            <h2 className="text-lg">Payment Details</h2>
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
            <RecaptchaAttribution className="mt-3 text-[11px] text-ink-soft" />
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-1">
          <div className="relative overflow-hidden rounded-lg border border-black/10 bg-white shadow-md p-7">
            {/* This page's one decorative motif — see RootGrowthMotif.tsx */}
            <RootGrowthMotif className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 text-[#2d5c6b]/[0.12]" />
            <h3 className="relative font-semibold">Your Impact</h3>
            <p className="relative mt-2 text-sm">
              {total} {IMPACT_STATEMENT}
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white shadow-md p-7">
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
