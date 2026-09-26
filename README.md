# عقدكم (aqdkm) — Rental Contract Documentation Requests

Arabic (RTL) platform for submitting residential and commercial rental-contract
documentation requests through guided smart forms, with a Sanity CMS backend
(requests inbox, contact messages, blog, FAQs, fees, social links, analytics).

## Routes

| Route | Content |
|---|---|
| `/` | Full-screen hero, contract-type tabs (both smart forms), steps, blog teaser, CMS FAQs |
| `/residential` | Residential smart form (standalone page) |
| `/commercial` | Commercial smart form (standalone page) |
| `/contact` | Contact info (phone / email / socials from CMS) + contact form |
| `/track` | Public request tracking: non-PII summary by request number + full detail behind applicant-phone check |
| `/request/success?no=REQ-…` | Conversion receipt after submit (`noindex`); refetches the non-PII summary; pushes `request_submitted` to `dataLayer` |
| `/request/success?no=REQ-…` | Conversion receipt after submit (`noindex`); refetches the non-PII summary; pushes `request_submitted` to `dataLayer` |
| `/blog` | Blog index + category chips, numbered `?page=` pagination (9/page, SEO anchors) |
| `/blog/[slug]` | Article page (SSG) with related CTA |
| `/blog/category/[slug]` | Category page (SSG) |
| `/newsletter/confirm` | Double opt-in confirmation (explicit click, token + expiry) |
| `/newsletter/unsubscribe` | One-step unsubscribe (email prefilled from link) |
| `POST /api/revalidate` | Sanity webhook: signature-checked cache revalidation (blog + type tags; request/contact/subscriber docs ignored) |
| `POST /api/broadcast/send` | Studio "Publish & notify": token + zod-guarded single-post broadcast |
| `/admin/[[...tool]]` | Embedded Sanity Studio (isolated root layout, no site chrome) |

Two root layouts keep URLs unchanged: `app/(site)/layout.tsx` (full
`<html lang="ar" dir="rtl">` shell) and `app/admin/layout.tsx` (bare
`<html>`/`<body>` shell, no `lang`/`dir`, no site chrome — the Studio brings
its own English LTR UI; never force RTL on it). The admin favicon resolves
via the `app/favicon.ico` convention; the site uses explicit metadata icons
(`public/logo/favicon*.ico`).
`main` is unconstrained; each page owns its `max-w-6xl` container.

## Stack & toolchain

- Next.js `16.3.5`, React 19, TypeScript (strict, `tsc --noEmit` clean)
- HeroUI v3 compound API only (`@heroui/react`) — docs: `heroui.com/docs/react/...`
- Tailwind CSS v4, `tw-animate-css`, `framer-motion@13.3.0`
- Sanity: `next-sanity`, `@sanity/client@7`, `groq@6`, `@portabletext/react@8`
- `next-themes` (class strategy + animated sun/moon toggle), `react-icons` only
  (`md`/`fa`/`fa6`/`ri`/`bs`/`pi`/`bi`/`hi2`/`si` — `si` solely for the header
  home icon); `lucide-react` is used solely for
  the mobile-menu `Menu`/`X` icons
- Package manager: `pnpm`. Never stage / stash / commit unless asked.

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

`.env.local` (plain `KEY=value` lines — values may be quoted, dotenv strips
the quotes; copy from the committed
`.env.example`, which is explicitly un-ignored in `.gitignore`):

```bash
cp .env.example .env.local
```

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` | Read path (homepage, blog, settings) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Pinned Sanity API version (required — build breaks without it) |
| `SANITY_API_TOKEN` | Editor-role token — Server-Action writes only (never `NEXT_PUBLIC_`) |
| `SANITY_REVALIDATE_SECRET` | Shared secret for POST /api/revalidate (Sanity webhook signature) |
| `RESEND_API_KEY` / `RESEND_FROM` | Newsletter + admin mail sending |
| `RESEND_SEGMENT_ID` | Newsletter audience segment (optional for contact sync; **required** for post broadcasts — empty breaks `/api/broadcast/send`) |
| `ADMIN_EMAIL` | Admin inbox for all-fields new-request notifications (failures logged, submissions always succeed) |
| `NEXT_PUBLIC_BROADCAST_TOKEN` | Shared token authorizing the Studio Publish & notify action (idempotent post broadcasts only) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for sitemap/metadata (defaults to `http://localhost:3000`) |

Studio lives at `/admin`. IDs are Sanity-generated; drafts stay in
`localStorage` (`aqdkm-draft-*`) until submitted.

## Sanity CMS

| Schema | Kind | Notes |
|---|---|---|
| `rentalRequest` | document | Groups: general / parties / property / terms; statuses new → reviewing → approved → completed / cancelled; user-filled fields are **read-only**, field titles bilingual (`English / العربية`); every submit emails the all-fields table to `ADMIN_EMAIL` (skipped with a server log when unset) |
| `contactMessage` | document | `name/phone/email/message` are **read-only** (staff never edits submissions); `status` uses the `StatusTabs` tab input; `submittedAt` read-only |
| `siteSettings` | singleton | Groups: general (fees, `supportPhone`, `email`, `faqs[]`) / social (`socialLinks[]`) / analytics (`gaMeasurementId`, `gtmId`) |
| `post` / `category` / `author` | documents | Blog group in Studio; FAQs moved from a `faq` type into `siteSettings.faqs[]` |
| `subscriber` | document | Newsletter double opt-in; user fields read-only; status via radio (`pending/confirmed/unsubscribed`) |

Custom Studio inputs (`sanity/lib/components/`): `PlatformSelect` (social
tab buttons), `FeesInput` (fee matrix), `StatusInput` (configured badge),
`StatusTabs` (message-status tabs). Studio nav (`sanity/structure.ts`):
singleton settings, Requests / Residential / Commercial (each with per-status
filters), Messages (newest first), Newsletter + Subscribers, Blog.

Type generation (commit the outputs):

```bash
npm run typegen   # sanity schemas extract + sanity typegen generate
```

Conventions: `sanity.types.ts` + `schema.json` are committed; call sites use
explicit `as *_RESULT` casts + `stegaClean` (no type augmentation reliance);
writes go through the cached-sync `getWriteClient()` Server Actions
(`sanity/lib/actions.ts`): `submitRentalRequest` + `submitContactMessage`
(write), `getRequestStatus` / `getRequestDetail` (reads — the latter gated on
applicant phone). Shared request/form types live in `lib/request-form.ts`
(never import types from `"use client"` components or server-action modules).

Server-Action boundary rules:
- Never pass client class instances (`CalendarDate`) — serialize to strings
  on the client first (`SerializedFormState`; calling `.toString()` on a client
  reference server-side throws).
- Capture `e.currentTarget` into a local before any `await` — React nulls it
  once the handler yields, so `form.reset()` after `await` throws.

## Forms & fees

- `SmartForm` (6 steps: role → parties → deed/location → terms → unit →
  review) with draft restore, autosave indicator, sticky fee sidebar
  (`FeeSummary` + mobile bottom bar, explainer sums derived from the active
  `FeeConfig`), and a matching `SmartFormSkeleton`
  shown during the ~500 ms draft-restore window. Commercial step-4 adds the
  activity/license section; the commercial entity branch collects the entity
  name; commercial-individual collects the counterparty name.
- Validation lockdown: every gated field carries an `error={err(...)}` message
  (selects, numbers, dates, conditional `..."other"`/branch fields) — no
  asterisk-only fields. The review `تأكيد` button runs `validateAll()` over
  steps 0–4 first: on failure it jumps to the offending step with highlights on
  and a step-named toast, so free stepper/review navigation can never smuggle
  invalid data to submit. `submitRentalRequest` re-checks everything server-side
  (`assertValidRentalRequest`, shared `validators`) — empty `bedrooms`/
  `bathrooms` are rejected, not written as `""`.
- Fee math (`lib/fees.ts`): `years = max(1, ceil(months/12))`; residential
  125 + 125/yr; commercial 200 + 200 first year, 400 + 400 extra — all
  CMS-overridable via `FeeConfig` / `DEFAULT_FEE_CONFIG`.
- Contact form (`components/contact/`): HeroUI `Form` (`validationBehavior="aria"`,
  `FormData` submit, `FieldError`s), toast feedback, writes `contactMessage`.
- WhatsApp float (`components/shell/whatsapp-float.tsx`): site-wide button fed
  by the WhatsApp URL in Site Settings → Social Media Links; hidden when none
  is configured. Bottom-start, lifted above the mobile fee bar.
- Request tracking (`components/track/` + `getRequestStatus` /
  `getRequestDetail`): the summary lookup returns only
  `requestNo/contractType/status/submittedAt/feeTotal/annualRent/feePayer` —
  no names, IDs, phones, or deed data ever leaves Sanity. The full detail view
  additionally requires the applicant phone recorded on the request (wrong
  phone → summary only + mismatch notice). Summary rows share
  `components/request/summary-row.tsx` with the success page; status Arabic
  labels are centralized in `REQUEST_STATUS_AR` (`lib/request-fields.ts`).
- Field-name convention (`lib/request-fields.ts` `FIELD_LABELS`): one
  `{ en, ar }` map per request field feeds the bilingual schema titles, the
  track detail labels, and the admin email rows — rename once, everywhere. Result/status chips
  carry state icons; commercial contract chips use the alt-soft wash.
- Conversion tracking: successful submit navigates to
  `/request/success?no=REQ-…` (`noindex`), which refetches the summary and
  pushes `{ event: "request_submitted", requestNo, contractType, value }` to
  `dataLayer`. Use the URL itself as the Google Ads website-conversion page;
  use the `request_submitted` event for GTM triggers. No Ads event tag is
  emitted by the app. Full setup: [Conversion tracking (GTM / Google Ads)](#conversion-tracking-gtm--google-ads).
- Newsletter (`components/newsletter/`, `lib/newsletter-actions.ts`,
  `lib/subscribers.ts`, `lib/email.ts`, `emails/`): double opt-in —
  footer signup → pending `subscriber` + Resend contact (opted out) → confirm
  email (`/newsletter/confirm?token=`, 24 h expiry, explicit click only) →
  confirmed + welcome mail. Unsubscribe (`/newsletter/unsubscribe`) flips status
  and globally opts out in Resend without leaking subscription state. Cover art
  is `public/emails/cover-header.jpg`, rasterized from `PostCoverSvg`.
- New-post broadcasts: Studio "Publish & notify" action (first publishes only;
  edits publish silently) calls `POST /api/broadcast/send` same-origin with the
  broadcast token;   `maybeBroadcastNewPost` skips drafts, already-sent, slug-less
  and future posts, records `broadcastSentAt`/`broadcastId` on the post for
  idempotency. No webhook auto-send by design (single Sanity webhook is
  revalidate-only).
- Cache revalidation (`app/api/revalidate/route.ts`): Sanity webhook POST with
  `SANITY_REVALIDATE_SECRET` signature; revalidates `blog` + document-type tags.
  Private high-frequency types (`rentalRequest`, `contactMessage`, `subscriber`)
  are guard-ignored. Reads carry `next.tags` (`siteSettings`/`post`/`category`),
  so the webhook actually invalidates. Manual step: create the webhook in the
  Sanity dashboard with a GROQ filter on published documents.
- Currency: `Intl.NumberFormat("ar-SA-u-nu-latn", { style: "currency",
  currency: "SAR", maximumFractionDigits: 0 })`, currency part replaced by
  plain-text `ر.س` (`CURRENCY_SYMBOL`, `lib/fees.ts`). Web surfaces render
  amounts with the Lucide `SaudiRiyal` icon (`components/price.tsx`, +
  `priceText()` for clipboard); mail templates keep `ر.س` text (inbox-safe).
- Skeletons mirror their content by construction: `SmartFormSkeleton` copies
  the step-0 grid (columns, stepper shapes, toolbar, sidebar, mobile fee bar);
  the hero `NewItemsLoading` rows copy the receipt card; `PostCardGridSkeleton`
  copies the blog card (cover, chips, title, excerpt, meta) with `loading.tsx`
  boundaries on `/blog` and category pages. Guard heights with
  `min-h-*` so staged transitions never jump.
- Heading order is machine-checked per page: exactly one `h1`, no skipped
  levels (`Card.Title` renders `h3` — use native `h2`/`h1` with `card__title`
  classes where the level demands it).

## Conversion tracking (GTM / Google Ads)

Every successful submission lands on `/request/success?no=REQ-…`, which pushes
one `dataLayer` event (`components/request/success-ping.tsx`):

```js
{ event: "request_submitted", requestNo: "REQ-2026-000001", contractType: "residential", value: 250 }
```

`value` is the fee total (SAR). The event fires on every success-page mount —
including refreshes; dedupe in reporting (Ads counting setting), not in code.
No Ads/GA event tag is emitted by the app; all of the below lives in the
GTM container + Ads dashboard.

### GTM setup (container ID from Site Settings → `gtmId`)

1. **Variables** — enable built-ins `Event`, `Page URL`; create Data Layer
   Variables `requestNo`, `contractType`, `value` (Version 2, default: none).
2. **Trigger** — Custom Event, event name `request_submitted`, all pages.
   (Backup/alternative: Page View trigger, URL contains `/request/success`.)
3. **Tags**
   - *Google Ads Conversion*: Conversion ID + Label from Ads
     (Tools → Conversions → the website conversion on this URL); set
     Conversion Value to `{{DLV - value}}`, Currency to `SAR`; fire on the
     Custom Event trigger.
   - *GA4 Event* (optional): event name `generate_lead`, parameters
     `contract_type = {{DLV - contractType}}`, `value = {{DLV - value}}`,
     `transaction_id = {{DLV - requestNo}}`; same trigger.
4. **Preview → publish.** Submit a test request, confirm `request_submitted`
   with all three variables in Preview, then publish the container version.

### Do not double-count page_views

The app loads GA4 via `@next/third-parties/google` (`components/analytics.tsx`)
**and** the GTM container. Never add a GA4 *Configuration* tag inside GTM —
`page_view` would fire twice. GTM is for Ads conversions + custom events only.

### Google Ads side (no code)

Conversions → New conversion action → Website → URL rule: *URL contains*
`/request/success`. Counting: `One` (per ad click) is the sane default for a
lead form; `Every` if repeat submissions per click are meaningful.

## Visual identity

- **Language/dir:** `<html lang="ar" dir="rtl">`; Arabic-first font stack —
  IBM Plex Sans Arabic (300–700 via `next/font`) + Inter, Tahoma fallback.
  Phone/email inputs are explicitly `dir="ltr"`.
- **Accent:** Saudi green — light `#00803d`, dark `oklch(72% 0.16 154)`.
  Green owns brand surfaces, CTAs, icons, washes.
- **Alt:** logo orange `--alt: #fc7c00` (both themes, `bg-alt`/`text-alt`/
  `border-alt` utilities via `@theme inline`). Orange strictly marks
  *interaction*: hovers, active nav pills, selected cards/rings, stepper
  progress, `::selection`, `--focus` rings, commercial soft chips
  (`bg-alt/10 text-alt`). Never a static brand surface.
- **Logo:** `public/logo/logo.svg` (monochrome green) + `public/logo/logo-alt.svg`
  (green + orange). `components/logo.tsx` is theme-aware via pure CSS — light
  mark in light mode (`dark:hidden`), alt mark in dark mode (`dark:block`), no
  JS, no flash, duplicate is `aria-hidden`. Rendered via `next/image`
  (`h-8 w-auto`) beside the عقدكم wordmark; used in header + linked footer
  logo. The blog-cover medallion embeds the same mark as a watermark
  (`<image href="/logo/logo.svg">`, maqrat-blog pattern).
- **Favicons:** `public/logo/favicon.ico` (light) + `public/logo/favicon-alt.ico`
  (dark), wired via the Metadata `icons.icon` array with
  `media: "(prefers-color-scheme: dark)"` on the dark entry — follows the *OS*
  scheme, not the in-app toggle. All brand assets live under `public/logo/`.
  Browsers cache favicons aggressively per URL: verify artwork swaps in a fresh
  profile, or version the URL (`?v=2`).
- **Footer:** quick links (no home link — logo covers that), contact column
  (`tel:` phone + `mailto:` email from CMS), socials, copyright bar.
- **Surfaces:**

  | Token | Light | Dark |
  |---|---|---|
  | `--background` | `oklch(98.6% 0.0035 154.06)` | `oklch(8% 0.012 154.06)` |
  | `--surface` | `oklch(100% 0.0008 154.06)` | `oklch(21.03% 0.003 154.06)` |
  | `--foreground` | `oklch(21.03% 0.0015 154.06)` | `oklch(99.11% 0.0015 154.06)` |
  | `--muted` | `oklch(44% 0.012 154.06)` | `oklch(78% 0.012 154.06)` |
  | `--border` | `oklch(90% 0.0015 154.06)` | `oklch(28% 0.0015 154.06)` |

- **Background system:** `.site-shell` (grain + top glow + banded wash). Light
  mode overrides to a near-white base with three discrete green light sources;
  the hero adds its own strong top glow (45%) + soft bottom glow (25%) plus a
  dot grid and `noise.gif` overlay.
- **Radius:** `--radius: 0.75rem` (`rounded-2xl` dominant; `rounded-3xl` fee/summary
  cards; `rounded-full` pills/avatars; header pill `md:rounded-md`).
- **Header:** reference geometry — `max-w-4xl` → scrolled `md:max-w-3xl`
  blur pill, `h-14` → `md:h-12`, portal-based mobile menu, sun/moon toggle on
  desktop and next to the mobile menu button. Six labels can't fit the condensed
  bar, so links collapse to an icon rail on scroll (`sr-only` labels,
  `aria-label` kept) inside a nowrap flex row — wrapping is structurally
  impossible.
- **Blog covers:** `PostCoverSvg` is `viewBox="0 0 800 400"` to match the
  `aspect-2/1` frame under `slice` (zero crop); artwork baseline is y=400.
- **Rules:** no hex colors outside `globals.css` (token `color-mix` only);
  logical properties in RTL (`ms-/me-/ps-/pe-/start-/end-`); `space-x-reverse`
  with negative space; `overflow-x-clip` on `main`.

## Verification

```bash
npm run typegen
npx tsc --noEmit
npx eslint app/ components/ sanity/ lib/ hooks/
npm run build
```

Write path can be probed with a throwaway script that creates, reads back,
and deletes a `contactMessage` via the write client (token required).

## Known issues (deferred, non-blocking)

- Custom-duration fee math in `submitRentalRequest` can diverge from stored
  `customMonths` (`sanity/lib/actions.ts` vs `lib/fees.ts`).
- `PostCardGrid` prop type only matches the blog-index call site; latest-posts
  and category results are structurally compatible but untyped as such.
