import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Map,
  UserRound,
  PiggyBank,
  Sparkles,
  Loader2,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  Plus,
  Check,
  Trash2,
  ExternalLink,
  Landmark,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SyncMenu } from '@/components/map/SyncMenu';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSchools } from '@/hooks/useSchools';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  type SavedScholarship,
  type ScholarshipScope,
  type ScholarshipStatus,
  SCHOLARSHIP_SCOPE_LABELS,
  SCHOLARSHIP_STATUS_LABELS,
  newScholarship,
} from '@/lib/profile';
import {
  type ScholarshipSuggestion,
  AID_SOURCES,
  MAJOR_SCHOLARSHIPS,
  PELL_BAND_COLOR,
  estimatePell,
  findScholarships,
  loadAidInputs,
  saveAidInputs,
  schoolAidLinks,
} from '@/lib/aid';
import { cn } from '@/lib/utils';

const SCOPE_COLOR: Record<ScholarshipScope, string> = {
  general: '#7F56D9',
  school: '#14B8A6',
  state: '#F59E0B',
  federal: '#1E2B4F',
  other: '#94A3B8',
};

export function AidPage() {
  const { userId, email, signInWithEmail, signOut } = useAuth();
  const { profile, status, update } = useProfile(userId);
  const { schools } = useSchools(userId);

  const saved = profile.scholarships;
  const savedNames = useMemo(
    () => new Set(saved.map((s) => s.name.toLowerCase().trim())),
    [saved],
  );

  const [inputs, setInputs] = useState(loadAidInputs);
  const pell = estimatePell(Number(inputs.income), Number(inputs.familySize));

  const [suggestions, setSuggestions] = useState<ScholarshipSuggestion[]>([]);
  const [finding, setFinding] = useState(false);
  const [findError, setFindError] = useState<string | null>(null);

  const [manualOpen, setManualOpen] = useState(false);

  function setInput(patch: Partial<typeof inputs>) {
    const next = { ...inputs, ...patch };
    setInputs(next);
    saveAidInputs(next);
  }

  function addScholarship(s: SavedScholarship) {
    update((p) => ({ ...p, scholarships: [...p.scholarships, s] }));
  }
  function patchScholarship(id: string, patch: Partial<SavedScholarship>) {
    update((p) => ({
      ...p,
      scholarships: p.scholarships.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    }));
  }
  function removeScholarship(id: string) {
    update((p) => ({ ...p, scholarships: p.scholarships.filter((x) => x.id !== id) }));
  }

  function saveSuggestion(s: ScholarshipSuggestion) {
    addScholarship(newScholarship({ ...s, status: 'researching' }));
    toast.success(`Saved ${s.name}`);
  }

  async function runFinder() {
    setFinding(true);
    setFindError(null);
    try {
      const res = await findScholarships(profile, schools);
      setSuggestions(res);
      if (res.length === 0) toast.message('No matches found — try filling in more of your profile.');
    } catch (e) {
      setFindError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setFinding(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-muted/30">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-border bg-white px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-700 hover:bg-gray-100" aria-label="Home">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate font-heading text-base font-bold text-navy-900">
            Financial Aid
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/profile" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex">
            <UserRound className="h-4 w-4" /> Profile
          </Link>
          <Link to="/map" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex">
            <Map className="h-4 w-4" /> Map
          </Link>
          <ApiKeySettings />
          <SyncMenu configured={isSupabaseConfigured} email={email} status={status} onSignIn={signInWithEmail} onSignOut={signOut} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-3 py-6 sm:px-6 sm:py-8">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-navy-900">
            <PiggyBank className="h-6 w-6 text-purple-500" />
            Financial aid & scholarships
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Estimate federal aid, find scholarships you may qualify for, and track
            everything in one place.
          </p>
        </div>

        {/* Scam guardrail */}
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Never pay to apply</strong> for a scholarship or for the FAFSA —
            legitimate aid is always free. Verify every award on its official site
            before sharing personal information.
          </span>
        </div>

        {/* Pell estimator */}
        <section className="rounded-2xl border border-border bg-white p-4">
          <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-navy-900">
            <Landmark className="h-4 w-4 text-purple-500" /> Federal aid (Pell) estimate
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label className="text-xs">Household income (annual)</Label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="e.g. 65000"
                value={inputs.income}
                onChange={(e) => setInput({ income: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Family size</Label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="e.g. 4"
                value={inputs.familySize}
                onChange={(e) => setInput({ familySize: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <div
                className="w-full rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ backgroundColor: `${PELL_BAND_COLOR[pell.band]}22`, color: PELL_BAND_COLOR[pell.band] }}
              >
                {pell.label}
              </div>
            </div>
          </div>
          {pell.note && <p className="mt-2 text-xs text-muted-foreground">{pell.note}</p>}
          <p className="mt-2 text-[11px] text-muted-foreground">
            Rough estimate from income & family size — not your real FAFSA result.
            Inputs stay private on this device. Get the official number at{' '}
            <a href="https://studentaid.gov/aid-estimator/" target="_blank" rel="noreferrer" className="text-purple-600 hover:underline">
              the Federal Student Aid Estimator
            </a>
            .
          </p>
        </section>

        {/* AI finder */}
        <section className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-navy-900">
              <Sparkles className="h-4 w-4 text-purple-500" /> Find scholarships for me
            </h3>
            <Button onClick={runFinder} disabled={finding} size="sm" className="bg-gradient-purple-teal text-white hover:opacity-90">
              {finding ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : suggestions.length ? <RefreshCw className="mr-1.5 h-4 w-4" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
              {finding ? 'Searching…' : suggestions.length ? 'Refresh' : 'Search'}
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Live web search across national, state, and school-specific aid, tailored
            to your profile. Verify each on its official page.
          </p>

          {findError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{findError} — sign in or add your Anthropic key, and ensure a backend is deployed (see AI_SETUP.md).</span>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              {suggestions.map((s, i) => (
                <ScholarshipCard
                  key={i}
                  s={s}
                  saved={savedNames.has(s.name.toLowerCase().trim())}
                  onSave={() => saveSuggestion(s)}
                />
              ))}
            </div>
          )}
        </section>

        {/* My scholarships tracker */}
        <section className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-navy-900">
              My scholarships ({saved.length})
            </h3>
            <Button variant="outline" size="sm" onClick={() => setManualOpen(true)}>
              <Plus className="mr-1 h-4 w-4" /> Add manually
            </Button>
          </div>
          {saved.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
              Nothing saved yet — save from the finder or trusted list below, or add one manually.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {saved.map((s) => (
                <div key={s.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-navy-900">{s.name}</span>
                        <ScopeBadge scope={s.scope} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {[s.provider, s.amount, s.deadline && `Due ${s.deadline}`].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <button onClick={() => removeScholarship(s.id)} className="shrink-0 rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Select value={s.status} onValueChange={(v) => patchScholarship(s.id, { status: v as ScholarshipStatus })}>
                      <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(SCHOLARSHIP_STATUS_LABELS) as ScholarshipStatus[]).map((st) => (
                          <SelectItem key={st} value={st}>{SCHOLARSHIP_STATUS_LABELS[st]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {s.url && (
                      <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-600 hover:underline">
                        Official page <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Curated trusted sources + major scholarships */}
        <section className="rounded-2xl border border-border bg-white p-4">
          <h3 className="font-heading text-sm font-semibold text-navy-900">
            Trusted free sources
          </h3>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {AID_SOURCES.map((src) => (
              <a key={src.url} href={src.url} target="_blank" rel="noreferrer" className="rounded-xl border border-border p-3 transition-colors hover:border-purple-300 hover:bg-purple-50/50">
                <p className="flex items-center gap-1.5 text-sm font-medium text-navy-900">
                  {src.name} <ExternalLink className="h-3 w-3 text-purple-500" />
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{src.desc}</p>
              </a>
            ))}
          </div>

          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Major national scholarships
          </h4>
          <div className="mt-2 space-y-2">
            {MAJOR_SCHOLARSHIPS.map((s, i) => (
              <ScholarshipCard
                key={i}
                s={s}
                saved={savedNames.has(s.name.toLowerCase().trim())}
                onSave={() => saveSuggestion(s)}
              />
            ))}
          </div>
        </section>

        {/* Per-school aid links */}
        {schools.length > 0 && (
          <section className="rounded-2xl border border-border bg-white p-4">
            <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-navy-900">
              <GraduationCap className="h-4 w-4 text-purple-500" /> Aid at your schools
            </h3>
            <div className="mt-3 space-y-3">
              {schools.map((s) => {
                const links = schoolAidLinks(s.name);
                return (
                  <div key={s.id}>
                    <p className="text-sm font-medium text-navy-900">{s.name}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <AidChip href={links.finAid} label="Financial aid" />
                      <AidChip href={links.netPrice} label="Net price calculator" />
                      <AidChip href={links.scholarships} label="Merit scholarships" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <ManualDialog open={manualOpen} onOpenChange={setManualOpen} onAdd={addScholarship} />
    </div>
  );
}

function ScholarshipCard({
  s,
  saved,
  onSave,
}: {
  s: ScholarshipSuggestion;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-navy-900">{s.name}</span>
            <ScopeBadge scope={s.scope} />
          </div>
          <p className="text-xs text-muted-foreground">
            {[s.provider, s.amount, s.deadline && `Due ${s.deadline}`].filter(Boolean).join(' · ')}
          </p>
          {s.eligibility && <p className="mt-1 text-xs text-navy-700">{s.eligibility}</p>}
          {s.url && (
            <a href={s.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-purple-600 hover:underline">
              Apply / details <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <Button size="sm" variant={saved ? 'outline' : 'default'} disabled={saved} onClick={onSave} className={cn('shrink-0', !saved && 'bg-gradient-purple-teal text-white hover:opacity-90')}>
          {saved ? <><Check className="mr-1 h-4 w-4" /> Saved</> : <><Plus className="mr-1 h-4 w-4" /> Save</>}
        </Button>
      </div>
    </div>
  );
}

function ScopeBadge({ scope }: { scope: ScholarshipScope }) {
  return (
    <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: SCOPE_COLOR[scope] }}>
      {SCHOLARSHIP_SCOPE_LABELS[scope]}
    </span>
  );
}

function AidChip({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-navy-700 transition-colors hover:border-purple-300 hover:bg-purple-50">
      {label} <ExternalLink className="h-3 w-3 text-purple-500" />
    </a>
  );
}

function ManualDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdd: (s: SavedScholarship) => void;
}) {
  const [form, setForm] = useState({ name: '', provider: '', amount: '', deadline: '', url: '', notes: '' });
  const [scope, setScope] = useState<ScholarshipScope>('general');

  function submit() {
    if (!form.name.trim()) return;
    onAdd(newScholarship({ ...form, name: form.name.trim(), scope, status: 'researching' }));
    setForm({ name: '', provider: '', amount: '', deadline: '', url: '', notes: '' });
    setScope('general');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Add a scholarship</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Scholarship name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Provider</Label>
              <Input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Amount</Label>
              <Input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="$2,500" />
            </div>
            <div>
              <Label className="text-xs">Deadline</Label>
              <Input value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} placeholder="e.g. Mar 15" />
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={scope} onValueChange={(v) => setScope(v as ScholarshipScope)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(SCHOLARSHIP_SCOPE_LABELS) as ScholarshipScope[]).map((sc) => (
                    <SelectItem key={sc} value={sc}>{SCHOLARSHIP_SCOPE_LABELS[sc]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Link</Label>
            <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" />
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!form.name.trim()} className="bg-gradient-purple-teal text-white hover:opacity-90">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
