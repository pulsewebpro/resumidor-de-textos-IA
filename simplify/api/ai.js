/**
 * Wrapper robusto para /api/ai
 * - sanea Access-Control-Allow-Origin y cualquier header antes de enviarlo
 * - delega en ai.real / ai.orig sin editar el original
 */
let mod;
try { mod = require('./ai.real'); } catch (e) {
  try { mod = require('./ai.orig'); } catch (e2) { mod = require('./ai.handler'); }
}

function getHandler(m) {
  if (!m) return null;
  if (typeof m === 'function') return m;
  if (typeof m.default === 'function') return m.default;
  if (typeof m.handler === 'function') return m.handler;
  if (m.default && typeof m.default.handler === 'function') return m.default.handler;
  return null;
}

const handlerFn = getHandler(mod);

function safeStringForHeader(v, fallback='') {
  if (Array.isArray(v)) v = v[0];
  if (v === null || v === undefined) return String(fallback);
  if (typeof v !== 'string') {
    try { v = String(v); } catch(e){ v = String(fallback); }
  }
  // eliminar CR/LF y caracteres de control comunes
  v = v.replace(/[\u0000-\u001F\u007F\r\n]+/g, '').trim();
  if (v === '') v = String(fallback);
  return v;
}

module.exports = async function (req, res) {
  // 1) preflight CORS básico a modo seguro (si llega OPTIONS)
  try {
    let originEnv = process.env.ALLOWED_ORIGIN || '*';
    if (typeof originEnv === 'string') {
      try { const parsed = JSON.parse(originEnv); if (Array.isArray(parsed) && parsed.length) originEnv = parsed[0]; } catch(e) {}
    }
    if (Array.isArray(originEnv)) originEnv = originEnv[0];
    originEnv = safeStringForHeader(originEnv, '*');
    res.setHeader('Access-Control-Allow-Origin', originEnv);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(204).end();
  } catch (e) {
    console.error('CORS guard preflight failed:', e && e.stack ? e.stack : e);
  }

  // 2) Monkeypatch res.setHeader para sanear cualquier header que intente poner el handler
  const _origSetHeader = res.setHeader ? res.setHeader.bind(res) : null;
  if (_origSetHeader) {
    res.setHeader = function (name, value) {
      try {
        if (!name || typeof name !== 'string') return _origSetHeader(name, value);
        const lname = name.toLowerCase();
        if (lname === 'access-control-allow-origin') {
          const safe = safeStringForHeader(value, '*');
          return _origSetHeader('Access-Control-Allow-Origin', safe);
        }
        // para otros headers: si es array, convertir a csv; luego sanitizar string
        if (Array.isArray(value)) value = value.join(',');
        const safeVal = safeStringForHeader(value, '');
        return _origSetHeader(name, safeVal);
      } catch (err) {
        console.error('SAFE setHeader failed for', name, err && err.stack ? err.stack : err);
        try { return _origSetHeader(name, typeof value === 'string' ? value.replace(/[\r\n]+/g,'') : ''); } catch(e2) {}
      }
    };
  }

  // 3) Delegar al handler original (si existe)
  try {
    if (!handlerFn) {
      console.error('WRAPPER ERROR: no handler found in ai.real/ai.orig');
      return res.status(500).json({ ok:false, error:'server_error', message:'no handler found' });
    }
    await handlerFn(req, res);
  } catch (err) {
    console.error('WRAPPER /api/ai ERROR', err && err.stack ? err.stack : err);
    res.status(500).json({ ok:false, error:'server_error', message:String(err && err.message ? err.message : err) });
  }
};
