// Shared by ContactForm.tsx (instant client feedback) and /api/contact
// (authoritative check for requests that skip the browser) — same
// one-rule-set/two-callers pattern as donationValidation.ts.
import { EMAIL_RE } from "@/lib/donationValidation";

export type ContactFields = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactFieldErrors = Partial<Record<keyof ContactFields, string>>;

export const CONTACT_LIMITS = { name: 100, subject: 200, message: 5000 } as const;

export function validateContactFields(fields: ContactFields): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const firstName = fields.firstName.trim();
  const lastName = fields.lastName.trim();
  const email = fields.email.trim();
  const subject = fields.subject.trim();
  const message = fields.message.trim();

  if (!firstName) errors.firstName = "First name is required.";
  else if (firstName.length > CONTACT_LIMITS.name) errors.firstName = "First name is too long.";

  if (lastName.length > CONTACT_LIMITS.name) errors.lastName = "Last name is too long.";

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (!subject) errors.subject = "Subject is required.";
  else if (subject.length > CONTACT_LIMITS.subject) errors.subject = "Subject is too long.";

  if (!message) errors.message = "Message is required.";
  else if (message.length > CONTACT_LIMITS.message)
    errors.message = `Message must be under ${CONTACT_LIMITS.message} characters.`;

  return errors;
}
