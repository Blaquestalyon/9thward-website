# Airtable Base Setup Guide

This guide walks you through building the Airtable base that powers the 9th Ward website from scratch. The site reads content from 5 tables and writes form submissions to 5 more. **Field names are a contract** — they must match exactly (case-sensitive, spaces included). If you ever rename a field, update the matching constant in `lib/airtable/config.ts` and nowhere else.

> Tip: create fields in the order listed. The **first** field in each table is its primary field.

---

## 0. Create the base

1. In Airtable, create a new base — call it something like **`9th Ward Site`**.
2. Delete the default `Table 1` after you've created the real tables (or rename it to the first one).

---

## READ TABLES (the site renders these)

### 1. `Artists`

| Field name       | Airtable field type                                             |
| ---------------- | --------------------------------------------------------------- |
| `Name`           | Single line text **(primary field)**                            |
| `Slug`           | Single line text — URL-safe, e.g. `dame-scott` (must be unique) |
| `Stage Name`     | Single line text                                                |
| `Bio`            | Long text                                                       |
| `Micro Tagline`  | Single line text — short hook shown under the name on cards     |
| `Genre`          | Single line text                                                |
| `Hometown`       | Single line text                                                |
| `Photo`          | Attachment                                                      |
| `Featured`       | Checkbox                                                        |
| `Sort Order`     | Number (integer)                                                |
| `Spotify URL`    | URL                                                             |
| `Apple Music URL`| URL                                                             |
| `SoundCloud URL` | URL                                                             |
| `YouTube URL`    | URL                                                             |
| `Instagram URL`  | URL                                                             |
| `Bandcamp URL`   | URL                                                             |
| `Booking Email`  | Email                                                           |
| `Status`         | Single select — options: **`Active`**, **`Inactive`**           |

> The site shows only `Status = Active`, sorted ascending by `Sort Order`. `Featured = true` artists surface on the home page.

### 2. `Releases`

| Field name       | Airtable field type                                                        |
| ---------------- | -------------------------------------------------------------------------- |
| `Title`          | Single line text **(primary field)**                                       |
| `Slug`           | Single line text — unique, URL-safe                                        |
| `Artist`         | **Link to another record → `Artists`** (allow linking to multiple)        |
| `Release Date`   | Date                                                                        |
| `Cover Art`      | Attachment                                                                  |
| `Type`           | Single select — options: **`Single`**, **`EP`**, **`Album`**, **`Mixtape`**|
| `Spotify URL`    | URL                                                                         |
| `Apple Music URL`| URL                                                                         |
| `SoundCloud URL` | URL                                                                         |
| `YouTube URL`    | URL                                                                         |
| `Bandcamp URL`   | URL                                                                         |
| `Embed URL`      | URL — the primary player link (Spotify/SoundCloud/YouTube/Apple share URL) |
| `Featured`       | Checkbox                                                                    |
| `Description`    | Long text                                                                   |

> Releases render newest first (by `Release Date`); `Featured` ones appear in a Spotlight section.

### 3. `Events`

| Field name    | Airtable field type                                          |
| ------------- | ------------------------------------------------------------ |
| `Title`       | Single line text **(primary field)**                         |
| `Date/Time`   | Date — **enable "Include a time field"**                     |
| `Venue`       | Single line text                                             |
| `City`        | Single line text                                             |
| `Artist(s)`   | **Link to another record → `Artists`** (allow multiple)      |
| `Ticket URL`  | URL                                                          |
| `RSVP URL`    | URL                                                          |
| `Flyer`       | Attachment                                                   |
| `Status`      | Single select — options: **`Upcoming`**, **`Past`**          |
| `Description` | Long text                                                   |

> Upcoming shows (`Status = Upcoming`) sort soonest-first; past shows sort most-recent-first.

### 4. `Services`

| Field name   | Airtable field type                             |
| ------------ | ----------------------------------------------- |
| `Name`       | Single line text **(primary field)**            |
| `Slug`       | Single line text — e.g. `production`            |
| `Summary`    | Single line text — short one-liner              |
| `Details`    | Long text                                       |
| `Icon`       | Single line text (optional; not required)       |
| `Sort Order` | Number (integer)                                |
| `Active`     | Checkbox                                         |

> Only `Active = true` services render, sorted by `Sort Order`. If this table is empty, the site shows built-in Production / Management / Promotion copy. Seed these three records:
>
> - **Production** — slug `production` — Summary "From first take to final master."
> - **Management** — slug `management` — Summary "The business, handled, so you can focus on the music."
> - **Promotion** — slug `promotion` — Summary "Get heard by the people who matter."

### 5. `BlogPosts`

| Field name       | Airtable field type                                    |
| ---------------- | ------------------------------------------------------ |
| `Title`          | Single line text **(primary field)**                   |
| `Slug`           | Single line text — unique, URL-safe                    |
| `Author`         | Single line text                                       |
| `Published Date` | Date                                                   |
| `Cover Image`    | Attachment                                             |
| `Excerpt`        | Long text                                              |
| `Body`           | Long text — Markdown supported (headings, lists, links, bold/italic, quotes) |
| `Tags`           | Multiple select (or Single line text, comma-separated) |
| `Status`         | Single select — options: **`Draft`**, **`Published`**  |

> Only `Status = Published` posts render, newest first by `Published Date`.

---

## WRITE TABLES (forms submit into these — start them empty)

For every write table, add these three shared fields with the exact names and options below:

- `Submitted At` — **Date** (enable "Include a time field")
- `Source` — **Single line text** (the site writes `website`)
- `Status` — **Single select** with options **`New`**, **`In Progress`**, **`Closed`** (the site writes `New`) — *not present on `NewsletterSignups`.*

### 6. `Submissions`

| Field name         | Airtable field type                          |
| ------------------ | -------------------------------------------- |
| `Artist/Band Name` | Single line text **(primary field)**         |
| `Contact Name`     | Single line text                             |
| `Email`            | Email                                        |
| `Phone`            | Phone number (or Single line text)           |
| `Genre`            | Single line text                             |
| `City`             | Single line text                             |
| `Music Link`       | URL                                          |
| `Social Links`     | Long text                                    |
| `Message`          | Long text                                    |
| `Submitted At`     | Date (with time)                             |
| `Source`           | Single line text                             |
| `Status`           | Single select — `New`, `In Progress`, `Closed` |

### 7. `BookingRequests`

| Field name         | Airtable field type                          |
| ------------------ | -------------------------------------------- |
| `Name`             | Single line text **(primary field)**         |
| `Email`            | Email                                        |
| `Phone`            | Phone number (or Single line text)           |
| `Artist Requested` | Single line text                             |
| `Event Date`       | Single line text (free-form date from form)  |
| `Venue/City`       | Single line text                             |
| `Budget`           | Single line text                             |
| `Details`          | Long text                                    |
| `Submitted At`     | Date (with time)                             |
| `Source`           | Single line text                             |
| `Status`           | Single select — `New`, `In Progress`, `Closed` |

### 8. `ServiceInquiries`

| Field name              | Airtable field type                                          |
| ----------------------- | ------------------------------------------------------------ |
| `Name`                  | Single line text **(primary field)**                         |
| `Email`                 | Email                                                        |
| `Phone`                 | Phone number (or Single line text)                           |
| `Service Interested In` | Single select — **`Production`**, **`Management`**, **`Promotion`** |
| `Artist/Project`        | Single line text                                             |
| `Details`               | Long text                                                    |
| `Submitted At`          | Date (with time)                                             |
| `Source`                | Single line text                                             |
| `Status`                | Single select — `New`, `In Progress`, `Closed`               |

### 9. `ContactMessages`

| Field name     | Airtable field type                          |
| -------------- | -------------------------------------------- |
| `Name`         | Single line text **(primary field)**         |
| `Email`        | Email                                        |
| `Subject`      | Single line text                             |
| `Message`      | Long text                                    |
| `Submitted At` | Date (with time)                             |
| `Source`       | Single line text                             |
| `Status`       | Single select — `New`, `In Progress`, `Closed` |

### 10. `NewsletterSignups`

| Field name     | Airtable field type                  |
| -------------- | ------------------------------------ |
| `Email`        | Email **(primary field)**            |
| `Source`       | Single line text                     |
| `Submitted At` | Date (with time)                     |

> The site uses `typecast: true` on writes, so single-select options are created automatically if missing — but it's cleaner to pre-create the options above.

---

## Create a Personal Access Token (PAT)

1. Go to **Airtable → your account → [Developer hub → Personal access tokens](https://airtable.com/create/tokens)**.
2. Click **Create new token**. Name it e.g. `9th Ward Website`.
3. Under **Scopes**, add:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
4. Under **Access**, click **Add a base** and select **only** the `9th Ward Site` base (least privilege).
5. Click **Create token** and **copy it immediately** (it starts with `pat…`). This is your `AIRTABLE_PAT`.

> Keep this token secret. It is used **server-side only** and must never be prefixed with `NEXT_PUBLIC_`.

---

## Find the Base ID

1. Open your base in the browser.
2. Look at the URL: `https://airtable.com/app XXXXXXXXXXXXXX/...` — the part starting with `app…` is your **Base ID**.
   (Or visit the [API docs](https://airtable.com/api) and pick the base; the intro shows "The ID of this base is `app…`".)
3. This is your `AIRTABLE_BASE_ID`.

---

## Wire it up

Set the two values (plus `REVALIDATE_SECRET` and `NEXT_PUBLIC_SITE_URL`) in `.env.local` for local dev and in Railway's **Variables** tab for production:

```
AIRTABLE_PAT=pat...
AIRTABLE_BASE_ID=app...
REVALIDATE_SECRET=some-long-random-string
NEXT_PUBLIC_SITE_URL=https://your-deployed-url
```

---

## First content to add

To have a live-feeling site on first load:

1. Add your real **Artists** (use the bio template — leave `[brackets]` where facts are unknown; don't invent stats or links). Set `Status = Active`, a `Sort Order`, and mark a few `Featured`.
2. Add a few **Releases**, each linked to an artist, with a `Cover Art` and an `Embed URL`. Mark the newest as `Featured` for the home hero.
3. Add the three **Services** records (Production, Management, Promotion) with `Active = true`.
4. Add any **Events** and **BlogPosts** as they come.

Once `Artists` has records, the built-in seed roster is no longer used.

---

## (Optional) Auto-refresh on edits

To skip the 5-minute cache after editing content, create an **Airtable automation**:

- **Trigger:** "When a record is updated/created" in a read table.
- **Action:** "Send a webhook" (or run a script) → `POST https://YOUR_SITE/api/revalidate?secret=YOUR_REVALIDATE_SECRET&tag=artists` (use the matching tag: `artists`, `releases`, `events`, `services`, `posts`).
