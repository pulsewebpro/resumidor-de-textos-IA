(() => {
  const $ = s => document.querySelector(s);
  const ta = $('#input') || document.querySelector('textarea');
  const gen = $('#btn-gen') || document.querySelector('button[data-action="gen"]') || document.querySelector('button');
  let out = $('#out'); if(!out){ out=document.createElement('pre'); out.id='out'; out.hidden=true; document.body.appendChild(out); }
  out.setAttribute('aria-live','polite'); out.setAttribute('aria-busy','false'); out.dataset.ready=out.dataset.ready||'0';
  let loading = $('#loading'); if(!loading){ loading=document.createElement('div'); loading.id='loading'; loading.textContent='Generando…';
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

  async function callAIWithPrompt(messages, maxTokens=400){
    showLoading(true); out.hidden=true;
    try{
      const r = await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ prompt: messages, maxTokens })});
      const j = await r.json();
      out.textContent = unwrap(j?.outputs?.[0]?.content ?? j);
      out.dataset.ready='1'; out.hidden=false;
    }catch(e){ out.textContent='Error al generar. Intenta de nuevo.'; out.dataset.ready='1'; out.hidden=false; }
    finally{ showLoading(false); window.dispatchEvent(new Event('ai:used')); }
  }
  async function callAIInput(text){ return callAIWithPrompt([{role:'user',content:text||'Escribe tu texto arriba.'}], 300); }

  // Render chips
  const host = $('#chips'); if (host && Array.isArray(window.SIMPLIFY_CHIPS)) {
    window.SIMPLIFY_CHIPS.forEach(group=>{
      const tag = document.createElement('span');
      tag.className='chip small'; tag.dataset.cat=group.cat; tag.textContent=group.cat;
      host.appendChild(tag);
      (group.items||[]).forEach(ch=>{
        const b=document.createElement('button');
        b.type='button'; b.className='chip'; b.textContent=ch.label; b.setAttribute('aria-label',`${group.cat}: ${ch.label}`);
        b.addEventListener('click',()=>{ const txt=ta?.value?.trim()||''; const msgs=ch.build(txt); callAIWithPrompt(msgs); });
        host.appendChild(b);
      });
    });
  }

  // Botón “Generar (ping API)” actual → usa input directo
  gen && gen.addEventListener('click', () => callAIInput(ta?.value?.trim() || ''));
})();
