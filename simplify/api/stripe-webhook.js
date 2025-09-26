import { adjustCredits, resetForSubscription, setWallet } from './_wallet-store.js';

const PLAN_ACTIONS = {
  one: (userId) => {
    adjustCredits(userId, 1);
    setWallet(userId, { plan: 'one' });
  },
  ten: (userId) => {
    adjustCredits(userId, 10);
    setWallet(userId, { plan: 'ten' });
  },
  sub: (userId) => {
    resetForSubscription(userId);
  }
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return respond(res, 204, {});
  }

  if (req.method !== 'POST') {
    return respond(res, 405, { ok: false, error: 'Method not allowed' });
  }

  const payload = await parseBody(req);
  const plan = String(payload?.plan || payload?.data?.plan || '').trim();
  const userId = sanitize(payload?.userId || payload?.data?.userId || req.headers['x-simplify-user']);

  if (!plan || !PLAN_ACTIONS[plan]) {
    return respond(res, 400, { ok: false, error: 'Evento desconocido' });
  }

  if (!userId) {
    return respond(res, 400, { ok: false, error: 'Falta userId' });
  }

  PLAN_ACTIONS[plan](userId);

  return respond(res, 200, { ok: true, plan, userId });
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

function respond(res, status, payload) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Simplify-User');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.end(JSON.stringify(payload));
}

function sanitize(value) {
  if (!value) return '';
  return String(value).replace(/[^a-z0-9\-]/gi, '').slice(0, 64);
}
