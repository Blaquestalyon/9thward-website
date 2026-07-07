/**
 * Optional email notifications via Resend.
 *
 * Degrades gracefully: if RESEND_API_KEY or NOTIFICATION_EMAIL is not set, the
 * notify* helpers no-op and return false. Form submissions must NEVER fail
 * because email is unconfigured.
 */

import "server-only";
import { Resend } from "resend";

function getClient(): { resend: Resend; to: string; from: string } | null {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!key || !to) return null;
  const from = process.env.RESEND_FROM_EMAIL || "9th Ward <onboarding@resend.dev>";
  return { resend: new Resend(key), to, from };
}

export function isEmailConfigured(): boolean {
  return getClient() !== null;
}

interface NotifyArgs {
  subject: string;
  /** Ordered key/value pairs rendered into the email body. */
  fields: Array<[string, string | undefined]>;
  replyTo?: string;
}

/**
 * Send a submission-notification email to the label. Returns true on success,
 * false if unconfigured or on error (errors are swallowed & logged).
 */
export async function sendNotification({
  subject,
  fields,
  replyTo,
}: NotifyArgs): Promise<boolean> {
  const client = getClient();
  if (!client) return false;

  const rows = fields
    .filter(([, v]) => v && v.trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#555;vertical-align:top">${escape(
          k
        )}</td><td style="padding:4px 0;color:#111">${escape(v!).replace(
          /\n/g,
          "<br>"
        )}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#6d28d9;margin:0 0 4px">9th Ward — New ${escape(subject)}</h2>
      <p style="color:#777;margin:0 0 16px;font-size:13px">Received ${new Date().toLocaleString(
        "en-US"
      )}</p>
      <table style="border-collapse:collapse;font-size:14px">${rows}</table>
    </div>`;

  try {
    await client.resend.emails.send({
      from: client.from,
      to: client.to,
      subject: `[9th Ward] New ${subject}`,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    return true;
  } catch (err) {
    console.error("[resend] send failed:", err);
    return false;
  }
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
