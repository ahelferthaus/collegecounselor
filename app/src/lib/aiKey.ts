// Optional "bring your own" Anthropic API key, used only as a fallback for the
// AI features when no server-side key is configured. Stored ONLY in this
// browser (localStorage) — never sent to our database, only to your own
// backend function over HTTPS when you generate a plan.

const KEY = 'cc_anthropic_key_v1';

export function getAiKey(): string {
  try {
    return localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

export function setAiKey(value: string): void {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}

export function hasAiKey(): boolean {
  return getAiKey().length > 0;
}

export function maskKey(k: string): string {
  if (!k) return '';
  if (k.length <= 12) return '••••';
  return `${k.slice(0, 7)}…${k.slice(-4)}`;
}

// --- College Scorecard API key (free, from api.data.gov) -----------------
const SCORECARD_KEY = 'cc_scorecard_key_v1';

export function getScorecardKey(): string {
  try {
    return localStorage.getItem(SCORECARD_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setScorecardKey(value: string): void {
  try {
    if (value) localStorage.setItem(SCORECARD_KEY, value);
    else localStorage.removeItem(SCORECARD_KEY);
  } catch {
    /* storage unavailable */
  }
}
