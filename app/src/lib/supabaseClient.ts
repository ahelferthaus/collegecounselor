import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// These are PUBLIC client credentials. The publishable/anon key is safe to ship
// in the browser — all data access is protected by row-level security so a user
// can only ever read or write their own rows. Override via env vars if you fork
// this to a different Supabase project.
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://uglrlibycppkhtofwmht.supabase.co';

const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'sb_publishable_p-e3UYMhT4pkhq06xDomuQ_IAkTdG38';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// A single shared client. PKCE flow keeps the magic-link redirect in the query
// string (?code=...) so it doesn't collide with the app's HashRouter routing.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
