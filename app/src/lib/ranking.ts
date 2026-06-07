// Transparent, re-weightable ranking over the public College Scorecard pool.
// The base weights approximate magazine-style rankings (heavy on selectivity,
// graduation, and outcomes), but every weight and filter is user-adjustable.
// This is a PUBLIC-DATA PROXY — it is not US News and makes no claim to match it.
import type { RankCollege } from './scorecard';
import { reputationScore } from './reputation';

export interface RankWeights {
  academics: number; // selectivity + test strength
  graduation: number; // completion + retention
  outcomes: number; // earnings 10yr
  reputation: number; // published rank (seed + your import)
  affordability: number; // low net price
}

export const DEFAULT_WEIGHTS: RankWeights = {
  academics: 30,
  graduation: 25,
  outcomes: 20,
  reputation: 25,
  affordability: 0,
};

export const WEIGHT_LABELS: Record<keyof RankWeights, string> = {
  academics: 'Academics & selectivity',
  graduation: 'Graduation & retention',
  outcomes: 'Career outcomes (earnings)',
  reputation: 'Reputation (published rank)',
  affordability: 'Affordability (low net price)',
};

export interface RankFilters {
  minSize: number; // 0 | 5000 | 10000 | 20000
  cityOnly: boolean; // locale 11-13
  ownership: 'any' | 'public' | 'private';
  state: string; // '' = any
  med: boolean; // has medical school (curated)
  law: boolean; // has law school (curated)
  sports: boolean; // notable D1 athletics (curated)
}

export const DEFAULT_FILTERS: RankFilters = {
  minSize: 0,
  cityOnly: false,
  ownership: 'any',
  state: '',
  med: false,
  law: false,
  sports: false,
};

export interface RankedSchool {
  college: RankCollege;
  score: number; // 0-100
  rank: number;
  attrs: SchoolAttrs;
}

// --- Curated attribute layer (med / law / notable athletics) -------------
// Public Scorecard data doesn't carry these, so this is a hand-curated,
// intentionally partial seed for well-known schools. Easy to extend (and a
// natural target for enrichment from ranking-magazine data later).
export interface SchoolAttrs {
  med?: boolean;
  law?: boolean;
  sports?: boolean;
}

const ATTRS: Record<string, SchoolAttrs> = {
  'harvard university': { med: true, law: true, sports: true },
  'yale university': { med: true, law: true, sports: true },
  'stanford university': { med: true, law: true, sports: true },
  'princeton university': { med: false, law: false, sports: true },
  'massachusetts institute of technology': { med: false, law: false, sports: true },
  'california institute of technology': { med: false, law: false, sports: false },
  'columbia university': { med: true, law: true, sports: true },
  'university of pennsylvania': { med: true, law: true, sports: true },
  'duke university': { med: true, law: true, sports: true },
  'johns hopkins university': { med: true, law: false, sports: false },
  'university of chicago': { med: true, law: true, sports: false },
  'northwestern university': { med: true, law: true, sports: true },
  'cornell university': { med: true, law: true, sports: true },
  'brown university': { med: true, law: false, sports: true },
  'dartmouth college': { med: true, law: false, sports: true },
  'vanderbilt university': { med: true, law: true, sports: true },
  'university of notre dame': { med: false, law: true, sports: true },
  'university of michigan': { med: true, law: true, sports: true },
  'university of michigan-ann arbor': { med: true, law: true, sports: true },
  'university of california-los angeles': { med: true, law: true, sports: true },
  'university of california-berkeley': { med: false, law: true, sports: true },
  'university of virginia': { med: true, law: true, sports: true },
  'university of north carolina at chapel hill': { med: true, law: true, sports: true },
  'university of southern california': { med: true, law: true, sports: true },
  'georgetown university': { med: true, law: true, sports: true },
  'new york university': { med: true, law: true, sports: false },
  'university of texas at austin': { med: true, law: true, sports: true },
  'university of florida': { med: true, law: true, sports: true },
  'ohio state university-main campus': { med: true, law: true, sports: true },
  'university of wisconsin-madison': { med: true, law: true, sports: true },
  'university of washington-seattle campus': { med: true, law: true, sports: true },
  'university of alabama': { med: false, law: true, sports: true },
  'pennsylvania state university-main campus': { med: true, law: true, sports: true },
  'university of georgia': { med: false, law: true, sports: true },
};

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[.,]/g, '')
    .trim();
}

export function attrsFor(name: string): SchoolAttrs {
  const n = normalizeName(name);
  if (ATTRS[n]) return ATTRS[n];
  // best-effort: match on a known key being a prefix of the school name
  for (const key of Object.keys(ATTRS)) {
    if (n.startsWith(key) || key.startsWith(n)) return ATTRS[key];
  }
  return {};
}

// --- Scoring -------------------------------------------------------------

function normalizer(values: number[]) {
  const valid = values.filter((v) => Number.isFinite(v));
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const span = max - min;
  return (v: number | null): number => {
    if (v == null || !Number.isFinite(v) || span === 0) return 0.5;
    return (v - min) / span;
  };
}

export function rankSchools(
  pool: RankCollege[],
  weights: RankWeights,
  filters: RankFilters,
): RankedSchool[] {
  if (pool.length === 0) return [];

  // Build normalizers across the full pool (before filtering) for stable scores.
  const normEarn = normalizer(pool.map((c) => c.earnings ?? NaN));
  const normSat = normalizer(pool.map((c) => c.satMid ?? NaN));
  const normPrice = normalizer(pool.map((c) => c.netPrice ?? NaN));

  const wsum =
    weights.academics +
      weights.graduation +
      weights.outcomes +
      weights.reputation +
      weights.affordability || 1;

  const scored = pool.map((c) => {
    const selectivity = c.admitRate != null ? 1 - c.admitRate : 0.5;
    const test = normSat(c.satMid);
    const academics = test > 0 ? 0.6 * selectivity + 0.4 * test : selectivity;
    const grad =
      c.completion != null || c.retention != null
        ? 0.6 * (c.completion ?? 0.5) + 0.4 * (c.retention ?? 0.5)
        : 0.5;
    const outcomes = normEarn(c.earnings);
    const affordability = 1 - normPrice(c.netPrice);
    // Reputation from published rank (your import or starter seed); neutral when
    // a school isn't on the list so it isn't unduly penalized.
    const rep = reputationScore(c.name);
    const reputation = rep == null ? 0.4 : rep;

    const score =
      ((weights.academics * academics +
        weights.graduation * grad +
        weights.outcomes * outcomes +
        weights.reputation * reputation +
        weights.affordability * affordability) /
        wsum) *
      100;

    return { college: c, score, rank: 0, attrs: attrsFor(c.name) };
  });

  const filtered = scored.filter(({ college, attrs }) => {
    if (filters.minSize && (college.size ?? 0) < filters.minSize) return false;
    if (filters.cityOnly && !(college.locale != null && college.locale >= 11 && college.locale <= 13))
      return false;
    if (filters.ownership === 'public' && college.ownership !== 1) return false;
    if (filters.ownership === 'private' && college.ownership !== 2) return false;
    if (filters.state && college.state !== filters.state) return false;
    if (filters.med && !attrs.med) return false;
    if (filters.law && !attrs.law) return false;
    if (filters.sports && !attrs.sports) return false;
    return true;
  });

  filtered.sort((a, b) => b.score - a.score);
  filtered.forEach((s, i) => (s.rank = i + 1));
  return filtered;
}

// --- Preference persistence ---------------------------------------------

const PREFS_KEY = 'cc_ranking_prefs_v1';

export function loadPrefs(): { weights: RankWeights; filters: RankFilters } {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        weights: { ...DEFAULT_WEIGHTS, ...(p.weights ?? {}) },
        filters: { ...DEFAULT_FILTERS, ...(p.filters ?? {}) },
      };
    }
  } catch {
    /* ignore */
  }
  return { weights: DEFAULT_WEIGHTS, filters: DEFAULT_FILTERS };
}

export function savePrefs(weights: RankWeights, filters: RankFilters): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ weights, filters }));
  } catch {
    /* ignore */
  }
}
