# 9th Ward Website — Handoff Doc

**Purpose:** Drop this whole file into a fresh Perplexity Computer chat to resume website editing without re-explaining anything. Everything Computer needs — repo, stack, conventions, deploy path, gotchas — is below.

Last updated: **08 Jul 2026** — reflects the About page rewrite, the "Born to protect" tagline, strict Featured/Status rendering, and the /submit rollback.

---

## 0. First prompt to paste in a new chat

> I'm continuing work on the 9th Ward Recording website. Repo: `Blaquestalyon/9thward-website` on GitHub. Live at `https://www.9thwardrecording.com`. Please read `HANDOFF.md` in the repo (or the pasted copy below) before doing anything, then help me with: **\<your request\>**.
>
> Ground rules: push to GitHub only (no Railway CLI), keep the local workspace at `/home/user/workspace/9th-ward-site/`, run `npm run build` before every commit, and follow the commit-message style already in the log.

---

## 1. Project at a glance

| Field | Value |
| --- | --- |
| **Product** | 9th Ward Production & Promotions — Houston-based indie artist management group with international reach |
| **Owner** | Jay Davis (Blaquestalyon) |
| **Live URL** | https://www.9thwardrecording.com |
| **Repo** | https://github.com/Blaquestalyon/9thward-website (public, `main` branch) |
| **Hosting** | Railway (auto-deploy on push to `main`) |
| **Local path** | `/home/user/workspace/9th-ward-site/` |
| **Framework** | Next.js 15.5.20 (App Router) + TypeScript + Tailwind + shadcn/ui |
| **Data** | Airtable base `app3HHnUsEOOvO9ND` ("9th Ward Website" in workspace "144K COLLECTIVE") |
| **Email** | Resend (optional — falls back gracefully if not configured) |
| **Package manager** | npm |
| **Node** | 20.x (Railway default) |

---

## 1a. Brand voice and story (READ THIS BEFORE ANY COPY WORK)

The 9th Ward story has been rewritten with founder-approved copy. **Do not paraphrase from memory — read `app/about/page.tsx` for the current canonical narrative.** Key rules:

- **New Orleans gave the name meaning, not the sound.** Do NOT write "New Orleans in the DNA", "New Orleans roots", or anything that implies the company, the artists, or the production style is from New Orleans. New Orleans matters because post-Katrina New Orleans artists in Houston influenced the brand *name and its protection-based meaning*.
- **Houston is the base.** 9th Ward is Houston-based and always has been.
- **El Paso is a cornerstone**, not a footnote. The Foundation (2017–2018) was a first-of-its-kind community-owned venue model operated through 9th Ward Production and Promotions Company, LLC and funded through S4TF, LTD. Source of record: <https://www.power-in-numbers.net/track-record/2017-foundation-venu/>
- **The Bronx** is a cornerstone of the roster and creative reach.
- **International reach today:** artists and collaborators connected to South Korea, Aruba, and the UK by way of Nigeria. Phrase as "artists and collaborators connected to" unless you have verified location fields per artist.
- **Founding:** Jay Davis founded the name/brand/model in 2010. Jay and Shakara Weston co-founded the company/label (9th Ward Production & Promotions Company, LLC) in 2015 after Shakara became the first artist to fully commit to the model in 2012. **Do not phrase this as if Shakara joined an already-established company.**
- **Canonical tagline (SITE.description):** *"Indie Artist Management Group. Music Production, Management & Promotion. Born to protect independent artists. Shaped by New Orleans. Built in Houston. Proven in El Paso. Reaching the world."*
- **Style rules:** professional, warm, grounded, founder-led. Short paragraphs. No em dashes in narrative body copy (colon or period instead). No overhyping. No `[Add ... here]` placeholders.

The About page timeline currently has 6 cards: 2010, 2012, 2015, 2017–2018 (The Foundation, linked), 2025 (iMused.ai, gold accent, linked), Today.

---

## 2. Repository map

```
9th-ward-site/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, fonts, theme, nav/footer
│   ├── page.tsx                  # Home — force-dynamic (Airtable-driven)
│   ├── globals.css               # Tailwind base + theme tokens
│   ├── about/                    # Origin story, founders, timeline (rewritten 08 Jul 2026)
│   ├── artists/                  # Roster — force-dynamic, source of truth is Airtable
│   ├── music/                    # Releases / catalog
│   ├── events/                   # Upcoming shows
│   ├── services/                 # Studio services
│   ├── blog/                     # Editorial posts
│   ├── contact/                  # Contact form (WORKING)
│   ├── submit/                   # Artist demo submissions — Next.js form → Submissions table
│   ├── actions/forms.ts          # ALL server actions (contact/booking/submit/inquiry/newsletter)
│   ├── api/revalidate/           # ISR revalidation webhook (uses REVALIDATE_SECRET)
│   ├── icon.png, apple-icon.png  # Favicons
│   ├── robots.ts, sitemap.ts     # SEO
│   ├── global-error.tsx          # Error boundary
│   └── not-found.tsx             # 404
├── components/
│   ├── site/                     # Domain components (nav, footer, forms, cards, hero, etc.)
│   │   ├── submit-form.tsx       # /submit client form (RESTORED — see §7 rollback note)
│   │   └── footer.tsx            # Renders SITE.description as the tagline
│   └── ui/                       # shadcn/ui primitives
├── lib/
│   ├── airtable/
│   │   ├── config.ts             # Base ID + table ID map (single source of truth)
│   │   ├── client.ts             # fetch wrapper + createRecord + createRecordDetailed
│   │   ├── read.ts               # Public reads — strict Status='Active' gate on artists
│   │   ├── write.ts              # Form writes (submissions, contact, booking, etc.)
│   │   └── types.ts
│   ├── email/                    # Resend wrapper (sendNotification)
│   ├── validation/schemas.ts     # Zod schemas for every form
│   ├── site.ts                   # SITE config — name, urls, socials, ventures, TAGLINE
│   ├── jsonld.ts                 # JSON-LD schema generators
│   ├── fonts.ts, embed.ts, rate-limit.ts, utils.ts
├── public/                       # Static assets (logo.png, favicon.ico, etc.)
├── scripts/                      # One-off maintenance scripts
├── content/                      # (reserved, unused)
├── AIRTABLE_SETUP.md             # Full Airtable schema + setup guide
├── README.md                     # Local dev + deploy overview
├── HANDOFF.md                    # ← this file
├── railway.json                  # Railway build/start command
├── next.config.mjs               # Next config (images, redirects)
├── tailwind.config.ts            # Design tokens
├── .env.example                  # Env var template
└── .env.local                    # Local dev (gitignored, minimal)
```

---

## 3. Environment variables (Railway)

All set in Railway's dashboard, NOT via CLI.

| Name | Purpose | Notes |
| --- | --- | --- |
| `AIRTABLE_PAT` | Airtable personal access token | Starts with `pat`, needs `data.records:read` + `data.records:write` on the "9th Ward Website" base only |
| `AIRTABLE_BASE_ID` | Airtable base ID | Must be exactly `app3HHnUsEOOvO9ND` (a typo here caused a 404 storm — see §7) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `https://www.9thwardrecording.com` |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Next 15 server-action encryption key | MUST be stable across deploys or all forms break |
| `REVALIDATE_SECRET` | ISR webhook auth | Used by `/api/revalidate` |
| `RESEND_API_KEY` | (Optional) email notifications | If unset, `sendNotification` is a no-op — forms still work |
| `RESEND_FROM`, `RESEND_TO` | (Optional) email routing | Only used when Resend is enabled |
| `NODE_ENV` | Runtime | `production` in Railway |

**Never dump env values to chat.** Reference them by name only.

---

## 4. Airtable data model

**Base:** `app3HHnUsEOOvO9ND` — see `AIRTABLE_SETUP.md` for full field definitions.

| Table | Table ID | Direction | Purpose |
| --- | --- | --- | --- |
| Artists | `tblKRi7PqX6OVdY3w` | Read | Roster displayed on homepage + /artists |
| Releases | `tblph09dgdQ4BiJEv` | Read | Music catalog |
| Events | `tblovR3hAZ1cuFJBk` | Read | Upcoming shows |
| Services | `tblYz9f1CnsSq7Fxu` | Read | Services list |
| BlogPosts | `tbleLDWtXhb87ZMmN` | Read | Editorial |
| Submissions | `tblEYKGWiojfhVUxy` | Write | Artist submissions from /submit |
| BookingRequests | `tblK44zds6j4lxU1K` | Write | Session booking requests |
| ServiceInquiries | `tblKGXBwc6xPQtur8` | Write | Service inquiry form |
| ContactMessages | `tblOsTdKiYX7gitnA` | Write | /contact form |
| NewsletterSignups | `tbl1NXV2odVy7IK9H` | Write | Footer newsletter opt-in |

All write tables have a `Status` field with options `New` / `In Progress` / `Closed`. New records land as `New` (see `lib/airtable/write.ts`).

**Table ID map lives in `lib/airtable/config.ts` — never hard-code IDs elsewhere.**

### Artist rendering rules (updated 08 Jul 2026)

- **Strict Status gate:** `lib/airtable/read.ts` only renders an artist if `Status === "Active"` (literal string). Blank/missing Status is treated as `Inactive`. Newly added rows stay hidden until you manually flip Status to Active.
- **Strict Featured gate:** `listFeaturedArtists()` only returns artists where `Featured` is true. There is NO fallback to "all active" when no artist is featured — an empty featured set means an empty home-page roster.
- **No seed data / no placeholder artists.** The site shows only what's in Airtable. If the Artists table is empty, the roster is empty.
- **Dynamic rendering:** `/` and `/artists` are `export const dynamic = "force-dynamic"` so Airtable edits take effect on the very next request. The Airtable client tag-caches list responses for 60 s (`REVALIDATE_SECONDS = 60` in `lib/airtable/config.ts`), so this is at most one Airtable API call per minute per Railway node.

### Pipedream Airtable connector limitations

The `airtable_oauth__pipedream` connector **cannot reliably write string/single-select/number fields** to Airtable (it only worked for checkbox `Featured` in testing). Reads work fine. For writes, either:
- Have the user do it manually in Airtable, or
- Hit the Airtable REST API directly with the PAT (out-of-band, not from the site's runtime).

---

## 5. Server actions (the important one)

All form handlers live in `app/actions/forms.ts` as **direct async exports** (Next.js 15 requires this — do NOT wrap them in a `guarded()` HOF, it breaks server-action registration and produces `UnrecognizedActionError` / digest crashes).

Pattern for every action:

```ts
"use server";

export async function contactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    // 1. Rate-limit check
    // 2. Zod parse (return { status:"error", errors, message } on parse failure)
    // 3. Airtable write via lib/airtable/write.ts
    // 4. Optional email notification via lib/email
    // 5. Return { status:"success", message: "..." }
  } catch (err) {
    console.error("[forms:<name>] threw:", err);
    return UNEXPECTED;
  }
}
```

Constants used in return values (also in `forms.ts`):

- `UNEXPECTED = { status:"error", message:"Something went wrong on our end. Please try again." }`
- `WRITE_FAILED = { status:"error", message:"Something went wrong saving your message. Please try again." }`

The client-side form components in `components/site/*-form.tsx` use `useActionState` and render the returned `message` in a red box on error / green box on success.

### Debug helper (leave in place)

`lib/airtable/client.ts` exports both `createRecord` (returns id or null) AND `createRecordDetailed` (returns a discriminated union: `{ok:true,id}` | `{ok:false,reason:"not_configured"|"http"|"threw",...}`). `lib/airtable/write.ts` re-exports `createContactMessageDetailed` etc.

If any form starts failing again, swap the action from `createContactMessage` → `createContactMessageDetailed` and surface `result.status` / `result.detail` in the returned `message`. Push, hard-reload, submit — the browser shows the exact Airtable error. Revert after fixing.

---

## 6. Local dev + deploy workflow

### Setup
```bash
cd /home/user/workspace/9th-ward-site
npm install                     # only if node_modules missing
cp .env.example .env.local      # then fill in AIRTABLE_PAT + AIRTABLE_BASE_ID
npm run dev                     # http://localhost:3000
```

### Build check (run before every commit)
```bash
npm run build
```

### Deploy
**Push to `main` — Railway auto-deploys.** No CLI. The user was explicit: *"actually no.. just push to github"*.

```bash
git add -A
git commit -m "<type>(<scope>): <what changed>"
git push origin main             # requires api_credentials=["github"] in bash tool call
```

Commit-message style (see `git log`):
- `feat(<scope>): ...` for new features
- `fix(<scope>): ...` for bug fixes
- `chore(<scope>): ...` for tooling/deps/assets
- `content(<scope>): ...` for copy/content rewrites
- `revert(<scope>): ...` for reverts (include the reverted SHA in the body)
- `debug(<scope>): ...` for temporary diagnostic surfacing (must be reverted with a `cleanup(<scope>): ...` commit)

Railway build command: `npm run build`. Start: `npm start`.

### Verifying a deploy went out
1. Wait ~60–90 s after push
2. Hard-reload the affected page (Cmd/Ctrl+Shift+R) — Next 15 server-action hashes change per deploy, stale tabs throw `UnrecognizedActionError`
3. Check Railway dashboard → Deployments tab if things look wrong

---

## 7. Gotchas + hard-won lessons

1. **Never wrap server actions in a helper HOF.** `export const contactAction = guarded(...)` compiles but breaks Next 15's server-action registration → runtime `UnrecognizedActionError`. Always use `export async function contactAction(...)` and inline try/catch. Commit `4b74a95` reverted this mistake.
2. **`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` must be stable.** Without it, Next generates a fresh key per build → every deploy invalidates all previously-rendered form components in users' open tabs.
3. **Hard-reload after every deploy** if you're testing the same tab you had open before. Server-action hashes change per deploy.
4. **Airtable 404 `NOT_FOUND` means base ID mismatch, not PAT scope.** If it were a PAT issue you'd get 401/403. Debug workflow: swap to `createRecordDetailed`, include `[base=... table=... pat=***XXXX]` in the error surface, compare against the known-good base ID `app3HHnUsEOOvO9ND`.
5. **Resend is optional.** `sendNotification` in `lib/email` returns early if `RESEND_API_KEY` is unset. Never make form success depend on email delivery.
6. **Every table already has "New" as a Status option.** If a write returns 422 UNKNOWN_FIELD_NAME, the field name in `lib/airtable/write.ts` disagrees with Airtable — fix the write, don't add fields via Airtable UI unless the user asks.
7. **Domain is `www.9thwardrecording.com`.** Not `9thwardproductions.com` (early planning name). Don't hard-code the old one anywhere.
8. **Don't use Railway CLI.** User pushes to GitHub; Railway auto-deploys. Hard preference.
9. **Rate limit is in-memory** (`lib/rate-limit.ts`). Resets on every deploy. Fine for now.
10. **The `guarded()` helper does not exist anymore.** Ignore any reference to it in old chat context.
11. **/submit uses the built-in Next.js form, NOT an Airtable form embed.** On 08 Jul 2026 we briefly tried replacing /submit with an iframe embed of an Airtable form (commit `42a278b`) that was meant to write straight to the Artists table. The URL was a base-editor page ID, not a shareable form ID, so Airtable returned 404 and X-Frame-Options blocked the iframe anyway. Commit `1e2d61f` reverted it back to the Next.js form writing to the **Submissions** table. If you want to switch to an Airtable-hosted form later, you must create a proper shared form view in Airtable, use its `Share form → Embed this form on your site` snippet (URL will look like `https://airtable.com/embed/shrXXXXX`), and iframe THAT URL — not the base-editor page URL.
12. **Static prerender vs. dynamic rendering.** `/` and `/artists` are Airtable-driven and MUST stay `dynamic = "force-dynamic"`. If you accidentally let them go back to static prerender, unchecking Featured on an artist will still show the stale version because Next's stale-while-revalidate serves the cached HTML.

---

## 8. Current state (as of 08 Jul 2026)

- **Contact form:** WORKING end-to-end (Airtable base-ID typo fixed earlier)
- **/submit form:** Next.js form writing to Submissions table (rolled back from Airtable embed attempt — see gotcha #11)
- **Other write forms** (booking, service inquiry, newsletter): built and wired, same `createRecord` path
- **About page:** rewritten with founder-approved narrative — see §1a for rules
- **Homepage + /artists:** `force-dynamic`, source only from Airtable, strict Status='Active' and Featured=true gates
- **Site-wide tagline (SITE.description):** "Indie Artist Management Group. Music Production, Management & Promotion. Born to protect independent artists. Shaped by New Orleans. Built in Houston. Proven in El Paso. Reaching the world." — fans out to root `<meta>`, Open Graph, Twitter card, JSON-LD, and the footer
- **Footer:** renders `SITE.description` directly (no more hardcoded "New Orleans in the DNA" fragment)
- **Timeline on About:** 2010, 2012, 2015, 2017–2018 (The Foundation, linked to power-in-numbers.net), 2025 (iMused.ai, linked, gold accent), Today
- **Logo:** real 1080×1080 transparent PNG, live in nav/footer/hero
- **ImUsed.ai feature block, featured YouTube videos, press strip:** live

### Recent commits (newest first)

- `3608b78` content(about): link iMused.ai on the 2025 timeline card
- `a376190` content(about): rewrite Our Story with El Paso, international reach, and updated timeline
- `1e2d61f` revert(submit): restore Next.js submit form writing to Submissions table
- `6c13871` content(brand): replace tagline with 'Born to protect independent artists' line
- `355af82` content(about): replace Our Story with the full origin narrative *(superseded by a376190)*
- `582c520` fix(artists): force dynamic rendering on / and /artists so Airtable edits show immediately
- `9ae9826` fix(artists): make Featured strictly gate homepage roster + shorten ISR
- `42a278b` feat(submit): replace Next.js form with Airtable form embed writing to Artists table *(reverted by 1e2d61f)*
- `fc968b7` feat(artists): drop seed roster fallback, source artists solely from Airtable
- `33f1ef4` docs: add HANDOFF.md for fresh-chat continuity

---

## 9. Suggested next tasks (not committed to)

- Exercise + verify the other write forms (booking, submit, service inquiry, newsletter) with real submissions
- Add a lightweight `/admin/inbox` route (protected by a header token) to view contact submissions without opening Airtable
- Wire up Resend for real email notifications on contact/booking
- Add Plausible or PostHog for analytics
- Content pass on Services page (real service list, no placeholder text)
- Blog post pipeline: draft first 3 posts and publish
- Optional: build an Airtable shared form on the Submissions table and swap /submit to embed it (see gotcha #11 for the correct URL shape)
- Optional: wire an Airtable automation → `/api/revalidate` webhook so Airtable edits propagate to the site within seconds instead of within a minute

---

## 10. Connectors + tools available in fresh Computer chat

For anything data-related, prefer connectors over browser automation:

- **GitHub** (`github_mcp_direct`) — push, PRs, issues; use `api_credentials=["github"]` in bash for git ops
- **Airtable** (`airtable_oauth__pipedream`) — reads work reliably (list-records, get-record, list-tables). Writes to string/single-select/number fields are unreliable through Pipedream — see §4 note
- **Google Drive** (`google_drive`) — if the user shares assets there
- **Finance** — not relevant here

For website work: this codebase follows the `website-building` skill's conventions but is a plain Next.js repo, not a website-building sandbox project. Do NOT run `deploy_website` or `publish_website` on it — deploy is Railway via GitHub push.

---

## 11. Quick command reference

```bash
# Build check
cd /home/user/workspace/9th-ward-site && npm run build

# Commit + push (fresh Computer chat needs api_credentials=["github"] on the bash call)
git add -A && git commit -m "feat(<scope>): <what>" && git push origin main

# Verify Airtable base+table+PAT independently of the deployed app
# (use the airtable_oauth__pipedream connector tools list-tables / list-records)

# Local dev
npm run dev  # http://localhost:3000
```

---

**End of handoff.** This file lives at `/home/user/workspace/9th-ward-site/HANDOFF.md`. Paste its contents into any new Computer chat to resume.
