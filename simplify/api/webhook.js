import { sendJSON } from './_utils/http.js';
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
  } else if (plan === 'ten') {
    addCredits(userId, 10);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('');
    return;
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
    res.statusCode = 400;
    res.end('');
    return;
  }

  let rawBody;
  try {
    rawBody = await bufferRequest(req);
  } catch (error) {
    if (error?.message === 'PAYLOAD_TOO_LARGE') {
      res.statusCode = 413;
      res.end('');
      return;
    }
    res.statusCode = 400;
    res.end('');
    return;
  }

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    res.statusCode = 400;
    res.end('');
    return;
  }

  if (event?.id && !rememberEvent(event.id)) {
    res.statusCode = 200;
    res.end('ok');
    return;
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

  res.statusCode = 200;
  res.end('ok');
}
