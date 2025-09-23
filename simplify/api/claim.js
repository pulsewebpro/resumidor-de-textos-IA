import Stripe from 'stripe';
import { handleCors, sendJSON, assertAllowedMethods, getTokenFromHeader, issueToken } from './_shared.js';

const planMeta = {
  one: { increment: 1, days: 30 },
  pack10: { increment: 10, days: 90 },
  sub: { increment: null, days: null }
};

const priceToPlan = () => {
  const map = {};
  if (process.env.STRIPE_PRICE_ONE) map[process.env.STRIPE_PRICE_ONE] = 'one';
  if (process.env.STRIPE_PRICE_10) map[process.env.STRIPE_PRICE_10] = 'pack10';
  if (process.env.STRIPE_PRICE_SUB) map[process.env.STRIPE_PRICE_SUB] = 'sub';
  return map;
};

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (assertAllowedMethods(req, res, ['GET', 'OPTIONS'])) return;

  const sessionId = req.query?.session_id || req.query?.sessionId || req.query?.sessionID;
  if (!sessionId || typeof sessionId !== 'string') {
    return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return sendJSON(res, 500, { ok: false, error: 'SERVER_MISCONFIGURED' });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['subscription'] });
    if (!session || session.url) {
      return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
    }
    const priceMap = priceToPlan();
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1, expand: ['data.price'] });
    const item = lineItems.data[0];
    const priceId = item?.price?.id || item?.price;
    const plan = priceMap[priceId];
    if (!plan || !planMeta[plan]) {
      return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
    }

    if (plan === 'sub') {
      if (!session.subscription || session.payment_status !== 'paid') {
        return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
      }
    } else if (session.payment_status !== 'paid') {
      return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
    }

    const uid = session.metadata?.uid;
    if (!uid) {
      return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
    }

    const existing = getTokenFromHeader(req);
    const baseUses = existing && existing.uid === uid && typeof existing.uses === 'number' ? Math.max(existing.uses, 0) : 0;
    const baseExp = existing && existing.uid === uid ? existing.exp : null;

    let uses = null;
    let exp = null;

    if (plan === 'sub') {
      uses = null;
      let subscription = session.subscription;
      if (typeof subscription === 'string') {
        subscription = await stripe.subscriptions.retrieve(subscription);
      }
      if (subscription && typeof subscription === 'object') {
        const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null;
        exp = periodEnd;
      }
    } else {
      uses = baseUses + planMeta[plan].increment;
      const extendMs = planMeta[plan].days * 24 * 60 * 60 * 1000;
      const currentExp = baseExp && Date.parse(baseExp) ? Date.parse(baseExp) : Date.now();
      exp = new Date(Math.max(Date.now(), currentExp) + extendMs).toISOString();
    }

    const { token, payload } = issueToken({ uid, uses, plan, exp });
    res.setHeader('x-simplify-set', token);
    return sendJSON(res, 200, { ok: true, wallet: payload });
  } catch (error) {
    return sendJSON(res, 500, { ok: false, error: 'STRIPE_ERROR' });
  }
}
