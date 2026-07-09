# 9th Ward Production & Promotions

The official website and electronic press kit (EPK) hub for **9th Ward Production & Promotions Company, LLC** — an indie artist management group born to protect independent artists. New Orleans gave the name meaning. Houston gave the mission a home. Artists give it purpose. Founded by Jay Davis in 2010; the company took shape in 2012 with Shakara Weston.

Its #1 job is to showcase the roster and the music. Secondary jobs: capture new artist submissions, take booking requests, and field service inquiries. **The site sells nothing — no store, no pricing, no checkout.**

Built with **Next.js 15 (App Router) + TypeScript**, **Tailwind CSS + shadcn/ui**, **Framer Motion**, and **Airtable** as the single content + intake backend. Deploys to **Railway** (Node, `output: "standalone"`).

---

## Tech stack

| Layer         | Choice                                                        |
| ------------- | ------------------------------------------------------------- |
| Framework     | Next.js 15.5.x, App Router, React 19, TypeScript (strict)     |
| Styling       | Tailwind CSS v3, shadcn/ui, CSS custom-property design tokens |
| Icons         | lucide-react                                                  |
| Animation     | Framer Motion (reduced-motion aware)                          |
| Validation    | Zod                                                           |
| Theme         | next-themes (dark default, light toggle, persisted)           |
| CMS + intake  | Airtable REST API (server-side only, via Personal Access Token) |
| Email         | Resend (optional, degrades gracefully)                        |
| Deploy target | Railway                                                       |

No database server, no auth, no Stripe/e-commerce, no Prisma.

---

## Environment variables

Copy `.env.example` → `.env.local` for local dev, and set the same variables in Railway's **Variables** tab for production. Only `NEXT_PUBLIC_*` variables are exposed to the browser; everything else is server-only.

| Variable                   | Required | What it is                                                                 |
| -------------------------- | -------- | -------------------------------------------------------------------------- |
| `AIRTABLE_PAT`             | Yes\*    | Airtable Personal Access Token (server-side only). Scopes: `data.records:read`, `data.records:write`, `schema.bases:read`. |
| `AIRTABLE_BASE_ID`         | Yes\*    | Base ID, starts with `app…`                                                |
| `REVALIDATE_SECRET`        | Yes      | Secret protecting `POST /api/revalidate`. Use a long random string.        |
| `NEXT_PUBLIC_SITE_URL`     | Yes      | Full deployed URL (e.g. `https://9thward.up.railway.app`). Used for canonical/OG/sitemap. |
| `RESEND_API_KEY`           | Optional | Enables email notifications on form submits.                               |
| `NOTIFICATION_EMAIL`       | Optional | Where submission alerts are sent.                                          |
| `RESEND_FROM_EMAIL`        | Optional | Verified Resend "from" address. Defaults to Resend's test sender.          |
| `NEXT_PUBLIC_ANALYTICS_ID` | Optional | If set, mounts the (cookieless) Plausible script. Value = your domain.     |

\* The site **builds and renders without Airtable configured** — pages show empty states. No content or form intake works until Airtable is wired up. Follow **[AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)** to create the base.

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#   then fill in AIRTABLE_PAT, AIRTABLE_BASE_ID, REVALIDATE_SECRET, NEXT_PUBLIC_SITE_URL
#   (leave the empties in place if you just want to see the UI with empty states)

# 3. Run the dev server
npm run dev            # http://localhost:3000

# Other scripts
npm run build          # production build (output: "standalone")
npm start              # serve the production build on $PORT (default 3000)
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
```

---

## Deploying to Railway

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo** and pick the repo. Railway auto-detects Next.js.
3. Open the service → **Variables** tab → add every variable from the table above.
4. Deploy. Railway runs `npm run build`, then `npm start` (which runs `next start -p ${PORT:-3000}` — the app binds to Railway's injected `$PORT`).
5. Load the site. Confirm reads (roster/releases render) and a test write (submit the contact form and check it lands in the Airtable `ContactMessages` table).

`next.config.mjs` sets `output: "standalone"` for a lean production server, and configures `images.remotePatterns` for Airtable attachment CDNs plus common cover-art/artist image hosts.

---

## Content model

All content lives in **Airtable** (see AIRTABLE_SETUP.md for the full schema). The code reads via typed readers in `lib/airtable/read.ts` and never crashes a page over one malformed row. If Airtable is empty or unreachable, the site renders empty states — there is no hardcoded fallback roster.

Services copy on `/services` and the About page copy are the brand's real approved copy; the `Services` page prefers Airtable records and falls back to the built-in copy if the table is empty.

---

## Caching & Airtable rate limits

Airtable enforces **5 requests/second per base** and a low monthly call cap on cheaper plans, so the site does **not** hit Airtable on every page view:

- Every reader uses Next.js ISR: `fetch(..., { next: { revalidate: 300, tags: [...] } })` — content is cached for **5 minutes** and served from cache in between.
- The client (`lib/airtable/client.ts`) implements **exponential backoff on HTTP 429** (respects `Retry-After`, retries up to 3 times).
- Reads are lazy/per-request and wrapped in try/catch that returns empty arrays, so a missing token or a transient Airtable error never breaks `next build` or a page render.

### On-demand revalidation

When you edit the Airtable base and want the site to refresh immediately (instead of waiting out the 5-minute window), POST to the revalidation route:

```bash
curl -X POST "https://YOUR_SITE/api/revalidate?secret=YOUR_REVALIDATE_SECRET&tag=artists"
```

Valid `tag` values: `artists`, `releases`, `events`, `services`, `posts`. The route returns **401** on a bad/missing secret and **400** on an invalid tag. You can wire this to an **Airtable automation** (when a record changes → send a webhook to this URL) for automatic refreshes.

---

## Forms & spam protection

The four Next.js intake forms all follow the same pattern (server actions in `app/actions/forms.ts`, Zod schemas in `lib/validation/schemas.ts`). The `/submit` page is different: it embeds an Airtable-hosted form that writes directly to the `Artists` table — no server action, no Zod schema, no Resend hook.

| Form                     | Writes to Airtable table | How |
| ------------------------ | ------------------------ | --- |
| `/submit`                | `Artists`                | Embedded Airtable form (page `pagxwnnGAwHRT7m1e`) |
| `/contact` (general)     | `ContactMessages`        | Next.js server action |
| Booking (events + contact) | `BookingRequests`      | Next.js server action |
| Service inquiry (services modal) | `ServiceInquiries` | Next.js server action |
| Newsletter (footer)      | `NewsletterSignups`      | Next.js server action |

Each submission:

1. Checks a **hidden honeypot** field (`hp_field`) — if filled, it silently "succeeds" without writing (bot deterrent).
2. **Rate-limits by client IP** using an in-memory Map (60-second window). This works on a single Railway instance; a multi-instance deployment would need a shared store (Redis/Upstash) — see the note in `lib/rate-limit.ts`.
3. Validates server-side with Zod (inline field errors; user input is never lost on error).
4. Writes to Airtable (stamping `Submitted At`, `Status = "New"`, `Source = "website"`).
5. Sends a Resend email notification **if configured** — if not, the form still writes to Airtable and succeeds.

---

## SEO & performance

- Per-page metadata + `generateMetadata` on `/artists/[slug]`, `/music/[slug]`, `/blog/[slug]` (title/description/OG image from the record).
- JSON-LD: `Organization` + `MusicGroup` (label) site-wide; `MusicGroup` per artist; `MusicAlbum`/`MusicRecording` per release; `MusicEvent` on events; `BreadcrumbList` on interior pages.
- Dynamic `sitemap.xml` (includes all Airtable slugs) and `robots.txt`.
- `next/image` everywhere with a themed placeholder when an attachment is missing (never a broken image).
- Music players (`components/site/music-embed.tsx`) are **lazy-mounted via IntersectionObserver** and use `<iframe loading="lazy">`, so below-the-fold players never block render.

---

## Project structure

```
app/
  layout.tsx            # root layout, fonts, theme, nav/footer, site-wide JSON-LD
  page.tsx              # Home
  artists/              # roster grid + [slug] EPK
  music/                # releases grid + [slug] smart link
  events/               # upcoming + past shows, booking CTA
  services/             # 3 services, inquiry modal (no pricing)
  submit/               # embedded Airtable form → Artists table
  blog/                 # list + [slug] markdown article
  about/                # brand About copy (verbatim)
  contact/              # contact + booking forms, socials
  actions/forms.ts      # all form server actions
  api/revalidate/       # on-demand ISR revalidation
  sitemap.ts, robots.ts
components/
  ui/                   # shadcn/ui primitives
  site/                 # Nav, Footer, cards, embeds, forms, motion, logo…
lib/
  airtable/             # client, config (field contract), types, read, write
  email/resend.ts       # optional notifications
  validation/schemas.ts # Zod schemas
  rate-limit.ts         # in-memory IP rate limiter
  jsonld.ts, site.ts, embed.ts, fonts.ts, utils.ts
```

---

## Assumptions (worth confirming)

- **Contact email** in `lib/site.ts` (`info@9thwardproductions.com`) is a placeholder — confirm the real address.
- **Office ZIP code** in `lib/site.ts.address.postalCode` is set to `77056` (Post Oak / Galleria area). Update if different.
- **Social placeholders:** Facebook and SoundCloud are the real, known accounts. Instagram/Spotify/YouTube/TikTok render as muted "coming soon" icons until you add real URLs in `lib/site.ts`.
- **One Airtable base** holds everything.
- **Accent color:** deep near-black base, NOLA purple primary, gold secondary accents — chosen to sit well against roster imagery, WCAG 2.2 AA.
