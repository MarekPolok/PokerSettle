# Poker Settle

A shared, mobile-first web app for tracking poker buy-ins and cash-outs during trips, with an automatic "who owes who" report and an all-time leaderboard. See `SPEC.md` (if present) for the full product spec.

Stack: React + Vite + TypeScript + Tailwind CSS + React Router, Supabase (Postgres + Realtime) for the backend, deployed on Netlify.

## Local development

1. Copy `.env.example` to `.env.local` and fill in your Supabase project's URL and anon key (Project Settings → API in the Supabase dashboard).
2. Run the SQL schema in the Supabase SQL editor (see spec §4), and disable Row-Level Security on all six tables (or add permissive policies) — this app has no login, so it relies on an open anon key by design.
3. Enable Realtime on `sessions`, `legs`, `leg_participants`, `buy_ins`, `cash_outs` (and optionally `players`) via the Supabase Table Editor.
4. `npm install`
5. `npm run dev`

## Deployment (Netlify)

1. Connect this GitHub repo to a new Netlify site. Build command and publish directory are already configured via `netlify.toml`.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in Netlify's site settings (same values as your `.env.local`).
3. Deploy. `netlify.toml` includes the SPA redirect rule so client-side routes don't 404 on refresh/deep link.
