# Campus Map — Cloud Sync Setup

The **Campus Map** (`/#/map`) lets you tag schools across the US & Europe with a
1–5 ranking and an A–C quality grade. It works offline out of the box
(localStorage), and can optionally **sync across devices** via Supabase with a
passwordless email magic-link sign-in.

## How sync works

- **Signed out:** schools live in your browser's `localStorage`.
- **Signed in:** schools live in your Supabase account (table `public.schools`)
  and stay live across devices through Postgres realtime. The first time you
  sign in, any schools already on that device are migrated into your account.
- Row-level security guarantees each user can only read/write their own rows.

The Supabase project (**CollegeAdvisor**) URL and **public** publishable key are
baked into `src/lib/supabaseClient.ts`, so sync works with no extra config. You
can override them with `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (see
`.env.example`).

## One required dashboard step: allow your redirect URLs

For the magic-link email to send users back to the right place, add your app
URLs in the Supabase dashboard:

**Authentication → URL Configuration**

- **Site URL:** your primary deployment, e.g.
  `https://ahelferthaus.github.io/collegecounselor/`
- **Redirect URLs** (add each one you use):
  - `http://localhost:5173/collegecounselor/` (local `npm run dev`)
  - `http://localhost:4173/collegecounselor/` (local `npm run preview`)
  - `https://ahelferthaus.github.io/collegecounselor/` (GitHub Pages)
  - `https://collegecounselor.vercel.app/` (Vercel)

Without these, the sign-in link falls back to the project's default Site URL and
won't complete on your live site.

## Email notes

The default Supabase SMTP is rate-limited (a few emails per hour) and is meant
for testing. For real use, configure a custom SMTP provider under
**Authentication → Emails → SMTP Settings**.

## Database

The table and policies were created via the `create_campus_map_schools`
migration:

- `public.schools` — `id, user_id, name, location, lat, lng, ranking (0–5),
  quality (A/B/C), status, notes, created_at, updated_at`
- RLS policies scoping every operation to `auth.uid() = user_id`
- An `updated_at` trigger and realtime publication membership
