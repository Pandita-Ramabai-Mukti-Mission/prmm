import { NextRequest, NextResponse } from "next/server";
import { validateContactFields } from "@/lib/contactValidation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendTemplateEmail } from "@/lib/msg91";
import { getHeadquartersContact } from "@/lib/content";

export const runtime = "nodejs";

// Receives ContactForm.tsx submissions (JSON), re-validates them, checks
// reCAPTCHA, then emails the message to the mission via MSG91. A public
// POST target like /api/payu/initiate, so nothing from the browser is
// trusted until it's re-checked here.
export async function POST(request: NextRequest) {
  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const get = (name: string) => (typeof raw[name] === "string" ? (raw[name] as string).trim() : "");

  const fields = {
    firstName: get("firstName"),
    lastName: get("lastName"),
    email: get("email"),
    subject: get("subject"),
    message: get("message"),
  };
  const interest = get("interest") === "volunteer" ? "volunteer" : "";

  const fieldErrors = validateContactFields(fields);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: "Some fields were missing or invalid.", fieldErrors }, { status: 400 });
  }

  const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const captchaOk = await verifyRecaptcha(get("captchaToken"), { remoteIp, expectedAction: "contact" });
  if (!captchaOk) {
    return NextResponse.json(
      { error: "We couldn't confirm you're not a bot. Please refresh the page and try again." },
      { status: 400 }
    );
  }

  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || getHeadquartersContact()?.email;
  if (!notifyTo) {
    console.error("[contact] No recipient: set CONTACT_NOTIFY_EMAIL or a headquarters email in the CMS.");
    return NextResponse.json({ error: "The contact form isn't set up yet. Please email us directly." }, { status: 503 });
  }

  const name = [fields.firstName, fields.lastName].filter(Boolean).join(" ");
  const subject = interest === "volunteer" ? `[Volunteer] ${fields.subject}` : fields.subject;

  // The mission's copy is the one that matters — if it fails, the visitor's
  // message would be silently lost, so surface the error to them.
  const notify = await sendTemplateEmail({
    to: [{ email: notifyTo }],
    templateId: process.env.MSG91_CONTACT_TEMPLATE_ID,
    // Keys must match the {{placeholders}} in the approved MSG91 template
    // "contact_form_submission_email".
    variables: {
      first_name: fields.firstName,
      last_name: fields.lastName || "-",
      name,
      email: fields.email,
      subject,
      message: fields.message,
    },
  });
  if (!notify.ok) {
    console.error("[contact] notification email failed:", notify.error);
    return NextResponse.json(
      { error: "Sorry, your message couldn't be sent right now. Please try again later or email us directly." },
      { status: 502 }
    );
  }

  // Deliberately no email to the visitor — only the mission is notified
  // (client requirement). The visitor's address is just a template variable
  // so the team can reply.
  return NextResponse.json({ ok: true });
}
