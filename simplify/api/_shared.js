import crypto from 'node:crypto';

const SECRET = process.env.SIMPLIFY_SIGNING_SECRET || '';

const isDev = (process.env.VERCEL_ENV || process.env.NODE_ENV) !== 'production';

const allowedOrigins = (process.env.ALLOWED_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const toBase64 = input => {
  const pad = input.length % 4;
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/') + (pad ? '='.repeat(4 - pad) : '');
  return normalized;
};

const base64url = buffer => buffer
  .toString('base64')
  .replace(/=+$/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

export function handleCors(req, res) {
  const origin = req.headers.origin;
  let allowOrigin = '';
  if (!origin) {
    allowOrigin = allowedOrigins[0] || (isDev ? '*' : '');
  } else if (allowedOrigins.includes(origin)) {
    allowOrigin = origin;
  } else if (isDev) {
    allowOrigin = origin;
  }

  if (allowOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-dev-admin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

export async function readBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return null;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error('BAD_JSON');
  }
}

export function sendJSON(res, status, data, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  for (const [key, value] of Object.entries(extraHeaders)) {
    if (value !== undefined && value !== null) {
      res.setHeader(key, value);
    }
  }
  res.end(JSON.stringify(data));
}

export function signToken(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('PAYLOAD_REQUIRED');
  if (!SECRET) throw new Error('MISSING_SECRET');
  const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));
  const signature = base64url(crypto.createHmac('sha256', SECRET).update(encodedPayload).digest());
  return `${encodedPayload}.${signature}`;
}

export function decodeToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadPart, signaturePart] = parts;
  if (!payloadPart || !signaturePart) return null;
  if (!SECRET) return null;
  const expectedSignature = base64url(crypto.createHmac('sha256', SECRET).update(payloadPart).digest());
  const providedSig = Buffer.from(toBase64(signaturePart), 'base64');
  const expectedSig = Buffer.from(toBase64(expectedSignature), 'base64');
  if (providedSig.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(providedSig, expectedSig)) return null;
  try {
    const json = JSON.parse(Buffer.from(toBase64(payloadPart), 'base64').toString('utf8'));
    if (json.exp && typeof json.exp === 'string' && Number.isFinite(Date.parse(json.exp))) {
      if (Date.now() > Date.parse(json.exp)) return null;
    }
    return json;
  } catch (error) {
    return null;
  }
}

export function getTokenFromHeader(req) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return null;
  const [type, token] = auth.split(' ');
  if (!type || type.toLowerCase() !== 'bearer' || !token) return null;
  return decodeToken(token);
}

export function issueToken({ uid, uses, plan, exp }) {
  if (!uid || typeof uid !== 'string') throw new Error('UID_REQUIRED');
  if (uses !== null && typeof uses !== 'number') throw new Error('USES_INVALID');
  if (!['free', 'one', 'pack10', 'sub'].includes(plan)) throw new Error('PLAN_INVALID');
  const payload = {
    uid,
    uses,
    plan,
    exp: exp ? new Date(exp).toISOString() : null
  };
  return { token: signToken(payload), payload };
}

export function assertAllowedMethods(req, res, methods) {
  if (!methods.includes(req.method)) {
    sendJSON(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
    return true;
  }
  return false;
}
