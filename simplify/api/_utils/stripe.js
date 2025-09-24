import Stripe from 'stripe';

const STRIPE_ENV_KEY = 'STRIPE_SECRET_KEY';
const SUB_STATE = new Map();
let stripeClient = null;

function ensureStripe() {
  const key = process.env[STRIPE_ENV_KEY];
  if (!key) {
    return { ok: false, code: 'ENV_MISSING', key: STRIPE_ENV_KEY };
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, { apiVersion: '2024-06-20' });
  }
  return stripeClient;
}

export function stripe() {
  const client = ensureStripe();
  if (client && typeof client === 'object' && client.ok === false) {
    return client;
  }
  return client;
}

export function setSubscriptionState(subId, data) {
  if (!subId) return;
  const entry = {
    status: data?.status ?? null,
    current_period_end: data?.current_period_end ?? null,
    current_period_end_ms: data?.current_period_end_ms ?? (data?.current_period_end ? data.current_period_end * 1000 : null)
  };
  SUB_STATE.set(subId, entry);
  return entry;
}

export function getSubscriptionState(subId) {
  if (!subId) return null;
  return SUB_STATE.get(subId) || null;
}

export async function getSubInfo(subId) {
  if (!subId) {
    return { ok: false, code: 'INVALID_SUBSCRIPTION' };
  }
  const cached = getSubscriptionState(subId);
  if (cached?.status) {
    const ms = typeof cached.current_period_end_ms === 'number'
      ? cached.current_period_end_ms
      : (cached.current_period_end ? Number(cached.current_period_end) * 1000 : null);
    return {
      ok: true,
      status: cached.status,
      current_period_end_ms: ms
    };
  }
  const client = ensureStripe();
  if (client && typeof client === 'object' && client.ok === false) {
    return client;
  }
  try {
    const subscription = await client.subscriptions.retrieve(subId);
    const periodEnd = subscription?.current_period_end ? subscription.current_period_end * 1000 : null;
    setSubscriptionState(subId, {
      status: subscription?.status ?? null,
      current_period_end: subscription?.current_period_end ?? null,
      current_period_end_ms: periodEnd
    });
    return {
      ok: true,
      status: subscription?.status ?? null,
      current_period_end_ms: periodEnd
    };
  } catch (error) {
    const message = error?.message || 'Unable to retrieve subscription';
    return { ok: false, code: 'STRIPE_ERROR', message };
  }
}

export { SUB_STATE };
