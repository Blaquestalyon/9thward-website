# 9th Ward Website — Handoff Doc

**Purpose:** Drop this whole file into a fresh Perplexity Computer chat to resume website editing without re-explaining anything. Everything Computer needs — repo, stack, conventions, deploy path, gotchas — is below.

---

## 0. First prompt to paste in a new chat

> I'm continuing work on the 9th Ward Recording website. Repo: `Blaquestalyon/9thward-website` on GitHub. Live at `https://www.9thwardrecording.com`. Please read `HANDOFF.md` in the repo (or the pasted copy below) before doing anything, then help me with: **\<your request\>**.
>
> Ground rules: push to GitHub only (no Railway CLI), keep the local workspace at `/home/user/workspace/9th-ward-site/`, run `npm run build` before every commit, and follow the commit-message style already in the log.

---

## 1. Project at a glance

| Field | Value |
| --- | --- |
| **Product** | 9th Ward Recording — Houston recording studio + label site |
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

## 2. Repository map

```
9th-ward-site/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, fonts, theme, nav/footer
│   ├── page.tsx                  # Home
│   ├── globals.css               # Tailwind base + theme tokens
│   ├── about/                    # Studio origin story, founders, timeline
│   ├── artists/                  # Roster (featured: Blaquestalyon, S4TF, Var Don)
│   ├── music/                    # Releases / catalog
│   ├── events/                   # Upcoming shows
│   ├── services/                 # Studio services + pricing
│   ├── blog/                     # Editorial posts
│   ├── contact/                  # Contact form (WORKING as of 07 Jul 2026)
│   ├── submit/                   # Artist demo submissions
│   ├── actions/forms.ts          # ALL server actions (contact/booking/submit/inquiry/newsletter)
│   ├── api/revalidate/           # ISR revalidation webhook (uses REVALIDATE_SECRET)
│   ├── icon.png, apple-icon.png  # Favicons
│   ├── robots.ts, sitemap.ts     # SEO
│   ├── global-error.tsx          # Error boundary
│   └── not-found.tsx             # 404
├── components/
│   ├── site/                     # Domain components (nav, footer, forms, cards, hero, etc.)
│   └── ui/                       # shadcn/ui primitives
├── lib/
│   ├── airtable/
│   │   ├── config.ts             # Base ID + table ID map (single source of truth)
│   │   ├── client.ts             # fetch wrapper + createRecord + createRecordDetailed
│   │   ├── read.ts               # Public reads (artists, releases, events, etc.)
│   │   ├── write.ts              # Form writes (submissions, contact, booking, etc.)
│   │   ├── seed.ts               # One-off seed data
│   │   └── types.ts
│   ├── email/                    # Resend wrapper (sendNotification)
│   ├── validation/schemas.ts     # Zod schemas for every form
│   ├── site.ts                   # SITE config (name, urls, socials, ventures)
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

All set in Railway's dashboard, NOT via CLI. The user does not want Railway CLI walkthroughs.

| Name | Purpose | Notes |
| --- | --- | --- |
| `AIRTABLE_PAT` | Airtable personal access token | Starts with `pat`, needs `data.records:read` + `data.records:write`, granted access to the "9th Ward Website" base only |
| `AIRTABLE_BASE_ID` | Airtable base ID | Must be exactly `app3HHnUsEOOvO9ND` (a typo here caused a 404 storm — see §7) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `https://www.9thwardrecording.com` |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Next 15 server-action encryption key | Currently `GzcPNv2ss6vWlJrA2pIxx2cmCdpeXRR/MeePtlklazc=` — MUST be stable across deploys or all forms break |
| `REVALIDATE_SECRET` | ISR webhook auth | `86vAqc3uwwtYp06Cjr2M4oonm-vb1xcOqg-HXGZCA-o` |
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
| Services | `tblYz9f1CnsSq7Fxu` | Read | Studio services + pricing |
| BlogPosts | `tbleLDWtXhb87ZMmN` | Read | Editorial |
| Submissions | `tblEYKGWiojfhVUxy` | Write | Demo submissions from /submit |
| BookingRequests | `tblK44zds6j4lxU1K` | Write | Session booking requests |
| ServiceInquiries | `tblKGXBwc6xPQtur8` | Write | Service inquiry form |
| ContactMessages | `tblOsTdKiYX7gitnA` | Write | /contact form |
| NewsletterSignups | `tbl1NXV2odVy7IK9H` | Write | Footer newsletter opt-in |

All write tables have a `Status` field with options `New` / `In Progress` / `Closed`. New records land as `New` (see `lib/airtable/write.ts`).

**Table ID map lives in `lib/airtable/config.ts` — never hard-code IDs elsewhere.**

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

If any form starts failing again, swap the action from `createContactMessage` → `createContactMessageDetailed` and surface `result.status` / `result.detail` in the returned `message`. Push, hard-reload, submit — the browser shows the exact Airtable error. Revert after fixing. This pattern already saved us once (see §7).

`[airtable]`-prefixed `console.log` / `console.error` calls also fire server-side and show up in Railway logs (when Railway is showing logs — sometimes it doesn't).

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
- `debug(<scope>): ...` for temporary diagnostic surfacing (must be reverted with a `cleanup(<scope>): ...` commit)

Railway build command: `npm run build`. Start: `npm start`. Health via Next's default.

### Verifying a deploy went out
1. Wait ~60-90s after push
2. Hard-reload the affected page in browser (Cmd/Ctrl+Shift+R) — Next 15 server-action hashes change per deploy, stale tabs throw `UnrecognizedActionError`
3. Check Railway dashboard → Deployments tab if things look wrong

---

## 7. Gotchas + hard-won lessons

1. **Never wrap server actions in a helper HOF.** `export const contactAction = guarded(...)` compiles but breaks Next 15's server-action registration → runtime `UnrecognizedActionError`. Always use `export async function contactAction(...)` and inline try/catch. Commit `4b74a95` reverted this mistake.
2. **`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` must be stable.** Without it, Next generates a fresh key per build → every deploy invalidates all previously-rendered form components in users' open tabs. Value is currently set in Railway; don't rotate it.
3. **Hard-reload after every deploy** if you're testing the same tab you had open before. Server-action hashes change per deploy.
4. **Airtable 404 `NOT_FOUND` means base ID mismatch, not PAT scope.** If it were a PAT issue you'd get 401/403. On 07 Jul 2026 the `AIRTABLE_BASE_ID` in Railway had a typo — Airtable returned 404 because the PAT couldn't find the (mis-typed) base. Debug workflow: swap to `createRecordDetailed`, include `[base=... table=... pat=***XXXX]` in the error surface, resubmit, compare against the known-good base ID `app3HHnUsEOOvO9ND`.
5. **Resend is optional.** `sendNotification` in `lib/email` returns early if `RESEND_API_KEY` is unset. Never make form success depend on email delivery.
6. **Every table already has "New" as a Status option.** If a write returns 422 UNKNOWN_FIELD_NAME, the field name in `lib/airtable/write.ts` disagrees with Airtable — fix the write, don't add fields via Airtable UI unless the user asks.
7. **Domain is `www.9thwardrecording.com`.** Not `9thwardproductions.com` (early planning name). Don't hard-code the old one anywhere.
8. **Don't use Railway CLI.** User pushes to GitHub; Railway auto-deploys. This is a hard preference.
9. **Rate limit is in-memory** (`lib/rate-limit.ts`). It resets on every deploy. Fine for now, but if you need durable rate-limiting later, add Upstash Redis.
10. **The `guarded()` helper does not exist anymore.** If you see it referenced in old chat context, ignore it — removed in commit `4b74a95`.

---

## 8. Current state (as of 08 Jul 2026)

- Contact form: **WORKING** end-to-end after Airtable base-ID typo fix
- Other write forms (booking, submit, service inquiry, newsletter): built and wired, use the same `createRecord` path — should work but not exhaustively re-tested since the fix
- Homepage, About, Artists, Music, Events, Services, Blog, Contact, Submit: all live
- ImUsed.ai feature block + featured YouTube videos + press strip: added in commit `06d3ab2`
- Logo: real 1080x1080 transparent PNG, live in nav/footer/hero
- Recent commits (newest first):
  - `75c5065` cleanup(contact): restore friendly WRITE_FAILED message
  - `821990f` debug(contact): include base/table/pat-tail in 404 error surface *(diagnostic, reverted by 75c5065)*
  - `2b8963e` debug(contact): surface exact Airtable failure reason to browser *(diagnostic, reverted by 75c5065)*
  - `4b74a95` fix(actions): restore direct async exports for server actions
  - `431f439` chore(icons): add app/icon.png, apple-icon.png, favicon.ico
  - `8bc0dd1` fix(forms): guard server actions and harden URL parsing
  - `6b27b21` feat(roster): feature Blaquestalyon, S4TF, Var Don on homepage
  - `06d3ab2` feat: ImUsed.ai feature block, featured YouTube videos, press strip
  - `2d1a3f4` chore: remove stray debug file and ignore gws.err
  - `7cf99c6` chore(logo): finalize 1080x1080 transparent PNG logo

---

## 9. Suggested next tasks (not committed to)

- Exercise + verify the other write forms (booking, submit, service inquiry, newsletter) with real submissions
- Add a lightweight `/admin/inbox` route (protected by a header token) to view contact submissions without opening Airtable
- Wire up Resend for real email notifications on contact/booking
- Add Plausible or PostHog for analytics
- Content pass on Services page (real pricing, packages)
- Blog post pipeline: draft first 3 posts and publish

---

## 10. Connectors + tools available in fresh Computer chat

For anything data-related, prefer connectors over browser automation:

- **GitHub** (`github_mcp_direct`) — push, PRs, issues; use `api_credentials=["github"]` in bash for git ops
- **Airtable** (`airtable_oauth__pipedream`) — direct reads/writes for verifying schema and testing without redeploy
- **Google Drive** (`google_drive`) — if the user shares assets there
- **Finance** — not relevant here

For website work: this codebase uses the `website-building` skill's conventions but is a plain Next.js repo, not a website-building sandbox project. Do NOT try to run `deploy_website` or `publish_website` on it — deploy is Railway via GitHub push.

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

**End of handoff.** Save this file at `/home/user/workspace/9th-ward-site/HANDOFF.md` and commit it. Paste its contents into any new Computer chat to resume.
