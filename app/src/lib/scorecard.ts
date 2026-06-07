// Client for the U.S. Dept. of Education College Scorecard API (public data).
// Free, no per-token cost. Get a key at https://api.data.gov/signup/ and set
// VITE_SCORECARD_API_KEY; falls back to the shared (rate-limited) DEMO_KEY.

const API_KEY =
  (import.meta.env.VITE_SCORECARD_API_KEY as string | undefined) || 'DEMO_KEY';
const BASE = 'https://api.data.gov/ed/collegescorecard/v1/schools';

export interface CollegeData {
  id: number;
  name: string;
  city: string;
  state: string;
  ownership: number | null; // 1 public, 2 private nonprofit, 3 for-profit
  admitRate: number | null; // 0..1
  size: number | null;
  sat25: number | null;
  sat75: number | null;
  act25: number | null;
  act75: number | null;
  avgNetPrice: number | null;
  costOfAttendance: number | null;
  schoolUrl: string | null;
}

const FIELDS = [
  'id',
  'school.name',
  'school.city',
  'school.state',
  'school.ownership',
  'latest.admissions.admission_rate.overall',
  'latest.student.size',
  'latest.admissions.sat_scores.25th_percentile.overall',
  'latest.admissions.sat_scores.75th_percentile.overall',
  'latest.admissions.act_scores.25th_percentile.cumulative',
  'latest.admissions.act_scores.75th_percentile.cumulative',
  'latest.cost.avg_net_price.overall',
  'latest.cost.attendance.academic_year',
  'school.school_url',
].join(',');

// The API may return either nested objects or flat dotted keys depending on
// version — read defensively from both.
function pick(obj: Record<string, unknown>, path: string): unknown {
  if (obj[path] !== undefined) return obj[path];
  return path.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

function num(v: unknown): number | null {
  return typeof v === 'number' && !Number.isNaN(v) ? v : null;
}

function toCollege(r: Record<string, unknown>): CollegeData {
  return {
    id: (num(pick(r, 'id')) ?? 0) as number,
    name: String(pick(r, 'school.name') ?? ''),
    city: String(pick(r, 'school.city') ?? ''),
    state: String(pick(r, 'school.state') ?? ''),
    ownership: num(pick(r, 'school.ownership')),
    admitRate: num(pick(r, 'latest.admissions.admission_rate.overall')),
    size: num(pick(r, 'latest.student.size')),
    sat25: num(pick(r, 'latest.admissions.sat_scores.25th_percentile.overall')),
    sat75: num(pick(r, 'latest.admissions.sat_scores.75th_percentile.overall')),
    act25: num(pick(r, 'latest.admissions.act_scores.25th_percentile.cumulative')),
    act75: num(pick(r, 'latest.admissions.act_scores.75th_percentile.cumulative')),
    avgNetPrice: num(pick(r, 'latest.cost.avg_net_price.overall')),
    costOfAttendance: num(pick(r, 'latest.cost.attendance.academic_year')),
    schoolUrl: (pick(r, 'school.school_url') as string) || null,
  };
}

// Strip common suffixes / punctuation so "Stanford University" matches.
function cleanName(name: string): string {
  return name.replace(/[—–-].*$/, '').trim();
}

const cache = new Map<string, CollegeData | null>();

export async function lookupCollege(name: string): Promise<CollegeData | null> {
  const key = name.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key) ?? null;

  const url =
    `${BASE}?api_key=${API_KEY}` +
    `&school.name=${encodeURIComponent(cleanName(name))}` +
    `&fields=${FIELDS}&per_page=1&sort=latest.student.size:desc`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Scorecard lookup failed (${res.status})`);
  const data = await res.json();
  const first = Array.isArray(data?.results) ? data.results[0] : null;
  const college = first ? toCollege(first) : null;
  cache.set(key, college);
  return college;
}

export const OWNERSHIP_LABEL: Record<number, string> = {
  1: 'Public',
  2: 'Private (nonprofit)',
  3: 'Private (for-profit)',
};
