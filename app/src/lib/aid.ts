// Financial aid helpers: a live (web-search) scholarship finder, a curated set
// of legitimate free sources + major national scholarships, per-school aid
// deep-links, and a rough federal-aid (Pell) estimator. Anti-scam by design:
// we only surface free-to-apply, reputable sources and always say "verify".
import { callAi, profileText } from './plan';
import type { ScholarshipScope, StudentProfile } from './profile';
import type { School } from './schools';

export interface ScholarshipSuggestion {
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  url: string;
  eligibility: string;
  scope: ScholarshipScope;
}

const SYSTEM = `You are a careful financial-aid counselor helping a student find scholarships and grants they may qualify for, using web search.
Find a mix of: national scholarships, scholarships for their U.S. state, and school-specific aid for the colleges they list.
STRICT rules:
- Only LEGITIMATE, FREE-TO-APPLY scholarships from reputable providers (.org / .edu / .gov / well-known foundations). NEVER anything that asks the student to pay a fee.
- Include the official application URL.
- Tailor to the student's profile (state, intended major, background/identity, achievements, grade level).
- Deadlines and amounts change yearly — include them but they must be verified on the official page.
- If you are not confident a scholarship is real and free, leave it out.
Return ONLY valid JSON (no markdown) matching exactly:
{ "scholarships": [ { "name": "", "provider": "", "amount": "", "deadline": "", "url": "", "eligibility": "one line", "scope": "general|school|state|federal|other" } ] }
Provide up to 12, most relevant first.`;

export async function findScholarships(
  profile: StudentProfile,
  schools: School[],
): Promise<ScholarshipSuggestion[]> {
  const today = new Date().toISOString().slice(0, 10);
  const schoolList = schools.map((s) => s.name).filter(Boolean).join('; ') || 'none yet';
  const prompt = `Today is ${today}.

STUDENT PROFILE:
${profileText(profile)}

COLLEGES THEY'RE CONSIDERING (for school-specific aid): ${schoolList}

Find scholarships and grants this student may qualify for (national, their state, and school-specific). Return the JSON now.`;
  return parseScholarships(await callAi(SYSTEM, prompt, { webSearch: true }));
}

function parseScholarships(text: string): ScholarshipSuggestion[] {
  let raw = text.trim();
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) raw = fence[1].trim();
  if (!raw.startsWith('{')) {
    const i = raw.indexOf('{');
    const j = raw.lastIndexOf('}');
    if (i !== -1 && j !== -1) raw = raw.slice(i, j + 1);
  }
  const data = JSON.parse(raw) as { scholarships?: unknown };
  const list = Array.isArray(data.scholarships) ? data.scholarships : [];
  return list
    .map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      const scope = ['general', 'school', 'state', 'federal', 'other'].includes(
        o.scope as string,
      )
        ? (o.scope as ScholarshipScope)
        : 'general';
      return {
        name: String(o.name ?? '').trim(),
        provider: String(o.provider ?? '').trim(),
        amount: String(o.amount ?? '').trim(),
        deadline: String(o.deadline ?? '').trim(),
        url: String(o.url ?? '').trim(),
        eligibility: String(o.eligibility ?? '').trim(),
        scope,
      };
    })
    .filter((s) => s.name);
}

// --- Curated, vetted (free, no cost, scam-safe) --------------------------

export interface AidLink {
  name: string;
  desc: string;
  url: string;
}

export const AID_SOURCES: AidLink[] = [
  {
    name: 'Federal Student Aid — FAFSA',
    desc: 'File the FAFSA: the gateway to Pell Grants, federal loans, work-study, and most state & school aid. Always free.',
    url: 'https://studentaid.gov/h/apply-for-aid/fafsa',
  },
  {
    name: 'Federal Student Aid Estimator',
    desc: 'Official estimate of the federal aid (including Pell) you may receive.',
    url: 'https://studentaid.gov/aid-estimator/',
  },
  {
    name: 'College Board BigFuture Scholarships',
    desc: 'Free national scholarship search from College Board.',
    url: 'https://bigfuture.collegeboard.org/pay-for-college/scholarships',
  },
  {
    name: 'CareerOneStop Scholarship Finder (U.S. Dept. of Labor)',
    desc: 'Government scholarship & grant database, 8,000+ awards.',
    url: 'https://www.careeronestop.org/Toolkit/Training/find-scholarships.aspx',
  },
];

export const MAJOR_SCHOLARSHIPS: ScholarshipSuggestion[] = [
  { name: 'Coca-Cola Scholars Program', provider: 'Coca-Cola Foundation', amount: '$20,000', deadline: 'Fall (seniors)', url: 'https://www.coca-colascholarsfoundation.org/apply/', eligibility: 'HS seniors; leadership & service', scope: 'general' },
  { name: 'QuestBridge National College Match', provider: 'QuestBridge', amount: 'Full 4-year scholarship', deadline: 'September', url: 'https://www.questbridge.org/', eligibility: 'High-achieving, low-income seniors', scope: 'general' },
  { name: 'The Gates Scholarship', provider: 'Gates Foundation', amount: 'Full cost of attendance', deadline: 'September', url: 'https://www.thegatesscholarship.org/', eligibility: 'Pell-eligible minority seniors', scope: 'general' },
  { name: 'Jack Kent Cooke College Scholarship', provider: 'Jack Kent Cooke Foundation', amount: 'Up to $55,000/yr', deadline: 'November', url: 'https://www.jkcf.org/our-scholarships/college-scholarship-program/', eligibility: 'High achievement + financial need', scope: 'general' },
  { name: 'Dell Scholars Program', provider: 'Michael & Susan Dell Foundation', amount: '$20,000', deadline: 'December', url: 'https://www.dellscholars.org/', eligibility: 'Grit + need; college-readiness programs', scope: 'general' },
  { name: 'Horatio Alger National Scholarship', provider: 'Horatio Alger Association', amount: '$25,000', deadline: 'October', url: 'https://scholars.horatioalger.org/', eligibility: 'Adversity + financial need', scope: 'general' },
  { name: 'Elks Most Valuable Student', provider: 'Elks National Foundation', amount: 'Up to $50,000', deadline: 'November', url: 'https://www.elks.org/scholars/scholarships/mvs.cfm', eligibility: 'HS seniors; need + merit', scope: 'general' },
  { name: 'Burger King Scholars', provider: 'BK McLamore Foundation', amount: '$1,000–$60,000', deadline: 'December', url: 'https://www.bkmclamorefoundation.org/', eligibility: 'HS seniors (US/Canada/PR)', scope: 'general' },
];

// Reliable per-school financial-aid deep-links (name-based web searches).
export function schoolAidLinks(name: string) {
  const q = (intent: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(`${name} ${intent}`)}`;
  return {
    finAid: q('financial aid office tuition'),
    netPrice: q('net price calculator'),
    scholarships: q('merit scholarships admissions'),
  };
}

// --- Rough Pell / federal-aid estimator ----------------------------------

export interface AidInputs {
  income: string;
  familySize: string;
}

export const MAX_PELL = 7395; // 2024-25 maximum Pell award

const AID_KEY = 'cc_aid_inputs_v1';

export function loadAidInputs(): AidInputs {
  try {
    const raw = localStorage.getItem(AID_KEY);
    if (raw) return JSON.parse(raw) as AidInputs;
  } catch {
    /* ignore */
  }
  return { income: '', familySize: '' };
}

export function saveAidInputs(v: AidInputs): void {
  try {
    localStorage.setItem(AID_KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

export interface PellEstimate {
  band: 'full' | 'partial' | 'low' | 'unknown';
  label: string;
  note: string;
}

// Very rough banding using HHS poverty guidelines (48 states, 2024) as a proxy
// for the FAFSA's income thresholds. Clearly an estimate, not the real SAI.
export function estimatePell(income: number, familySize: number): PellEstimate {
  if (!Number.isFinite(income) || income <= 0 || !familySize) {
    return { band: 'unknown', label: 'Enter income & family size', note: '' };
  }
  const poverty = 15060 + 5380 * Math.max(0, familySize - 1);
  if (income <= poverty * 1.75) {
    return {
      band: 'full',
      label: 'Likely maximum Pell',
      note: `Households near or below ~175% of the poverty line often qualify for close to the maximum (~$${MAX_PELL.toLocaleString()}/yr).`,
    };
  }
  if (income <= poverty * 3.5) {
    return {
      band: 'partial',
      label: 'Likely partial Pell',
      note: 'Middle-income households often receive a partial Pell Grant. The exact amount depends on your full FAFSA (SAI) and each school’s cost.',
    };
  }
  return {
    band: 'low',
    label: 'Likely little to no Pell',
    note: 'Higher-income households often receive little federal grant aid — but still file the FAFSA: it unlocks loans, work-study, and many state & merit awards.',
  };
}

export const PELL_BAND_COLOR: Record<PellEstimate['band'], string> = {
  full: '#14B8A6',
  partial: '#F59E0B',
  low: '#94A3B8',
  unknown: '#94A3B8',
};
