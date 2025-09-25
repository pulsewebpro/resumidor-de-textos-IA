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
