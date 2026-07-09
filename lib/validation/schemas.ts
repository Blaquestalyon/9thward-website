import { z } from "zod";

/**
 * Zod schemas for every intake form. Shared by client (react-hook-form/inline
 * errors) and server actions (authoritative validation).
 *
 * Each schema includes a honeypot field `hp_field` — if it is filled, a bot
 * likely submitted the form. Server actions silently succeed but skip writes.
 */

const email = z.string().trim().email("Enter a valid email address.");
const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid URL (including https://).")
  .optional()
  .or(z.literal(""));
const requiredUrl = z
  .string()
  .trim()
  .min(1, "A link to your music is required.")
  .url("Enter a valid URL (including https://).");

const honeypot = z.string().optional();

// ── /submit ──
export const submissionSchema = z.object({
  artistBandName: z.string().trim().min(1, "Artist or band name is required.").max(120),
  contactName: z.string().trim().min(1, "Your name is required.").max(120),
  email,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  genre: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  musicLink: requiredUrl,
  socialLinks: z.string().trim().max(500).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  hp_field: honeypot,
});
export type SubmissionInput = z.infer<typeof submissionSchema>;

// ── /contact (general) ──
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Your name is required.").max(120),
  email,
  subject: z.string().trim().min(1, "A subject is required.").max(160),
  message: z.string().trim().min(1, "Please include a message.").max(2000),
  hp_field: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

// ── booking (events + contact) ──
export const bookingSchema = z.object({
  name: z.string().trim().min(1, "Your name is required.").max(120),
  email,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  artistRequested: z.string().trim().max(160).optional().or(z.literal("")),
  eventDate: z.string().trim().max(60).optional().or(z.literal("")),
  venueCity: z.string().trim().max(200).optional().or(z.literal("")),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  details: z.string().trim().max(2000).optional().or(z.literal("")),
  hp_field: honeypot,
});
export type BookingInput = z.infer<typeof bookingSchema>;

// ── service inquiry (services modal) ──
export const serviceInquirySchema = z.object({
  name: z.string().trim().min(1, "Your name is required.").max(120),
  email,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  serviceInterestedIn: z.enum(["Production", "Management", "Promotion"], {
    errorMap: () => ({ message: "Choose a service." }),
  }),
  artistProject: z.string().trim().max(160).optional().or(z.literal("")),
  details: z.string().trim().max(2000).optional().or(z.literal("")),
  hp_field: honeypot,
});
export type ServiceInquiryInput = z.infer<typeof serviceInquirySchema>;

// ── newsletter (footer) ──
export const newsletterSchema = z.object({
  email,
  hp_field: honeypot,
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** Shared server-action result shape used by all forms. */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** field -> first error message */
  errors?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };

/** Flatten a ZodError into a field->message map. */
export function zodErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** True if the honeypot was filled — treat as a bot. */
export function isHoneypotFilled(hp?: string | null): boolean {
  return typeof hp === "string" && hp.trim().length > 0;
}
