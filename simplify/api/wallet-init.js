import { handleCors, readBody, sendJSON, assertAllowedMethods, getTokenFromHeader, issueToken, signToken } from './_shared.js';

const FREE_PLAN = {
  uses: 3,
  plan: 'free',
  expDays: 30
};

const daysToMs = days => days * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (assertAllowedMethods(req, res, ['POST', 'OPTIONS'])) return;

  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
  }

  const uid = body?.uid;
  if (!uid || typeof uid !== 'string') {
    return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
  }

  const existing = getTokenFromHeader(req);
  if (existing && existing.uid === uid) {
    const token = signToken(existing);
    res.setHeader('x-simplify-set', token);
    return sendJSON(res, 200, { ok: true, wallet: existing });
  }

  const exp = new Date(Date.now() + daysToMs(FREE_PLAN.expDays)).toISOString();
  const { token, payload } = issueToken({ uid, uses: FREE_PLAN.uses, plan: FREE_PLAN.plan, exp });
  res.setHeader('x-simplify-set', token);
  return sendJSON(res, 200, { ok: true, wallet: payload });
}
