export default async function handler(req, res) {
  const _o = res.setHeader?.bind(res);
  const clean = v => (Array.isArray(v)?v[0]:v??'').toString().replace(/[\u0000-\u001F\u007F\r\n]+/g,'').trim();
  res.setHeader = (n,v)=>_o(n, n.toLowerCase()==='access-control-allow-origin' ? (clean(v)||'*') : clean(v));
  let origin = process.env.ALLOWED_ORIGIN ?? '*';
  try { const p = JSON.parse(origin); if (Array.isArray(p)&&p[0]) origin=p[0]; } catch {}
  if (Array.isArray(origin)) origin = origin[0] ?? '*';
  origin = clean(origin)||'*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if (req.method==='OPTIONS') { res.statusCode=204; return res.end(); }
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({ ok:true, ts:new Date().toISOString() }));
}
