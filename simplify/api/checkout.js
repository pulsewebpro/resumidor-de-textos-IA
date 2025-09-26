import { ensureWallet } from './_wallet-store.js';

const PLAN_CONFIG = {
  one:  { price: 1,  label: 'one', credits: 1 },
  ten:  { price: 5,  label: 'ten', credits: 10 },
  sub:  { price: 8,  label: 'sub', credits: Infinity }
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return respondCors(res, 204);
  }

  if (req.method !== 'POST') {
    return respond(res, 405, { ok: false, error: 'Method not allowed' });
  }

  const body = await parseBody(req);
  const planKey = String(body?.plan || '').trim();
  const plan = PLAN_CONFIG[planKey];
  const userId = sanitize(body?.userId || req.headers['x-simplify-user']);

  if (!plan) {
    return respond(res, 400, { ok: false, error: 'Plan inválido' });
  }

  const wallet = ensureWallet(userId);
  const sessionId = createSessionId(plan.label, userId);
  const url = buildCheckoutUrl(plan, sessionId, userId);

  return respond(res, 200, {
    ok: true,
    url,
    sessionId,
    plan: wallet.plan,
    credits: wallet.credits
  });
}

function respond(res, status, payload) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Simplify-User');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.end(JSON.stringify(payload));
}

function respondCors(res, status = 204) {
  res.status(status);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Simplify-User');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.end();
}

async function parseBody(req) {
  if (req.body && Object.keys(req.body).length) return req.body;
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) {
    return {};
  }
}

function sanitize(value) {
  if (!value) return '';
  return String(value).replace(/[^a-z0-9\-]/gi, '').slice(0, 64);
}

function createSessionId(planLabel, userId = '') {
  const base = `${planLabel}-${Date.now()}`;
  return sanitize(`${base}-${userId || 'guest'}`);
}

function buildCheckoutUrl(plan, sessionId, userId) {
  const base = process.env.CHECKOUT_BASE_URL || 'https://checkout.stripe.com/test';
  return `${base}/${plan.label}-${sessionId}?user=${encodeURIComponent(userId || 'guest')}&amount=${plan.price}`;
}
