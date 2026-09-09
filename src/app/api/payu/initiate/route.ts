import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAllProgramsMeta } from "@/lib/content";
import { validateDonationFields } from "@/lib/donationValidation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { computeRequestHash, getPayuConfig } from "@/lib/payu";
import { appendDonationRow } from "@/lib/googleSheets";

export const runtime = "nodejs";

// Re-validates and re-signs a donation submitted by DonateForm.tsx before
// handing it to PayU's hosted checkout. Everything here must be re-checked
// server-side even though the browser form already validated it — this
// endpoint is a public POST target, reachable directly by anything that
// wants to skip the form (and the captcha check below exists specifically
// because the current WordPress site is already spam-compromised; see
// docs/progress-log.md).
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const get = (name: string) => String(formData.get(name) ?? "").trim();

  const amount = Number(get("amount"));
  const cause = get("cause") || "general";
  const otherCause = get("otherCause");
  const fullName = get("fullName");
  const email = get("email");
  const phone = get("phone");
  const address = get("address");
  const pan = get("pan");
  const captchaResponse = get("g-recaptcha-response");

  const fieldErrors = validateDonationFields({ amount, cause, otherCause, fullName, email, phone, address, pan });
  if (Object.keys(fieldErrors).length > 0) {
    return errorPage("Check your details", "Some fields were missing or invalid. Please go back and try again.");
  }

  const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const captchaOk = await verifyRecaptcha(captchaResponse, { remoteIp, expectedAction: "donate" });
  if (!captchaOk) {
    return errorPage(
      "Verification failed",
      "We couldn't confirm you're not a bot. Please go back and try the verification challenge again."
    );
  }

  const { key, salt, actionUrl } = getPayuConfig();
  if (!key || !salt) {
    return errorPage(
      "Payment gateway not configured",
      "PayU credentials (PAYU_MERCHANT_KEY / PAYU_SALT) aren't set for this environment yet — see docs/dev-backlog.md #13."
    );
  }

  const causeLabel = resolveCauseLabel(cause, otherCause);
  const txnid = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  const amountStr = amount.toFixed(2);
  const productinfo = `Donation - ${causeLabel}`;
  const { origin } = new URL(request.url);
  const callbackUrl = `${origin}/api/payu/callback/`;

  const hash = computeRequestHash({
    key,
    txnid,
    amount: amountStr,
    productinfo,
    firstname: fullName,
    email,
    udf1: pan,
    salt,
  });

  const fields: Record<string, string> = {
    key,
    txnid,
    amount: amountStr,
    productinfo,
    firstname: fullName,
    email,
    phone,
    address1: address,
    udf1: pan,
    surl: callbackUrl,
    furl: callbackUrl,
    hash,
  };

  // Fire-and-forget-ish: awaited so errors surface in server logs, but its
  // return value is never checked against the redirect — a spreadsheet
  // outage must not stop a donor from reaching PayU.
  await appendDonationRow({
    txnid,
    status: "initiated",
    amount: amountStr,
    cause: causeLabel,
    fullName,
    email,
    phone,
    address,
    pan,
  });

  return new NextResponse(renderAutoSubmitForm(actionUrl, fields), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

function resolveCauseLabel(cause: string, otherCause: string): string {
  if (cause === "general") return "General Fund";
  if (cause === "other") return otherCause || "Other";
  const match = getAllProgramsMeta().find((p) => p.slug === cause);
  return match?.title ?? "General Fund";
}

function renderAutoSubmitForm(actionUrl: string, fields: Record<string, string>): string {
  const inputs = Object.entries(fields)
    .map(([name, value]) => `<input type="hidden" name="${escapeAttr(name)}" value="${escapeAttr(value)}" />`)
    .join("\n      ");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to PayU&hellip;</title>
  </head>
  <body>
    <p>Redirecting to the secure payment page&hellip;</p>
    <form id="payu-redirect" method="POST" action="${escapeAttr(actionUrl)}">
      ${inputs}
    </form>
    <script>document.getElementById("payu-redirect").submit();</script>
  </body>
</html>`;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function errorPage(title: string, message: string): NextResponse {
  return new NextResponse(
    `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>${escapeAttr(title)}</title></head>
  <body style="font-family: system-ui, sans-serif; max-width: 32rem; margin: 4rem auto; padding: 0 1.5rem;">
    <h1>${escapeAttr(title)}</h1>
    <p>${escapeAttr(message)}</p>
    <p><a href="/donate/">&larr; Back to Donate</a></p>
  </body>
</html>`,
    { status: 400, headers: { "Content-Type": "text/html" } }
  );
}
