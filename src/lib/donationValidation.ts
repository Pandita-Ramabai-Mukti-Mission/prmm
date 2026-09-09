// Pure validation rules shared by the donate form (client-side, instant
// feedback) and the PayU initiate route (server-side, so a request that
// skips the browser entirely can't sneak an empty/malformed donation
// through). One set of rules, two callers — see PhotoBox.tsx for the same
// pattern applied to markup instead of logic.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\+?\d{7,15}$/;
export const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export type DonationFields = {
  amount: number;
  cause: string;
  otherCause: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  pan: string;
};

export type DonationFieldErrors = Partial<
  Record<"amount" | "otherCause" | "fullName" | "email" | "phone" | "address" | "pan", string>
>;

export function validateDonationFields(fields: DonationFields): DonationFieldErrors {
  const errors: DonationFieldErrors = {};

  if (!fields.amount || fields.amount < 1) {
    errors.amount = "Enter an amount greater than ₹0.";
  }
  if (fields.cause === "other" && !fields.otherCause.trim()) {
    errors.otherCause = "Tell us which cause this gift is for.";
  }
  if (!fields.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }
  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!fields.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_RE.test(fields.phone.trim().replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!fields.address.trim()) {
    errors.address = "Address is required.";
  }
  if (fields.pan.trim() && !PAN_RE.test(fields.pan.trim().toUpperCase())) {
    errors.pan = "PAN should look like ABCDE1234F.";
  }

  return errors;
}
