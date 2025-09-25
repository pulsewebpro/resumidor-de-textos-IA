(() => {
  // Placeholder guía si está vacío o es muy corto
  const ta = document.querySelector('textarea#input, textarea[name="input"], textarea');
  if (ta && (!ta.placeholder || ta.placeholder.length < 5)) {
    ta.placeholder = "Pega aquí tu texto… o prueba un chip 👇";
  }

  // Micro-descripciones para botones por texto aproximado
  const micro = new Map([
    ["tl;dr","Condensa en 3 frases claras"],
    ["resumir","Condensa en 3 frases claras"],
    ["traducir","Traduce y adapta como nativo"],
    ["reescribir","Haz tu texto claro, corto o convincente"],
    ["seo","Genera títulos y copys que venden"],
    ["marketing","Genera títulos y copys que venden"],
    ["legal","Convierte ideas en contratos o políticas"],
    ["formal","Convierte ideas en contratos o políticas"],
    ["creativo","Poema, rap o cuento en segundos"],
    ["documentos","Sube PDF y resume o exporta"],
    ["especial","Hazlo viral, negocio o experto en 1 click"]
  ]);

  const buttons = Array.from(document.querySelectorAll('button'));
  for (const btn of buttons) {
    const label = (btn.innerText || btn.textContent || "").trim().toLowerCase();
    if (!label) continue;
    for (const [key, desc] of micro.entries()) {
      if (label.includes(key)) {
        const next = btn.nextElementSibling;
        const already = next && next.classList && next.classList.contains('chip-sub');
        if (!already) {
          const sub = document.createElement('small');
          sub.className = 'chip-sub';
          sub.textContent = desc;
          btn.after(sub);
        }
        break;
      }
    }
  }
})();
/* === UI++: mejora de botones base === */
(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  for (const b of btns) { b.classList?.add('btn'); }
})();
/* === UI++: CTA y ghost por texto === */
(() => {
  const all = Array.from(document.querySelectorAll('button'));
  for (const b of all) {
    const t = (b.innerText || "").toLowerCase();
    if (t.startsWith('generar')) b.classList.add('cta-primary');
    if (t.includes('api') || t.includes('health')) b.classList.add('btn-ghost');
  }
})();
/* === UI++: envolver bloques como tarjeta (sin tocar HTML) === */
(() => {
  const heads = document.querySelectorAll('h2, h3');
  heads.forEach(h => {
    const n = h.nextElementSibling;
    if (n && n.tagName === 'DIV' && !n.classList.contains('card')) n.classList.add('card');
  });
})();
/* === UI++: placeholder en textarea === */
(() => {
  const ta = document.querySelector('textarea#input, textarea[name="input"], textarea');
  if (ta && (!ta.placeholder || ta.placeholder.length < 5)) {
    ta.placeholder = "Pega aquí tu texto… o prueba un chip";
  }
})();
/* === Autosize inteligente del textarea === */
(() => {
  const ta = document.querySelector('textarea');
  if (!ta) return;

  const baseMin = () => {
    // base por viewport (funciona con los min-height de CSS)
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    ta.style.minHeight = (isMobile ? Math.max(200, vh * 0.38) : Math.max(160, vh * 0.28)) + 'px';
  };

  const autosize = () => {
    ta.style.height = 'auto';
    const extra = 16; // acolchado
    ta.style.height = Math.min(ta.scrollHeight + extra, 1000) + 'px';
  };

  baseMin();
  autosize();
  ta.addEventListener('input', autosize);
  window.addEventListener('resize', () => { baseMin(); autosize(); });
})();
/* === Copys oficiales de producción + limpieza de controles técnicos === */
(() => {
  const q = (sel) => document.querySelector(sel);

  // 1) Título visible (hero / h1)
  const heroTitle = q('.hero h1') || q('h1');
  if (heroTitle) heroTitle.textContent = 'Simplify AI — textos en 1 click';

  // 2) Subtítulo (claim)
  // Queremos: "Resume, reescribe y traduce en segundos. 3 usos gratis. Sin registro."
  const heroSub =
    q('.hero .sub') ||
    // fallback por si no hay .hero
    q('.header + p') ||
    q('p:has(+ .main)'); // robusto: por si cambia estructura
  if (heroSub) {
    heroSub.textContent = 'Resume, reescribe y traduce en segundos. 3 usos gratis. Sin registro.';
  }

  // 3) Leyenda de la zona del textarea
  // Si existe un "Entrada", lo cambiamos a "Texto"
  const legends = Array.from(document.querySelectorAll('legend, .section-legend, .card > h3, .panel > h3'));
  for (const lg of legends) {
    const t = (lg.textContent || '').trim().toLowerCase();
    if (t === 'entrada') lg.textContent = 'Texto';
  }

  // 4) Placeholder oficial del textarea
  const ta = q('textarea#input, textarea[name="input"], textarea');
  if (ta) ta.placeholder = 'Pega aquí tu texto… o prueba un chip';

  // 5) Botón primario: que no diga cosas de "ping", sino "Generar"
  // Y el botón técnico de "Probar /api/health" lo escondemos para público
  const buttons = Array.from(document.querySelectorAll('button, .qa-btn, .btn'));
  for (const b of buttons) {
    const txt = (b.innerText || b.textContent || '').trim().toLowerCase();

    // renombra "Generar (ping API)" -> "Generar"
    if (txt.includes('generar') && txt.includes('ping')) {
      b.textContent = 'Generar';
    }

    // oculta botón técnico
    if (txt.includes('probar') && txt.includes('api') && txt.includes('health')) {
      b.classList.add('hide-in-public');
    }
  }

  // 6) <title> del documento (pestaña del navegador)
  try {
    document.title = 'Simplify AI — textos en 1 click';
  } catch (e) {}

  // 7) Micro-descripciones de chips (si aún no estaban:
  //    dejamos textos claros de producción; no duplicamos si ya existen)
  const micro = new Map([
    ['Resumir',     'Condensa en 3 frases claras'],
    ['TL;DR',       'Condensa en 3 frases claras'],
    ['Traducir',    'Traduce y adapta como nativo'],
    ['Reescribir',  'Haz tu texto claro, corto o convincente'],
    ['SEO',         'Genera títulos y copys que venden'],
    ['Marketing',   'Genera títulos y copys que venden'],
    ['Legal',       'Convierte ideas en contratos o políticas'],
    ['Formal',      'Convierte ideas en contratos o políticas'],
    ['Creativo',    'Poema, rap o cuento en segundos'],
    ['Documentos',  'Sube PDF y resume o exporta'],
    ['Especial',    'Hazlo viral, negocio o experto en 1 click'],
  ]);

  const chipEls = Array.from(document.querySelectorAll('.chip, .pill, .chip__item, .qa-btn, button'));
  for (const el of chipEls) {
    const label = (el.innerText || el.textContent || '').trim();
    if (!label) continue;
    for (const [key, desc] of micro.entries()) {
      if (label.toLowerCase().includes(key.toLowerCase())) {
        const next = el.nextElementSibling;
        const already = next && next.classList && next.classList.contains('chip-sub');
        if (!already) {
          const sub = document.createElement('small');
          sub.className = 'chip-sub';
          sub.textContent = desc;
          el.after(sub);
        }
        break;
      }
    }
  }
})();
