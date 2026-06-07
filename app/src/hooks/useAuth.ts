import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { isAllowedEmail } from '@/lib/access';

export interface AuthState {
  session: Session | null;
  userId: string | null;
  email: string | null;
  loading: boolean;
}

// The redirect target for the magic link. We send users back to the app root
// (no hash) so the PKCE `?code=` param is parsed cleanly before HashRouter runs.
function redirectTo(): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}`;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Supabase auth (an external system) and mirror the session.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) throw new Error('Sync is not configured.');
    // Accounts are pre-created (private app) — don't create new users from a
    // magic-link request, so only allowlisted accounts can ever receive a link.
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo(), shouldCreateUser: false },
    });
    if (error) throw error;
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!supabase) throw new Error('Login is not configured.');
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const email = session?.user.email ?? null;

  return {
    session,
    userId: session?.user.id ?? null,
    email,
    loading,
    allowed: isAllowedEmail(email),
    signInWithEmail,
    signInWithPassword,
    signOut,
  } satisfies AuthState & {
    allowed: boolean;
    signInWithEmail: (email: string) => Promise<void>;
    signInWithPassword: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
  };
}
