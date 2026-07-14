# TechStore — Project Guide for Claude Code

## What this is
A small e-commerce site for electronics/tech gadgets. Dark "Instrument
Panel" design theme (engineered, datasheet-like — not generic SaaS dark
mode). Frontend is built; backend/admin is in progress.

## Tech stack
- Next.js 16 (App Router), TypeScript, React 19
- Tailwind CSS v4 — config lives in `src/app/globals.css` via `@theme
  inline`, there is no `tailwind.config.js`
- shadcn/ui-style components (hand-built, not pulled from the CLI registry
  — Radix primitives + CVA + Tailwind), in `src/components/ui/`
- Framer Motion for animation, Lucide React for icons
- `next-themes` for light/dark mode (class strategy, default theme: dark)
- Backend (in progress): Supabase (Postgres) + Prisma, Stripe Checkout +
  webhooks, custom admin panel under `src/app/admin/*`

## Design tokens (globals.css)
- Colors are OKLCH-based CSS variables: `--background`, `--surface`,
  `--border-hairline`, `--muted-foreground`, `--primary` (signal amber —
  the one accent color, used deliberately, not sprinkled everywhere)
- `:root` = light mode, `.dark` = dark mode (the brand default)
- Fonts: Space Grotesk (`--font-display`, headings only), Inter
  (`--font-sans`, body), JetBrains Mono (`--font-mono`, prices/specs/SKUs)
- `.grid-texture` utility = the subtle PCB-grid background used behind
  hero sections — the one signature background texture, don't overuse it

## Shared components — use these, don't re-implement inline
- `src/components/shared/container.tsx` — `mx-auto max-w-7xl px-4
  sm:px-6 lg:px-8`. Every top-level page section wraps in this. If a
  section's left/right edge doesn't line up with others, it's almost
  always because that section skipped `Container` and hand-rolled its
  own padding instead.
- `src/components/shared/section-heading.tsx` — eyebrow + title +
  description, with an optional `action={{ label, href }}` prop that
  pins a "View all →" link to the same row as the title (title left,
  link right). Don't pair `align="center"` with `action` — the row
  layout wins automatically in that case since centered-title +
  right-pinned-link doesn't make visual sense together.
- `src/hooks/use-has-mounted.ts` — for any component reading client-only
  state (localStorage cart count, theme, etc.) that would otherwise cause
  a hydration mismatch. Use this, NOT `useState(false)` +
  `useEffect(() => setMounted(true), [])` — that pattern triggers a
  "setState synchronously within an effect" warning on newer React.
  `useHasMounted` uses `useSyncExternalStore` instead, which is the hook
  React actually intends for this exact case.

## Mobile rules (hard-won during this build — don't regress these)
- Any `<input>`/`<select>`/`<textarea>` must be ≥16px font-size below the
  `sm` breakpoint, or iOS Safari auto-zooms on focus. There's a global
  guard for this in `globals.css`, but be explicit in new components too
  (`text-base sm:text-sm`), don't rely on the global rule alone.
- `button, a, [role="button"], input, select, summary` all have
  `touch-action: manipulation` globally, to stop double-tap-to-zoom.
  Never add `maximum-scale=1`/`user-scalable=no` to fix zoom issues —
  that disables pinch-zoom entirely, which fails WCAG 1.4.4.
- Hover-only interactions (e.g. a "quick add to cart" button revealed on
  `group-hover`) are invisible on touch devices, since there's no hover
  state to trigger them. Gate hover-reveal behind `md:` and make the
  element visible by default below it, or the feature is unreachable on
  mobile.
- Tailwind's arbitrary `shadow-[...]` syntax does NOT hook into
  `--tw-shadow-color` the way built-in `shadow-lg`/`shadow-xl` do —
  pairing an arbitrary shadow value with a `shadow-<color>/<opacity>`
  utility silently does nothing. Use the built-in size utilities when you
  need a colored shadow.
- Never put `banner`/`ads`/`ad` in an image path or folder name
  (`/images/banners/...`) — ad blockers commonly filter URLs containing
  those substrings, and it silently breaks images only on devices running
  a blocker (easy to miss since it works fine without one).
- Category/filter chip rows: horizontal scroll + snap on mobile
  (`overflow-x-auto snap-x`, with the `.scrollbar-hide` utility), wrap
  and center from `sm` up. Don't force wrapping on narrow screens.

## Known cross-file type gaps
The `Product` type in `src/types/product.ts` in this scaffold is a
simplified version — the actual working copy of this project (where most
of the recent component work has happened) has additional fields like
`discountPercent` and `colors: { name: string }[]`. If Prisma schema work
references fields not in this file's `Product` interface, check against
actual usage in components first before assuming it's a bug.

## Current status / next steps
Frontend: Navbar, mobile nav, footer, hero (sidebar + banner variant),
categories, product cards, product filters, checkout flow (multi-step,
Cambodia-specific delivery logic — Phnom Penh geolocation share vs.
province/district selection), light/dark theme toggle — all built.

Backend: not started. See `techstore-backend-prompt.md` for the full
spec (written as user stories) — Supabase + Prisma schema, admin auth,
admin product/order CRUD, Stripe Checkout + webhook, in that order.