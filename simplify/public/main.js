(() => {
  const $ = s => document.querySelector(s);
  const ta = $('#input') || document.querySelector('textarea');
  const gen = $('#btn-gen') || document.querySelector('button[data-action="gen"]') || document.querySelector('button');
  let out = $('#out');
  if (!out) { out = document.createElement('pre'); out.id='out'; document.body.appendChild(out); }
  out.setAttribute('aria-live','polite');
  out.setAttribute('aria-busy','false');
  out.dataset.ready = out.dataset.ready || '0';
  // loader accesible
  let loading = $('#loading');
  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'loading';
    loading.setAttribute('aria-hidden','true');
    loading.textContent = 'Generando…';
    (out.parentElement||document.body).insertBefore(loading, out);
  }
  // desanidar si viene JSON dentro de JSON
  const unwrap = (c) => {
    if (typeof c === 'string') {
      const t = c.trim();
      if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
        try {
          const j = JSON.parse(t);
          if (j?.ok===true && Array.isArray(j.outputs) && j.outputs[0]?.content) return j.outputs[0].content;
          return JSON.stringify(j,null,2);
        } catch {}
      }
      return c;
    }
    if (c?.ok===true && Array.isArray(c.outputs) && c.outputs[0]?.content) return c.outputs[0].content;
    try { return JSON.stringify(c,null,2); } catch { return String(c??''); }
  };
  async function callAI(text) {
    loading.setAttribute('aria-hidden','false');
    out.setAttribute('aria-busy','true');
    try {
      const r = await fetch('/api/ai', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ input: text || 'Escribe tu texto arriba.' })
      });
      const j = await r.json();
      const content = unwrap(j?.outputs?.[0]?.content ?? j);
      out.textContent = content;
      out.dataset.ready = '1';
    } catch(e) {
      out.textContent = 'Error al generar. Intenta de nuevo.';
      out.dataset.ready = '1';
    } finally {
      out.setAttribute('aria-busy','false');
      loading.setAttribute('aria-hidden','true');
      window.dispatchEvent(new Event('ai:used'));
    }
  }
  gen && gen.addEventListener('click', () => callAI(ta?.value?.trim() || ''));
})();
