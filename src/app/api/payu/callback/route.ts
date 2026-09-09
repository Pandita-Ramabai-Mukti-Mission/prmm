import { NextRequest, NextResponse } from "next/server";
import { computeResponseHash, getPayuConfig } from "@/lib/payu";
import { updateDonationStatus } from "@/lib/googleSheets";

export const runtime = "nodejs";

// PayU POSTs here for both surl and furl (see DonateForm.tsx's initiate
// route) — the `status` field, not which URL was hit, is what distinguishes
// success from failure. The donation row itself was already written by
// /api/payu/initiate (that's the only point with donor-submitted fields
// like phone/address that aren't part of PayU's signed hash); this route
// only verifies the payment and reconciles that row's status — see
// docs/dev-backlog.md #14 for what's still not built (real receipting).
export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  const formData = await request.formData();
  const get = (name: string) => String(formData.get(name) ?? "");

  const status = get("status");
  const txnid = get("txnid");
  const amount = get("amount");
  const productinfo = get("productinfo");
  const firstname = get("firstname");
  const email = get("email");
  const udf1 = get("udf1");
  const receivedHash = get("hash");
  const mihpayid = get("mihpayid");

  const { key, salt } = getPayuConfig();
  if (!key || !salt) {
    return NextResponse.redirect(`${origin}/donate/thank-you/?status=error&reason=not_configured`);
  }

  const expectedHash = computeResponseHash({ salt, status, udf1, email, firstname, productinfo, amount, txnid, key });

  // A mismatch means either the payload was tampered with in transit, or it
  // didn't actually come from PayU — treat it as untrusted regardless of
  // what `status` claims.
  if (expectedHash !== receivedHash) {
    return NextResponse.redirect(`${origin}/donate/thank-you/?status=error&reason=hash_mismatch`);
  }

  const outcome = status === "success" ? "success" : "failure";
  await updateDonationStatus(txnid, outcome, mihpayid || undefined);

  const params = new URLSearchParams({ status: outcome, txnid, amount });
  return NextResponse.redirect(`${origin}/donate/thank-you/?${params.toString()}`);
}
