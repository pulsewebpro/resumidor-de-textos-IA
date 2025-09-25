import OpenAI from 'openai';
import { applyCors, extractBearerToken, readJSONBody, sendJSON } from './_utils/http.js';
import { consumeWalletToken } from './claim.js';

export const config = {
  runtime: 'nodejs18.x'
};

let openaiClient = null;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { ok: false, code: 'ENV_MISSING', key: 'OPENAI_API_KEY' };
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

function normalizePrompt(body) {
  if (!body || typeof body !== 'object') return null;
  let { prompt, input, maxTokens } = body;
  if (!Array.isArray(prompt) && typeof input === 'string' && input.trim()) {
    prompt = [{ role: 'user', content: input.trim() }];
  }
  if (!Array.isArray(prompt) || prompt.length === 0) {
    return null;
  }
  return { prompt, maxTokens };
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') {
    return sendJSON(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  let body = {};
  try {
    body = await readJSONBody(req);
  } catch (error) {
    if (error?.message === 'PAYLOAD_TOO_LARGE') {
      return sendJSON(res, 413, { ok: false, code: 'PAYLOAD_TOO_LARGE' });
    }
    if (error?.message === 'INVALID_JSON') {
      return sendJSON(res, 400, { ok: false, code: 'INVALID_JSON' });
    }
    body = {};
  }

  const authToken = extractBearerToken(req);

  const promptData = normalizePrompt(body);
  if (!promptData) {
    return sendJSON(res, 400, { ok: false, code: 'INVALID_PROMPT' });
  }

  const walletUserId = body.walletUserId || req.headers['x-wallet-user'] || null;

  let updatedToken = null;
  if (authToken) {
    const claimResult = await consumeWalletToken(authToken, { walletUserId });
    if (claimResult?.ok === false) {
      const status = claimResult.code === 'NO_CREDITS' || claimResult.code === 'SUB_INACTIVE' ? 402 : 401;
      return sendJSON(res, status, { ok: false, code: claimResult.code });
    }
    updatedToken = claimResult?.token || null;
  }

  const maxTokens = Math.max(1, Math.min(2048, Number(promptData.maxTokens) || 512));
  let content = '';

  const openai = getOpenAIClient();
  if (openai?.ok === false) {
    const fallbackContent = promptData?.prompt?.map?.((step) => step?.content)?.join('\n') || '';
    const message = fallbackContent ? `Echo: ${fallbackContent}` : 'Configura OPENAI_API_KEY';
    if (updatedToken) {
      res.setHeader('x-simplify-token', updatedToken);
    }
    return sendJSON(res, 200, {
      ok: true,
      outputs: [{ label: 'fallback', content: message }]
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: promptData.prompt,
      max_tokens: maxTokens,
      temperature: 0.3
    });
    content = completion?.choices?.[0]?.message?.content?.trim?.() || '';
  } catch (error) {
    return sendJSON(res, 502, { ok: false, code: 'OPENAI_ERROR', message: error?.message || 'OpenAI request failed' });
  }

  if (!content) {
    content = '';
  }

  if (updatedToken) {
    res.setHeader('x-simplify-token', updatedToken);
  }

  return sendJSON(res, 200, {
    ok: true,
    outputs: [
      {
        label: 'AI',
        content
      }
    ]
  });
}
