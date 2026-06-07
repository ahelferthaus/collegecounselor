// Transparent admission "banding" — deliberately NOT a single false-precision
// probability. Combines a school's selectivity (admit rate) with where the
// student's test scores fall in the admitted range, the way a counselor would.
import { computeGpa, type StudentProfile } from './profile';
import type { CollegeData } from './scorecard';

export interface StudentStats {
  gpa: number; // unweighted, 0 if none
  sat: number | null;
  act: number | null;
}

export function deriveStats(p: StudentProfile): StudentStats {
  const gpa = computeGpa(p.academics.courses).unweighted;
  let sat: number | null = null;
  let act: number | null = null;
  for (const t of p.academics.tests) {
    const n = parseInt(t.score.replace(/[^0-9]/g, ''), 10);
    if (Number.isNaN(n)) continue;
    if (t.type === 'SAT' && n >= 400 && n <= 1600) sat = Math.max(sat ?? 0, n);
    if (t.type === 'ACT' && n >= 1 && n <= 36) act = Math.max(act ?? 0, n);
  }
  return { gpa, sat, act };
}

export type Band = 'Likely' | 'Target' | 'Reach' | 'High Reach' | 'Unknown';

export interface FitResult {
  band: Band;
  testPosition: 'above' | 'within' | 'below' | null;
  reasons: string[];
}

export const BAND_STYLES: Record<Band, { bg: string; fg: string; label: string }> = {
  Likely: { bg: '#CCFBF1', fg: '#0F766E', label: 'Likely' },
  Target: { bg: '#EDE9FE', fg: '#6D28D9', label: 'Target' },
  Reach: { bg: '#FEF3C7', fg: '#B45309', label: 'Reach' },
  'High Reach': { bg: '#FEE2E2', fg: '#B91C1C', label: 'High Reach' },
  Unknown: { bg: '#F1F5F9', fg: '#475569', label: 'Not enough data' },
};

// Where does the student's best test score sit vs the admitted middle 50%?
function testPosition(stats: StudentStats, c: CollegeData) {
  if (stats.sat && c.sat25 && c.sat75) {
    if (stats.sat >= c.sat75) return { pos: 'above' as const, kind: 'SAT' };
    if (stats.sat < c.sat25) return { pos: 'below' as const, kind: 'SAT' };
    return { pos: 'within' as const, kind: 'SAT' };
  }
  if (stats.act && c.act25 && c.act75) {
    if (stats.act >= c.act75) return { pos: 'above' as const, kind: 'ACT' };
    if (stats.act < c.act25) return { pos: 'below' as const, kind: 'ACT' };
    return { pos: 'within' as const, kind: 'ACT' };
  }
  return null;
}

export function computeFit(stats: StudentStats, c: CollegeData | null): FitResult {
  if (!c || c.admitRate == null) {
    return {
      band: 'Unknown',
      testPosition: null,
      reasons: ['No published admissions data found for this school.'],
    };
  }

  const reasons: string[] = [];
  const rate = c.admitRate;
  const ratePct = Math.round(rate * 100);

  // 1) Base selectivity from admit rate (0 = hardest, 3 = easiest).
  let score: number;
  if (rate < 0.15) {
    score = 0;
    reasons.push(`Highly selective — admits ~${ratePct}% of applicants.`);
  } else if (rate < 0.4) {
    score = 1;
    reasons.push(`Selective — admits ~${ratePct}% of applicants.`);
  } else if (rate < 0.7) {
    score = 2;
    reasons.push(`Moderately selective — admits ~${ratePct}% of applicants.`);
  } else {
    score = 3;
    reasons.push(`Accessible — admits ~${ratePct}% of applicants.`);
  }

  // 2) Adjust by where the student's scores land in the admitted range.
  const tp = testPosition(stats, c);
  if (tp) {
    if (tp.pos === 'above') {
      score += 1;
      reasons.push(`Your ${tp.kind} is at/above their 75th percentile — a strength.`);
    } else if (tp.pos === 'below') {
      score -= 1;
      reasons.push(`Your ${tp.kind} is below their 25th percentile — a stretch.`);
    } else {
      reasons.push(`Your ${tp.kind} is within their middle 50%.`);
    }
  } else if (stats.sat || stats.act) {
    reasons.push('This school has no published score range to compare against.');
  } else {
    reasons.push('Add SAT/ACT scores to your profile for a sharper estimate.');
  }

  // 3) Map combined score to a band.
  let band: Band;
  if (score >= 3) band = 'Likely';
  else if (score >= 2) band = 'Target';
  else if (score >= 1) band = 'Reach';
  else band = 'High Reach';

  return { band, testPosition: tp?.pos ?? null, reasons };
}

export function formatRange(lo: number | null, hi: number | null): string | null {
  if (lo == null && hi == null) return null;
  if (lo != null && hi != null) return `${lo}–${hi}`;
  return String(lo ?? hi);
}

export function formatMoney(n: number | null): string | null {
  if (n == null) return null;
  return `$${Math.round(n).toLocaleString()}`;
}
