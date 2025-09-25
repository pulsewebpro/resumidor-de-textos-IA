import { applyCors, readJSONBody, sendJSON } from './_utils/http.js';
import { stripe } from './_utils/stripe.js';

export const config = {
  runtime: 'nodejs'
};

const PLAN_CONFIG = {
  one: { env: 'STRIPE_PRICE_ONESHOT', mode: 'payment' },
  pack10: { env: 'STRIPE_PRICE_PACK10', mode: 'payment' },
  sub: { env: 'STRIPE_PRICE_SUBS', mode: 'subscription' }
};

function requiredEnv(key) {
  const value = process.env[key];
  if (!value) {
    return { ok: false, code: 'ENV_MISSING', key };
  }
  return value;
}

function resolveOrigin() {
  const raw = process.env.CORS_ORIGIN || process.env.ALLOWED_ORIGIN || 'https://simplify.pulsewebpro.com';
  if (!raw || typeof raw !== 'string') return 'https://simplify.pulsewebpro.com';
  const first = raw.split(',')[0]?.trim();
  return (first || 'https://simplify.pulsewebpro.com').replace(/\/$/, '');
}

function successUrl() {
  const origin = resolveOrigin();
  return `${origin}/?paid=1&session_id={CHECKOUT_SESSION_ID}`;
}

function cancelUrl() {
  const origin = resolveOrigin();
  return `${origin}/?canceled=1`;
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
    return sendJSON(res, 400, { ok: false, code: 'INVALID_REQUEST' });
  }

  const url = new URL(req.url || '', 'http://localhost');
  const planParam = url.searchParams.get('plan');
  const planBody = body.plan;
  const plan = (planParam || planBody || '').toLowerCase();

  if (!PLAN_CONFIG[plan]) {
    return sendJSON(res, 400, { ok: false, code: 'INVALID_PLAN' });
  }

  const priceEnv = PLAN_CONFIG[plan].env;
  const price = requiredEnv(priceEnv);
  if (price?.ok === false) {
    return sendJSON(res, 500, price);
  }

  const stripeClient = stripe();
  if (stripeClient?.ok === false) {
    return sendJSON(res, 500, stripeClient);
  }

  const walletUserId = typeof body.walletUserId === 'string' ? body.walletUserId : null;
  const requestId = typeof body.requestId === 'string' ? body.requestId : null;
  const idempotencyKey = typeof body.idempotencyKey === 'string' ? body.idempotencyKey : requestId;

  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: PLAN_CONFIG[plan].mode,
      line_items: [
        {
          price,
          quantity: 1
        }
      ],
      metadata: {
        plan
      },
      success_url: successUrl(),
      cancel_url: cancelUrl(),
      client_reference_id: walletUserId || undefined,
      allow_promotion_codes: false,
      billing_address_collection: 'auto'
    }, idempotencyKey ? { idempotencyKey } : undefined);

    return sendJSON(res, 200, { ok: true, url: session?.url });
  } catch (error) {
    const message = error?.message || 'Stripe Checkout error';
    return sendJSON(res, 500, { ok: false, code: 'STRIPE_ERROR', message });
  }
}
