import { applyCors, extractBearerToken, sendJSON } from './_utils/http.js';
import { signWallet, verifyWallet } from './_utils/jwt.js';
import { takeCredits } from './_utils/state.js';
import { baseWallet, normalizeWallet, normalizeUses, refreshSubscription } from './_utils/wallet.js';

export const config = {
  runtime: 'nodejs18.x'
};

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET' && req.method !== 'POST') {
    return sendJSON(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  const url = new URL(req.url || '', 'http://localhost');
  const adminParam = url.searchParams.get('admin');
  const adminHeader = req.headers['x-simplify-admin'];
  const isAdmin = adminParam === 'on' || adminHeader === 'on';

  const walletUserId = req.headers['x-wallet-user'] || url.searchParams.get('walletUserId') || null;

  const token = extractBearerToken(req) || url.searchParams.get('token');
  let wallet = baseWallet();

  if (token) {
    const verification = verifyWallet(token);
    if (verification?.ok === false) {
      // fall back to new wallet
      wallet = baseWallet();
    } else if (verification?.payload) {
      wallet = normalizeWallet(verification.payload, { forceAdmin: false });
    }
  }

  if (isAdmin) {
    wallet.plan = 'free';
    wallet.uses = null;
  }

  if (!isAdmin && walletUserId && wallet.plan !== 'sub') {
    const pending = takeCredits(walletUserId);
    if (pending > 0) {
      wallet.plan = 'credits';
      const currentUses = normalizeUses(wallet.uses);
      wallet.uses = (currentUses ?? 0) + pending;
    }
  }

  if (wallet.plan === 'sub') {
    const expMs = wallet.exp ? Date.parse(wallet.exp) : null;
    if (!expMs || Number.isNaN(expMs) || expMs <= Date.now()) {
      const refreshed = await refreshSubscription(wallet.subId);
      if (refreshed?.ok === false) {
        wallet.plan = 'free';
        wallet.uses = 3;
        wallet.exp = null;
        wallet.subId = null;
      } else {
        wallet.exp = refreshed.exp ?? null;
      }
    }
  }

  if (!isAdmin && wallet.plan !== 'sub') {
    const currentUses = normalizeUses(wallet.uses);
    if (currentUses === null || currentUses < 0) {
      wallet.uses = wallet.plan === 'free' ? 3 : 0;
    } else {
      wallet.uses = currentUses;
    }
    if (wallet.plan === 'credits' && wallet.uses <= 0) {
      wallet.plan = 'free';
      wallet.uses = 0;
    }
  }

  const signed = signWallet(wallet);
  if (signed?.ok === false) {
    return sendJSON(res, 500, signed);
  }
  return sendJSON(res, 200, { ok: true, token: signed.token });
}
