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
import { createRecord } from "./client";
import { TABLES, FIELDS } from "./config";
import type {
  BookingRequestPayload,
  ContactMessagePayload,
  NewsletterSignupPayload,
  ServiceInquiryPayload,
  SubmissionPayload,
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

export async function createSubmission(p: SubmissionPayload): Promise<string | null> {
  const F = FIELDS.Submissions;
  return createRecord(
    TABLES.Submissions,
    clean({
      [F.ArtistBandName]: p.artistBandName,
      [F.ContactName]: p.contactName,
      [F.Email]: p.email,
      [F.Phone]: p.phone,
      [F.Genre]: p.genre,
      [F.City]: p.city,
      [F.MusicLink]: p.musicLink,
      [F.SocialLinks]: p.socialLinks,
      [F.Message]: p.message,
      [F.SubmittedAt]: now(),
      [F.Source]: SOURCE,
      [F.Status]: NEW,
    })
  );
}

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
