// Server-only wrapper around MSG91's transactional Email API. Every email
// this site sends goes through sendTemplateEmail() so the request shape
// lives in exactly one place.
//
// Request shape provenance (docs.msg91.com is a JS-rendered SPA that won't
// return content to automated fetches — see docs/dev-backlog.md #15):
//   - Endpoint, POST, `authkey` header, and per-recipient `variables`:
//     MSG91's own "Sending Emails Using Handlebars" doc (via search index).
//   - `recipients[].to[]`, `from`, `domain`, `template_id`: a public
//     third-party client (github.com/Paramj0t/msg91-services, EmailBuilder.ts).
// Before launch, compare this against the sample request the MSG91
// dashboard generates for the real template (Email → Templates → API) and
// adjust buildPayload() if anything differs.
//
// MSG91 email only sends via templates created in the dashboard; the
// `variables` object fills that template's {{placeholders}}. The variable
// names each caller uses are listed in .env.example next to its template ID.

const SEND_URL = "https://control.msg91.com/api/v5/email/send";

export type EmailRecipient = { email: string; name?: string };

export type SendResult = { ok: true } | { ok: false; error: string };

type SendArgs = {
  to: EmailRecipient[];
  templateId: string | undefined;
  variables: Record<string, string>;
};

export function isMsg91Configured(): boolean {
  return Boolean(process.env.MSG91_AUTH_KEY && process.env.MSG91_EMAIL_DOMAIN && process.env.MSG91_FROM_EMAIL);
}

function buildPayload({ to, templateId, variables }: SendArgs & { templateId: string }) {
  const fromName = process.env.MSG91_FROM_NAME;
  return {
    recipients: [{ to, variables }],
    from: fromName
      ? { email: process.env.MSG91_FROM_EMAIL, name: fromName }
      : { email: process.env.MSG91_FROM_EMAIL },
    domain: process.env.MSG91_EMAIL_DOMAIN,
    template_id: templateId,
  };
}

// Never throws: callers decide whether a failed email is fatal (contact
// form — the message would be lost) or best-effort (donation receipt — the
// payment already succeeded and the donor must still reach the thank-you page).
export async function sendTemplateEmail(args: SendArgs): Promise<SendResult> {
  const authKey = process.env.MSG91_AUTH_KEY;
  if (!isMsg91Configured() || !authKey) {
    return { ok: false, error: "MSG91 is not configured (MSG91_AUTH_KEY / MSG91_EMAIL_DOMAIN / MSG91_FROM_EMAIL)." };
  }
  if (!args.templateId) {
    return { ok: false, error: "MSG91 template ID is not set for this email." };
  }

  try {
    const res = await fetch(SEND_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authkey: authKey,
      },
      body: JSON.stringify(buildPayload({ ...args, templateId: args.templateId })),
    });

    const text = await res.text();
    // MSG91's response schema isn't verified (see header comment), so treat
    // anything other than a 2xx without an explicit failure marker as an error
    // and log the raw body for diagnosis.
    let body: { status?: string; hasError?: boolean } = {};
    try {
      body = JSON.parse(text);
    } catch {
      // Non-JSON body — rely on the HTTP status alone.
    }
    if (!res.ok || body.status === "fail" || body.hasError === true) {
      console.error(`[msg91] send failed (${res.status}): ${text}`);
      return { ok: false, error: `MSG91 responded ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[msg91] request error:", err);
    return { ok: false, error: "Could not reach MSG91." };
  }
}
