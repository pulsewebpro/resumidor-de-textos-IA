(() => {
  // Placeholder guía si está vacío o es muy corto
  const ta = document.querySelector('textarea#input, textarea[name="input"], textarea');
  if (ta && (!ta.placeholder || ta.placeholder.length < 5)) {
    ta.placeholder = "Pega aquí tu texto… o prueba un chip 👇";
  }

  // Micro-descripciones para botones por texto aproximado
  const micro = new Map([
    ["tl;dr", "De horas de lectura a minutos de claridad."],
    ["resumir", "De horas de lectura a minutos de claridad."],
    ["traducir", "Más de 50 idiomas, con alma nativa."],
    ["reescribir", "Haz que tu idea sea inolvidable."],
    ["seo", "Textos que venden mientras duermes."],
    ["marketing", "Textos que venden mientras duermes."],
    ["legal", "De una idea a un contrato válido en segundos."],
    ["formal", "De una idea a un contrato válido en segundos."],
    ["creativo", "Poema, rap o cuento: tu texto, transformado."],
    ["documentos", "De PDF a resumen con un clic."],
    ["especial", "Hazlo viral, hazlo negocio, hazlo tuyo."]
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
/* === Hero CTA despliega área de texto === */
(() => {
  const cta = document.getElementById('hero-cta');
  if (!cta) return;
  cta.addEventListener('click', () => {
    const ta = document.getElementById('input');
    if (!ta) return;
    ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      try { ta.focus({ preventScroll: true }); }
      catch { ta.focus(); }
    }, 420);
  });
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
  if (heroTitle) heroTitle.textContent = 'Convierte ideas en impacto con IA, al instante.';

  // 2) Subtítulo (claim)
  // Queremos: "Resume, reescribe y traduce en segundos. 3 usos gratis. Sin registro."
  const heroSub =
    q('.hero .sub') ||
    // fallback por si no hay .hero
    q('.header + p') ||
    q('p:has(+ .main)'); // robusto: por si cambia estructura
  if (heroSub) {
    heroSub.textContent = 'Resume, traduce, reescribe o transforma en poema o contrato. Gratis 3 usos. Sin registro.';
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
    document.title = 'Simplify AI – Resume, traduce y transforma tus textos gratis con IA';
  } catch (e) {}

  // 7) Micro-descripciones de chips (si aún no estaban:
  //    dejamos textos claros de producción; no duplicamos si ya existen)
  const micro = new Map([
    ['Resumir',     'De horas de lectura a minutos de claridad.'],
    ['TL;DR',       'De horas de lectura a minutos de claridad.'],
    ['Traducir',    'Más de 50 idiomas, con alma nativa.'],
    ['Reescribir',  'Haz que tu idea sea inolvidable.'],
    ['SEO',         'Textos que venden mientras duermes.'],
    ['Marketing',   'Textos que venden mientras duermes.'],
    ['Legal',       'De una idea a un contrato válido en segundos.'],
    ['Formal',      'De una idea a un contrato válido en segundos.'],
    ['Creativo',    'Poema, rap o cuento: tu texto, transformado.'],
    ['Documentos',  'De PDF a resumen con un clic.'],
    ['Especial',    'Hazlo viral, hazlo negocio, hazlo tuyo.'],
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
