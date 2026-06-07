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

// --- Bulk pool for the Rankings directory --------------------------------

export interface RankCollege {
  id: number;
  name: string;
  city: string;
  state: string;
  ownership: number | null;
  locale: number | null; // 11-13 city, 21-23 suburb, 31-33 town, 41-43 rural
  lat: number | null;
  lng: number | null;
  admitRate: number | null;
  size: number | null;
  satMid: number | null;
  completion: number | null; // 0..1
  retention: number | null; // 0..1
  earnings: number | null; // median 10yr
  netPrice: number | null;
  schoolUrl: string | null;
}

const POOL_FIELDS = [
  'id',
  'school.name',
  'school.city',
  'school.state',
  'school.ownership',
  'school.locale',
  'school.school_url',
  'location.lat',
  'location.lon',
  'latest.admissions.admission_rate.overall',
  'latest.student.size',
  'latest.admissions.sat_scores.25th_percentile.overall',
  'latest.admissions.sat_scores.75th_percentile.overall',
  'latest.completion.completion_rate_4yr_150nt',
  'latest.student.retention_rate.four_year.full_time',
  'latest.earnings.10_yrs_after_entry.median',
  'latest.cost.avg_net_price.overall',
].join(',');

function toRankCollege(r: Record<string, unknown>): RankCollege {
  const sat25 = num(pick(r, 'latest.admissions.sat_scores.25th_percentile.overall'));
  const sat75 = num(pick(r, 'latest.admissions.sat_scores.75th_percentile.overall'));
  const satMid =
    sat25 != null && sat75 != null ? Math.round((sat25 + sat75) / 2) : sat75 ?? sat25;
  return {
    id: (num(pick(r, 'id')) ?? 0) as number,
    name: String(pick(r, 'school.name') ?? ''),
    city: String(pick(r, 'school.city') ?? ''),
    state: String(pick(r, 'school.state') ?? ''),
    ownership: num(pick(r, 'school.ownership')),
    locale: num(pick(r, 'school.locale')),
    lat: num(pick(r, 'location.lat')),
    lng: num(pick(r, 'location.lon')),
    admitRate: num(pick(r, 'latest.admissions.admission_rate.overall')),
    size: num(pick(r, 'latest.student.size')),
    satMid: satMid,
    completion: num(pick(r, 'latest.completion.completion_rate_4yr_150nt')),
    retention: num(pick(r, 'latest.student.retention_rate.four_year.full_time')),
    earnings: num(pick(r, 'latest.earnings.10_yrs_after_entry.median')),
    netPrice: num(pick(r, 'latest.cost.avg_net_price.overall')),
    schoolUrl: (pick(r, 'school.school_url') as string) || null,
  };
}

// Fetch a pool of well-known 4-year schools (predominantly bachelor's, US,
// 1k+ students) ordered by graduation rate as a sensible starting set.
export async function fetchSchoolPool(limit = 200): Promise<RankCollege[]> {
  const perPage = 100;
  const pages = Math.ceil(limit / perPage);
  const out: RankCollege[] = [];
  for (let page = 0; page < pages; page++) {
    const url =
      `${BASE}?api_key=${API_KEY}` +
      `&school.degrees_awarded.predominant=3` +
      `&school.operating=1` +
      `&latest.student.size__range=1000..` +
      `&fields=${POOL_FIELDS}` +
      `&sort=latest.completion.completion_rate_4yr_150nt:desc` +
      `&per_page=${perPage}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Scorecard pool failed (${res.status})`);
    const data = await res.json();
    const results = Array.isArray(data?.results) ? data.results : [];
    for (const r of results) out.push(toRankCollege(r));
    if (results.length < perPage) break;
  }
  return out.slice(0, limit);
}
