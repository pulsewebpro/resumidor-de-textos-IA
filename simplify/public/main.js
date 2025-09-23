(() => {
  const $ = s => document.querySelector(s);

  // Elementos base
  const ta = $('#input') || document.querySelector('textarea');
  const gen = $('#btn-gen') || document.querySelector('button[data-action="gen"]') || document.querySelector('button');
  let out = $('#out'); if(!out){ out=document.createElement('pre'); out.id='out'; out.hidden=true; document.body.appendChild(out); }
  out.setAttribute('aria-live','polite'); out.setAttribute('aria-busy','false'); out.dataset.ready=out.dataset.ready||'0';

  // Loader
  let loading = $('#loading'); 
  if(!loading){ loading=document.createElement('div'); loading.id='loading'; loading.textContent='Generando…';
    (out.parentElement||document.body).insertBefore(loading,out);
  }
  const showLoading=(b)=>{ loading.style.display=b?'block':'none'; out.setAttribute('aria-busy',String(b)); };

  // Normaliza contenido
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

  async function callAIWithPrompt(messages, maxTokens=500){
    showLoading(true); out.hidden=true;
    try{
      const r = await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({ prompt: messages, maxTokens })});
      const j = await r.json();
      out.textContent = unwrap(j?.outputs?.[0]?.content ?? j);
      out.dataset.ready='1'; out.hidden=false;
    }catch(e){
      out.textContent = 'Error al generar. Intenta de nuevo.';
      out.dataset.ready='1'; out.hidden=false;
    }finally{
      showLoading(false);
      window.dispatchEvent(new Event('ai:used'));
      window.scrollTo({top: out.getBoundingClientRect().top + window.scrollY - 120, behavior:'smooth'});
    }
  }

  async function callAIInput(text){ return callAIWithPrompt([{role:'user',content:text||'Escribe tu texto arriba.'}], 320); }

  // Render de chips en tarjetas
  const mount = $('#chips-panel');
  const CATS = Array.isArray(window.SIMPLIFY_CHIPS)?window.SIMPLIFY_CHIPS:[];
  if (mount && CATS.length){
    mount.innerHTML='';
    CATS.forEach(group=>{
      const card=document.createElement('div'); card.className='chip-card';
      const h=document.createElement('div'); h.className='chip-title'; h.textContent=group.cat; card.appendChild(h);
      const row=document.createElement('div'); row.className='chip-row'; card.appendChild(row);
      (group.items||[]).forEach(ch=>{
        const b=document.createElement('button'); b.type='button'; b.className='chip-btn'; b.textContent=ch.label;
        b.addEventListener('click',()=>{ const txt=ta?.value?.trim()||''; const msgs=ch.build(txt); callAIWithPrompt(msgs); });
        row.appendChild(b);
      });
      mount.appendChild(card);
    });
  }

  // Botón “Generar”
  gen && gen.addEventListener('click', () => callAIInput(ta?.value?.trim() || ''));
})();
