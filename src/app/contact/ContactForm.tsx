"use client";

import { useState } from "react";
import { CONTACT_LIMITS, validateContactFields, type ContactFieldErrors } from "@/lib/contactValidation";
import { useRecaptchaToken } from "@/lib/recaptchaClient";
import { RecaptchaAttribution } from "@/components/RecaptchaAttribution";

const RECAPTCHA_ACTION = "contact";

const LABEL_CLASS = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-ink-soft";
const inputClass = (error?: string) =>
  `w-full rounded-md border px-3.5 py-2.5 text-sm text-ink ${error ? "border-red-400" : "border-black/15"}`;

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
      {error}
    </p>
  );
}

export function ContactForm({ interest }: { interest?: string }) {
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const getRecaptchaToken = useRecaptchaToken();

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const a11y = (id: string, error?: string) => ({
    id,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const nextErrors = validateContactFields(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    try {
      const captchaToken = await getRecaptchaToken(RECAPTCHA_ACTION);
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, interest, captchaToken }),
      });
      const data: { ok?: boolean; error?: string; fieldErrors?: ContactFieldErrors } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setFormError(data.error || "Sorry, your message couldn't be sent. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setFormError("Verification failed. Please refresh the page and try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex-1 rounded-lg border border-black/10 bg-white shadow-md p-6" role="status">
        <h2 className="text-lg">Thank you</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Your message has been sent to our team. We&apos;ll reply to <strong>{values.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex-1 rounded-lg border border-black/10 bg-white shadow-md p-6">
      <h2 className="text-lg">Send a Message</h2>
      <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-first-name" className={LABEL_CLASS}>
            First name
          </label>
          <input
            {...a11y("contact-first-name", errors.firstName)}
            autoComplete="given-name"
            maxLength={CONTACT_LIMITS.name}
            value={values.firstName}
            onChange={set("firstName")}
            className={inputClass(errors.firstName)}
          />
          <FieldError id="contact-first-name" error={errors.firstName} />
        </div>
        <div>
          <label htmlFor="contact-last-name" className={LABEL_CLASS}>
            Last name
          </label>
          <input
            {...a11y("contact-last-name", errors.lastName)}
            autoComplete="family-name"
            maxLength={CONTACT_LIMITS.name}
            value={values.lastName}
            onChange={set("lastName")}
            className={inputClass(errors.lastName)}
          />
          <FieldError id="contact-last-name" error={errors.lastName} />
        </div>
      </div>
      <div className="mt-3.5">
        <label htmlFor="contact-email" className={LABEL_CLASS}>
          Email
        </label>
        <input
          {...a11y("contact-email", errors.email)}
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          className={inputClass(errors.email)}
        />
        <FieldError id="contact-email" error={errors.email} />
      </div>
      <div className="mt-3.5">
        <label htmlFor="contact-subject" className={LABEL_CLASS}>
          Subject
        </label>
        <input
          {...a11y("contact-subject", errors.subject)}
          maxLength={CONTACT_LIMITS.subject}
          value={values.subject}
          onChange={set("subject")}
          className={inputClass(errors.subject)}
        />
        <FieldError id="contact-subject" error={errors.subject} />
      </div>
      <div className="mt-3.5">
        <label htmlFor="contact-message" className={LABEL_CLASS}>
          Message
        </label>
        <textarea
          {...a11y("contact-message", errors.message)}
          rows={5}
          maxLength={CONTACT_LIMITS.message}
          value={values.message}
          onChange={set("message")}
          className={inputClass(errors.message)}
        />
        <FieldError id="contact-message" error={errors.message} />
      </div>

      {formError && (
        <p className="mt-3 text-xs text-red-600" role="alert">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 rounded-md bg-coral px-6 py-3 text-sm font-semibold text-white hover:bg-coral-dark disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
      <RecaptchaAttribution className="mt-3 text-[11px] text-ink-soft" />
    </form>
  );
}
