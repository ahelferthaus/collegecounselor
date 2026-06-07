// Supabase Edge Function (Deno) — generates the improvement plan via the
// Anthropic Messages API. Robust, easy to deploy, but pure pay-per-token
// (does not draw from a Claude plan's Agent SDK credit pool).
//
// Deploy:  supabase functions deploy plan --no-verify-jwt
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// (We verify the user manually so a caller can also use their own key.)

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY =
  Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? '';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

async function verifyUser(token: string | null): Promise<boolean> {
  if (!token || !SUPABASE_URL) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: token, apikey: SUPABASE_ANON_KEY },
    });
    return res.ok;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: { system?: string; prompt?: string; model?: string; apiKey?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const { system, prompt, model, apiKey, webSearch } = body as typeof body & {
    webSearch?: boolean;
  };
  if (!prompt || !system) return json({ error: 'Missing prompt.' }, 400);

  const serverKey = Deno.env.get('ANTHROPIC_API_KEY');
  const key = apiKey || serverKey;
  if (!key) return json({ error: 'No Anthropic API key configured.' }, 500);

  // Server key requires a signed-in user; a personal key does not.
  if (!apiKey) {
    const ok = await verifyUser(req.headers.get('authorization'));
    if (!ok) return json({ error: 'Sign in required to use the shared key.' }, 401);
  }

  // Optional server-side web search tool (for live event lookups).
  const reqBody: Record<string, unknown> = {
    model: model || 'claude-sonnet-4-6',
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: prompt }],
  };
  if (webSearch) {
    reqBody.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 6 }];
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return json({ error: `Anthropic API error (${resp.status}): ${err.slice(0, 300)}` }, 502);
    }

    const data = await resp.json();
    const text = Array.isArray(data.content)
      ? data.content.filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('')
      : '';
    return json({ text });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Generation failed.' }, 500);
  }
});
