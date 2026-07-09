# 9th Ward Website — Handoff Doc

**Purpose:** Drop this whole file into a fresh AI coding session (Claude Cowork, Perplexity Computer, or similar) to resume website editing without re-explaining anything. Everything needed — repo, stack, conventions, deploy path, gotchas — is below.

Last updated: **09 Jul 2026 (evening)** — the full 8-page layout redesign is now LIVE. Credibility-first homepage (HeroHome2 + proof stats + "Featured in" press bar + founders band + ImUsed.ai + CTA), plus rebuilds of About, Services, Artists (featured spotlight + genre/city filter), Music (featured-release banner + type filter/sort), Events (next-show banner + compact archive), Blog listing (featured lead + category filter), and Contact (routing tiles + reason selector + fuller sidebar). New client filter components; centered-newsletter footer site-wide; persistent Home nav link. Builds on the same-day YouTube-first embed reorder + blog article typography work.

---

## 0. First prompt to paste in a new chat

> I'm continuing work on the 9th Ward Recording website. Repo: `Blaquestalyon/9thward-website` on GitHub. Live at `https://www.9thwardrecording.com`. Please read `HANDOFF.md` in the repo (or the pasted copy below) before doing anything, then help me with: **\<your request\>**.
>
> Ground rules: layout-only redesign keeps the dark near-black / NOLA-purple / gold palette and Inter + Space Grotesk fonts. Verify with `tsc --noEmit` + `npm run build` before handing anything off. Follow the commit-message style in the log. **In Claude Cowork, YOU do not push — Jay pushes from gitbash himself** (see §6). Always keep a plain "Home" link in the top nav.

---

## 1. Project at a glance

| Field | Value |
| --- | --- |
| **Product** | 9th Ward Production & Promotions — Houston-based indie artist management group with international reach |
| **Owner** | Jay Davis (Blaquestalyon) |
| **Live URL** | https://www.9thwardrecording.com |
| **Repo** | https://github.com/Blaquestalyon/9thward-website (public, `main` branch) |
| **Hosting** | Railway (auto-deploy on push to `main`) |
| **Repo on Jay's PC** | `C:\Users\jdavi\Claude\Projects\9thward-website` — in Claude Cowork, Claude works in its own cloud clone and writes finished files here via the desktop bridge; Jay pushes from gitbash |
| **Local path (Perplexity Computer)** | `/home/user/workspace/9th-ward-site/` |
| **Framework** | Next.js 15.5.20 (App Router) + TypeScript + Tailwind + shadcn/ui |
| **Data** | Airtable base `app3HHnUsEOOvO9ND` ("9th Ward Website" in workspace "144K COLLECTIVE") |
| **Email** | Resend (optional — falls back gracefully if not configured) |
| **Package manager** | npm |
| **Node** | 20.x (Railway default) |
| **Design tokens** | Dark-first: near-black `#0A0A0B` bg, NOLA-purple primary, gold accent. Fonts: Inter (body), Space Grotesk (display). Do NOT change colors/fonts — the redesign is layout-only. |

---

## 1a. Brand voice and story (READ THIS BEFORE ANY COPY WORK)

The 9th Ward story has been rewritten with founder-approved copy. **Do not paraphrase from memory — read `app/about/page.tsx` for the current canonical narrative.** Key rules:

- **New Orleans gave the name meaning, not the sound.** Do NOT write "New Orleans in the DNA", "New Orleans roots", or anything that implies the company, the artists, or the production style is from New Orleans. New Orleans matters because post-Katrina New Orleans artists in Houston influenced the brand *name and its protection-based meaning*.
- **Houston is the base.** 9th Ward is Houston-based and always has been. It began in Houston in 2010 — never imply a "New Orleans → Houston" geographic origin.
- **El Paso is a cornerstone**, not a footnote. The Foundation (2017–2018) was a first-of-its-kind community-owned venue model operated through 9th Ward Production and Promotions Company, LLC and funded through S4TF, LTD. Source of record: <https://www.power-in-numbers.net/track-record/2017-foundation-venu/>
- **The Bronx** is a cornerstone of the roster and creative reach.
- **International reach today:** artists and collaborators connected to South Korea, Aruba, and the UK by way of Nigeria. Phrase as "artists and collaborators connected to" unless you have verified location fields per artist.
- **Founding:** Jay Davis founded the name/brand/model in 2010. Jay and Shakara Weston co-founded the company/label (9th Ward Production & Promotions Company, LLC) in 2015 after Shakara became the first artist to fully commit to the model in 2012. **Do not phrase this as if Shakara joined an already-established company.**
- **Canonical tagline (SITE.description):** *"Indie Artist Management Group. Music Production, Management & Promotion. Born to protect independent artists. Shaped by New Orleans. Built in Houston. Proven in El Paso. Reaching the world."*
- **Style rules:** professional, warm, grounded, founder-led. Short paragraphs. No em dashes in narrative body copy (colon or period instead). No overhyping. No `[Add ... here]` placeholders.

**About page structure (rebuilt 09 Jul 2026):** leads with a **founders row** (Jay Davis + Shakara Weston, JD/SW monogram avatars until real photos are supplied), then a **horizontal timeline** with 6 nodes (2010 → 2012 → 2015 → 2017–2018 → 2025 → Today; the 2025 iMused.ai node is gold-accented), then an **international-reach tag band**, then the full **Our Story** narrative set in two columns with a **pull-quote sidebar**. The `#imused` anchor sits on the "2025: the mission enters a new era" story section (`scroll-mt-28`) so the homepage ImUsed.ai "How it came together" button lands on it. What We Do (3 cards) and the Work-With-Us CTA close the page. Confirm current copy in `app/about/page.tsx` before editing.

---

## 2. Repository map

```
9th-ward-site/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, fonts, theme, nav; renders <Footer newsletterCentered />
│   ├── page.tsx                  # Home — force-dynamic; credibility-first layout (HeroHome2)
│   ├── globals.css               # Tailwind base + theme tokens
│   ├── about/                    # Founders row, horizontal timeline, reach band, 2-col story (rebuilt 09 Jul 2026)
│   ├── artists/                  # Roster — force-dynamic; featured spotlight + genre/city filter (ArtistRoster)
│   ├── music/                    # Releases — featured-release banner + type filter/sort (MusicCatalog)
│   ├── music/[slug]/             # Release detail — YouTube-first embed (see gotcha #14)
│   ├── events/                   # Next-show hero banner + upcoming list + compact past archive
│   ├── services/                 # 3 Airtable service cards + process band + proof band + CTA
│   ├── blog/                     # Listing: featured lead post + category filter (BlogList)
│   ├── blog/[slug]/              # Article — prose typography, drop cap, lead pull-quote (see §4 blog rules)
│   ├── contact/                  # Routing tiles + message form (reason selector) + booking form + sidebar
│   ├── submit/                   # Artist demo submissions — Next.js form → Submissions table
│   ├── actions/forms.ts          # ALL server actions (contact/booking/submit/inquiry/newsletter)
│   ├── api/revalidate/           # ISR revalidation webhook (uses REVALIDATE_SECRET)
│   ├── icon.png, apple-icon.png  # Favicons
│   ├── robots.ts, sitemap.ts     # SEO
│   ├── global-error.tsx          # Error boundary
│   └── not-found.tsx             # 404
├── components/
│   ├── site/                     # Domain components (nav, footer, forms, cards, hero, etc.)
│   │   ├── nav.tsx               # Top nav; plain "Home" link is the first item (desktop + mobile)
│   │   ├── footer.tsx            # `newsletterCentered` prop → centered-newsletter variant (used site-wide)
│   │   ├── hero-home2.tsx        # Homepage hero: label H1 + proof stats + release support card
│   │   ├── press-bar.tsx         # Homepage "Featured in" trust bar (Yahoo Finance / Int'l Telegraph / 144K)
│   │   ├── artist-roster.tsx     # CLIENT: /artists genre/city filter grid
│   │   ├── music-catalog.tsx     # CLIENT: /music type filter + Newest/Oldest sort grid
│   │   ├── blog-list.tsx         # CLIENT: /blog category (tag) filter grid
│   │   ├── contact-form.tsx      # /contact message form — "Reason" <select> named subject (see §5)
│   │   ├── submit-form.tsx       # /submit client form (writes to Submissions table)
│   │   └── ...                   # artist-card, release-card, event-card, music-embed, platform-button, motion, etc.
│   └── ui/                       # shadcn/ui primitives
├── lib/
│   ├── airtable/
│   │   ├── config.ts             # Base ID + table ID map (single source of truth)
│   │   ├── client.ts             # fetch wrapper + createRecord + createRecordDetailed
│   │   ├── read.ts               # Public reads — strict Status='Active' gate; blog slug sanitizer
│   │   ├── write.ts              # Form writes (submissions, contact, booking, etc.)
│   │   └── types.ts
│   ├── email/                    # Resend wrapper (sendNotification)
│   ├── validation/schemas.ts     # Zod schemas for every form
│   ├── site.ts                   # SITE config — name, urls, socials, ventures, TAGLINE, YOUTUBE_CHANNEL, PRESS
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

> **Removed in the redesign:** `app/home-2/` (the temporary live preview route) and `components/site/site-footer.tsx` (the preview-only footer wrapper) were deleted when Home 2 was promoted to `/`. `hero-home2.tsx` / `press-bar.tsx` filenames still say "home2"/"press" but are the real homepage components now — cosmetic, safe to rename later.

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
- **Artists page spotlight (09 Jul 2026):** `/artists` picks the first `Featured` artist (else the first artist) as a large spotlight, and shows the rest in `ArtistRoster` with genre/city filter chips. Set at least one artist `Featured` so the spotlight is a deliberate choice.
- **No seed data / no placeholder artists.** The site shows only what's in Airtable. If the Artists table is empty, the roster is empty.
- **Dynamic rendering:** `/` and `/artists` are `export const dynamic = "force-dynamic"` so Airtable edits take effect on the very next request. The Airtable client tag-caches list responses for 60 s (`REVALIDATE_SECONDS = 60` in `lib/airtable/config.ts`), so this is at most one Airtable API call per minute per Railway node.

### Release rendering rules (09 Jul 2026)

- **Music page featured banner:** `/music` uses `getLatestFeaturedRelease()` (latest `Featured` release, else the newest) as a wide banner with an inline `MusicEmbed` player + `PlatformButtons`; the rest go into `MusicCatalog` with type-filter chips (Singles/EPs/Albums/Mixtapes) + Newest/Oldest sort. The banner player needs at least one platform URL or an `Embed URL` on that release, or the player area is hidden (buttons still show if any URL exists).

### Pipedream Airtable connector limitations

The `airtable_oauth__pipedream` connector **cannot reliably write string/single-select/number fields** to Airtable (it only worked for checkbox `Featured` in testing). Reads work fine. For writes, either:
- Have the user do it manually in Airtable, or
- Hit the Airtable REST API directly with the PAT (out-of-band, not from the site's runtime).

### BlogPost rendering rules (updated 09 Jul 2026)

- **Listing page (09 Jul 2026):** `/blog` promotes the newest post to a large **featured lead** (image + excerpt + Read link) and shows the rest in `BlogList` with **category (tag) filter chips**.
- **Slug sanitization at read time.** `toPost()` in `lib/airtable/read.ts` passes every Airtable `Slug` value through `sanitizeSlug()`, which lowercases and replaces any run of non-alphanumeric characters with a single hyphen. So an Airtable slug like `What Happened to Hip Hop? Pt.1` becomes `what-happened-to-hip-hop-pt-1` on both the listing link and the `[slug]` route. **You still want authors to type URL-safe slugs in Airtable** — the sanitizer is a safety net, not a naming style.
- **Airtable long-text body → real prose.** `components/site/markdown.tsx` treats every non-empty line as its own paragraph (Airtable's Enter key produces a single `\n`, not the `\n\n` markdown expects), and any paragraph longer than ~500 chars is auto-split on sentence boundaries into ~2–3-sentence paragraphs. Combined with the Markdown wrapper's typography classes (17px body, 1.75 line-height, drop cap on the first paragraph, 68ch measure, primary-color links) this turns raw pasted prose into a readable article without asking the author for markdown syntax.
- **Publish gate:** `listPosts()` filters to `status === "Published"`. Draft posts never appear in the listing or at their slug URL.

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

> **Contact "Reason" selector (09 Jul 2026):** the contact form's Subject field is now a `<select name="subject">` (options: General inquiry / Submit music / Booking / Press / Something else). It is deliberately still named `subject`, so `contactAction` and `contactSchema` (which validate a `subject` string) are UNCHANGED — the selected reason becomes the subject. If you add more reasons, just add `<option>`s; no server change needed.

### Debug helper (leave in place)

`lib/airtable/client.ts` exports both `createRecord` (returns id or null) AND `createRecordDetailed` (returns a discriminated union: `{ok:true,id}` | `{ok:false,reason:"not_configured"|"http"|"threw",...}`). `lib/airtable/write.ts` re-exports `createContactMessageDetailed` etc.

If any form starts failing again, swap the action from `createContactMessage` → `createContactMessageDetailed` and surface `result.status` / `result.detail` in the returned `message`. Push, hard-reload, submit — the browser shows the exact Airtable error. Revert after fixing.

---

## 6. Local dev + deploy workflow

### Claude Cowork workflow (current — READ THIS)

In Claude Cowork, Claude runs in its own **cloud clone** and **CANNOT push to GitHub**. The flow is:

1. Claude edits + verifies in the cloud clone: `npx tsc --noEmit` and `npm run build`. **`next build` fails offline only because `next/font` can't fetch Google Fonts** — temporarily stub `lib/fonts.ts` to plain `{ variable }` objects to make the build run, then `git checkout -- lib/fonts.ts` to restore it. Never ship the stub. (Same trick + an env-gated `MOCK_DATA=1` branch in `lib/airtable/read.ts` is used to seed mock rows for local screenshots; both are reverted before handoff.)
2. Claude writes the finished file(s) into Jay's connected repo folder (`C:\Users\jdavi\Claude\Projects\9thward-website`) via the desktop bridge (or delivers a zip if the desktop is offline).
3. **Jay pushes from gitbash**, staging by name:
   ```
   git add path/to/file1 path/to/file2
   git diff --cached --stat        # sanity-check the file list
   git commit -m "..."
   git push
   ```
   If the push is rejected "remote ahead" (another session/device pushed), run `git pull --no-edit` then `git push`.
4. Do NOT set up push credentials or a GitHub bot for Claude — Jay declined that.
5. **Preview vs direct-replace is Jay's call per page.** The Home redesign shipped first as a live `/home-2` preview (a cascading "Home" dropdown let Jay compare), then was promoted to `/` and the preview deleted. About/Services/Artists/Music/Events/Blog/Contact were direct replaces. **When promoting a preview, keep the plain "Home" nav link — only remove the preview submenu entries.**

### Setup (Perplexity Computer path)
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
**Push to `main` — Railway auto-deploys.** No CLI. The user was explicit: *"actually no.. just push to github"*. (In Perplexity Computer the assistant pushed via `api_credentials=["github"]`; in Claude Cowork Jay pushes himself — see the Cowork workflow above.)

Commit-message style (see `git log`):
- `feat(<scope>): ...` for new features
- `fix(<scope>): ...` for bug fixes
- `chore(<scope>): ...` for tooling/deps/assets
- `content(<scope>): ...` for copy/content rewrites
- `revert(<scope>): ...` for reverts (include the reverted SHA in the body)
- `debug(<scope>): ...` for temporary diagnostic surfacing (must be reverted with a `cleanup(<scope>): ...` commit)

*(The page-rebuild commits from Claude Cowork use plain sentence-case messages like "Rebuild About page: ..." rather than the `type(scope):` convention. Either is fine; match the surrounding log when you can.)*

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
13. **Spotify's plain `/embed/` iframe does NOT scale up.** Regardless of the container height you allocate, Spotify's iframe renders a fixed ~80px mini-player card for `/embed/album/` and `/embed/track/`. Setting the container to 152/166/232/352 all produce visible dead space below the card because Spotify won't fill it. On 08 Jul 2026 we cycled through 166 → 352 → 152 → 80 chasing this before landing on **80px in `lib/embed.ts`** (`audioHeight: 80`) to hug the natural card. If you ever want the taller Spotify player with big cover art + full track list, you have to switch to Spotify's iframe JS API (not the plain `/embed/` endpoint). See commit `62a5af4`.
14. **Release-embed platform preference is YouTube-first.** `app/music/[slug]/page.tsx` (and the `/music` featured banner) pick the primary embed in this order: explicit Airtable `Embed URL` → `youtubeUrl` → `appleMusicUrl` → `soundcloudUrl` → `spotifyUrl`. YouTube is preferred because its 16:9 iframe fills the container cleanly and Spotify's plain embed does not (see gotcha #13). The `Where to stream` button row still shows all four platforms so listeners can click through to their preferred one. See commit `7ce770c`.
15. **Slugs in Airtable must be URL-safe.** `toPost()` sanitizes them, but an Airtable slug containing `?`, spaces, or other unsafe characters will still route as the sanitized version — meaning old shared links to the raw slug will 404. On 09 Jul 2026 a blog post authored with slug `what-happened-to-hip-hop?-1` 404'd because the `?` was parsed as a query string. Fixed by editing the Airtable slug to `what-happened-to-hip-hop-pt-1` AND adding the sanitizer safety net (commit `6bca95e`). Rule of thumb for authors: **lowercase letters, digits, and hyphens only.**
16. **Airtable long-text ≠ markdown.** Authors don't type `\n\n` between paragraphs; they press Enter once. The blog renderer in `components/site/markdown.tsx` treats every non-empty line as a paragraph and auto-splits paragraphs longer than ~500 chars on sentence boundaries so pasted walls of text look like prose. Do NOT tell authors to "use markdown syntax" — they won't. Fix rendering, not the CMS.
17. **Redesign is layout-only.** The 8-page redesign changed structure/hierarchy only — same palette, same fonts. Filter/sort UIs are client components (`artist-roster`, `music-catalog`, `blog-list`); if you add another, follow the same shape (derive chips from values present, filter with `useState`). Framer-motion entrance animations start at opacity 0, so when screenshotting full pages, inject `[style*="opacity"]{opacity:1!important}[style*="transform"]{transform:none!important}` first.

---

## 8. Current state (as of 09 Jul 2026, evening — full redesign live)

- **Homepage (`/`):** credibility-first layout (Home 2 promoted from preview). `HeroHome2` leads with the label positioning as the H1, the featured release as a support card, and a 4-stat proof row (16 yrs independent / 102K subs / 2.6M+ views / 4 continents). Then a **"Featured in" press bar** (`press-bar.tsx`), a **"Who we are"** founders band (pulled from About), the **ImUsed.ai** feature moved up top, the roster, Latest releases, Most-watched videos, detailed press cards, and a **"Work with 9th Ward"** CTA band. force-dynamic; strict Status='Active' + Featured gates unchanged.
- **Nav:** plain **Home** link is the leftmost item (desktop + mobile). The temporary cascading "Home" dropdown (used to preview Home 2) was removed on promotion.
- **Footer:** newsletter is **centered**, applied **site-wide** (`layout.tsx` renders `<Footer newsletterCentered />`; the `newsletterCentered` prop lives in `footer.tsx`).
- **About page:** rebuilt — founders row, horizontal 6-node timeline, international-reach tag band, two-column Our Story with pull-quote sidebar, What We Do, Work-With-Us CTA. `#imused` anchor on the 2025 section (`scroll-mt-28`). See §1a. Founder avatars are JD/SW monograms pending real photos.
- **Services page:** rebuilt — 3 Airtable service cards + 4-step **process** band + **proof band** + closing **CTA**.
- **Artists page:** rebuilt — featured-artist **spotlight** (photo, bio, badges, socials, View profile) + `ArtistRoster` **genre/city filter** grid.
- **Music page:** rebuilt — **featured-release banner** (cover, inline player, platform buttons, Full-release link) + `MusicCatalog` **type filter + Newest/Oldest sort**.
- **Events page:** rebuilt — **next-show hero banner** (date block + flyer + tickets) + "More upcoming shows" list + **compact past-shows archive grid**.
- **Blog listing:** rebuilt — **featured lead post** + `BlogList` **category (tag) filter**. (Blog *article* page typography was overhauled separately — see below.)
- **Contact page:** rebuilt — three **routing tiles** (Submit music / Book an artist / Press & partners) + message form with a **Reason selector** + booking form + sidebar (email, studio, **"reply within 2 business days"**, socials).
- **Contact form:** WORKING end-to-end. Reason `<select>` is named `subject` so the server action/schema are unchanged (§5).
- **/submit form:** Next.js form writing to Submissions table (rolled back from Airtable embed attempt — see gotcha #11).
- **Other write forms** (booking, service inquiry, newsletter): built and wired, same `createRecord` path.
- **Release detail pages (`/music/[slug]`):** primary embed prefers YouTube (16:9) with fallback YouTube → Apple → SoundCloud → Spotify; explicit Airtable `Embed URL` overrides. Spotify container locked to 80px (gotcha #13).
- **Blog article page (`/blog/[slug]`):** real prose typography — 68ch measure, 17px/1.75 body, drop cap, primary-color links; excerpt renders as a bordered lead pull-quote; "More from the blog" outro. Slug sanitizer safety net in `toPost()`.
- **Site-wide tagline (SITE.description):** "Indie Artist Management Group. Music Production, Management & Promotion. Born to protect independent artists. Shaped by New Orleans. Built in Houston. Proven in El Paso. Reaching the world." — fans out to root `<meta>`, Open Graph, Twitter card, JSON-LD, and the footer.
- **Logo:** real 1080×1080 transparent PNG, live in nav/footer/hero.
- **First live blog post:** *What Happened to Hip Hop? Pt.1* by CL, published 09 Jul 2026, slug `what-happened-to-hip-hop-pt-1`.

### Recent commits (newest first)

- `94b869f` Rebuild Events, Blog, Contact pages *(Cowork)*
- `eea245a` Rebuild Artists + Music pages: spotlight/banner, filters, sort *(Cowork)*
- `f3cd620` Rebuild Services page: add process, proof band, and CTA *(Cowork)*
- `c0eef6b` Rebuild About page: founders, timeline, reach band, two-column story *(Cowork)*
- `6bca95e` feat(blog): humane article typography + slug sanitization safety net *(Perplexity)*
- `ec94e15` Add persistent Home link to top menu *(Cowork)*
- `9f15641` Promote Home 2 to homepage; remove preview route, Home dropdown, preview footer wrapper *(Cowork)*
- `45ce6dd` Refine Home 2: two music sections; fix #imused anchor offset *(Cowork)*
- `d8a015e` Add Home 2 homepage preview + cascading Home menu; centered footer on preview *(Cowork)*
- `7ce770c` feat(music): prefer YouTube as primary release embed, then Apple, SoundCloud, Spotify *(Perplexity)*
- `62a5af4` fix(music-embed): drop Spotify container to 80px to match its mini-player *(supersedes fa438d9 and 2735e94)*
- `3608b78` content(about): link iMused.ai on the 2025 timeline card
- `a376190` content(about): rewrite Our Story with El Paso, international reach, and updated timeline
- `1e2d61f` revert(submit): restore Next.js submit form writing to Submissions table
- `6c13871` content(brand): replace tagline with 'Born to protect independent artists' line
- `582c520` fix(artists): force dynamic rendering on / and /artists so Airtable edits show immediately
- `9ae9826` fix(artists): make Featured strictly gate homepage roster + shorten ISR
- `fc968b7` feat(artists): drop seed roster fallback, source artists solely from Airtable
- `33f1ef4` docs: add HANDOFF.md for fresh-chat continuity

---

## 9. Suggested next tasks (not committed to)

> **Session log — 09 Jul 2026 (evening, Claude Cowork):** shipped the full 8-page layout-only redesign (credibility-first goal). Home built as a `/home-2` live preview then promoted to `/` (`d8a015e` → `9f15641`); persistent Home nav link (`ec94e15`); About (`c0eef6b`), Services (`f3cd620`), Artists + Music (`eea245a`), Events + Blog + Contact (`94b869f`) rebuilt as direct replaces. New client filter components (artist-roster, music-catalog, blog-list); new homepage components (hero-home2, press-bar); centered-newsletter footer site-wide; `#imused` anchor fixed on About. The 4th homepage hero stat was corrected from a misleading "NOLA→HOU→world" to "4 continents" (the brand started in Houston, not New Orleans — see §1a). Earlier same-day (Perplexity): YouTube-first embed reorder (`7ce770c`), Spotify player 80px (`62a5af4`), blog article typography + slug sanitizer (`6bca95e`).

**Open follow-ups Jay flagged:**
- **Founder photos on About** — swap the JD/SW monograms for real headshots when supplied.
- **Minor tweaks to Blog and Contact** — Jay expects to revisit these.
- Cosmetic: rename `hero-home2.tsx` / `press-bar.tsx` now that they're the main homepage components (optional).

**Still open from before:**
- Exercise + verify the other write forms (booking, submit, service inquiry, newsletter) with real submissions.
- Add a lightweight `/admin/inbox` route (protected by a header token) to view contact submissions without opening Airtable.
- Wire up Resend for real email notifications on contact/booking.
- Add Plausible or PostHog for analytics.
- Services: the three service cards still fall back to `FALLBACK_SERVICES` copy — move real service copy into the Airtable `Services` table.
- Blog post pipeline: draft more posts and publish.
- Optional: Airtable automation → `/api/revalidate` webhook so edits propagate within seconds instead of a minute.

---

## 10. Connectors + tools available

- **Claude Cowork (current):** the desktop bridge (`device_*` tools) reaches Jay's connected repo folder; the **Airtable MCP** reads/writes the base; Claude works in a cloud git clone (can fetch/read GitHub but does NOT push — Jay pushes). Screenshots via headless Chromium against a local `next dev`.
- **Perplexity Computer (prior):** GitHub (`github_mcp_direct`, push via `api_credentials=["github"]`); Airtable (`airtable_oauth__pipedream`) — reads reliable, string/single-select/number writes unreliable (see §4); Google Drive for shared assets.

For website work: this is a plain Next.js repo, not a website-building sandbox. Do NOT run `deploy_website` / `publish_website` — deploy is Railway via GitHub push.

---

## 11. Quick command reference

```bash
# Verify before handoff (Claude Cowork cloud clone or local)
npx tsc --noEmit
npm run build          # offline: temporarily stub lib/fonts.ts, then `git checkout -- lib/fonts.ts`

# Jay's push (from gitbash in C:\Users\jdavi\Claude\Projects\9thward-website)
git add path/to/changed/files
git diff --cached --stat
git commit -m "<what changed>"
git push
# if rejected "remote ahead":
git pull --no-edit && git push

# Local dev
npm run dev  # http://localhost:3000
```

---

**End of handoff.** This file lives at the repo root (`HANDOFF.md`). Paste its contents into any new AI coding session to resume.
