# AI "My Plan" — Setup

The **My Plan** page (`/#/plan`) turns the student profile + tagged schools into a
personalized "how to improve my chances" roadmap via Claude. The frontend builds
the prompt and calls whichever backend is available — it prefers the **Vercel /
Agent SDK** endpoint (so usage can draw from your Claude plan's Agent SDK credit
pool) and falls back to the **Supabase Edge / Messages API** endpoint.

> Important: a deployed app **cannot** use your Claude.ai subscription *login*.
> It must authenticate with an **Anthropic API key** (kept server-side). If that
> key is on the same Anthropic account as a Pro/Max plan, Agent SDK usage draws
> from your plan's monthly Agent-SDK credit pool before pay-per-token.

## Auth model
- Using the **server key** requires the caller to be **signed in** (we verify the
  Supabase session) — this prevents others from burning your credits.
- A user who pastes **their own** key (key button → stored only in their browser)
  can generate without signing in; they pay for their own usage.

## Option A — Vercel function (Agent SDK, draws from plan credit)
File: `app/api/plan.ts` (Node runtime).
1. Deploy the app to Vercel (project root = `app/`).
2. In Vercel → Settings → Environment Variables, set:
   - `ANTHROPIC_API_KEY` = your key (put it on your Pro/Max account for credit-pool pricing)
3. Redeploy. The frontend calls `/api/plan` automatically.

> Note: GitHub Pages can't run functions, so on the Pages mirror the app falls
> back to the Supabase endpoint (Option B).

## Option B — Supabase Edge function (Messages API, pay-per-token)
File: `supabase/functions/plan/index.ts` (Deno).
```bash
supabase functions deploy plan --no-verify-jwt
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```
The frontend calls `${VITE_SUPABASE_URL}/functions/v1/plan` as a fallback.

## Environment variables (frontend, optional)
Set in `.env` / Vercel:
- `VITE_AI_MODEL` — Claude model (default `claude-sonnet-4-6`; use `claude-opus-4-8` for max quality)
- `VITE_SCORECARD_API_KEY` — free key from https://api.data.gov/signup/ to lift College Scorecard rate limits

## Cost summary
- **Vercel + Agent SDK**: draws from your plan's monthly Agent-SDK credit pool first (Pro $20 / Max 5× $100 / Max 20× $200), then pay-per-token.
- **Supabase + Messages API**: pay-per-token only (no plan credit).
- Generated plans are cached in the browser so re-opening the page doesn't re-spend tokens.
