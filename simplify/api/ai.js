import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;
const isProd = process.env.NODE_ENV === 'production';
const envAllowedOrigin = process.env.ALLOWED_ORIGIN;
const ALLOWED_ORIGIN = isProd ? envAllowedOrigin : '*';

function setCors(req, res) {
  const requestOrigin = req.headers.origin;
  const allowWildcard = !isProd || ALLOWED_ORIGIN === '*';
  const canMirrorOrigin = ALLOWED_ORIGIN && requestOrigin && requestOrigin === ALLOWED_ORIGIN;

  if (allowWildcard) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (canMirrorOrigin || (!requestOrigin && ALLOWED_ORIGIN)) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function tryParseJSON(payload) {
  if (!payload) return null;
  try {
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

function extractJSON(raw) {
  if (!raw) return null;
  const direct = tryParseJSON(raw);
  if (direct) return direct;

  const block = raw.match(/```json\s*([\s\S]*?)```/i);
  if (block) {
    const fromBlock = tryParseJSON(block[1]);
    if (fromBlock) return fromBlock;
  }

  const firstBrace = raw.indexOf('{');
  if (firstBrace !== -1) {
    let depth = 0;
    for (let idx = firstBrace; idx < raw.length; idx += 1) {
      const char = raw[idx];
      if (char === '{') {
        depth += 1;
      } else if (char === '}') {
        depth -= 1;
        if (depth === 0) {
          const candidate = raw.slice(firstBrace, idx + 1);
          const parsed = tryParseJSON(candidate);
          if (parsed) return parsed;
          break;
        }
      }
    }
  }

  return null;
}

function sanitizeOutputs(outputs) {
  if (!Array.isArray(outputs)) return null;

  const sanitized = outputs
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const label = typeof item.label === 'string' && item.label.trim()
        ? item.label.trim()
        : `Resultado ${index + 1}`;
      const contentValue = item.content != null ? item.content : '';
      const content = typeof contentValue === 'string' ? contentValue : String(contentValue);
      return { label, content };
    })
    .filter(Boolean);

  return sanitized.length ? sanitized : null;
}

function normalizeResponsePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if (payload.ok === false) {
    return { ok: false, message: payload.message || 'Error' };
  }

  const baseOutputs = Array.isArray(payload) ? payload : payload.result?.outputs || payload.outputs;
  const outputs = sanitizeOutputs(baseOutputs);
  if (outputs) {
    return { ok: true, result: { outputs } };
  }

  return null;
}

function createFallbackFromRaw(raw) {
  const content = String(raw ?? '').trim();
  return {
    ok: true,
    result: {
      outputs: [
        {
          label: 'Resultado',
          content,
        },
      ],
    },
  };
}

async function callOpenAI(messages, maxTokens) {
  if (!client) {
    const error = new Error('OPENAI_API_KEY no está configurada.');
    error.status = 500;
    throw error;
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const response = await client.chat.completions.create({
    model,
    messages,
    max_tokens: typeof maxTokens === 'number' ? maxTokens : undefined,
    temperature: 0.6,
  });

  const raw = response?.choices?.[0]?.message?.content;
  if (!raw) {
    const error = new Error('La IA no devolvió contenido.');
    error.status = 502;
    throw error;
  }

  return raw;
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const { prompt: composedPrompt, maxTokens } = req.body || {};

    if (!Array.isArray(composedPrompt) || composedPrompt.length === 0) {
      const error = new Error('Prompt inválido.');
      error.status = 400;
      throw error;
    }

    const raw = await callOpenAI(composedPrompt, maxTokens);
    const parsed = extractJSON(raw);
    const normalized = normalizeResponsePayload(parsed);

    if (normalized) {
      return res.status(200).json(normalized);
    }

    const fallback = createFallbackFromRaw(raw);
    return res.status(200).json(fallback);
  } catch (error) {
    const status = error.status || 500;
    console.error(`[api/ai] ${status} ${error.message || 'Error'}`);
    return res.status(status).json({ ok: false, message: error.message || 'Error interno' });
  }
}
