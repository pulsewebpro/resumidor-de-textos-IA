(function(){
  // --- utilidades ---
  const log = (...a) => { try{ console.log('[admin-bypass]', ...a); }catch{} };
  const findByText = (tag, re) => {
    const nodes = Array.from(document.querySelectorAll(tag));
    return nodes.find(n => re.test((n.textContent||'').trim()));
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // --- forzar admin (por query arg o fetch /api/health) ---
  (async function detectAdmin(){
    try{
      // 1) si ?admin=on en la URL -> fuerza admin
      const url = new URL(location.href);
      if(url.searchParams.get('admin') === 'on'){
        window.__SIMPLIFY_ADMIN__ = true;
        localStorage.setItem('simplify_admin', 'true');
        log('Modo admin activado por query ?admin=on');
        return;
      }

      // 2) consulta /api/health (si existe) para ver si admin:true
      const r = await fetch('/api/health').catch(()=>null);
      if(r && r.ok){
        const j = await r.json().catch(()=>null);
        if(j && j.admin){
          window.__SIMPLIFY_ADMIN__ = true;
          localStorage.setItem('simplify_admin', 'true');
          log('Modo admin activado por /api/health -> admin:true');
        }
      }
    }catch(e){ log('detectAdmin error', e); }
  })();

  // --- UI indicator ---
  (function addIndicator(){
    try{
      const id = 'admin-bypass-indicator';
      if(document.getElementById(id)) return;
      const el = document.createElement('div');
      el.id = id;
      el.textContent = 'ADMIN';
      el.style.position = 'fixed';
      el.style.left = '12px';
      el.style.top = '12px';
      el.style.zIndex = 99999;
      el.style.padding = '6px 8px';
      el.style.background = 'linear-gradient(90deg,#ffcf60,#eaa200)';
      el.style.color = '#022';
      el.style.borderRadius = '8px';
      el.style.fontWeight = '700';
      el.style.boxShadow = '0 6px 18px rgba(0,0,0,.5)';
      el.style.display = 'none'; // solo mostrar si admin
      document.documentElement.appendChild(el);
      // mostrar si admin
      const show = () => { if(window.__SIMPLIFY_ADMIN__ || localStorage.getItem('simplify_admin') === 'true'){ el.style.display='block'; } };
      window.addEventListener('load', show);
      setTimeout(show, 500);
    }catch(e){ log('addIndicator error', e); }
  })();

  // --- pintar resultados en la UI (intenta detectar el contenedor) ---
  function paint(outputs){
    const txt = (outputs||[]).map(o => `${o.label || 'Resultado'}\n\n${o.content || ''}`).join('\n\n----\n\n');
    // detecta elementos comunes donde pintar
    const selectors = [
      '#resultado', '#ai-result', '#result', '.resultado', '.result', 'main pre', 'pre', 'main textarea'
    ];
    for(const sel of selectors){
      const node = document.querySelector(sel);
      if(node){
        if(node.tagName === 'TEXTAREA' || node.tagName === 'INPUT') node.value = txt;
        else node.textContent = txt;
        node.style.display = 'block';
        return;
      }
    }
    // fallback: crear pre al final del main
    let pre = document.querySelector('#admin-bypass-output');
    if(!pre){
      pre = document.createElement('pre');
      pre.id = 'admin-bypass-output';
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.background = 'rgba(0,0,0,0.6)';
      pre.style.color = '#fff';
      pre.style.padding = '12px';
      pre.style.borderRadius = '8px';
      pre.style.maxHeight = '40vh';
      pre.style.overflow = 'auto';
      pre.style.margin = '18px';
      document.body.appendChild(pre);
    }
    pre.textContent = txt;
  }

  // --- intentamos enlazar la UI (textarea + boton generar) ---
  async function wireOnce(){
    // espera DOM
    if(document.readyState !== 'complete' && document.readyState !== 'interactive') {
      await new Promise(res => document.addEventListener('DOMContentLoaded', res, {once:true}));
    }

    // reintentos para cuando la UI cargue tarde
    for(let attempt=0; attempt<12; attempt++){
      // 1) intentar textarea por placeholder en español
      let textarea = document.querySelector('textarea[placeholder*="Pega tu"]') ||
                     document.querySelector('textarea[placeholder*="Pega un texto"]') ||
                     document.querySelector('textarea[placeholder*="Pega tu texto"]') ||
                     document.querySelector('textarea');

      // 2) buscar botón "Generar" por texto
      let btn = findByText('button', /generar/i) || findByText('button', /generar\s*\(/i);

      // 3) fallback por clases (si tu proyecto usa .btn, .primary)
      if(!btn) btn = document.querySelector('.btn-primary, .btn, button[type="submit"]');

      if(textarea && btn){
        log('Elementos encontrados:', {textarea, btn, attempt});
        hook(textarea, btn);
        return true;
      }

      log('Esperando UI (attempt', attempt+1,') textarea:', !!textarea, 'btn:', !!btn);
      await wait(250);
    }

    // si no los encontró, avisar por consola y por paint()
    log('No se encontraron textarea/button tras varios intentos. Inspecciona el HTML y pásame el selector exacto.');
    paint([{label:'Admin-bypass', content:'No se encontraron textarea o botón "Generar". Abre DevTools y dímeme el selector. Ejemplo: textarea#miInput o button#generar'}]);
    return false;
  }

  // --- enganchar el evento y hacer POST /api/ai ---
  function hook(textarea, btn){
    if(btn.__adminBypassHooked) { log('Ya hooked'); return; }
    btn.__adminBypassHooked = true;

    btn.addEventListener('click', async (e) => {
      try{
        e.preventDefault();
        e.stopPropagation();
      }catch(e){}
      // validar admin forzado
      if(!window.__SIMPLIFY_ADMIN__ && localStorage.getItem('simplify_admin') !== 'true'){
        log('No admin detectado, pero continuamos (se puede forzar con ?admin=on).');
      }

      const value = (textarea.value||'').trim();
      if(!value){
        alert('Pega un texto arriba.'); // mantiene behavior original si está vacío
        return;
      }

      paint([{label:'Procesando', content:'Enviando a /api/ai…'}]);
      try{
        const r = await fetch('/api/ai', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ text: value, input: value })
        });
        const ct = r.headers.get('content-type') || '';
        if(!ct.includes('application/json')){
          const t = await r.text();
          throw new Error('La API no respondió JSON (maybe 404). Preview: '+t.slice(0,300));
        }
        const j = await r.json();
        log('API response', j);
        if(!j) throw new Error('Respuesta vacía');
        if(j.ok === false) throw new Error(j.error || 'ok:false');
        const outputs = j.outputs || (j.result ? [{label:'result', content: j.result}] : [{label:'raw', content: JSON.stringify(j,null,2)}]);
        paint(outputs);
      }catch(err){
        log('Error invocando /api/ai', err);
        paint([{label:'Error', content: String(err.message || err)}]);
      }
    }, {capture:true});
    log('Hook instalado en botón Generar y textarea.');
  }

  // arrancar
  wireOnce();
  // reintentos periódicos por si la UI cambia dinámicamente
  const ticker = setInterval(() => { wireOnce(); }, 2000);
  setTimeout(()=> clearInterval(ticker), 20000);

})();
