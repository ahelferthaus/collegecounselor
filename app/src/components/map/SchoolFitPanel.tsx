import { useEffect, useState } from 'react';
import { Loader2, Pencil, RefreshCw, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RatingStars } from './RatingStars';
import { QualityBadge } from './QualityBadge';
import { type School } from '@/lib/schools';
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

interface Props {
  school: School;
  stats: StudentStats;
  onClose: () => void;
  onEdit: () => void;
}

export function SchoolFitPanel({ school, stats, onClose, onEdit }: Props) {
  const [college, setCollege] = useState<CollegeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Fetch College Scorecard data (external system) for the selected school.
  /* eslint-disable react-hooks/set-state-in-effect */
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
  /* eslint-enable react-hooks/set-state-in-effect */

  const fit = computeFit(stats, college);
  const bandStyle = BAND_STYLES[fit.band];
  const satRange = college && formatRange(college.sat25, college.sat75);
  const actRange = college && formatRange(college.act25, college.act75);
  const noProfile = stats.gpa === 0 && !stats.sat && !stats.act;

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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-navy-900">{value}</dd>
    </div>
  );
}
