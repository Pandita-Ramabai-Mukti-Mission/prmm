// Google's own published test key pair (developers.google.com/recaptcha/docs/faq)
// — pairs with the test sitekey rendered by DonateForm.tsx when
// NEXT_PUBLIC_RECAPTCHA_SITE_KEY isn't set, and always verifies
// successfully. Confirmed empirically this session that it also works
// through v3's execute() API, even though Google's docs only describe it
// for the v2 checkbox — but siteverify then omits `score`/`action`
// entirely (it's a fixed always-pass shortcut, not a real evaluation),
// which is why those are only enforced when present below. Both keys must
// be swapped for the real pair before launch (see docs/dev-backlog.md —
// bot-prevention item) or verification is a no-op against real traffic.
const RECAPTCHA_TEST_SECRET = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
const SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const DEFAULT_MIN_SCORE = 0.5;

export async function verifyRecaptcha(
  token: string,
  opts: { remoteIp?: string; expectedAction?: string; minScore?: number } = {}
): Promise<boolean> {
  if (!token) return false;

  const secret = process.env.RECAPTCHA_SECRET || RECAPTCHA_TEST_SECRET;
  const body = new URLSearchParams({ secret, response: token });
  if (opts.remoteIp) body.set("remoteip", opts.remoteIp);

  try {
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body });
    const data: { success?: boolean; score?: number; action?: string } = await res.json();
    if (!data.success) return false;

    // Real v3 keys always return both; the test key pair returns neither
    // (see comment above) — so only enforce them when Google actually sent
    // them, rather than treating their absence as a failure.
    if (typeof data.score === "number" && data.score < (opts.minScore ?? DEFAULT_MIN_SCORE)) return false;
    if (opts.expectedAction && data.action && data.action !== opts.expectedAction) return false;

    return true;
  } catch {
    return false;
  }
}
