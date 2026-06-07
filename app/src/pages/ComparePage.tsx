import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Map, Columns3, Trophy } from 'lucide-react';
import { RatingStars } from '@/components/map/RatingStars';
import { QualityBadge } from '@/components/map/QualityBadge';
import { useAuth } from '@/hooks/useAuth';
import { useSchools } from '@/hooks/useSchools';
import {
  type School,
  type Quality,
  STATUS_LABELS,
  VISIT_METRICS,
  METRIC_CATEGORIES,
  categoryAverage,
  metricsAverage,
} from '@/lib/schools';
import { type CollegeData, lookupCollege } from '@/lib/scorecard';
import { getReputation } from '@/lib/reputation';
import { cn } from '@/lib/utils';

type Better = 'high' | 'low' | 'none';
const QUALITY_RANK: Record<string, number> = { A: 3, B: 2, C: 1 };

export function ComparePage() {
  const { userId } = useAuth();
  const { schools } = useSchools(userId);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(schools.map((s) => s.id)),
  );
  // Default-select all once schools load (e.g. arriving from the cloud).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setSelectedIds((prev) => {
      if (prev.size > 0) return prev;
      return new Set(schools.map((s) => s.id));
    });
  }, [schools]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const cols = useMemo(
    () => schools.filter((s) => selectedIds.has(s.id)),
    [schools, selectedIds],
  );

  // Lazy-load College Scorecard data for the compared schools.
  const [scData, setScData] = useState<Record<string, CollegeData | null>>({});
  useEffect(() => {
    let active = true;
    cols.forEach((s) => {
      if (s.id in scData) return;
      lookupCollege(s.name)
        .then((c) => active && setScData((prev) => ({ ...prev, [s.id]: c })))
        .catch(() => active && setScData((prev) => ({ ...prev, [s.id]: null })));
    });
    return () => {
      active = false;
    };
  }, [cols, scData]);

  if (schools.length < 2) {
    return (
      <Shell>
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Tag at least 2 schools on the{' '}
          <Link to="/map" className="font-semibold text-purple-600 underline">
            Campus Map
          </Link>{' '}
          to compare them side by side.
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* School selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {schools.map((s) => {
          const on = selectedIds.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() =>
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  if (next.has(s.id)) next.delete(s.id);
                  else next.add(s.id);
                  return next;
                })
              }
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                on
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-border text-navy-700 hover:bg-gray-50',
              )}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {cols.length < 2 ? (
        <p className="text-sm text-muted-foreground">Select at least 2 schools above.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <Th sticky>School</Th>
                {cols.map((s) => (
                  <Th key={s.id}>
                    <div className="font-semibold text-navy-900">{s.name}</div>
                    {s.location && (
                      <div className="text-[11px] font-normal text-muted-foreground">
                        {s.location}
                      </div>
                    )}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              <GroupHeader span={cols.length + 1}>Your ratings</GroupHeader>
              <Row
                label="Overall rank"
                cols={cols}
                getVal={(s) => s.ranking || null}
                better="high"
                render={(s) => <RatingStars value={s.ranking} size={12} />}
              />
              <Row
                label="Quality"
                cols={cols}
                getVal={(s) => (s.quality ? QUALITY_RANK[s.quality] : null)}
                better="high"
                render={(s) => <QualityBadge quality={s.quality as Quality | null} />}
              />
              <Row
                label="Visit average"
                cols={cols}
                getVal={(s) => metricsAverage(s.metrics) || null}
                better="high"
                fmt={(v) => v.toFixed(1)}
              />
              <Row
                label="Status"
                cols={cols}
                getVal={() => null}
                better="none"
                render={(s) => (
                  <span className="text-xs text-muted-foreground">
                    {STATUS_LABELS[s.status]}
                  </span>
                )}
              />

              {METRIC_CATEGORIES.map((cat) => (
                <Group key={cat}>
                  <GroupHeader span={cols.length + 1}>{cat}</GroupHeader>
                  <Row
                    label={`${cat} average`}
                    cols={cols}
                    getVal={(s) => categoryAverage(s.metrics, cat) || null}
                    better="high"
                    fmt={(v) => v.toFixed(1)}
                    bold
                  />
                  {VISIT_METRICS.filter((m) => m.category === cat).map((m) => (
                    <Row
                      key={m.key}
                      label={m.label}
                      cols={cols}
                      getVal={(s) => s.metrics[m.key] || null}
                      better="high"
                      fmt={(v) => String(v)}
                      muted
                    />
                  ))}
                </Group>
              ))}

              <GroupHeader span={cols.length + 1}>Reputation & college data</GroupHeader>
              <Row
                label="Published rank"
                cols={cols}
                getVal={(s) => getReputation(s.name)?.rank ?? null}
                better="low"
                fmt={(v) => `#${v}`}
              />
              <Row
                label="Admit rate"
                cols={cols}
                getVal={(s) => scData[s.id]?.admitRate ?? null}
                better="low"
                fmt={(v) => `${Math.round(v * 100)}%`}
              />
              <Row
                label="SAT (mid 50%)"
                cols={cols}
                getVal={(s) => satMid(scData[s.id])}
                better="high"
                fmt={(v) => String(v)}
              />
              <Row
                label="Avg net price"
                cols={cols}
                getVal={(s) => scData[s.id]?.avgNetPrice ?? null}
                better="low"
                fmt={(v) => `$${Math.round(v).toLocaleString()}`}
              />
              <Row
                label="Undergrads"
                cols={cols}
                getVal={(s) => scData[s.id]?.size ?? null}
                better="none"
                fmt={(v) => v.toLocaleString()}
              />
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Best value in each row is highlighted. Your ratings come from your visit
        scorecards; college data is from the U.S. College Scorecard.
      </p>
    </Shell>
  );
}

function satMid(c: CollegeData | null | undefined): number | null {
  if (!c) return null;
  if (c.sat25 != null && c.sat75 != null) return Math.round((c.sat25 + c.sat75) / 2);
  return c.sat75 ?? c.sat25 ?? null;
}

interface RowProps {
  label: string;
  cols: School[];
  getVal: (s: School) => number | null;
  better: Better;
  fmt?: (v: number) => string;
  render?: (s: School) => React.ReactNode;
  bold?: boolean;
  muted?: boolean;
}

function Row({ label, cols, getVal, better, fmt, render, bold, muted }: RowProps) {
  const vals = cols.map(getVal);
  const numeric = vals.filter((v): v is number => v != null);
  let best: number | null = null;
  if (better !== 'none' && numeric.length > 1) {
    best = better === 'high' ? Math.max(...numeric) : Math.min(...numeric);
  }
  return (
    <tr className="border-t border-border">
      <Td sticky bold={bold} muted={muted}>
        {label}
      </Td>
      {cols.map((s, i) => {
        const v = vals[i];
        const isBest = best != null && v === best;
        return (
          <Td key={s.id} center highlight={isBest}>
            {render ? (
              render(s)
            ) : v == null ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              <span className={cn(bold && 'font-semibold')}>{fmt ? fmt(v) : v}</span>
            )}
          </Td>
        );
      })}
    </tr>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function GroupHeader({ span, children }: { span: number; children: React.ReactNode }) {
  return (
    <tr>
      <td
        colSpan={span}
        className="sticky left-0 bg-muted px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground"
      >
        {children}
      </td>
    </tr>
  );
}

function Th({ children, sticky }: { children: React.ReactNode; sticky?: boolean }) {
  return (
    <th
      className={cn(
        'min-w-[130px] border-b border-border px-3 py-2.5 text-center align-bottom',
        sticky && 'sticky left-0 z-10 bg-white text-left',
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  sticky,
  center,
  highlight,
  bold,
  muted,
}: {
  children: React.ReactNode;
  sticky?: boolean;
  center?: boolean;
  highlight?: boolean;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        'px-3 py-2',
        center && 'text-center',
        highlight && 'bg-teal-50',
        sticky && 'sticky left-0 z-10 bg-white text-left text-navy-800',
        bold && 'font-semibold',
        muted && 'text-muted-foreground',
      )}
    >
      {children}
    </td>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-muted/30">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-border bg-white px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-700 hover:bg-gray-100" aria-label="Home">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="truncate font-heading text-base font-bold text-navy-900">
            Compare
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/rankings" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex">
            <Trophy className="h-4 w-4" /> Rankings
          </Link>
          <Link to="/map" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 sm:flex">
            <Map className="h-4 w-4" /> Map
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-7">
        <div className="mb-4">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-navy-900">
            <Columns3 className="h-6 w-6 text-purple-500" />
            Compare schools
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your visit scores and key data, side by side.
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
