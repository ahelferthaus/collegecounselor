// "Recommended for you" — individualized school suggestions from the student's
// profile, via the shared AI backend. Reuses the same dual-backend call as the
// improvement plan.
import { callAi, profileText } from './plan';
import type { StudentProfile } from './profile';
import type { School } from './schools';

export interface SchoolSuggestion {
  name: string;
  location: string;
  band: 'Likely' | 'Target' | 'Reach';
  reason: string;
  highlights: string[];
}

const SYSTEM = `You are an expert college counselor building a personalized college list.
Recommend REAL, currently-operating, accredited colleges/universities that fit the student.
- Balance the list across bands: include some Likely, several Target, and a few Reach.
- Tailor to intended major/interests, academic stats, budget, and location/size/setting preferences.
- Be realistic about selectivity relative to the student's stats.
- Do NOT include any school already on the student's list.
- Use correct official school names and their city + state (or country).
Return ONLY valid JSON (no markdown, no prose) matching exactly:
{ "suggestions": [ { "name": "", "location": "City, ST", "band": "Likely|Target|Reach", "reason": "1-2 sentences on why it fits THIS student", "highlights": ["short phrase", "short phrase"] } ] }
Provide 9-12 suggestions.`;

export async function getRecommendations(
  profile: StudentProfile,
  existing: School[],
): Promise<SchoolSuggestion[]> {
  const exclude =
    existing
      .map((s) => s.name)
      .filter(Boolean)
      .join('; ') || 'none';
  const prompt = `STUDENT PROFILE:\n${profileText(profile)}\n\nALREADY ON THEIR LIST (exclude these): ${exclude}\n\nReturn the recommended college list now as JSON.`;
  return parseSuggestions(await callAi(SYSTEM, prompt));
}

function parseSuggestions(text: string): SchoolSuggestion[] {
  let raw = text.trim();
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) raw = fence[1].trim();
  if (!raw.startsWith('{')) {
    const i = raw.indexOf('{');
    const j = raw.lastIndexOf('}');
    if (i !== -1 && j !== -1) raw = raw.slice(i, j + 1);
  }
  const data = JSON.parse(raw) as { suggestions?: unknown };
  const list = Array.isArray(data.suggestions) ? data.suggestions : [];
  return list.map((s) => {
    const o = (s ?? {}) as Record<string, unknown>;
    const band = ['Likely', 'Target', 'Reach'].includes(o.band as string)
      ? (o.band as SchoolSuggestion['band'])
      : 'Target';
    return {
      name: String(o.name ?? '').trim(),
      location: String(o.location ?? '').trim(),
      band,
      reason: String(o.reason ?? '').trim(),
      highlights: Array.isArray(o.highlights) ? o.highlights.map(String) : [],
    };
  }).filter((s) => s.name);
}
