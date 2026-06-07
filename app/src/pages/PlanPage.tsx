import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Sparkles,
  Loader2,
  Map,
  UserRound,
  AlertCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SyncMenu } from '@/components/map/SyncMenu';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSchools } from '@/hooks/useSchools';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  type PlanResult,
  type Recommendation,
  generatePlan,
} from '@/lib/plan';
import { cn } from '@/lib/utils';

const PLAN_CACHE_KEY = 'cc_last_plan_v1';

const PRIORITY_STYLES: Record<Recommendation['priority'], string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-purple-100 text-purple-700',
  Low: 'bg-slate-100 text-slate-600',
};

function loadCachedPlan(): PlanResult | null {
  try {
    const raw = localStorage.getItem(PLAN_CACHE_KEY);
    return raw ? (JSON.parse(raw) as PlanResult) : null;
  } catch {
    return null;
  }
}

export function PlanPage() {
  const { userId, email, signInWithEmail, signOut } = useAuth();
  const { profile, status } = useProfile(userId);
  const { schools } = useSchools(userId);

  const [plan, setPlan] = useState<PlanResult | null>(() => loadCachedPlan());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const courseCount = profile.academics.courses.length;
  const hasProfile =
    courseCount > 0 ||
    profile.extracurriculars.length > 0 ||
    profile.whoIAm.intendedMajors.length > 0;

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePlan(profile, schools);
      setPlan(result);
      try {
        localStorage.setItem(PLAN_CACHE_KEY, JSON.stringify(result));
      } catch {
        /* ignore */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-muted/30">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-border bg-white px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-700 transition-colors hover:bg-gray-100"
            aria-label="Back to College Counselor"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate font-heading text-base font-bold text-navy-900">
            My Plan
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/profile"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex"
          >
            <UserRound className="h-4 w-4" /> Profile
          </Link>
          <Link
            to="/map"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex"
          >
            <Map className="h-4 w-4" /> Map
          </Link>
          <ApiKeySettings />
          <SyncMenu
            configured={isSupabaseConfigured}
            email={email}
            status={status}
            onSignIn={signInWithEmail}
            onSignOut={signOut}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 py-6 sm:px-6 sm:py-8">
        <div className="mb-5">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-navy-900">
            <Sparkles className="h-6 w-6 text-purple-500" />
            How to improve my chances
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A personalized, time-aware plan built from your academics, activities,
            story, and tagged schools — specific moves, not vague advice.
          </p>
        </div>

        {!hasProfile && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Your profile is mostly empty. Fill in{' '}
              <Link to="/profile" className="font-semibold underline">
                My Profile
              </Link>{' '}
              (courses, activities, intended major) and tag schools on the{' '}
              <Link to="/map" className="font-semibold underline">
                Campus Map
              </Link>{' '}
              for a useful plan.
            </span>
          </div>
        )}

        <Button
          onClick={run}
          disabled={loading}
          className="bg-gradient-purple-teal text-white hover:opacity-90"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : plan ? (
            <RefreshCw className="mr-2 h-4 w-4" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Thinking…' : plan ? 'Regenerate plan' : 'Generate my plan'}
        </Button>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Couldn't generate a plan</p>
              <p className="mt-0.5">{error}</p>
              <p className="mt-1 text-xs text-red-600/80">
                Make sure you're signed in (Sync) or have added your Anthropic key,
                and that a backend is deployed (Vercel function or Supabase Edge
                function). See AI_SETUP.md.
              </p>
            </div>
          </div>
        )}

        {plan && (
          <div className="mt-6 space-y-4">
            {plan.summary && (
              <div className="rounded-2xl border border-border bg-gradient-to-br from-purple-50 to-teal-50 p-4">
                <p className="text-sm text-navy-800">{plan.summary}</p>
              </div>
            )}

            {plan.recommendations.map((r, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-bold',
                      PRIORITY_STYLES[r.priority],
                    )}
                  >
                    {r.priority}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {r.category}
                  </span>
                  {r.timeframe && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {r.timeframe}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-base font-semibold text-navy-900">
                  {r.title}
                </h3>
                {r.rationale && (
                  <p className="mt-1 text-sm text-muted-foreground">{r.rationale}</p>
                )}
                {r.steps.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {r.steps.map((s, j) => (
                      <li key={j} className="flex gap-2 text-sm text-navy-800">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <p className="px-1 pt-2 text-xs text-muted-foreground">
              This plan is guidance, not a guarantee. Admissions are holistic — use
              this to focus your effort, and check specifics with your counselor.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
