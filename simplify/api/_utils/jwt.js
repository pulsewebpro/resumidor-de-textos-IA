import jwt from 'jsonwebtoken';

const SECRET_ENV_KEY = 'SIMPLIFY_JWT_SECRET';

function getSecret() {
  const secret = process.env[SECRET_ENV_KEY];
  if (!secret) {
    return { ok: false, code: 'ENV_MISSING', key: SECRET_ENV_KEY };
  }
  if (typeof secret !== 'string' || !secret.trim()) {
    return { ok: false, code: 'ENV_MISSING', key: SECRET_ENV_KEY };
  }
  return secret;
}

export function signWallet(payload = {}, options = {}) {
  const secret = getSecret();
  if (typeof secret !== 'string') {
    return secret;
  }
  try {
    const safePayload = { ...payload };
    const token = jwt.sign(safePayload, secret, { ...options, algorithm: 'HS256' });
    return { ok: true, token };
  } catch (error) {
    return { ok: false, code: 'JWT_SIGN_ERROR', message: error?.message || 'Unable to sign token' };
  }
}

export function verifyWallet(token) {
  const secret = getSecret();
  if (typeof secret !== 'string') {
    return secret;
  }
  if (!token || typeof token !== 'string') {
    return { ok: false, code: 'INVALID_TOKEN' };
  }
  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return { ok: true, payload };
  } catch (error) {
    return { ok: false, code: 'INVALID_TOKEN', message: error?.message || 'Invalid token' };
  }
}

export function requireSecret() {
  const secret = getSecret();
  if (typeof secret === 'string') {
    return { ok: true, secret };
  }
  return secret;
}
