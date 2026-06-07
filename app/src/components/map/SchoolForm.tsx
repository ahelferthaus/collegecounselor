import { useEffect, useState } from 'react';
import { Loader2, MapPin, Search, Trash2, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { RatingStars } from './RatingStars';
import {
  type GeocodeResult,
  type Quality,
  type School,
  type Status,
  STATUS_LABELS,
  VISIT_METRICS,
  METRIC_CATEGORIES,
  metricsAverage,
  countRatedMetrics,
  geocode,
} from '@/lib/schools';
import type { NewSchool } from '@/hooks/useSchools';
import { cn } from '@/lib/utils';

export interface FormSeed {
  school?: School; // editing an existing school
  lat?: number; // pre-filled coords (e.g. from a map click)
  lng?: number;
  location?: string;
}

interface SchoolFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seed: FormSeed | null;
  onSubmit: (data: NewSchool) => void;
  onDelete?: (id: string) => void;
}

const QUALITIES: Quality[] = ['A', 'B', 'C'];

export function SchoolForm({
  open,
  onOpenChange,
  seed,
  onSubmit,
  onDelete,
}: SchoolFormProps) {
  const editing = seed?.school ?? null;

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [ranking, setRanking] = useState(0);
  const [quality, setQuality] = useState<Quality | null>(null);
  const [status, setStatus] = useState<Status>('considering');
  const [notes, setNotes] = useState('');
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [scorecardOpen, setScorecardOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Reset the form whenever it opens with a new seed.
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setLocation(editing.location);
      setCoords({ lat: editing.lat, lng: editing.lng });
      setRanking(editing.ranking);
      setQuality(editing.quality);
      setStatus(editing.status);
      setNotes(editing.notes);
      setMetrics(editing.metrics ?? {});
      setSearchQuery(editing.name);
    } else {
      setName('');
      setLocation(seed?.location ?? '');
      setCoords(
        seed?.lat != null && seed?.lng != null
          ? { lat: seed.lat, lng: seed.lng }
          : null,
      );
      setRanking(0);
      setQuality(null);
      setStatus('considering');
      setNotes('');
      setMetrics({});
      setSearchQuery('');
    }
    setScorecardOpen(false);
    setResults([]);
    setSearchError(null);
  }, [open, seed, editing]);

  function setMetric(key: string, value: number) {
    setMetrics((prev) => {
      const next = { ...prev };
      if (value > 0) next[key] = value;
      else delete next[key];
      return next;
    });
  }

  async function runSearch() {
    const q = searchQuery.trim() || name.trim();
    if (!q) return;
    setSearching(true);
    setSearchError(null);
    setResults([]);
    try {
      const found = await geocode(q);
      if (found.length === 0) setSearchError('No matches found. Try a city or full school name.');
      setResults(found);
    } catch {
      setSearchError('Search failed. Check your connection or drop a pin on the map instead.');
    } finally {
      setSearching(false);
    }
  }

  function pickResult(r: GeocodeResult) {
    setCoords({ lat: r.lat, lng: r.lng });
    setLocation(r.label);
    setResults([]);
  }

  function handleSubmit() {
    if (!name.trim() || !coords) return;
    onSubmit({
      name: name.trim(),
      location: location.trim(),
      lat: coords.lat,
      lng: coords.lng,
      ranking,
      quality,
      status,
      notes: notes.trim(),
      metrics,
    });
    onOpenChange(false);
  }

  const canSave = name.trim().length > 0 && coords != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {editing ? 'Edit school' : 'Add a school'}
          </DialogTitle>
          <DialogDescription>
            Tag a campus you're considering and rate it as you go.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="school-name">School name</Label>
            <Input
              id="school-name"
              value={name}
              placeholder="e.g. University of California, Berkeley"
              onChange={(e) => {
                setName(e.target.value);
                if (!searchQuery) setSearchQuery(e.target.value);
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="school-search">Find on map</Label>
            <div className="flex gap-2">
              <Input
                id="school-search"
                value={searchQuery}
                placeholder="Search a school, city or address"
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    runSearch();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={runSearch}
                disabled={searching}
                className="shrink-0"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {searchError && (
              <p className="text-xs text-destructive">{searchError}</p>
            )}

            {results.length > 0 && (
              <ul className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-border bg-white">
                {results.map((r, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => pickResult(r)}
                      className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-purple-50"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" />
                      <span className="line-clamp-2">{r.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {coords && (
              <p className="flex items-center gap-1.5 text-xs text-teal-700">
                <MapPin className="h-3.5 w-3.5" />
                Pinned at {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                {location ? ` · ${location.split(',').slice(0, 2).join(',')}` : ''}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Ranking (1–5)</Label>
              <div className="flex h-10 items-center">
                <RatingStars value={ranking} onChange={setRanking} size={22} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Quality (A–C)</Label>
              <ToggleGroup
                type="single"
                value={quality ?? ''}
                onValueChange={(v) => setQuality((v || null) as Quality | null)}
                className="justify-start"
              >
                {QUALITIES.map((q) => (
                  <ToggleGroupItem
                    key={q}
                    value={q}
                    aria-label={`Quality ${q}`}
                    className="h-10 w-10 border data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                  >
                    {q}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="school-notes">Visit notes</Label>
            <Textarea
              id="school-notes"
              value={notes}
              placeholder="Tour dates, who you met, programs, first impressions…"
              rows={3}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Visit scorecard — 1-5 across academic → social → campus → practical */}
          <Collapsible open={scorecardOpen} onOpenChange={setScorecardOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <span className="text-sm font-medium text-navy-900">
                  Visit scorecard{' '}
                  <span className="font-normal text-muted-foreground">(rate 1–5)</span>
                </span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {countRatedMetrics(metrics) > 0 && (
                    <span className="font-medium text-purple-600">
                      avg {metricsAverage(metrics).toFixed(1)} ·{' '}
                      {countRatedMetrics(metrics)}/{VISIT_METRICS.length}
                    </span>
                  )}
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      scorecardOpen && 'rotate-180',
                    )}
                  />
                </span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-3">
              {METRIC_CATEGORIES.map((cat) => (
                <div key={cat}>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {cat}
                  </p>
                  <div className="space-y-1">
                    {VISIT_METRICS.filter((m) => m.category === cat).map((m) => (
                      <div
                        key={m.key}
                        className="flex items-center justify-between gap-3 rounded-md px-1 py-1"
                      >
                        <span className="text-sm text-navy-800">{m.label}</span>
                        <RatingStars
                          value={metrics[m.key] ?? 0}
                          onChange={(v) => setMetric(m.key, v)}
                          size={16}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {editing && onDelete ? (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                onDelete(editing.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSave}
              className="bg-gradient-purple-teal text-white hover:opacity-90"
            >
              {editing ? 'Save changes' : 'Add school'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
