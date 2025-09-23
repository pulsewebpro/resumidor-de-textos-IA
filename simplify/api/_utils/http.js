const DEFAULT_ORIGIN = 'https://simplify.pulsewebpro.com';
const MAX_BODY_SIZE = 16 * 1024; // 16KB

export function applyCors(req, res) {
  const allowed = typeof process.env.ALLOWED_ORIGIN === 'string' && process.env.ALLOWED_ORIGIN.trim()
    ? process.env.ALLOWED_ORIGIN.trim()
    : DEFAULT_ORIGIN;
  res.setHeader?.('Access-Control-Allow-Origin', allowed);
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader?.('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

export async function readJSONBody(req, limit = MAX_BODY_SIZE) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  const chunks = [];
  let total = 0;
  await new Promise((resolve, reject) => {
    req.on('data', chunk => {
      total += chunk.length;
      if (total > limit) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', resolve);
    req.on('error', reject);
  });
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) {
    throw new Error('INVALID_JSON');
  }
}

export function sendJSON(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader?.('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export function extractBearerToken(req) {
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (!auth || typeof auth !== 'string') return null;
  const parts = auth.split(' ');
  if (parts.length !== 2) return null;
  if (!/^Bearer$/i.test(parts[0])) return null;
  return parts[1];
}

export function nowMs() {
  return Date.now();
}

export function isExpired(timestampMs) {
  if (!timestampMs) return true;
  return Number(timestampMs) <= nowMs();
}
