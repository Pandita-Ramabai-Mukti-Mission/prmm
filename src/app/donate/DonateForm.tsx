"use client";

import { useState } from "react";

const AMOUNTS = [500, 1000, 2500, 5000];

function impactFor(amount: number) {
  if (amount <= 500) return "provides a month of school supplies for one child.";
  if (amount <= 1000) return "covers a week of nutritious meals for five children.";
  if (amount <= 2500) return "supports a month of medical care at Krishnabai Memorial Hospital.";
  return "funds a month of vocational training for one resident.";
}

function chipClass(selected: boolean) {
  return `rounded-md px-4 py-2.5 text-sm font-semibold ${
    selected ? "bg-coral text-white" : "border border-black/15 text-ink"
  }`;
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
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [amount, setAmount] = useState(1000);

  const total = `₹${amount.toLocaleString("en-IN")}${frequency === "monthly" ? "/month" : ""}`;

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-start">
      <div className="flex flex-col gap-5 md:flex-[2]">
        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-serif text-lg">Choose Your Cause &amp; Gift</h2>

          <div className="mt-3 flex flex-wrap gap-2.5">
            <button type="button" className={chipClass(cause === "general")} onClick={() => setCause("general")}>
              General Fund
            </button>
            {causes.map((c) => (
              <button
                key={c.slug}
                type="button"
                className={chipClass(cause === c.slug)}
                onClick={() => setCause(c.slug)}
              >
                {c.title}
              </button>
            ))}
            <button type="button" className={chipClass(cause === "other")} onClick={() => setCause("other")}>
              Other
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              Frequency
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                className={chipClass(frequency === "one-time")}
                onClick={() => setFrequency("one-time")}
              >
                One-time
              </button>
              <button
                type="button"
                className={chipClass(frequency === "monthly")}
                onClick={() => setFrequency("monthly")}
              >
                Monthly
              </button>
            </div>
            {frequency === "monthly" && (
              <p className="mt-2 text-sm text-slate">
                Monthly gifts help us plan ahead and reach more children consistently — our most
                sustainable way to give.
              </p>
            )}
          </div>

          <div className="mt-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
              Amount
            </div>
            <div className="flex flex-wrap gap-2.5">
              {AMOUNTS.map((v) => (
                <button key={v} type="button" className={chipClass(amount === v)} onClick={() => setAmount(v)}>
                  &#8377;{v.toLocaleString("en-IN")}
                </button>
              ))}
              <div className="w-36 rounded-md border border-black/15 px-3.5 py-2.5 text-sm text-ink-soft">
                Custom amount
              </div>
            </div>
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
          <h2 className="font-serif text-lg">Your Details</h2>
          <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {["Full name", "Email", "Phone", "Address"].map((f) => (
              <div key={f} className="rounded-md border border-black/15 px-3.5 py-2.5 text-sm text-ink-soft">
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-5">
          <h2 className="font-serif text-lg">Payment Details</h2>
          <div className="mt-3 w-64 rounded-md border border-black/15 px-3.5 py-2.5 text-sm text-ink-soft">
            PAN number
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            Required by Income Tax rules to issue an 80G receipt for donations above &#8377;[amount —
            confirm threshold with client]. Handled via our secure payment partner — not stored on this
            form.
          </p>
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
                type="button"
                disabled
                title="Payment gateway not yet selected — dev-backlog.md #13"
                className="cursor-not-allowed rounded-md bg-coral/60 px-6 py-3 text-sm font-semibold text-white"
              >
                Proceed to Secure Payment &rarr;
              </button>
            </div>
          </div>
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
          <p className="mt-2 text-sm text-ink-soft">256-bit encrypted checkout via our payment partner.</p>
        </div>
      </div>
    </div>
  );
}
