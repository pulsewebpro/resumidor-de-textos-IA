import Stripe from 'stripe';
import { handleCors, readBody, sendJSON, assertAllowedMethods } from './_shared.js';

const planConfig = {
  one: { mode: 'payment', priceEnv: 'STRIPE_PRICE_ONE' },
  pack10: { mode: 'payment', priceEnv: 'STRIPE_PRICE_10' },
  sub: { mode: 'subscription', priceEnv: 'STRIPE_PRICE_SUB' }
};

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (assertAllowedMethods(req, res, ['POST', 'OPTIONS'])) return;

  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
  }

  const plan = body?.plan;
  const uid = body?.uid;
  if (!plan || !planConfig[plan] || !uid || typeof uid !== 'string') {
    return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const publicBase = process.env.PUBLIC_BASE_URL;
  if (!stripeSecret || !publicBase) {
    return sendJSON(res, 500, { ok: false, error: 'SERVER_MISCONFIGURED' });
  }

  const priceId = process.env[planConfig[plan].priceEnv];
  if (!priceId) {
    return sendJSON(res, 500, { ok: false, error: 'SERVER_MISCONFIGURED' });
  }

  try {
    const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });
    const session = await stripe.checkout.sessions.create({
      mode: planConfig[plan].mode,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${publicBase}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${publicBase}/?cancelled=true`,
      metadata: { uid, plan }
    });

    return sendJSON(res, 200, { ok: true, url: session.url });
  } catch (error) {
    return sendJSON(res, 500, { ok: false, error: 'STRIPE_ERROR' });
  }
}
