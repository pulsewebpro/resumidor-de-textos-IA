import { applyCors, sendJSON } from './_utils/http.js';

export const config = {
  runtime: 'nodejs18.x'
};

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  return sendJSON(res, 503, { ok: false, error: 'not_implemented' });
}
