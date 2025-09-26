(()=>{
  const $ = s => document.querySelector(s);
  const resEl   = $('#tab-res');
  const jsonEl  = $('#tab-json');
  const rawEl   = $('#tab-raw');
  const loadEl  = $('#loading');
  const tabRes  = $('#tabbtn-res');
  const tabJson = $('#tabbtn-json');
  const tabRaw  = $('#tabbtn-raw');

  function show(obj){
    try{
      if(loadEl) loadEl.hidden = true;

      // Normalización
      let pretty = obj, raw = obj, text = '';
      if (typeof obj === 'string') {
        text = obj;
      } else {
        const out = obj && obj.outputs && obj.outputs[0] || {};
        text = out.content || out.text || obj.content || obj.text || '';
        pretty = obj;
        raw = obj;
      }

      if (resEl)  resEl.textContent  = text || '(sin contenido)';
      if (jsonEl) jsonEl.textContent = JSON.stringify(pretty, null, 2);
      if (rawEl)  rawEl.textContent  = typeof raw === 'string' ? raw : JSON.stringify(raw);

      // Activar pestaña Resultado
      if (resEl)  resEl.hidden  = false;
      if (jsonEl) jsonEl.hidden = true;
      if (rawEl)  rawEl.hidden  = true;

      if (tabRes)  tabRes.setAttribute('aria-selected','true');
      if (tabJson) tabJson.setAttribute('aria-selected','false');
      if (tabRaw)  tabRaw.setAttribute('aria-selected','false');

      // Scroll al panel
      if (resEl && resEl.parentElement) {
        resEl.parentElement.scrollIntoView({behavior:'smooth', block:'center'});
      }
    } catch(e){ console.error('[result-router] show error:', e); }
  }

  // API pública
  window.__simplifyShowResult = show;

  // Evento custom
  window.addEventListener('simplify:result', e => show(e.detail), false);

  // Observa el dump #ai-result (por compatibilidad con tu flujo actual)
  const dump = document.getElementById('ai-result');
  if (dump) {
    const mo = new MutationObserver(()=>{
      const txt = (dump.textContent || '').trim();
      if (!txt) return;
      try { show(JSON.parse(txt)); } catch { show(txt); }
      dump.textContent = ''; // limpiar para próximos resultados
    });
    mo.observe(dump, {childList:true, subtree:true, characterData:true});
  }
})();
