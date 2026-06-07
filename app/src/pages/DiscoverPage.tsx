import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Compass,
  Loader2,
  Map,
  UserRound,
  Sparkles,
  AlertCircle,
  Plus,
  Check,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SyncMenu } from '@/components/map/SyncMenu';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSchools } from '@/hooks/useSchools';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { geocode } from '@/lib/schools';
import { BAND_STYLES } from '@/lib/fit';
import { type SchoolSuggestion, getRecommendations } from '@/lib/discover';
import { cn } from '@/lib/utils';

const CACHE_KEY = 'cc_last_suggestions_v1';
const BAND_ORDER: SchoolSuggestion['band'][] = ['Likely', 'Target', 'Reach'];

function loadCached(): SchoolSuggestion[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as SchoolSuggestion[]) : [];
  } catch {
    return [];
  }
}

export function DiscoverPage() {
  const { userId, email, signInWithEmail, signOut } = useAuth();
  const { profile, status } = useProfile(userId);
  const { schools, addSchool } = useSchools(userId);

  const [suggestions, setSuggestions] = useState<SchoolSuggestion[]>(loadCached);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const existingNames = useMemo(
    () => new Set(schools.map((s) => s.name.toLowerCase().trim())),
    [schools],
  );

  const hasProfile =
    profile.academics.courses.length > 0 ||
    profile.whoIAm.intendedMajors.length > 0 ||
    profile.extracurriculars.length > 0;

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const result = await getRecommendations(profile, schools);
      setSuggestions(result);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      } catch {
        /* ignore */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function addToMap(s: SchoolSuggestion) {
    setAdding(s.name);
    try {
      const results = await geocode(`${s.name} ${s.location}`);
      if (results.length === 0) {
        toast.error(`Couldn't locate ${s.name} — add it manually on the map.`);
        return;
      }
      const { lat, lng, label } = results[0];
      await addSchool({
        name: s.name,
        location: s.location || label,
        lat,
        lng,
        ranking: 0,
        quality: null,
        status: 'considering',
        notes: s.reason,
      });
      setAdded((prev) => new Set(prev).add(s.name.toLowerCase().trim()));
      toast.success(`Added ${s.name} to your Campus Map`);
    } catch {
      toast.error('Could not add that school.');
    } finally {
      setAdding(null);
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
            Discover
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/profile" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex">
            <UserRound className="h-4 w-4" /> Profile
          </Link>
          <Link to="/map" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex">
            <Map className="h-4 w-4" /> Map
          </Link>
          <Link to="/plan" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex">
            <Sparkles className="h-4 w-4" /> Plan
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
            <Compass className="h-6 w-6 text-purple-500" />
            Recommended for you
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fit-ranked colleges based on your academics, interests, budget, and
            preferences — add any with one tap to your Campus Map.
          </p>
        </div>

        {!hasProfile && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Fill in{' '}
              <Link to="/profile" className="font-semibold underline">
                My Profile
              </Link>{' '}
              (intended major, courses, preferences) for suggestions tuned to you.
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
          ) : suggestions.length ? (
            <RefreshCw className="mr-2 h-4 w-4" />
          ) : (
            <Compass className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Finding fits…' : suggestions.length ? 'Refresh suggestions' : 'Get recommendations'}
        </Button>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Couldn't get suggestions</p>
              <p className="mt-0.5">{error}</p>
              <p className="mt-1 text-xs text-red-600/80">
                Sign in (Sync) or add your Anthropic key, and make sure a backend
                is deployed. See AI_SETUP.md.
              </p>
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-6 space-y-6">
            {BAND_ORDER.map((band) => {
              const items = suggestions.filter((s) => s.band === band);
              if (items.length === 0) return null;
              const style = BAND_STYLES[band];
              return (
                <div key={band}>
                  <h3 className="mb-2 flex items-center gap-2 font-heading text-sm font-semibold text-navy-900">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                      style={{ backgroundColor: style.bg, color: style.fg }}
                    >
                      {band}
                    </span>
                    <span className="text-muted-foreground">({items.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {items.map((s, i) => {
                      const key = s.name.toLowerCase().trim();
                      const isAdded = added.has(key) || existingNames.has(key);
                      return (
                        <div key={i} className="rounded-2xl border border-border bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="font-heading font-semibold text-navy-900">
                                {s.name}
                              </h4>
                              {s.location && (
                                <p className="text-xs text-muted-foreground">{s.location}</p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant={isAdded ? 'outline' : 'default'}
                              disabled={isAdded || adding === s.name}
                              onClick={() => addToMap(s)}
                              className={cn(
                                'shrink-0',
                                !isAdded && 'bg-gradient-purple-teal text-white hover:opacity-90',
                              )}
                            >
                              {adding === s.name ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : isAdded ? (
                                <>
                                  <Check className="mr-1 h-4 w-4" /> On map
                                </>
                              ) : (
                                <>
                                  <Plus className="mr-1 h-4 w-4" /> Add
                                </>
                              )}
                            </Button>
                          </div>
                          {s.reason && (
                            <p className="mt-2 text-sm text-muted-foreground">{s.reason}</p>
                          )}
                          {s.highlights.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {s.highlights.map((h, j) => (
                                <span
                                  key={j}
                                  className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <p className="px-1 text-xs text-muted-foreground">
              AI-generated suggestions — verify details (programs, deadlines, cost)
              on each school's official site before deciding.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
