import { applyCors, extractBearerToken, readJSONBody, sendJSON } from './_utils/http.js';
import { signWallet, verifyWallet } from './_utils/jwt.js';
import { takeCredits } from './_utils/state.js';
import { normalizeWallet, normalizeUses, refreshSubscription } from './_utils/wallet.js';

export const config = {
  runtime: 'nodejs'
};

export async function consumeWalletToken(token, { walletUserId } = {}) {
  if (!token || typeof token !== 'string') {
    return { ok: false, code: 'INVALID_TOKEN' };
  }
  const verification = verifyWallet(token);
  if (verification?.ok === false || !verification?.payload) {
    return { ok: false, code: 'INVALID_TOKEN' };
  }

  let wallet = normalizeWallet(verification.payload, { forceAdmin: false });

  if (walletUserId && wallet.plan !== 'sub') {
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
        return { ok: false, code: 'SUB_INACTIVE' };
      }
      wallet.exp = refreshed.exp ?? null;
    }
  } else if (wallet.uses == null) {
    // Admin mode: unlimited
  } else {
    const currentUses = normalizeUses(wallet.uses) ?? 0;
    if (currentUses <= 0) {
      return { ok: false, code: 'NO_CREDITS' };
    }
    const newUses = Math.max(0, currentUses - 1);
    wallet.uses = newUses;
    if (wallet.plan === 'credits' && newUses <= 0) {
      wallet.plan = 'free';
      wallet.uses = 0;
    }
  }

  const signed = signWallet(wallet);
  if (signed?.ok === false) {
    return signed;
  }
  return { ok: true, token: signed.token, wallet };
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

  const token = extractBearerToken(req) || body.token;
  const walletUserId = body.walletUserId || req.headers['x-wallet-user'] || null;

  const result = await consumeWalletToken(token, { walletUserId });
  if (result?.ok === false) {
    let status = 400;
    if (result.code === 'NO_CREDITS' || result.code === 'SUB_INACTIVE') status = 402;
    else if (result.code === 'ENV_MISSING') status = 500;
    return sendJSON(res, status, result);
  }

  return sendJSON(res, 200, { ok: true, token: result.token });
}
