# Elite Transition (ET) — Claude Code Master Prompt

> Paste this whole file as your first message in a fresh Claude Code session, with the
> `design_handoff_et/` folder available in the working directory. Build in the order given.

---

## 0. What you're building

**Elite Transition (ET)** is a real-estate-investing education product for pro athletes — "turn game checks into owned assets." Tagline: **"Earn more than you owned."** There are **two surfaces**, and you are building **both in this one session**:

1. **Marketing site** (`/web`) — the public landing page. Mostly static/marketing.
2. **Product app** (`/app`) — the interactive learning app: onboarding → lesson map → lessons (cards + quiz + deal simulators) → rewards/XP/streaks → Pegasus AI advisor → profile/leaderboard/paywall.

They **share one brand system** (logo, color, type, tokens). Build the shared foundation FIRST, then both surfaces consume it. Do not duplicate tokens per surface.

The files in `design_handoff_et/` are **HTML/JSX design references** — prototypes that show intended look and behavior. **Recreate them in a real codebase using the framework below.** Do not ship the HTML directly.

---

## 1. Target stack

- **Monorepo** (pnpm workspaces or Turborepo).
- **Next.js (App Router) + TypeScript + Tailwind** for both `/web` and `/app`.
- Shared **`packages/brand`**: design tokens (CSS vars + Tailwind preset), the ET logo component, fonts, and primitive UI (Button, Card, Tag, etc.).
- Structure:
  ```
  /apps/web        → marketing site   (deploys to elitetransition.com)
  /apps/app        → product app      (deploys to app.elitetransition.com)
  /packages/brand  → tokens, logo, fonts, primitives  (imported by both)
  ```

---

## 2. Two Vercel deployments (do this — same session)

Create **two separate Vercel projects** from this one repo:

| Vercel project | Root directory | Domain |
|---|---|---|
| `et-web` | `apps/web` | `elitetransition.com` (apex) |
| `et-app` | `apps/app` | `app.elitetransition.com` (subdomain) |

- Use the Vercel CLI (`vercel link` / `vercel --prod`) or connect the Git repo and set the **Root Directory** per project in the dashboard.
- Each Vercel project gets its own build + its own URL. Both can deploy in this session.
- I (the user) will provide Vercel auth / token and confirm the domain. If a domain isn't ready, deploy to the default `*.vercel.app` URLs and leave domain wiring as a documented step.
- Ensure the monorepo build only rebuilds the surface that changed (Turborepo remote cache or Vercel "Ignored Build Step").

---

## 3. Brand system (`packages/brand`)

**Colors**
- Background: `#000000` (near-black). Surface `#141414`, surface-active `#1c1c1c`.
- Lines: `#252525`, `#3a3a3a`.
- Text: `#FFFFFF`, muted `#8A8A8A`.
- **Accent (primary): `#1E5BFF`** (electric blue) — used for CTAs, active states, highlights.
- App is **dark-first**. Keep saturation restrained; blue is the only chromatic accent.

**Type**
- **Inter Tight** — UI + headlines (weights 400–800; tight negative letter-spacing on big heds, e.g. `-0.03em`).
- **JetBrains Mono** — eyebrows, labels, stats, data (uppercase, wide letter-spacing ~`0.2em`).
- **Instrument Serif** (incl. italic) — occasional editorial accent in headlines.
- Load via `next/font` (Google). Don't hand-roll @font-face.

**Logo**
- The "ET" mark (blue rounded square, white "ET", heavy Inter Tight). There's also an animated logo (`et-logo.webm`) and arrow/striped variants in the bundle — expose the static mark as `<ETLogo/>` and keep the video as an optional hero treatment.

**Primitives to extract:** Button (filled-blue / outline), Card/surface, Tag/chip, eyebrow label, stat block, phone frame (app preview). Match radii, borders (`1px solid #252525`), and shadows from the references.

---

## 4. `/app` — the product app

Recreate the **ET2** app. Reference files (in bundle): `et2-app.jsx` (router/state), `et2-data.js` (curriculum), `et2-home.jsx`, `et2-map.jsx`, `et2-lesson.jsx`, `et2-onboard.jsx`, `et2-rewards.jsx`, `et2-pegasus.jsx`, `et2-sim-*.jsx`, `et2-screens-extra.jsx`, `et2-ui.jsx`.

**Navigation:** 3-tab bottom nav — **Home · Lessons · Pegasus**. Profile lives top-right (opens Profile → Leaderboard / Settings / Notifications / Paywall).

**Core flow:**
- **Onboarding** (first run) → sets goal, experience level, topics.
- **Home** — today's lesson, streak, progress %, module title.
- **Lessons map** — Module 01 "Your First Deal", 5 lessons, each ending in a simulator. Lesson states: locked / current / done.
- **Lesson** — intro → teaching cards → quiz (XP per correct) → **deal simulator** (Deal Spotter, Buy Box, Underwrite, Flip, Block) → **rewards** (grade, XP, streak).
- **Pegasus** — AI advisor screen.
- **Profile / Leaderboard / Settings / Notifications / Paywall.**

**State:** progress (completed lessons, XP, streak, sim grades, onboarded flag) currently persists in `localStorage` under `et2-progress-v1`. **This is prototype scaffolding** — design the data model for a real backend later, but a local/persisted store is fine for v1. No backend exists yet.

### ⚠️ Portfolio screen — NOT yet in the app
There is **no Portfolio screen in the app yet.** A `PortfolioScreen` design exists only in the marketing/reel code (`video/et-reel-screens.jsx`: 3 doors, $312K equity, $985K portfolio value, holdings list) and in an old 4-tab draft (`et-screens-3.jsx`).
**TODO for you:** build a real **Portfolio** screen in the app, using the reel's `PortfolioScreen` as the visual starting point. Decide nav placement with the user — likely a 4th tab (Home · Lessons · Portfolio · Pegasus) or reached from Home/Profile. Flag this as an open decision; don't silently pick.

---

## 5. `/web` — the marketing site

Recreate the landing page. Reference files: `ET Landing Page.html` (entry), `et-landing-1.jsx`, `et-landing-2.jsx`, `et-landing-3.jsx`, `et-landing-motion.jsx`, `journey/et-journey-screens.jsx`, `video/et-reel-*.jsx`.

- Dark, editorial, athlete-facing. Hero with the "Earn more than you owned" message and animated logo/product reel.
- Sections include: hero + waitlist, the 3-step product story (Learn → Rep → Own), animated app screens (map / Pegasus / spotter / portfolio), social proof ("Real players. Real portfolios."), and the closing "your career has an end date / your portfolio doesn't" CTA.
- Waitlist form is currently non-functional — wire to a real capture (e.g. a `/api/waitlist` route + your DB/email tool) or leave a clearly-marked stub.

---

## 6. Prototype vs. real (read before coding)

- **Real product scope:** the full UI, the curriculum content in `et2-data.js`, the lesson/quiz/sim flow, navigation, branding.
- **Scaffolding to replace later:** `localStorage` progress, fake leaderboard data, hardcoded portfolio numbers, the non-functional waitlist, any "Pegasus AI" responses that are canned. Build these behind interfaces so a backend can drop in.
- The `.jsx` files use inline Babel + global-scope component sharing — that's a prototyping constraint, **not** a pattern to carry over. Use proper ES modules/imports.

---

## 7. Build order

1. Scaffold monorepo + `packages/brand` (tokens, fonts, logo, primitives).
2. Stand up `/web` and `/app` Next apps importing `brand`.
3. Build `/app`: nav shell → onboarding → home → lessons map → lesson flow → rewards → Pegasus → profile/leaderboard/settings/paywall.
4. Build the **Portfolio** screen (confirm nav placement first).
5. Build `/web` landing sections.
6. Create both Vercel projects, deploy both, wire domains.

Ask me about: domain readiness + Vercel token, Portfolio nav placement, and whether the waitlist/Pegasus should be wired to a real backend now or stubbed.
