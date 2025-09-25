/* === Simplify UI Premium helpers === */
(() => {
  // Placeholder en textarea
  const ta = document.querySelector('textarea#input, textarea[name="input"], textarea');
  if (ta && (!ta.placeholder || ta.placeholder.length < 5)) {
    ta.placeholder = "Pega aquí tu texto… o prueba un chip 👇";
  }

  // Micro-descripciones para chips
  const micro = new Map([
    ["Resumir", "Condensa en 3 frases claras"],
    ["TL;DR", "Condensa en 3 frases claras"],
    ["Traducir", "Traduce y adapta como nativo"],
    ["Reescribir", "Haz tu texto claro, corto o convincente"],
    ["SEO", "Genera títulos y copys que venden"],
    ["Marketing", "Genera títulos y copys que venden"],
    ["Legal", "Convierte ideas en contratos o políticas"],
    ["Formal", "Convierte ideas en contratos o políticas"],
    ["Creativo", "Poema, rap o cuento en segundos"],
    ["Documentos", "Sube PDF y resume o exporta"],
    ["Especial", "Hazlo viral, negocio o experto en 1 click"]
  ]);

  const chipEls = Array.from(document.querySelectorAll('.chip, .pill, .chip__item, .qa-btn, button'));
  for (const el of chipEls) {
    const label = (el.innerText || el.textContent || "").trim();
    if (!label) continue;
    for (const [key, desc] of micro.entries()) {
      if (label.toLowerCase().includes(key.toLowerCase())) {
        if (!el.nextElementSibling || !el.nextElementSibling.classList?.contains('chip-sub')) {
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
