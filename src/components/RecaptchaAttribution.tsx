// Required text whenever reCAPTCHA v3 protects a form on this site —
// v3 has no visible challenge beyond Google's own floating badge, and
// their Terms of Service require this notice regardless of whether that
// badge is shown or hidden. One copy, reused by every protected form
// instead of re-typed (and possibly drifting) per form.
export function RecaptchaAttribution({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-[11px] text-ink-soft"}>
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
  );
}
