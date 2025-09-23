(() => {
  const $ = s => document.querySelector(s);
  const ta = $('#input');
  const btnGen = $('#btn-gen');
  const btnHealth = $('#btn-health');

  const tabBtns = [$('#tabbtn-res'), $('#tabbtn-json'), $('#tabbtn-raw')];
  const panes   = [$('#tab-res'),   $('#tab-json'),   $('#tab-raw')];
  const loading = $('#loading');

  // Admin (de pay.guard.js o por localStorage)
  const IS_ADMIN = window.SIMPLIFY_IS_ADMIN === true || localStorage.getItem('simplify_admin') === '1';
  const MAX_FREE = (IS_ADMIN ? Infinity : (window.SIMPLIFY_MAX_FREE || 3));
  const KEY = 'simplify_uses';

  const getUses = () => Number(localStorage.getItem(KEY) || 0);
  const addUse  = () => { if (!IS_ADMIN && Number.isFinite(MAX_FREE)) localStorage.setItem(KEY, String(getUses()+1)); };

  function setLoading(v){
    if(v){ loading.hidden=false; panes.forEach(p=>p.hidden=true); }
    else { loading.hidden=true; }
  }
  function setTab(idx){
    tabBtns.forEach((b,i)=>{ b.setAttribute('aria-selected', String(i===idx)); });
    panes.forEach((p,i)=>{ p.hidden = i!==idx; p.tabIndex = i===idx ? 0 : -1; });
    panes[idx].focus();
  }
  setTab(0);

  async function callAI(messages, maxTokens=500){
    if (!IS_ADMIN && Number.isFinite(MAX_FREE) && getUses() >= MAX_FREE){
      document.querySelector('#pay-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
      alert('Has usado los 3 intentos gratis. Compra créditos para seguir usando Simplify.');
      return;
    }

    setLoading(true);
    try{
      const r = await fetch('/api/ai', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ prompt: messages, maxTokens })
      });
      const raw = await r.text();
      let json=null; try{ json = JSON.parse(raw); }catch{}
      const content = json?.outputs?.[0]?.content ?? raw;

      panes[0].textContent = typeof content==='string' ? content : JSON.stringify(content,null,2);
      panes[1].textContent = json ? JSON.stringify(json,null,2) : '(sin JSON)';
      panes[2].textContent = raw;

      setLoading(false);
      setTab(0);
      addUse();
      window.dispatchEvent(new Event('ai:used'));
    }catch(err){
      setLoading(false);
      panes[0].textContent = 'Error al generar. Intenta de nuevo.';
      setTab(0);
    }
  }

  async function pingHealth(){
    setTab(1);
    panes[0].textContent = '';
    panes[1].textContent = '';
    panes[2].textContent = '';
    setLoading(true);
    try{
      const r = await fetch('/api/health');
      const j = await r.json();
      setLoading(false);
      panes[1].textContent = JSON.stringify(j,null,2);
      setTab(1);
    }catch(e){
      setLoading(false);
      panes[1].textContent = 'Error /api/health';
    }
  }

  btnGen?.addEventListener('click', ()=>{
    const text = (ta?.value||'').trim();
    callAI([{role:'user', content: text || 'Escribe un texto arriba.'}], 320);
  });
  btnHealth?.addEventListener('click', pingHealth);

  tabBtns.forEach((b,i)=> b?.addEventListener('click', ()=> setTab(i)));
})();
