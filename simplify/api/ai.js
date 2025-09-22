export default async function handler(req, res) {
  // --- safe setHeader (evita "Invalid character in header content")
  const _o = res.setHeader?.bind(res);
  const clean = (v, fb='') => {
    if (Array.isArray(v)) v = v[0];
    v = v==null ? fb : (typeof v==='string'?v:String(v));
    v = v.replace(/[\u0000-\u001F\u007F\r\n]+/g,'').trim();
    return v || String(fb);
  };
  res.setHeader = (n,v)=>{
    if (!n) return _o(n,v);
    if (n.toLowerCase()==='access-control-allow-origin') return _o('Access-Control-Allow-Origin', clean(v,'*'));
    if (Array.isArray(v)) v = v.join(',');
    return _o(n, clean(v,''));
  };

  // --- CORS
  let origin = process.env.ALLOWED_ORIGIN ?? '*';
  try { const p = typeof origin==='string' ? JSON.parse(origin) : origin; if (Array.isArray(p)&&p[0]) origin=p[0]; } catch {}
  if (Array.isArray(origin)) origin = origin[0] ?? '*';
  origin = clean(typeof origin==='string' ? origin : '*','*');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method==='OPTIONS') { res.statusCode=204; return res.end(); }
  if (req.method!=='POST') { res.statusCode=405; return res.end(JSON.stringify({ok:false,error:'Method Not Allowed'})); }

  // --- body parse tolerante
  let body = req.body;
  if (!body) {
    try {
      const chunks=[]; await new Promise(r=>{req.on('data',c=>chunks.push(c));req.on('end',r);});
      body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
    } catch { body = {}; }
  }

  // --- prompt[] o input->prompt[]
  let { prompt: composedPrompt, input, maxTokens } = body || {};
  if (!Array.isArray(composedPrompt) && typeof input==='string' && input.trim()) {
    composedPrompt = [{ role:'user', content: input.trim() }];
  }
  if (!Array.isArray(composedPrompt) || composedPrompt.length===0) {
    res.statusCode=400;
    res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.end(JSON.stringify({ ok:false, error:'Prompt inválido.' }));
  }

  // --- llamada a OpenAI (opcional; fallback si falta clave)
  const apiKey = process.env.OPENAI_API_KEY;
  const max_tokens = Math.max(1, Math.min(2048, Number(maxTokens)||512));
  let text = '';

  if (apiKey) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method:'POST',
        headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
        body: JSON.stringify({ model:'gpt-4o-mini', messages: composedPrompt, max_tokens, temperature:0.3 })
      });
      const d = await r.json();
      text = d?.choices?.[0]?.message?.content?.trim?.() || '';
    } catch(e) {
      console.error('openai error', e?.message||e);
    }
  }
  if (!text) {
    // --- fallback sin exponer datos (no logs de usuario)
    const userText = composedPrompt.map(m=>m?.role==='user'?m.content:'').filter(Boolean).join('\n').slice(0,2000);
    text = userText || 'OK';
  }

  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.end(JSON.stringify({ ok:true, outputs:[{ label:'default', content:text }] }));
}
