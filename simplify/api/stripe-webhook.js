import { applyCors, sendJSON } from './_utils/http.js';
import { stripe, setSubscriptionState } from './_utils/stripe.js';
import { addCredits } from './_utils/state.js';

export const config = {
  runtime: 'nodejs18.x'
};

const MAX_BODY = 16 * 1024;
const PROCESSED_EVENTS = new Set();

function rememberEvent(id) {
  if (!id) return false;
  if (PROCESSED_EVENTS.has(id)) return false;
  PROCESSED_EVENTS.add(id);
  if (PROCESSED_EVENTS.size > 1000) {
    const firstKey = PROCESSED_EVENTS.values().next().value;
    if (firstKey) PROCESSED_EVENTS.delete(firstKey);
  }
  return true;
}

function bufferRequest(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', chunk => {
      total += chunk.length;
      if (total > MAX_BODY) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function syncSubscription(stripeClient, subId) {
  if (!subId) return null;
  try {
    const subscription = await stripeClient.subscriptions.retrieve(subId);
    setSubscriptionState(subId, {
      status: subscription?.status ?? null,
      current_period_end: subscription?.current_period_end ?? null
    });
    return subscription;
  } catch (error) {
    return null;
  }
}

function handleCheckoutPayment(session) {
  const plan = session?.metadata?.plan;
  const userId = session?.client_reference_id;
  if (!userId) return;
  if (plan === 'one') {
    addCredits(userId, 1);
  } else if (plan === 'pack10') {
    addCredits(userId, 10);
  }
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method === 'GET' || req.method === 'HEAD') {
    return sendJSON(res, 200, { ok: true });
  }
  if (req.method !== 'POST') {
    return sendJSON(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  const stripeClient = stripe();
  if (stripeClient?.ok === false) {
    return sendJSON(res, 500, stripeClient);
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return sendJSON(res, 500, { ok: false, code: 'ENV_MISSING', key: 'STRIPE_WEBHOOK_SECRET' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return sendJSON(res, 400, { ok: false, code: 'SIGNATURE_MISSING' });
  }

  let rawBody;
  try {
    rawBody = await bufferRequest(req);
  } catch (error) {
    if (error?.message === 'PAYLOAD_TOO_LARGE') {
      return sendJSON(res, 413, { ok: false, code: 'PAYLOAD_TOO_LARGE' });
    }
    return sendJSON(res, 400, { ok: false, code: 'INVALID_PAYLOAD' });
  }

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return sendJSON(res, 400, { ok: false, code: 'INVALID_SIGNATURE' });
  }

  if (event?.id && !rememberEvent(event.id)) {
    return sendJSON(res, 200, { ok: true, received: true });
  }

  const type = event?.type;
  const data = event?.data?.object;

  try {
    if (type === 'checkout.session.completed') {
      if (data?.mode === 'payment') {
        handleCheckoutPayment(data);
      } else if (data?.mode === 'subscription') {
        await syncSubscription(stripeClient, data?.subscription);
      }
    } else if (type === 'invoice.payment_succeeded') {
      await syncSubscription(stripeClient, data?.subscription);
    } else if (type === 'customer.subscription.updated') {
      const subId = data?.id;
      if (subId) {
        setSubscriptionState(subId, {
          status: data?.status ?? null,
          current_period_end: data?.current_period_end ?? null
        });
      }
    }
  } catch (error) {
    // swallow to avoid leaking sensitive info
  }

  return sendJSON(res, 200, { ok: true });
}
