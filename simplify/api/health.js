import { applyCors, sendJSON } from './_utils/http.js';

export const config = {
  runtime: 'nodejs18.x'
};

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method === 'GET') {
    return sendJSON(res, 200, {
      ok: true,
      service: 'simplify',
      timestamp: new Date().toISOString()
    });
  }
  if (req.method === 'HEAD') {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method === 'OPTIONS') {
    return;
  }
  return sendJSON(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
}
