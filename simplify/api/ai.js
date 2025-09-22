import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

const isProd = process.env.NODE_ENV === 'production';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || (isProd ? '' : '*');

function setCors(req, res) {
  const requestOrigin = req.headers.origin;
  const wildcard = !isProd || ALLOWED_ORIGIN === '*';
  const same = ALLOWED_ORIGIN && requestOrigin && requestOrigin === ALLOWED_ORIGIN;
  if (wildcard) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (same || (!requestOrigin && ALLOWED_ORIGIN)) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function tryParseJSON(s) {
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
}
function extractJSON(raw) {
  if (!raw) return null;
  // 1) directo
  let parsed = tryParseJSON(raw);
  if (parsed) return parsed;
  // 2) bloque ```json ... ```
  const m1 = raw.match(/```json\s*([\s\S]*?)```/i);
  if (m1) {
    parsed = tryParseJSON(m1[1]);
    if (parsed) return parsed;
  }
  // 3) primer objeto balanceado
  const start = raw.indexOf('{');
  if (start !== -1) {
    let depth = 0;
    for (let i = start; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          const cand = raw.slice(start, i + 1);
          parsed = tryParseJSON(cand);
          if (parsed) return parsed;
          break;
        }
      }
    }
  }
  return null;
}

function normalize(payload) {
  if (!payload || typeof payload !== 'object') return null;
  if (payload.ok === false) return { ok: false, message: payload.message || 'Error' };
  const outputs = Array.isArray(payload?.result?.outputs)
    ? payload.result.outputs
    : Array.isArray(payload.outputs) ? payload.outputs : null;
  if (outputs) {
    const clean = outputs.map((o, i) => ({
      label: (o && typeof o.label === 'string' && o.label.trim()) || `Resultado ${i+1}`,
      content: String(o?.content ?? '')
    }));
    return { ok: true, result: { outputs: clean } };
  }
  return null;
}

async function callOpenAI(messages, maxTokens) {
  if (!client) {
    // Sin API key, devolvemos mock en desarrollo para no romper la UI
    return JSON.stringify({
      ok: true,
      result: { outputs: [{ label: 'Resultado', content: 'Mock: configura OPENAI_API_KEY en Vercel.' }] }
    });
  }
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const resp = await client.chat.completions.create({
    model,
    messages,
    max_tokens: typeof maxTokens === 'number' ? maxTokens : undefined,
    temperature: 0.4,
  });
  const raw = resp?.choices?.[0]?.message?.content;
  if (!raw) throw Object.assign(new Error('La IA no devolvió contenido.'), { status: 502 });
  return raw;
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    // Logs concisos (se ven en Vercel -> Deployments -> Logs)
    console.log('[api/ai] start', {
      hasKey: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    });

    const body = req.body || {};
    // Soporta payloads antiguos: { prompt } o { text, chips, ... } con buildPrompt en cliente
    const prompt = Array.isArray(body.prompt) ? body.prompt : body.messages || null;
    const maxTokens = body.maxTokens;

    if (!Array.isArray(prompt) || prompt.length === 0) {
      console.log('[api/ai] bad-prompt', typeof prompt);
      return res.status(400).json({ ok: false, message: 'Prompt inválido.' });
    }

    // Llamada a OpenAI
    const raw = await callOpenAI(prompt, maxTokens);
    console.log('[api/ai] raw-length', raw?.length ?? 0);

    // Parseo robusto
    const parsedObj = extractJSON(raw) || tryParseJSON(raw);
    const normalized = normalize(parsedObj);
    if (normalized) return res.status(200).json(normalized);

    // Fallback seguro
    const content = String(raw ?? '').trim();
    return res.status(200).json({
      ok: true,
      result: { outputs: [{ label: 'Resultado', content }] }
    });

  } catch (err) {
    const status = err?.status || 500;
    console.error('[api/ai] error', status, err?.message || String(err));
    return res.status(status).json({ ok: false, message: err?.message || 'Error interno' });
  }
}
