import crypto from "node:crypto";

// PayU's hosted-checkout POST target — no test/production toggle exists on
// the merchant key itself, so PAYU_MODE picks which one we submit to.
export const PAYU_TEST_ACTION_URL = "https://test.payu.in/_payment";
export const PAYU_PRODUCTION_ACTION_URL = "https://secure.payu.in/_payment";

export function getPayuConfig() {
  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_SALT;
  const mode = process.env.PAYU_MODE === "production" ? "production" : "test";
  const actionUrl = mode === "production" ? PAYU_PRODUCTION_ACTION_URL : PAYU_TEST_ACTION_URL;
  return { key, salt, mode, actionUrl } as const;
}

type RequestHashParams = {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  salt: string;
};

// Field order is fixed by PayU's spec, confirmed against
// https://docs.payu.in/docs/hashing-request-and-response (fetched 2026-09,
// not reconstructed from memory — a wrong field order here silently produces
// a hash PayU rejects, or worse, one it doesn't). Do not reorder without
// re-checking that page.
export function computeRequestHash({
  key,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = "",
  salt,
}: RequestHashParams): string {
  const raw = [key, txnid, amount, productinfo, firstname, email, udf1, udf2, udf3, udf4, udf5, "", "", "", "", "", salt].join(
    "|"
  );
  return crypto.createHash("sha512").update(raw).digest("hex");
}

type ResponseHashParams = {
  salt: string;
  status: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  email: string;
  firstname: string;
  productinfo: string;
  amount: string;
  txnid: string;
  key: string;
};

// Reverse of the request hash — PayU signs its surl/furl callback with the
// same fields in reverse order, salt-first. Verifying this is what stops a
// forged POST to our callback route from being trusted as a real payment.
export function computeResponseHash({
  salt,
  status,
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = "",
  email,
  firstname,
  productinfo,
  amount,
  txnid,
  key,
}: ResponseHashParams): string {
  const raw = [
    salt,
    status,
    "",
    "",
    "",
    "",
    "",
    udf5,
    udf4,
    udf3,
    udf2,
    udf1,
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key,
  ].join("|");
  return crypto.createHash("sha512").update(raw).digest("hex");
}
