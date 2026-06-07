import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2, Lock, Mail, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { isAllowedEmail } from '@/lib/access';
import { cn } from '@/lib/utils';

type Mode = 'password' | 'magic';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, email: sessionEmail, loading, signInWithEmail, signInWithPassword } =
    useAuth();

  const from = (location.state as { from?: string } | null)?.from ?? '/map';

  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in (and allowed)? Skip the form.
  useEffect(() => {
    if (!loading && session && isAllowedEmail(sessionEmail)) {
      navigate(from, { replace: true });
    }
  }, [loading, session, sessionEmail, from, navigate]);

  async function handlePassword() {
    if (!email.includes('@') || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithPassword(email, password);
      // onAuthStateChange + the effect above handle the redirect.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  async function handleMagic() {
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithEmail(email);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send the link.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-muted/30 px-4 py-10">
      <Link to="/" className="mb-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-purple-teal">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-heading text-lg font-bold text-navy-900">
          College Counselor AI
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-navy-900">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This app is private. Sign in with your account to continue.
        </p>

        {!isSupabaseConfigured ? (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Login isn't configured in this build.
          </div>
        ) : sent ? (
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3 text-sm text-purple-800">
              <Mail className="h-5 w-5 shrink-0" />
              <span>
                We sent a one-tap sign-in link to{' '}
                <span className="font-medium">{email}</span>. Open it on this
                device. The link expires in about an hour.
              </span>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
              Back
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 text-sm">
              <button
                type="button"
                onClick={() => { setMode('password'); setError(null); }}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-colors',
                  mode === 'password' ? 'bg-white text-navy-900 shadow-sm' : 'text-muted-foreground',
                )}
              >
                <KeyRound className="h-3.5 w-3.5" /> Password
              </button>
              <button
                type="button"
                onClick={() => { setMode('magic'); setError(null); }}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-colors',
                  mode === 'magic' ? 'bg-white text-navy-900 shadow-sm' : 'text-muted-foreground',
                )}
              >
                <Mail className="h-3.5 w-3.5" /> Email link
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && mode === 'magic') {
                      e.preventDefault();
                      handleMagic();
                    }
                  }}
                />
              </div>

              {mode === 'password' && (
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handlePassword();
                      }
                    }}
                  />
                </div>
              )}

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button
                onClick={mode === 'password' ? handlePassword : handleMagic}
                disabled={busy}
                className="w-full bg-gradient-purple-teal text-white hover:opacity-90"
              >
                {busy ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : mode === 'password' ? (
                  <Lock className="mr-2 h-4 w-4" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {mode === 'password' ? 'Sign in' : 'Send sign-in link'}
              </Button>

              {mode === 'magic' && (
                <p className="text-[11px] text-muted-foreground">
                  Passwordless — we email you a one-tap link. Only existing
                  accounts can receive one.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <Link to="/" className="mt-5 text-xs text-muted-foreground hover:text-navy-700">
        ← Back to home
      </Link>
    </div>
  );
}
