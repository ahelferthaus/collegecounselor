import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Trophy,
  Loader2,
  Map,
  Compass,
  RefreshCw,
  Plus,
  Check,
  RotateCcw,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SyncMenu } from '@/components/map/SyncMenu';
import { useAuth } from '@/hooks/useAuth';
import { useSchools } from '@/hooks/useSchools';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  type RankCollege,
  OWNERSHIP_LABEL,
  fetchSchoolPool,
} from '@/lib/scorecard';
import {
  type RankFilters,
  type RankWeights,
  DEFAULT_FILTERS,
  DEFAULT_WEIGHTS,
  WEIGHT_LABELS,
  loadPrefs,
  rankSchools,
  savePrefs,
} from '@/lib/ranking';
import { cn } from '@/lib/utils';

export function RankingsPage() {
  const { userId, email, signInWithEmail, signOut, loading: authLoading } = useAuth();
  const { schools, addSchool } = useSchools(userId);

  const [pool, setPool] = useState<RankCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const initial = loadPrefs();
  const [weights, setWeights] = useState<RankWeights>(initial.weights);
  const [filters, setFilters] = useState<RankFilters>(initial.filters);
  const [added, setAdded] = useState<Set<string>>(new Set());

  // Load the school pool once (and on retry).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchSchoolPool(200)
      .then((p) => active && setPool(p))
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [attempt]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    savePrefs(weights, filters);
  }, [weights, filters]);

  const ranked = useMemo(
    () => rankSchools(pool, weights, filters),
    [pool, weights, filters],
  );

  const existingNames = useMemo(
    () => new Set(schools.map((s) => s.name.toLowerCase().trim())),
    [schools],
  );

  async function addToMap(rc: RankCollege, rank: number) {
    if (rc.lat == null || rc.lng == null) {
      toast.error("Location unavailable — add it from the Campus Map instead.");
      return;
    }
    try {
      await addSchool({
        name: rc.name,
        location: [rc.city, rc.state].filter(Boolean).join(', '),
        lat: rc.lat,
        lng: rc.lng,
        ranking: 0,
        quality: null,
        status: 'considering',
        notes: `#${rank} on my custom ranking`,
        metrics: {},
      });
      setAdded((p) => new Set(p).add(rc.name.toLowerCase().trim()));
      toast.success(`Added ${rc.name} to your Campus Map`);
    } catch {
      toast.error('Could not add that school.');
    }
  }

  const resetPrefs = () => {
    setWeights(DEFAULT_WEIGHTS);
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="min-h-[100dvh] bg-muted/30">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-border bg-white px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-700 hover:bg-gray-100" aria-label="Home">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate font-heading text-base font-bold text-navy-900">
            Rankings
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/discover" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex">
            <Compass className="h-4 w-4" /> Discover
          </Link>
          <Link to="/map" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex">
            <Map className="h-4 w-4" /> Map
          </Link>
          <SyncMenu
            configured={isSupabaseConfigured}
            email={email}
            status={authLoading ? 'loading' : 'local'}
            onSignIn={signInWithEmail}
            onSignOut={signOut}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-7">
        <div className="mb-4">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-navy-900">
            <Trophy className="h-6 w-6 text-purple-500" />
            My ranking
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Re-weight what matters to you and filter the list — the order updates
            live. A public-data starting point, not US News.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
          {/* Controls */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                  <SlidersHorizontal className="h-4 w-4 text-purple-500" /> Weights
                </p>
                <button onClick={resetPrefs} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-navy-700">
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>
              <div className="space-y-3">
                {(Object.keys(weights) as (keyof RankWeights)[]).map((k) => (
                  <div key={k}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-navy-800">{WEIGHT_LABELS[k]}</span>
                      <span className="font-semibold text-purple-600">{weights[k]}</span>
                    </div>
                    <Slider
                      value={[weights[k]]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(v) => setWeights((w) => ({ ...w, [k]: v[0] }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-navy-900">Filters</p>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Minimum size</Label>
                  <Select
                    value={String(filters.minSize)}
                    onValueChange={(v) => setFilters((f) => ({ ...f, minSize: Number(v) }))}
                  >
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any size</SelectItem>
                      <SelectItem value="5000">5,000+ students</SelectItem>
                      <SelectItem value="10000">10,000+ students</SelectItem>
                      <SelectItem value="20000">20,000+ students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={filters.ownership}
                    onValueChange={(v) => setFilters((f) => ({ ...f, ownership: v as RankFilters['ownership'] }))}
                  >
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">State (optional)</Label>
                  <Input
                    value={filters.state}
                    placeholder="e.g. CA"
                    maxLength={2}
                    className="h-9 uppercase"
                    onChange={(e) => setFilters((f) => ({ ...f, state: e.target.value.toUpperCase() }))}
                  />
                </div>
                <ToggleRow label="City campuses only" checked={filters.cityOnly} onChange={(v) => setFilters((f) => ({ ...f, cityOnly: v }))} />
                <ToggleRow label="Has medical school" checked={filters.med} onChange={(v) => setFilters((f) => ({ ...f, med: v }))} />
                <ToggleRow label="Has law school" checked={filters.law} onChange={(v) => setFilters((f) => ({ ...f, law: v }))} />
                <ToggleRow label="Notable D1 athletics" checked={filters.sports} onChange={(v) => setFilters((f) => ({ ...f, sports: v }))} />
              </div>
              {(filters.med || filters.law || filters.sports) && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Med / law / athletics use a curated list of well-known schools —
                  it's intentionally partial and may exclude valid matches.
                </p>
              )}
            </div>
          </aside>

          {/* Results */}
          <section>
            {loading ? (
              <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading schools…
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p className="flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4" /> Couldn't load school data
                </p>
                <p className="mt-1">{error}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setAttempt((a) => a + 1)}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
                </Button>
              </div>
            ) : (
              <>
                <p className="mb-2 text-xs text-muted-foreground">
                  {ranked.length} schools · ranked by your weights
                </p>
                <ol className="space-y-2">
                  {ranked.map(({ college: c, score, rank, attrs }) => {
                    const key = c.name.toLowerCase().trim();
                    const isAdded = added.has(key) || existingNames.has(key);
                    return (
                      <li key={c.id} className="rounded-xl border border-border bg-white p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-7 shrink-0 text-center font-heading text-lg font-bold text-purple-600">
                            {rank}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="font-semibold text-navy-900">{c.name}</span>
                              {attrs.med && <Tag>Med</Tag>}
                              {attrs.law && <Tag>Law</Tag>}
                              {attrs.sports && <Tag>D1</Tag>}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {[c.city, c.state].filter(Boolean).join(', ')}
                              {c.ownership ? ` · ${OWNERSHIP_LABEL[c.ownership] ?? ''}` : ''}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                              {c.admitRate != null && <span>{Math.round(c.admitRate * 100)}% admit</span>}
                              {c.size != null && <span>{c.size.toLocaleString()} students</span>}
                              {c.earnings != null && <span>${(c.earnings / 1000).toFixed(0)}k earnings</span>}
                              {c.completion != null && <span>{Math.round(c.completion * 100)}% grad</span>}
                            </div>
                            <div className="mt-1.5 flex items-center gap-2">
                              <div className="h-1.5 flex-1 rounded-full bg-muted">
                                <div className="h-1.5 rounded-full bg-gradient-purple-teal" style={{ width: `${score}%` }} />
                              </div>
                              <span className="w-8 text-right text-xs font-bold text-navy-900">
                                {score.toFixed(0)}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={isAdded ? 'outline' : 'default'}
                            disabled={isAdded}
                            onClick={() => addToMap(c, rank)}
                            className={cn('shrink-0', !isAdded && 'bg-gradient-purple-teal text-white hover:opacity-90')}
                          >
                            {isAdded ? <><Check className="mr-1 h-4 w-4" /> Added</> : <><Plus className="mr-1 h-4 w-4" /> Add</>}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-4 text-xs text-muted-foreground">
                  Methodology: scores normalize each school's selectivity, test
                  range, graduation/retention, earnings, and net price across the
                  pool, then apply your weights. Data: U.S. Dept. of Education
                  College Scorecard. This is a transparent public-data proxy — not
                  US News — and a base you can refine.
                </p>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-navy-800">
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">
      {children}
    </span>
  );
}
