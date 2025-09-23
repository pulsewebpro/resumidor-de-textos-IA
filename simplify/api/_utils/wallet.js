import { getSubInfo, getSubscriptionState } from './stripe.js';

export const ACTIVE_SUB_STATUSES = new Set(['active', 'trialing', 'past_due']);

export function baseWallet() {
  return {
    plan: 'free',
    uses: 3,
    exp: null,
    subId: null,
    email: null
  };
}

export function normalizeUses(value) {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.max(0, Math.floor(num));
}

export function normalizeWallet(payload, { forceAdmin = false } = {}) {
  if (!payload || typeof payload !== 'object') {
    return baseWallet();
  }
  const result = baseWallet();
  result.plan = typeof payload.plan === 'string' ? payload.plan : 'free';
  if (forceAdmin) {
    result.uses = null;
  } else if (result.plan === 'credits' || result.plan === 'free') {
    result.uses = normalizeUses(payload.uses);
    if (result.uses === null && result.plan === 'free') {
      result.uses = 3;
    }
    if (result.plan === 'credits' && (result.uses === null || result.uses <= 0)) {
      result.plan = 'free';
      result.uses = 0;
    }
  } else {
    result.uses = null;
  }
  result.exp = payload.exp ?? null;
  result.subId = payload.subId ?? null;
  result.email = payload.email ?? null;
  return result;
}

export async function refreshSubscription(subId) {
  if (!subId) {
    return { ok: false, code: 'SUB_INACTIVE' };
  }
  const cached = getSubscriptionState(subId);
  let status = cached?.status ?? null;
  let endMs = cached?.current_period_end_ms ?? null;
  if (!status || !endMs) {
    const info = await getSubInfo(subId);
    if (info?.ok === false) {
      return info;
    }
    status = info?.status ?? null;
    endMs = info?.current_period_end_ms ?? null;
  }
  if (!status) {
    return { ok: false, code: 'SUB_INACTIVE' };
  }
  if (!ACTIVE_SUB_STATUSES.has(status)) {
    return { ok: false, code: 'SUB_INACTIVE', status };
  }
  if (!endMs) {
    return { ok: true, exp: null, status };
  }
  return { ok: true, exp: new Date(endMs).toISOString(), status };
}
