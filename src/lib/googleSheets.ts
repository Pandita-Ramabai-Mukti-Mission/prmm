import { JWT } from "google-auth-library";

// Donation record-keeping, not the payment flow itself — see
// docs/dev-backlog.md #14. Every function here fails closed and quiet
// (returns false, logs server-side) rather than throwing: a spreadsheet
// outage must never block a donor's actual payment, which PayU has
// already processed by the time any of this runs.
//
// Sheet layout (row 1 = header, created once by hand in the spreadsheet):
// A Timestamp | B TxnId | C Status | D Amount | E Cause | F FullName |
// G Email | H Phone | I Address | J PAN | K PayU Reference (mihpayid)
const SHEET_NAME = "Donations";
const APPEND_RANGE = `${SHEET_NAME}!A:J`;
const TXNID_COLUMN_RANGE = `${SHEET_NAME}!B:B`;

function getSheetsConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  // Env vars can't hold real newlines — the private key is stored with
  // literal "\n" escapes and unescaped here.
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!spreadsheetId || !clientEmail || !privateKey) return null;
  return { spreadsheetId, clientEmail, privateKey };
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string | null> {
  try {
    const jwt = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const { token } = await jwt.getAccessToken();
    return token ?? null;
  } catch (err) {
    console.error("[googleSheets] failed to obtain access token", err);
    return null;
  }
}

export type DonationRow = {
  txnid: string;
  status: string;
  amount: string;
  cause: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  pan: string;
};

// Called from /api/payu/initiate right before redirecting to PayU — this is
// the only point where we hold donor-submitted fields (phone, address) that
// are both fully validated and not yet subject to PayU's hash-verification
// boundary. Logs an "initiated" row; updateDonationStatus below reconciles
// it once PayU's signed callback confirms an outcome.
export async function appendDonationRow(row: DonationRow): Promise<boolean> {
  const config = getSheetsConfig();
  if (!config) return false;

  const token = await getAccessToken(config.clientEmail, config.privateKey);
  if (!token) return false;

  const values = [
    [
      new Date().toISOString(),
      row.txnid,
      row.status,
      row.amount,
      row.cause,
      row.fullName,
      row.email,
      row.phone,
      row.address,
      row.pan,
    ],
  ];

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${encodeURIComponent(
      APPEND_RANGE
    )}:append?valueInputOption=USER_ENTERED`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    });
    if (!res.ok) {
      console.error("[googleSheets] append failed", res.status, await res.text());
    }
    return res.ok;
  } catch (err) {
    console.error("[googleSheets] append threw", err);
    return false;
  }
}

// Called from /api/payu/callback after the response hash has been verified
// — only `status` (and optionally PayU's own mihpayid) are trustworthy at
// this point, so that's all this updates. Locates the row by scanning
// column B for txnid; fine at NGO donation volumes, not built for scale.
export async function updateDonationStatus(
  txnid: string,
  status: string,
  payuReference?: string
): Promise<boolean> {
  const config = getSheetsConfig();
  if (!config) return false;

  const token = await getAccessToken(config.clientEmail, config.privateKey);
  if (!token) return false;

  try {
    const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${encodeURIComponent(
      TXNID_COLUMN_RANGE
    )}`;
    const readRes = await fetch(readUrl, { headers: { Authorization: `Bearer ${token}` } });
    if (!readRes.ok) {
      console.error("[googleSheets] txnid lookup failed", readRes.status, await readRes.text());
      return false;
    }
    const data: { values?: string[][] } = await readRes.json();
    const rows = data.values ?? [];
    const rowIndex = rows.findIndex((r) => r[0] === txnid);
    if (rowIndex === -1) {
      console.error("[googleSheets] no row found for txnid", txnid);
      return false;
    }
    const sheetRow = rowIndex + 1; // API rows are 1-indexed and this range starts at row 1.

    const updates = [{ range: `${SHEET_NAME}!C${sheetRow}`, values: [[status]] }];
    if (payuReference) {
      updates.push({ range: `${SHEET_NAME}!K${sheetRow}`, values: [[payuReference]] });
    }

    const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values:batchUpdate`;
    const res = await fetch(batchUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ valueInputOption: "USER_ENTERED", data: updates }),
    });
    if (!res.ok) {
      console.error("[googleSheets] status update failed", res.status, await res.text());
    }
    return res.ok;
  } catch (err) {
    console.error("[googleSheets] update threw", err);
    return false;
  }
}
