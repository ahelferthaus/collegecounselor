// Vercel serverless function (Node runtime) — generates the improvement plan
// using the Claude Agent SDK, so usage draws from a linked Pro/Max plan's
// Agent SDK credit pool before pay-per-token. The ANTHROPIC_API_KEY is a
// server-side secret and is NEVER exposed to the browser.
//
// Deploy: this lives under /api on your Vercel project. Set the env var
// ANTHROPIC_API_KEY in the Vercel dashboard. (GitHub Pages can't run this —
// the app will fall back to the Supabase Edge function there.)
import { query } from '@anthropic-ai/claude-agent-sdk';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://uglrlibycppkhtofwmht.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_p-e3UYMhT4pkhq06xDomuQ_IAkTdG38';

export const config = { maxDuration: 60 };

async function verifyUser(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: token, apikey: SUPABASE_ANON_KEY },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { system, prompt, model, apiKey, webSearch } = body as {
    system?: string;
    prompt?: string;
    model?: string;
    apiKey?: string;
    webSearch?: boolean;
  };

  if (!prompt || !system) {
    res.status(400).json({ error: 'Missing prompt.' });
    return;
  }

  // If using the server key, require a valid signed-in user (prevents abuse).
  // A caller supplying their own key pays for their own usage.
  const serverKey = process.env.ANTHROPIC_API_KEY;
  const key = apiKey || serverKey;
  if (!key) {
    res.status(500).json({ error: 'No Anthropic API key configured on the server.' });
    return;
  }
  if (!apiKey) {
    const ok = await verifyUser(req.headers['authorization']);
    if (!ok) {
      res.status(401).json({ error: 'Sign in required to use the shared key.' });
      return;
    }
  }

  process.env.ANTHROPIC_API_KEY = key;

  try {
    const response = query({
      prompt,
      options: {
        model: model || 'claude-sonnet-4-6',
        systemPrompt: system,
        maxTurns: webSearch ? 4 : 1,
        allowedTools: webSearch ? ['WebSearch'] : [],
      },
    });

    let resultText = '';
    let assistantText = '';
    for await (const message of response as AsyncIterable<Record<string, unknown>>) {
      if (message.type === 'result' && typeof message.result === 'string') {
        resultText = message.result as string;
      } else if (message.type === 'assistant') {
        const msg = message.message as { content?: Array<{ type: string; text?: string }> };
        for (const block of msg?.content ?? []) {
          if (block.type === 'text' && block.text) assistantText += block.text;
        }
      }
    }
    res.status(200).json({ text: resultText || assistantText });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Generation failed.' });
  } finally {
    if (apiKey) delete process.env.ANTHROPIC_API_KEY;
  }
}
