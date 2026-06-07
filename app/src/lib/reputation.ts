// Reputation signal for the ranking. A small, EDITABLE starter set of widely-
// known schools (approximate, recent) plus a user-import box. We deliberately
// do NOT bundle any publisher's full ordered list — paste your own copy via
// Import; it's stored only in your browser and overrides the starter values.

export interface ReputationEntry {
  rank: number;
  kind: 'National' | 'Liberal Arts' | 'Imported';
}

function norm(name: string): string {
  return name
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[.,]/g, '')
    .replace(/\s*-\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Approximate, widely-known top schools — a starting reference you can replace
// by importing your own list. Not authoritative; verify against the source.
const SEED: Record<string, ReputationEntry> = {};
const nat: [string, number][] = [
  ['Princeton University', 1], ['Massachusetts Institute of Technology', 2],
  ['Harvard University', 3], ['Stanford University', 3], ['Yale University', 5],
  ['California Institute of Technology', 6], ['Duke University', 6],
  ['Johns Hopkins University', 6], ['Northwestern University', 6],
  ['University of Pennsylvania', 6], ['Cornell University', 11],
  ['University of Chicago', 11], ['Brown University', 13], ['Columbia University', 13],
  ['Dartmouth College', 15], ['University of California-Los Angeles', 15],
  ['University of California-Berkeley', 17], ['Rice University', 17],
  ['University of Notre Dame', 18], ['Vanderbilt University', 18],
  ['Carnegie Mellon University', 21], ['University of Michigan-Ann Arbor', 21],
  ['Georgetown University', 22], ['University of North Carolina at Chapel Hill', 22],
  ['Emory University', 24], ['University of Virginia', 24],
  ['Washington University in St Louis', 24], ['University of Southern California', 27],
  ['New York University', 30],
];
const lac: [string, number][] = [
  ['Williams College', 1], ['Amherst College', 2], ['Swarthmore College', 3],
  ['Pomona College', 4], ['Wellesley College', 4], ['Bowdoin College', 6],
  ['Carleton College', 6], ['Claremont McKenna College', 8], ['Middlebury College', 9],
  ['Washington and Lee University', 9], ['Smith College', 11], ['Davidson College', 11],
  ['Grinnell College', 11], ['Hamilton College', 14], ['Vassar College', 14],
  ['Haverford College', 16], ['Colgate University', 17], ['Wesleyan University', 17],
  ['Barnard College', 18], ['Colby College', 18],
];
for (const [n, r] of nat) SEED[norm(n)] = { rank: r, kind: 'National' };
for (const [n, r] of lac) SEED[norm(n)] = { rank: r, kind: 'Liberal Arts' };

const IMPORT_KEY = 'cc_reputation_import_v1';
let importCache: Record<string, ReputationEntry> | null = null;

function loadImport(): Record<string, ReputationEntry> {
  if (importCache) return importCache;
  try {
    const raw = localStorage.getItem(IMPORT_KEY);
    importCache = raw ? (JSON.parse(raw) as Record<string, ReputationEntry>) : {};
  } catch {
    importCache = {};
  }
  return importCache;
}

export function getReputation(name: string): ReputationEntry | null {
  const n = norm(name);
  const imported = loadImport();
  if (imported[n]) return imported[n];
  if (SEED[n]) return SEED[n];
  // best-effort prefix match for naming differences
  for (const key of Object.keys(imported)) {
    if (n.startsWith(key) || key.startsWith(n)) return imported[key];
  }
  for (const key of Object.keys(SEED)) {
    if (n.startsWith(key) || key.startsWith(n)) return SEED[key];
  }
  return null;
}

// 1.0 for #1, decreasing with rank; null when unknown.
export function reputationScore(name: string): number | null {
  const rep = getReputation(name);
  if (!rep) return null;
  return Math.max(0, 1 - (rep.rank - 1) / 200);
}

// Parse pasted lines like "1. Princeton University", "1, Princeton",
// "Princeton University, 1", or "1<tab>Princeton". Returns count imported.
export function importReputation(text: string, kindLabel = 'Imported'): number {
  const map: Record<string, ReputationEntry> = { ...loadImport() };
  let count = 0;
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const m = trimmed.match(/(\d{1,3})/);
    if (!m) continue;
    const rank = parseInt(m[1], 10);
    const name = trimmed.replace(/\d{1,3}/, '').replace(/^[).,\-\s]+|[).,\-\s]+$/g, '').trim();
    if (!name) continue;
    map[norm(name)] = { rank, kind: kindLabel as ReputationEntry['kind'] };
    count++;
  }
  importCache = map;
  try {
    localStorage.setItem(IMPORT_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
  return count;
}

export function reputationImportCount(): number {
  return Object.keys(loadImport()).length;
}

export function clearReputationImport(): void {
  importCache = {};
  try {
    localStorage.removeItem(IMPORT_KEY);
  } catch {
    /* ignore */
  }
}
