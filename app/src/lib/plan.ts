// Builds the "improvement plan" prompt from the student profile + tagged
// schools, calls whichever AI backend is available (prefer the Vercel/Agent SDK
// endpoint, fall back to the Supabase Edge/Messages endpoint), and parses the
// structured result. The prompt lives here (one place); the backends are thin.
import {
  type StudentProfile,
  GRADE_LEVELS,
  GRADE_LEVEL_LABELS,
  computeGpa,
} from './profile';
import type { School } from './schools';
import { STATUS_LABELS } from './schools';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseClient';
import { getAiKey } from './aiKey';

export interface Recommendation {
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  rationale: string;
  steps: string[];
  timeframe: string;
}

export interface PlanResult {
  summary: string;
  recommendations: Recommendation[];
}

const MODEL = (import.meta.env.VITE_AI_MODEL as string) || 'claude-sonnet-4-6';

const SYSTEM = `You are an expert, encouraging high-school college admissions counselor.
You give specific, realistic, actionable guidance grounded ONLY in the student's data and remaining time before graduation.

Principles:
- Be concrete and time-aware. Tie each recommendation to the student's grade level and how much time is left.
- Identify real gaps (e.g., a weak grade in a subject relevant to the intended major, course rigor below target schools, an activity with no leadership/impact trajectory) and propose a concrete path to address each.
- Example of the style we want: "B in sophomore Chemistry + an intended Engineering major → take AP Physics junior year; spend the prior summer on the Khan Academy mechanics unit; an A there shows an upward STEM trajectory that matters more than the earlier B."
- Be honest. Never invent admission probabilities or guarantees. Encourage without false promises.
- Prioritize ruthlessly: a few high-impact moves beat a long list.

Return ONLY valid JSON (no markdown, no prose outside JSON) matching exactly:
{
  "summary": "2-4 sentence honest overview of where the student stands and the biggest levers",
  "recommendations": [
    {
      "title": "short imperative title",
      "category": "Academics | Testing | Extracurriculars | Essays/Story | Fit/List | Other",
      "priority": "High | Medium | Low",
      "rationale": "why this matters for THIS student and their target schools",
      "steps": ["concrete step", "concrete step"],
      "timeframe": "when to do it, e.g. 'Summer before junior year'"
    }
  ]
}`;

export function profileText(p: StudentProfile): string {
  const gpa = computeGpa(p.academics.courses);
  const lines: string[] = [];
  lines.push(
    `GPA: ${gpa.unweighted.toFixed(2)} unweighted, ${gpa.weighted.toFixed(2)} weighted (${gpa.gradedCredits} graded credits).`,
  );

  for (const gl of GRADE_LEVELS) {
    const cs = p.academics.courses.filter((c) => c.gradeLevel === gl);
    if (cs.length === 0) continue;
    const items = cs
      .map(
        (c) =>
          `${c.name || '(unnamed)'} [${c.level}${c.subject ? ', ' + c.subject : ''}]${c.grade ? ' — ' + c.grade : ''}`,
      )
      .join('; ');
    lines.push(`${GRADE_LEVEL_LABELS[gl]}: ${items}`);
  }

  if (p.academics.tests.length) {
    lines.push(
      'Tests: ' +
        p.academics.tests
          .map((t) => `${t.type}${t.label ? ' ' + t.label : ''} ${t.score}`.trim())
          .join('; '),
    );
  }

  if (p.extracurriculars.length) {
    lines.push('Activities (most important first):');
    p.extracurriculars.forEach((a, i) => {
      const grades = a.gradeLevels.length ? ` grades ${a.gradeLevels.join(',')}` : '';
      const hrs = a.hoursPerWeek ? ` ${a.hoursPerWeek}h/wk` : '';
      lines.push(
        `  ${i + 1}. ${a.name || '(unnamed)'} — ${a.role || 'member'} @ ${a.organization || 'n/a'} [${a.category}]${grades}${hrs}. ${a.description}${a.awards ? ' Awards: ' + a.awards : ''}`,
      );
    });
  }

  const w = p.whoIAm;
  const who: string[] = [];
  if (w.gradYear) who.push(`Grad year: ${w.gradYear}`);
  if (w.location) who.push(`Location: ${w.location}`);
  if (w.intendedMajors) who.push(`Intended major(s): ${w.intendedMajors}`);
  if (w.careerInterests) who.push(`Career interests: ${w.careerInterests}`);
  if (w.academicInterests) who.push(`Academic interests: ${w.academicInterests}`);
  if (w.hooks.length) who.push(`Background: ${w.hooks.join(', ')}`);
  if (w.background) who.push(`Context: ${w.background}`);
  if (w.values) who.push(`Values: ${w.values}`);
  if (w.collegePreferences) who.push(`College preferences: ${w.collegePreferences}`);
  if (w.budget) who.push(`Budget: ${w.budget}`);
  if (w.story) who.push(`Story: ${w.story}`);
  if (who.length) lines.push('Who they are:\n  ' + who.join('\n  '));

  return lines.join('\n');
}

function schoolsText(schools: School[]): string {
  if (!schools.length) return 'No target schools tagged yet.';
  return (
    'Target schools (with the student\'s own rating 1-5 and quality A-C):\n' +
    schools
      .map(
        (s) =>
          `  - ${s.name}${s.location ? ' (' + s.location + ')' : ''} — rank ${s.ranking || '?'}/5, quality ${s.quality ?? '?'}, ${STATUS_LABELS[s.status]}`,
      )
      .join('\n')
  );
}

export function buildPrompt(
  profile: StudentProfile,
  schools: School[],
): { system: string; prompt: string } {
  const prompt = `Here is the student's profile and target schools. Produce their personalized "how to improve my chances" plan.

=== STUDENT PROFILE ===
${profileText(profile)}

=== TARGET SCHOOLS ===
${schoolsText(schools)}

Return the JSON plan now.`;
  return { system: SYSTEM, prompt };
}

export function parsePlan(text: string): PlanResult {
  let raw = text.trim();
  // Strip markdown code fences if the model added them.
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) raw = fence[1].trim();
  // Fall back to the first {...} block.
  if (!raw.startsWith('{')) {
    const i = raw.indexOf('{');
    const j = raw.lastIndexOf('}');
    if (i !== -1 && j !== -1) raw = raw.slice(i, j + 1);
  }
  const data = JSON.parse(raw) as Partial<PlanResult>;
  const recs = Array.isArray(data.recommendations) ? data.recommendations : [];
  return {
    summary: typeof data.summary === 'string' ? data.summary : '',
    recommendations: recs.map((r) => ({
      title: String(r.title ?? 'Recommendation'),
      category: String(r.category ?? 'Other'),
      priority: (['High', 'Medium', 'Low'].includes(r.priority as string)
        ? r.priority
        : 'Medium') as Recommendation['priority'],
      rationale: String(r.rationale ?? ''),
      steps: Array.isArray(r.steps) ? r.steps.map(String) : [],
      timeframe: String(r.timeframe ?? ''),
    })),
  };
}

export class PlanError extends Error {}

/**
 * Shared AI call — gathers auth/key, tries the available backends (prefer the
 * Vercel/Agent SDK function, fall back to the Supabase Edge function) and
 * returns the raw assistant text. Used by both the plan and discover features.
 */
export async function callAi(
  system: string,
  prompt: string,
  opts?: { webSearch?: boolean },
): Promise<string> {
  const byoKey = getAiKey() || undefined;
  const token = (await supabase?.auth.getSession())?.data.session?.access_token;

  if (!token && !byoKey) {
    throw new PlanError(
      'Sign in to use the shared key, or add your own Anthropic API key in settings.',
    );
  }

  const body = JSON.stringify({
    system,
    prompt,
    model: MODEL,
    apiKey: byoKey,
    webSearch: opts?.webSearch ?? false,
  });

  const vercel = { url: '/api/plan', supabase: false };
  const supa = { url: `${SUPABASE_URL}/functions/v1/plan`, supabase: true };
  // Web search is most reliable via the Messages-API (Supabase) backend, so
  // prefer it when searching; otherwise prefer the Vercel/Agent SDK path.
  const endpoints: { url: string; supabase: boolean }[] = [];
  if (opts?.webSearch && SUPABASE_URL) {
    endpoints.push(supa, vercel);
  } else {
    endpoints.push(vercel);
    if (SUPABASE_URL) endpoints.push(supa);
  }

  let lastError = 'No AI backend is available.';
  for (const ep of endpoints) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (ep.supabase) headers['apikey'] = SUPABASE_ANON_KEY;

      const res = await fetch(ep.url, { method: 'POST', headers, body });
      const ct = res.headers.get('content-type') ?? '';
      if (!ct.includes('application/json')) {
        // e.g. a static 404 page where no function is deployed — try next.
        lastError = `No function deployed at ${ep.url}.`;
        continue;
      }
      const data = await res.json();
      if (!res.ok || data.error) {
        lastError = data.error || `Backend error (${res.status}).`;
        continue;
      }
      return (data.text as string) ?? '';
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }
  throw new PlanError(lastError);
}

/** Generates and parses a personalized improvement plan. */
export async function generatePlan(
  profile: StudentProfile,
  schools: School[],
): Promise<PlanResult> {
  const { system, prompt } = buildPrompt(profile, schools);
  return parsePlan(await callAi(system, prompt));
}
