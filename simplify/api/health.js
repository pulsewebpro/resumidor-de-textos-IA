import { handleCors, sendJSON, assertAllowedMethods } from './_shared.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (assertAllowedMethods(req, res, ['GET', 'OPTIONS'])) return;

  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  sendJSON(res, 200, {
    ok: true,
    time: new Date().toISOString(),
    env: { hasOpenAI }
  });
}
