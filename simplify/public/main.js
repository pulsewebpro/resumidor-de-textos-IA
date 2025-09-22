(() => {
  const $ = s => document.querySelector(s);
  const ta = $('#input') || document.querySelector('textarea');
  const out = $('#out') || document.querySelector('pre') || document.body.appendChild(document.createElement('pre'));
  const gen = $('#btn-gen') || document.querySelector('button[data-action="gen"]') || document.querySelector('button');

  const unwrap = (c) => {
    // si viene JSON en texto -> parsea y saca outputs[0].content
    if (typeof c === 'string') {
      const t = c.trim();
      if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
        try {
          const j = JSON.parse(t);
          if (j && j.ok === true && Array.isArray(j.outputs) && j.outputs[0]?.content) return j.outputs[0].content;
          return JSON.stringify(j, null, 2);
        } catch {}
      }
      return c;
    }
    if (c && c.ok === true && Array.isArray(c.outputs) && c.outputs[0]?.content) return c.outputs[0].content;
    try { return JSON.stringify(c, null, 2); } catch { return String(c ?? ''); }
  };

  async function callAI(text) {
    const r = await fetch('/api/ai', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ input: text || 'Escribe tu texto arriba.' })
    });
    const j = await r.json();
    let content = j?.outputs?.[0]?.content ?? '';
    content = unwrap(content);
    out.textContent = content;
    window.dispatchEvent(new Event('ai:used')); // actualiza el contador de usos (guard)
  }

  gen && gen.addEventListener('click', () => callAI(ta?.value?.trim() || ''));
})();
