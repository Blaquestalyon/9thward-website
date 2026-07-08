/**
 * Airtable writers for the 5 intake tables.
 *
 * Each writer:
 *  - is called ONLY from server actions (never the browser)
 *  - stamps Submitted At = current ISO timestamp, Status = "New",
 *    Source = "website"
 *  - returns the created record id or null (never throws)
 */

import "server-only";
import { createRecord, createRecordDetailed, type CreateResult } from "./client";
import { TABLES, FIELDS } from "./config";
import type {
  BookingRequestPayload,
  ContactMessagePayload,
  NewsletterSignupPayload,
  ServiceInquiryPayload,
} from "./types";

const now = () => new Date().toISOString();
const SOURCE = "website";
const NEW = "New";

/** Drop undefined/empty values so we never send blank fields to Airtable. */
function clean(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out;
}

// NOTE: `createSubmission` (writing to the `Submissions` table) was removed
// when /submit was migrated to an Airtable-hosted form that writes directly
// to the `Artists` table. The Submissions table is preserved in Airtable
// for archival. Restore this writer + `SubmissionPayload` from git history
// if a separate demo-intake queue is ever needed again.

export async function createBookingRequest(
  p: BookingRequestPayload
): Promise<string | null> {
  const F = FIELDS.BookingRequests;
  return createRecord(
    TABLES.BookingRequests,
    clean({
      [F.Name]: p.name,
      [F.Email]: p.email,
      [F.Phone]: p.phone,
      [F.ArtistRequested]: p.artistRequested,
      [F.EventDate]: p.eventDate,
      [F.VenueCity]: p.venueCity,
      [F.Budget]: p.budget,
      [F.Details]: p.details,
      [F.SubmittedAt]: now(),
      [F.Source]: SOURCE,
      [F.Status]: NEW,
    })
  );
}

export async function createServiceInquiry(
  p: ServiceInquiryPayload
): Promise<string | null> {
  const F = FIELDS.ServiceInquiries;
  return createRecord(
    TABLES.ServiceInquiries,
    clean({
      [F.Name]: p.name,
      [F.Email]: p.email,
      [F.Phone]: p.phone,
      [F.ServiceInterestedIn]: p.serviceInterestedIn,
      [F.ArtistProject]: p.artistProject,
      [F.Details]: p.details,
      [F.SubmittedAt]: now(),
      [F.Source]: SOURCE,
      [F.Status]: NEW,
    })
  );
}

export async function createContactMessage(
  p: ContactMessagePayload
): Promise<string | null> {
  const F = FIELDS.ContactMessages;
  return createRecord(
    TABLES.ContactMessages,
    clean({
      [F.Name]: p.name,
      [F.Email]: p.email,
      [F.Subject]: p.subject,
      [F.Message]: p.message,
      [F.SubmittedAt]: now(),
      [F.Source]: SOURCE,
      [F.Status]: NEW,
    })
  );
}

/** Debug variant that returns the detailed failure reason. */
export async function createContactMessageDetailed(
  p: ContactMessagePayload
): Promise<CreateResult> {
  const F = FIELDS.ContactMessages;
  return createRecordDetailed(
    TABLES.ContactMessages,
    clean({
      [F.Name]: p.name,
      [F.Email]: p.email,
      [F.Subject]: p.subject,
      [F.Message]: p.message,
      [F.SubmittedAt]: now(),
      [F.Source]: SOURCE,
      [F.Status]: NEW,
    })
  );
}

export async function createNewsletterSignup(
  p: NewsletterSignupPayload
): Promise<string | null> {
  const F = FIELDS.NewsletterSignups;
  return createRecord(
    TABLES.NewsletterSignups,
    clean({
      [F.Email]: p.email,
      [F.Source]: SOURCE,
      [F.SubmittedAt]: now(),
    })
  );
}
