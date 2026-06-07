// Live, on-demand campus events via the AI backend's web search. We never
// pre-scrape or cache a global dataset (events go stale fast); instead we fetch
// per school when the user asks, and cache that school's result briefly.
import { callAi } from './plan';
import type { School } from './schools';

export type EventType = 'Virtual' | 'On-campus' | 'Other';

export interface CampusEvent {
  title: string;
  type: EventType;
  date: string;
  description: string;
  url: string;
}

export interface EventsCache {
  events: CampusEvent[];
  fetchedAt: number;
}

const TTL_MS = 12 * 60 * 60 * 1000; // 12h
const cacheKey = (id: string) => `cc_events_${id}`;

const SYSTEM = `You research a specific college's UPCOMING official admissions events using web search.
Look for: information sessions, campus tours / visit days, virtual info sessions, open houses, and admitted-student events.
Rules:
- Use web search and prefer the school's official .edu admissions/visit/events pages (and its event registration system).
- Only include events dated in the FUTURE relative to today's date given in the prompt.
- Include a registration/details URL when available.
- If you cannot find concrete events, return an empty list rather than guessing.
Return ONLY valid JSON (no markdown, no prose) matching exactly:
{ "events": [ { "title": "", "type": "Virtual|On-campus|Other", "date": "YYYY-MM-DD or readable date", "url": "https://...", "description": "one short line" } ] }
Include up to 8 events, soonest first.`;

export async function fetchEvents(school: School): Promise<CampusEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const prompt = `School: ${school.name}${school.location ? ` (${school.location})` : ''}.
Today's date is ${today}.
Find this school's upcoming official admissions events (virtual and on-campus) with dates and registration links. Return the JSON now.`;
  const text = await callAi(SYSTEM, prompt, { webSearch: true });
  return parseEvents(text);
}

function parseEvents(text: string): CampusEvent[] {
  let raw = text.trim();
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) raw = fence[1].trim();
  if (!raw.startsWith('{')) {
    const i = raw.indexOf('{');
    const j = raw.lastIndexOf('}');
    if (i !== -1 && j !== -1) raw = raw.slice(i, j + 1);
  }
  const data = JSON.parse(raw) as { events?: unknown };
  const list = Array.isArray(data.events) ? data.events : [];
  return list
    .map((e) => {
      const o = (e ?? {}) as Record<string, unknown>;
      const type = ['Virtual', 'On-campus', 'Other'].includes(o.type as string)
        ? (o.type as EventType)
        : 'Other';
      return {
        title: String(o.title ?? '').trim(),
        type,
        date: String(o.date ?? '').trim(),
        description: String(o.description ?? '').trim(),
        url: String(o.url ?? '').trim(),
      };
    })
    .filter((e) => e.title);
}

export function loadCachedEvents(id: string): EventsCache | null {
  try {
    const raw = localStorage.getItem(cacheKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EventsCache;
    if (Date.now() - parsed.fetchedAt > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCachedEvents(id: string, events: CampusEvent[]): EventsCache {
  const cache: EventsCache = { events, fetchedAt: Date.now() };
  try {
    localStorage.setItem(cacheKey(id), JSON.stringify(cache));
  } catch {
    /* ignore */
  }
  return cache;
}

export function timeAgo(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  return `${hrs}h ago`;
}
