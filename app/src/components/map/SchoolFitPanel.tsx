import { useEffect, useState } from 'react';
import {
  Loader2,
  Pencil,
  RefreshCw,
  X,
  ExternalLink,
  CalendarDays,
  CalendarClock,
  Compass,
  Globe,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RatingStars } from './RatingStars';
import { QualityBadge } from './QualityBadge';
import {
  type School,
  METRIC_CATEGORIES,
  categoryAverage,
  countRatedMetrics,
  metricsAverage,
} from '@/lib/schools';
import {
  type CollegeData,
  OWNERSHIP_LABEL,
  lookupCollege,
} from '@/lib/scorecard';
import {
  type StudentStats,
  BAND_STYLES,
  computeFit,
  formatMoney,
  formatRange,
} from '@/lib/fit';
import { visitLinks } from '@/lib/visit';
import {
  type CampusEvent,
  type EventType,
  fetchEvents,
  loadCachedEvents,
  saveCachedEvents,
  timeAgo,
} from '@/lib/events';

interface Props {
  school: School;
  stats: StudentStats;
  onClose: () => void;
  onEdit: () => void;
}

const EVENT_BADGE: Record<EventType, { bg: string; fg: string }> = {
  Virtual: { bg: '#EDE9FE', fg: '#6D28D9' },
  'On-campus': { bg: '#CCFBF1', fg: '#0F766E' },
  Other: { bg: '#F1F5F9', fg: '#475569' },
};

export function SchoolFitPanel({ school, stats, onClose, onEdit }: Props) {
  const [college, setCollege] = useState<CollegeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [events, setEvents] = useState<CampusEvent[] | null>(null);
  const [eventsAt, setEventsAt] = useState<number | null>(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Fetch College Scorecard data + load any cached events for this school.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    lookupCollege(school.name)
      .then((c) => active && setCollege(c))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [school.name, attempt]);

  useEffect(() => {
    const cached = loadCachedEvents(school.id);
    setEvents(cached?.events ?? null);
    setEventsAt(cached?.fetchedAt ?? null);
    setEventsError(null);
  }, [school.id]);

  async function findEvents() {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const ev = await fetchEvents(school);
      const cache = saveCachedEvents(school.id, ev);
      setEvents(ev);
      setEventsAt(cache.fetchedAt);
    } catch (e) {
      setEventsError(e instanceof Error ? e.message : 'Could not load events.');
    } finally {
      setEventsLoading(false);
    }
  }

  const fit = computeFit(stats, college);
  const bandStyle = BAND_STYLES[fit.band];
  const satRange = college && formatRange(college.sat25, college.sat75);
  const actRange = college && formatRange(college.act25, college.act75);
  const noProfile = stats.gpa === 0 && !stats.sat && !stats.act;
  const links = visitLinks(school, college);
  const ratedCount = countRatedMetrics(school.metrics);

  return (
    <div className="flex max-h-[58%] shrink-0 flex-col border-b border-border bg-white">
      <div className="flex items-start justify-between gap-2 px-3 pt-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-heading text-sm font-bold text-navy-900">
              {school.name}
            </h2>
            <QualityBadge quality={school.quality} />
          </div>
          {school.location && (
            <p className="truncate text-xs text-muted-foreground">
              {school.location}
            </p>
          )}
          <div className="mt-1">
            <RatingStars value={school.ranking} size={13} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-2">
        {/* Band */}
        <div
          className="mb-3 flex items-center justify-between rounded-xl px-3 py-2"
          style={{ backgroundColor: bandStyle.bg }}
        >
          <span className="text-xs font-medium" style={{ color: bandStyle.fg }}>
            Admission outlook
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{ backgroundColor: bandStyle.fg, color: '#fff' }}
          >
            {bandStyle.label}
          </span>
        </div>

        {/* Visit & events — reliable deep-links (works even without a data match) */}
        <div className="mb-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-navy-800">
            <CalendarDays className="h-3.5 w-3.5 text-purple-500" /> Visit & events
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <LinkBtn href={links.visit} icon={<Compass className="h-3.5 w-3.5" />} label="Book a visit/tour" />
            <LinkBtn href={links.events} icon={<CalendarDays className="h-3.5 w-3.5" />} label="Register for events" />
            <LinkBtn href={links.virtualTour} icon={<Video className="h-3.5 w-3.5" />} label="Virtual tour" />
            {links.site && (
              <LinkBtn href={links.site} icon={<Globe className="h-3.5 w-3.5" />} label="Official site" />
            )}
          </div>
        </div>

        {/* Upcoming events — live, on-demand via web search */}
        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-navy-800">
              <CalendarClock className="h-3.5 w-3.5 text-purple-500" /> Upcoming events
            </p>
            <button
              type="button"
              onClick={findEvents}
              disabled={eventsLoading}
              className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50"
            >
              {eventsLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              {events ? 'Refresh' : 'Find events'}
            </button>
          </div>

          {eventsLoading && (
            <p className="text-xs text-muted-foreground">Searching the web…</p>
          )}
          {eventsError && <p className="text-xs text-destructive">{eventsError}</p>}
          {!eventsLoading && events && events.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No upcoming events found — check the official events page above.
            </p>
          )}
          {events && events.length > 0 && (
            <ul className="space-y-1.5">
              {events.map((e, i) => (
                <li key={i} className="rounded-lg border border-border p-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                      style={{
                        backgroundColor: EVENT_BADGE[e.type].bg,
                        color: EVENT_BADGE[e.type].fg,
                      }}
                    >
                      {e.type}
                    </span>
                    {e.date && (
                      <span className="text-[11px] text-muted-foreground">{e.date}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-navy-900">{e.title}</p>
                  {e.description && (
                    <p className="text-[11px] text-muted-foreground">{e.description}</p>
                  )}
                  {e.url && (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-purple-600 hover:underline"
                    >
                      Register / details <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
          {events && events.length > 0 && eventsAt && (
            <p className="mt-1 text-[10px] text-muted-foreground">
              AI + web search · {timeAgo(eventsAt)} · always verify on the official
              page
            </p>
          )}
        </div>

        {/* Visit scorecard summary (when rated) */}
        {ratedCount > 0 && (
          <div className="mb-3 rounded-xl border border-border p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-navy-800">Your visit ratings</p>
              <div className="flex items-center gap-1.5">
                <RatingStars value={Math.round(metricsAverage(school.metrics))} size={13} />
                <span className="text-xs font-bold text-navy-900">
                  {metricsAverage(school.metrics).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              {METRIC_CATEGORIES.map((cat) => {
                const avg = categoryAverage(school.metrics, cat);
                if (avg === 0) return null;
                return (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="w-24 shrink-0 text-[11px] text-muted-foreground">
                      {cat}
                    </span>
                    <div className="h-1.5 flex-1 rounded-full bg-muted">
                      <div
                        className="h-1.5 rounded-full bg-gradient-purple-teal"
                        style={{ width: `${(avg / 5) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right text-[11px] font-medium text-navy-700">
                      {avg.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading college data…
          </div>
        ) : error ? (
          <div className="space-y-2 py-2 text-sm text-muted-foreground">
            <p>Couldn't reach the College Scorecard service.</p>
            <Button variant="outline" size="sm" onClick={() => setAttempt((a) => a + 1)}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
            </Button>
          </div>
        ) : !college ? (
          <p className="py-2 text-sm text-muted-foreground">
            No College Scorecard match for “{school.name}”. Try the school's full
            official name when tagging it.
          </p>
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <Stat
                label="Admit rate"
                value={
                  college.admitRate != null
                    ? `${Math.round(college.admitRate * 100)}%`
                    : '—'
                }
              />
              <Stat
                label="Type"
                value={
                  college.ownership ? OWNERSHIP_LABEL[college.ownership] ?? '—' : '—'
                }
              />
              <Stat label="SAT (mid 50%)" value={satRange ?? '—'} />
              <Stat label="ACT (mid 50%)" value={actRange ?? '—'} />
              <Stat
                label="Undergrads"
                value={college.size != null ? college.size.toLocaleString() : '—'}
              />
              <Stat
                label="Avg net price"
                value={formatMoney(college.avgNetPrice) ?? '—'}
              />
            </dl>

            <div className="mt-3 rounded-lg bg-muted/60 p-2.5">
              <p className="mb-1 text-xs font-semibold text-navy-800">
                Why this outlook
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {fit.reasons.map((r, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-purple-400">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {noProfile && (
              <p className="mt-2 text-xs text-purple-700">
                Fill in your GPA and test scores in{' '}
                <span className="font-semibold">My Profile</span> for a personalized
                outlook.
              </p>
            )}

            <a
              href={`https://collegescorecard.ed.gov/school/?${college.id}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-purple-600 hover:underline"
            >
              View on College Scorecard <ExternalLink className="h-3 w-3" />
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function LinkBtn({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-xs font-medium text-navy-700 transition-colors hover:border-purple-300 hover:bg-purple-50"
    >
      <span className="shrink-0 text-purple-500">{icon}</span>
      <span className="truncate">{label}</span>
    </a>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-navy-900">{value}</dd>
    </div>
  );
}
