# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page React optin/lead capture page for P+ exclusive life insurance leads. Collects name + email via modal, POSTs to a GoHighLevel webhook, then shows a thank-you page linking to a Google Doc with pricing details.

## Commands

- `npm run dev` — local dev server (Vite)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally

No tests or linter configured.

## Architecture

Single-file React app (`src/App.jsx`) with three components, all inline-styled:

- **`App`** — root component, manages submitted/not-submitted state, loads Google Fonts
- **`OptInPage`** — landing page with value props and CTA button
- **`Modal`** — overlay form (name + email), POSTs to `WEBHOOK_URL` on submit
- **`ThankYouPage`** — post-submit page with link to `GOOGLE_DOC_URL`

Two constants at top of `App.jsx` control external integrations:
- `GOOGLE_DOC_URL` — pricing/availability document shown after optin
- `WEBHOOK_URL` — GoHighLevel webhook receiving lead data `{ name, email }`

## Deployment

Hosted on Vercel, connected to GitHub repo `montem-dk/insurance-leads-optin`. Pushes to `main` auto-deploy.

## Design

- Fonts: Instrument Serif (headings), IBM Plex Sans (body) — loaded via Google Fonts at runtime
- Color palette: off-white background (#FAFAF8), near-black text (#1A1A18), muted greys, green accents for availability/checks
- All styling is inline React style objects — no CSS files or framework
