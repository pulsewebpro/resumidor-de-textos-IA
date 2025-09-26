import { ensureWallet } from './_wallet-store.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return respond(res, 204, {});
  }

  if (req.method !== 'GET') {
    return respond(res, 405, { ok: false, error: 'Method not allowed' });
  }

  const userId = sanitize(req.query?.user || req.headers['x-simplify-user']);
  const wallet = ensureWallet(userId);
  const url = buildPortalUrl(userId);

  return respond(res, 200, {
    ok: true,
    url,
    plan: wallet.plan,
    credits: wallet.credits
  });
}

function buildPortalUrl(userId) {
  const base = process.env.BILLING_PORTAL_URL || 'https://billing.stripe.com/p/session';
  return `${base}/${encodeURIComponent(userId || 'guest')}`;
}

function respond(res, status, payload) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Simplify-User');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.end(JSON.stringify(payload));
}

function sanitize(value) {
  if (!value) return '';
  return String(value).replace(/[^a-z0-9\-]/gi, '').slice(0, 64);
}
