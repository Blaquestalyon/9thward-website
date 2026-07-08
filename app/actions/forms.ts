"use server";

/**
 * All form server actions live here.
 *
 * Each action:
 *  1. Reads FormData, checks the honeypot (silently succeeds if filled).
 *  2. Rate-limits by client IP + form name (in-memory; single-instance only).
 *  3. Validates with Zod (returns inline field errors on failure, preserving
 *     the user's input — the client keeps its own state).
 *  4. Writes to Airtable.
 *  5. Sends a Resend notification if configured (never fails the user if not).
 *
 * Uses the useFormState signature: (prevState, formData) => FormState.
 *
 * IMPORTANT: In a `"use server"` file, EVERY export must be a top-level
 * `export async function foo(...)` declaration — Next.js will not treat
 * `export const foo = <expr>` as a server action, and importing it from a
 * client component crashes at runtime. Do not refactor these back into a
 * `guarded(name, impl)` wrapper — inline the try/catch instead.
 */

import { headers } from "next/headers";
import {
  bookingSchema,
  contactSchema,
  initialFormState,
  isHoneypotFilled,
  newsletterSchema,
  serviceInquirySchema,
  submissionSchema,
  zodErrors,
  type FormState,
} from "@/lib/validation/schemas";
import {
  createBookingRequest,
  createContactMessage,
  createNewsletterSignup,
  createServiceInquiry,
  createSubmission,
} from "@/lib/airtable/write";
import { sendNotification } from "@/lib/email/resend";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

async function clientKey(form: string): Promise<string> {
  const h = await headers();
  return `${form}:${getClientIp(h)}`;
}

const RATE_LIMITED: FormState = {
  status: "error",
  message: "You're going a little fast. Please wait a minute and try again.",
};

const WRITE_FAILED: FormState = {
  status: "error",
  message:
    "Something went wrong saving your message. Please try again shortly, or email us directly.",
};

const UNEXPECTED: FormState = {
  status: "error",
  message:
    "Something went wrong on our end. Please try again shortly, or email us directly.",
};

const s = (v: FormDataEntryValue | null): string =>
  typeof v === "string" ? v : "";

// ─────────────────────────────────────────────────────────────
// SUBMISSIONS  (/submit)
// ─────────────────────────────────────────────────────────────
export async function submitMusicAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    if (isHoneypotFilled(s(formData.get("hp_field")))) {
      return { status: "success", message: "Thanks — we got your submission." };
    }
    const rl = rateLimit(await clientKey("submit"));
    if (!rl.ok) return RATE_LIMITED;

    const parsed = submissionSchema.safeParse({
      artistBandName: s(formData.get("artistBandName")),
      contactName: s(formData.get("contactName")),
      email: s(formData.get("email")),
      phone: s(formData.get("phone")),
      genre: s(formData.get("genre")),
      city: s(formData.get("city")),
      musicLink: s(formData.get("musicLink")),
      socialLinks: s(formData.get("socialLinks")),
      message: s(formData.get("message")),
      hp_field: s(formData.get("hp_field")),
    });
    if (!parsed.success) {
      return { status: "error", errors: zodErrors(parsed.error), message: "Please fix the highlighted fields." };
    }

    const d = parsed.data;
    const id = await createSubmission(d);
    if (!id) return WRITE_FAILED;

    await sendNotification({
      subject: "Artist Submission",
      replyTo: d.email,
      fields: [
        ["Artist / Band", d.artistBandName],
        ["Contact", d.contactName],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Genre", d.genre],
        ["City", d.city],
        ["Music Link", d.musicLink],
        ["Socials", d.socialLinks],
        ["Message", d.message],
      ],
    });

    return {
      status: "success",
      message: "Thanks — your music is in. We listen to everything and reach out when there's a fit.",
    };
  } catch (err) {
    console.error("[forms:submit] threw:", err);
    return UNEXPECTED;
  }
}

// ─────────────────────────────────────────────────────────────
// CONTACT  (/contact)
// ─────────────────────────────────────────────────────────────
export async function contactAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    if (isHoneypotFilled(s(formData.get("hp_field")))) {
      return { status: "success", message: "Thanks — we'll be in touch." };
    }
    const rl = rateLimit(await clientKey("contact"));
    if (!rl.ok) return RATE_LIMITED;

    const parsed = contactSchema.safeParse({
      name: s(formData.get("name")),
      email: s(formData.get("email")),
      subject: s(formData.get("subject")),
      message: s(formData.get("message")),
      hp_field: s(formData.get("hp_field")),
    });
    if (!parsed.success) {
      return { status: "error", errors: zodErrors(parsed.error), message: "Please fix the highlighted fields." };
    }

    const d = parsed.data;
    const id = await createContactMessage(d);
    if (!id) return WRITE_FAILED;

    await sendNotification({
      subject: "Contact Message",
      replyTo: d.email,
      fields: [
        ["Name", d.name],
        ["Email", d.email],
        ["Subject", d.subject],
        ["Message", d.message],
      ],
    });

    return { status: "success", message: "Thanks for reaching out — we'll get back to you soon." };
  } catch (err) {
    console.error("[forms:contact] threw:", err);
    return UNEXPECTED;
  }
}

// ─────────────────────────────────────────────────────────────
// BOOKING  (/events + /contact)
// ─────────────────────────────────────────────────────────────
export async function bookingAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    if (isHoneypotFilled(s(formData.get("hp_field")))) {
      return { status: "success", message: "Thanks — your booking request is in." };
    }
    const rl = rateLimit(await clientKey("booking"));
    if (!rl.ok) return RATE_LIMITED;

    const parsed = bookingSchema.safeParse({
      name: s(formData.get("name")),
      email: s(formData.get("email")),
      phone: s(formData.get("phone")),
      artistRequested: s(formData.get("artistRequested")),
      eventDate: s(formData.get("eventDate")),
      venueCity: s(formData.get("venueCity")),
      budget: s(formData.get("budget")),
      details: s(formData.get("details")),
      hp_field: s(formData.get("hp_field")),
    });
    if (!parsed.success) {
      return { status: "error", errors: zodErrors(parsed.error), message: "Please fix the highlighted fields." };
    }

    const d = parsed.data;
    const id = await createBookingRequest(d);
    if (!id) return WRITE_FAILED;

    await sendNotification({
      subject: "Booking Request",
      replyTo: d.email,
      fields: [
        ["Name", d.name],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Artist Requested", d.artistRequested],
        ["Event Date", d.eventDate],
        ["Venue / City", d.venueCity],
        ["Budget", d.budget],
        ["Details", d.details],
      ],
    });

    return { status: "success", message: "Booking request received — we'll follow up to lock in details." };
  } catch (err) {
    console.error("[forms:booking] threw:", err);
    return UNEXPECTED;
  }
}

// ─────────────────────────────────────────────────────────────
// SERVICE INQUIRY  (/services modal)
// ─────────────────────────────────────────────────────────────
export async function serviceInquiryAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    if (isHoneypotFilled(s(formData.get("hp_field")))) {
      return { status: "success", message: "Thanks — your inquiry is in." };
    }
    const rl = rateLimit(await clientKey("service"));
    if (!rl.ok) return RATE_LIMITED;

    const parsed = serviceInquirySchema.safeParse({
      name: s(formData.get("name")),
      email: s(formData.get("email")),
      phone: s(formData.get("phone")),
      serviceInterestedIn: s(formData.get("serviceInterestedIn")),
      artistProject: s(formData.get("artistProject")),
      details: s(formData.get("details")),
      hp_field: s(formData.get("hp_field")),
    });
    if (!parsed.success) {
      return { status: "error", errors: zodErrors(parsed.error), message: "Please fix the highlighted fields." };
    }

    const d = parsed.data;
    const id = await createServiceInquiry(d);
    if (!id) return WRITE_FAILED;

    await sendNotification({
      subject: `Service Inquiry — ${d.serviceInterestedIn}`,
      replyTo: d.email,
      fields: [
        ["Name", d.name],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Service", d.serviceInterestedIn],
        ["Artist / Project", d.artistProject],
        ["Details", d.details],
      ],
    });

    return { status: "success", message: "Inquiry received — we'll reach out to start the conversation." };
  } catch (err) {
    console.error("[forms:service] threw:", err);
    return UNEXPECTED;
  }
}

// ─────────────────────────────────────────────────────────────
// NEWSLETTER  (footer)
// ─────────────────────────────────────────────────────────────
export async function newsletterAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    if (isHoneypotFilled(s(formData.get("hp_field")))) {
      return { status: "success", message: "You're on the list." };
    }
    const rl = rateLimit(await clientKey("newsletter"));
    if (!rl.ok) return RATE_LIMITED;

    const parsed = newsletterSchema.safeParse({
      email: s(formData.get("email")),
      hp_field: s(formData.get("hp_field")),
    });
    if (!parsed.success) {
      return { status: "error", errors: zodErrors(parsed.error), message: "Enter a valid email." };
    }

    const id = await createNewsletterSignup({ email: parsed.data.email });
    if (!id) return WRITE_FAILED;

    return { status: "success", message: "You're on the list — thanks!" };
  } catch (err) {
    console.error("[forms:newsletter] threw:", err);
    return UNEXPECTED;
  }
}

// `initialFormState` is a plain constant object — it must be re-exported via
// a wrapper function because "use server" files cannot export non-function
// values. Client components import it from `@/lib/validation/schemas` directly.
