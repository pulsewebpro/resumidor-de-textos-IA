(() => {
  // Montaje robusto: esperamos DOM y seguimos aunque otros scripts tarden
  const onReady = (fn) => (document.readyState !== 'loading')
    ? fn()
    : document.addEventListener('DOMContentLoaded', fn);

  onReady(() => {
    const host = document.getElementById('chips-panel');
    if (!host) return console.warn('[chips] no #chips-panel en DOM');

    const $in = () => (document.getElementById('input')?.value || '').trim();
    const needText = () => {
      const t = $in();
      if (!t) alert('Pega un texto arriba para usar esta acción.');
      return t;
    };

    // Si main.js no está listo, hacemos la llamada directa y pintamos nosotros
    async function callAI_fallback(messages, maxTokens=500){
      const resEl  = document.getElementById('tab-res');
      const jsonEl = document.getElementById('tab-json');
      const rawEl  = document.getElementById('tab-raw');
      try{
        const r = await fetch('/api/ai', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ prompt: messages, maxTokens })
        });
        const raw = await r.text();
        let json=null; try{ json = JSON.parse(raw); }catch{}
        const content = json?.outputs?.[0]?.content ?? raw;
        if (resEl)  resEl.textContent  = typeof content==='string' ? content : JSON.stringify(content,null,2);
        if (jsonEl) jsonEl.textContent = json ? JSON.stringify(json,null,2) : '(sin JSON)';
        if (rawEl)  rawEl.textContent  = raw;
        document.getElementById('tabbtn-res')?.click?.();
        document.getElementById('result-title')?.scrollIntoView({behavior:'smooth',block:'start'});
      }catch(e){
        if (resEl) resEl.textContent = 'Error al generar (fallback).';
      }
    }
    const go = (messages, maxTokens=500) => {
      if (typeof window.simplifyCallAI === 'function') window.simplifyCallAI(messages, maxTokens);
      else callAI_fallback(messages, maxTokens);
    };

    // UI helpers
    const chip = (label, onClick, variant='') => {
      const b = document.createElement('button');
      b.className = 'pill'; if (variant) b.dataset.variant = variant;
      b.type = 'button'; b.textContent = label;
      b.addEventListener('click', onClick);
      return b;
    };
    const card = (title, items=[]) => {
      const c = document.createElement('div'); c.className='chip-card';
      const h = document.createElement('div'); h.className='chip-title'; h.textContent=title;
      const row = document.createElement('div'); row.className='chips';
      items.forEach(i=>row.appendChild(i)); c.append(h,row); return c;
    };

    // Traductor — lista corta + entrada libre
    const LANGS = {
      en:'Inglés', es:'Español', fr:'Francés', de:'Alemán', it:'Italiano', pt:'Portugués',
      nl:'Neerlandés', sv:'Sueco', da:'Danés', no:'Noruego', fi:'Finés',
      pl:'Polaco', cs:'Checo', sk:'Eslovaco', ro:'Rumano', hu:'Húngaro',
      el:'Griego', tr:'Turco', ar:'Árabe', he:'Hebreo', ru:'Ruso', uk:'Ucraniano',
      hi:'Hindi', bn:'Bengalí', id:'Indonesio', ms:'Malayo', th:'Tailandés', vi:'Vietnamita',
      zh:'Chino', ja:'Japonés', ko:'Coreano'
    };
    const askLang = () => {
      const def = 'en (Inglés)';
      const ans = prompt('Idioma destino (código o nombre). Ej: "en", "fr", "alemán"', def);
      if (!ans) return null;
      const t = ans.trim().toLowerCase();
      // permite "en", "english", "inglés", "alemán", etc.
      const byCode = LANGS[t];
      if (byCode) return t; // código válido
      // intenta mapear por nombre aproximado
      const match = Object.entries(LANGS).find(([code,name]) =>
        name.toLowerCase().includes(t) || code===t
      );
      return match ? match[0] : t; // si no, deja tal cual
    };

    // Chips (pensados para cualquier texto)
    const grupos = [
      {
        title:'Resumir',
        items:[
          chip('TL;DR (1 frase)', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres un asistente que resume con precisión.'},
                {role:'user',content:`Resume en UNA sola frase (máx 25 palabras): ${txt}`}], 180);
          }, 'primary'),
          chip('Puntos clave (bullets)', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres un asistente que extrae bullets claros.'},
                {role:'user',content:`Devuelve 5-7 puntos clave, concisos y accionables del texto:\n${txt}`}], 260);
          }),
          chip('Resumen general', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres un asistente que resume con estructura.'},
                {role:'user',content:`Resume de forma clara con subtítulos y párrafos cortos:\n${txt}`}], 420);
          })
        ]
      },
      {
        title:'Traducir',
        items:[
          chip('Elegir idioma…', ()=> {
            const txt = needText(); if(!txt) return;
            const lang = askLang(); if(!lang) return;
            go([{role:'system',content:'Eres traductor profesional.'},
                {role:'user',content:`Traduce a ${lang}: ${txt}`}], 260);
          }, 'primary'),
          chip('→ Inglés', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres traductor profesional.'},
                {role:'user',content:`Traduce al inglés: ${txt}`}], 240);
          }),
          chip('→ Francés', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres traductor profesional.'},
                {role:'user',content:`Traduce al francés: ${txt}`}], 240);
          }),
        ]
      },
      {
        title:'Reescribir',
        items:[
          chip('Más claro', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres editor profesional.'},
                {role:'user',content:`Reescribe con máxima claridad y fluidez, sin cambiar el significado:\n${txt}`}], 260);
          }, 'primary'),
          chip('Más corto', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres editor profesional.'},
                {role:'user',content:`Reduce el texto un 30–50% manteniendo la información clave:\n${txt}`}], 240);
          }),
          chip('Cambiar tono…', ()=> {
            const txt = needText(); if(!txt) return;
            const tono = prompt('Tono deseado (ej: formal, cercano, profesional, divertido):','profesional') || 'profesional';
            go([{role:'system',content:'Eres editor de estilo.'},
                {role:'user',content:`Reescribe con tono ${tono} y mejor legibilidad:\n${txt}`}], 260);
          }),
          chip('Más creativo', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres copywriter creativo.'},
                {role:'user',content:`Haz el texto más creativo y atractivo, manteniendo el significado:\n${txt}`}], 240);
          })
        ]
      },
      {
        title:'SEO / Marketing',
        items:[
          chip('Meta + keywords', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres experto en SEO.'},
                {role:'user',content:`Genera: Título SEO (<=60), Meta descripción (<=155), y 5 keywords para: ${txt}`}], 260);
          }, 'primary'),
          chip('Anuncio corto', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres copywriter publicitario.'},
                {role:'user',content:`Escribe 3 anuncios cortos (máx 90 caracteres) para: ${txt}`}], 220);
          }),
          chip('Post LinkedIn', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres un creador de contenido para LinkedIn.'},
                {role:'user',content:`Escribe un post de LinkedIn claro, con gancho y CTA, sobre:\n${txt}`}], 280);
          })
        ]
      },
      {
        title:'Legal',
        items:[
          chip('Cláusula NDA', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres abogado y escribes cláusulas simples (no asesoría legal).'},
                {role:'user',content:`Escribe una cláusula de confidencialidad breve y clara para:\n${txt}`}], 260);
          }, 'primary')
        ]
      },
      {
        title:'Documentos',
        items:[
          chip('1 página (con secciones)', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres escritor técnico.'},
                {role:'user',content:`Escribe un documento de ~1 página con secciones, listas y buena estructura sobre:\n${txt}`}], 700);
          }, 'primary'),
          chip('FAQs (5–7)', ()=> {
            const txt = needText(); if(!txt) return;
            go([{role:'system',content:'Eres redactor técnico.'},
                {role:'user',content:`Genera 5–7 preguntas frecuentes (FAQ) con respuestas claras sobre:\n${txt}`}], 320);
          })
        ]
      },
      {
        title:'Especial',
        items:[
          chip('Hazme el prompt', ()=> {
            const txt = $in(); // puede ser vacío
            go([{role:'system',content:'Generas prompts precisos para modelos de lenguaje.'},
                {role:'user',content:`Genera un prompt muy claro para este objetivo: ${txt || '(indicar objetivo)'} (audiencia, tono, longitud).`}], 240);
          }, 'primary'),
          chip('Explícamelo como si…', ()=> {
            const txt = needText(); if(!txt) return;
            const edad = prompt('Edad/Perfil (ej: 10 años, principiante, directivo):','10 años') || '10 años';
            go([{role:'system',content:'Explicas con analogías simples.'},
                {role:'user',content:`Explica el contenido para ${edad}:\n${txt}`}], 260);
          }),
          chip('Prompt libre…', ()=> {
            const txt = $in() || '(sin texto pegado)';
            const instr = prompt('¿Qué quieres hacer con el texto?', 'Resume con ejemplos y bullets');
            if (!instr) return;
            go([{role:'system',content:'Eres un asistente flexible.'},
                {role:'user',content:`${instr}:\n${txt}`}], 500);
          })
        ]
      }
    ];

    // Render UI
    grupos.forEach(g => host.appendChild(card(g.title, g.items)));
    // Reintento por si un estilo o hydrate limpió el nodo
    if (!host.children.length) setTimeout(() => grupos.forEach(g => host.appendChild(card(g.title, g.items))), 50);
  });
})();
