(() => {
  const $ = s => document.querySelector(s);
  const ta = $('#input') || document.querySelector('textarea');
  const gen = $('#btn-gen') || document.querySelector('button[data-action="gen"]') || document.querySelector('button');
  let out = $('#out'); if(!out){ out=document.createElement('pre'); out.id='out'; out.hidden=true; document.body.appendChild(out); }
  out.setAttribute('aria-live','polite'); out.setAttribute('aria-busy','false'); out.dataset.ready=out.dataset.ready||'0';

  // loader accesible (texto simple)
  let loading = $('#loading');
  if(!loading){ loading=document.createElement('div'); loading.id='loading'; loading.textContent='Generando…';
    loading.style.cssText='display:none;margin:12px 0;color:#111;background:#f4f4f5;border-radius:12px;padding:8px 12px';
    (out.parentElement||document.body).insertBefore(loading,out);
  }
  const showLoading=(b)=>{ loading.style.display=b?'block':'none'; out.setAttribute('aria-busy',String(b)); };

  const unwrap = (c) => {
    if (typeof c==='string') {
      const t=c.trim();
      if ((t.startsWith('{')&&t.endsWith('}'))||(t.startsWith('[')&&t.endsWith(']'))) {
        try{ const j=JSON.parse(t); if(j?.ok===true && Array.isArray(j.outputs)&&j.outputs[0]?.content) return j.outputs[0].content; return JSON.stringify(j,null,2);}catch{}
      }
      return c;
    }
    if (c?.ok===true && Array.isArray(c.outputs) && c.outputs[0]?.content) return c.outputs[0].content;
    try{ return JSON.stringify(c,null,2);}catch{ return String(c??'');}
  };

  async function callAI(text){
    showLoading(true); out.hidden=true;
    try{
      const r = await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input:text||'Escribe tu texto arriba.'})});
      const j = await r.json();
      out.textContent = unwrap(j?.outputs?.[0]?.content ?? j);
      out.dataset.ready='1'; out.hidden=false;
    }catch(e){ out.textContent='Error al generar. Intenta de nuevo.'; out.dataset.ready='1'; out.hidden=false; }
    finally{ showLoading(false); window.dispatchEvent(new Event('ai:used')); }
  }

  gen && gen.addEventListener('click',()=>callAI(ta?.value?.trim()||''));
})();
