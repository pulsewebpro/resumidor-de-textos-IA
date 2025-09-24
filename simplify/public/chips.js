(() => {
  const onReady = (fn) => (document.readyState !== 'loading')
    ? fn()
    : document.addEventListener('DOMContentLoaded', fn);

  onReady(() => {
    const host = document.getElementById('chips-panel');
    if (!host) return console.warn('[chips] no #chips-panel en DOM');

    const inputEl = () => document.getElementById('input');
    const textIn  = () => (inputEl()?.value || '').trim();
    const needText = () => { const t = textIn(); if (!t) alert('Pega un texto arriba.'); return t; };

    // Fallback directo si main.js no está listo
    async function callAI_fallback(messages, maxTokens=500){
      const token = localStorage.getItem('SIMPLIFY_WALLET');
      const userId = window.__simplifyUserId || localStorage.getItem('SIMPLIFY_USER_ID');
      if (!token) {
        window.dispatchEvent(new CustomEvent('wallet:error', { detail: { code: 'NO_CREDITS' } }));
        return;
      }
      const rEl  = document.getElementById('tab-res');
      const jEl  = document.getElementById('tab-json');
      const wEl  = document.getElementById('tab-raw');
      try{
        const r = await fetch('/api/ai',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`,
            'x-wallet-user':userId||''
          },
          body:JSON.stringify({prompt:messages,maxTokens})
        });
        const raw = await r.text(); let json=null; try{ json=JSON.parse(raw);}catch{}
        const newTok = r.headers.get('x-simplify-token') || json?.token;
        if (newTok) localStorage.setItem('SIMPLIFY_WALLET', newTok);
        if (!r.ok){
          window.dispatchEvent(new CustomEvent('wallet:error', { detail: { code: json?.code || 'ERROR' } }));
          return;
        }
        const content = json?.outputs?.[0]?.content ?? raw;
        if (rEl) rEl.textContent = typeof content==='string'?content:JSON.stringify(content,null,2);
        if (jEl) jEl.textContent = json?JSON.stringify(json,null,2):'(sin JSON)';
        if (wEl) wEl.textContent = raw;
        document.getElementById('tabbtn-res')?.click?.();
        document.getElementById('result-title')?.scrollIntoView({behavior:'smooth',block:'start'});
      }catch(e){ if (rEl) rEl.textContent='Error al generar (fallback).'; }
    }
    const go = (messages, maxTokens=500) =>
      (typeof window.simplifyCallAI==='function') ? window.simplifyCallAI(messages,maxTokens) : callAI_fallback(messages,maxTokens);

    // Helpers UI
    const chip = (label, onClick, variant='') => {
      const b=document.createElement('button'); b.className='pill'; if(variant) b.dataset.variant=variant;
      b.type='button'; b.textContent=label; b.addEventListener('click', onClick); return b;
    };
    const card = (title, items=[]) => {
      const c=document.createElement('div'); c.className='chip-card';
      const h=document.createElement('div'); h.className='chip-title'; h.textContent=title;
      const row=document.createElement('div'); row.className='chips';
      items.forEach(i=>row.appendChild(i)); c.append(h,row); return c;
    };

    // Idiomas (para búsqueda por nombre o código)
    const LANGS = { en:'Inglés', es:'Español', fr:'Francés', de:'Alemán', it:'Italiano', pt:'Portugués', nl:'Neerlandés', sv:'Sueco', da:'Danés', no:'Noruego', fi:'Finés', pl:'Polaco', cs:'Checo', ro:'Rumano', hu:'Húngaro', el:'Griego', tr:'Turco', ar:'Árabe', he:'Hebreo', ru:'Ruso', uk:'Ucraniano', hi:'Hindi', id:'Indonesio', th:'Tailandés', vi:'Vietnamita', zh:'Chino', ja:'Japonés', ko:'Coreano' };
    const askLang = () => {
      const def='en (Inglés)'; const ans=prompt('Idioma destino (código o nombre):', def); if(!ans) return null;
      const t=ans.trim().toLowerCase(); if (LANGS[t]) return t;
      const match=Object.entries(LANGS).find(([code,name])=> name.toLowerCase().includes(t) || code===t);
      return match?match[0]:t;
    };

    // ====== GRUPOS ======
    const grupos = [
      // RESUMIR
      { title:'Resumir', items:[
        chip('TL;DR (1 frase)', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres un asistente que resume con precisión.'},
              {role:'user',content:`Resume en UNA sola frase (<=25 palabras): ${txt}`}], 180);
        }, 'primary'),
        chip('Puntos clave (bullets)', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres un asistente que extrae bullets claros.'},
              {role:'user',content:`Devuelve 5–7 puntos clave, concisos y accionables del texto:\n${txt}`}], 260);
        }),
        chip('Resumen general', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres un asistente que resume con estructura.'},
              {role:'user',content:`Resume de forma clara con subtítulos y párrafos cortos:\n${txt}`}], 420);
        }),
        chip('Para niños', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Explicas conceptos con lenguaje sencillo para niños de 8–10 años.'},
              {role:'user',content:`Explícalo de forma simple, con ejemplos cotidianos:\n${txt}`}], 260);
        }),
        chip('En tono experto', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres un experto en el tema y escribes con precisión técnica.'},
              {role:'user',content:`Haz un resumen experto, preciso y bien referenciado (sin inventar datos):\n${txt}`}], 360);
        }),
      ]},

      // TRADUCIR
      { title:'Traducir', items:[
        chip('Elegir idioma…', ()=>{ const txt=needText(); if(!txt) return;
          const lang=askLang(); if(!lang) return;
          go([{role:'system',content:'Eres traductor profesional.'},
              {role:'user',content:`Traduce a ${lang}: ${txt}`}], 260);
        }, 'primary'),
        chip('→ Inglés', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres traductor profesional.'},
              {role:'user',content:`Traduce al inglés: ${txt}`}], 240);
        }),
        chip('→ Francés', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres traductor profesional.'},
              {role:'user',content:`Traduce al francés: ${txt}`}], 240);
        }),
        chip('→ Alemán', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres traductor profesional.'},
              {role:'user',content:`Traduce al alemán: ${txt}`}], 240);
        }),
        chip('Adaptar culturalmente', ()=>{ const txt=needText(); if(!txt) return;
          const region = prompt('¿A qué país/mercado hay que adaptar? (ej. México, España, Argentina, EE.UU.)','España')||'España';
          go([{role:'system',content:'Eres localizador experto (adaptación cultural).'},
              {role:'user',content:`Adapta el contenido para ${region}: modismos, ejemplos y formatos adecuados; mantiene el sentido y evita falsedades.\n${txt}`}], 300);
        }),
      ]},

      // REESCRIBIR
      { title:'Reescribir', items:[
        chip('Más claro', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres editor profesional.'},
              {role:'user',content:`Reescribe con máxima claridad y fluidez, sin cambiar el significado:\n${txt}`}], 260);
        }, 'primary'),
        chip('Más corto', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres editor profesional.'},
              {role:'user',content:`Reduce el texto un 30–50% manteniendo la información clave:\n${txt}`}], 240);
        }),
        chip('Más formal', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres editor de estilo.'},
              {role:'user',content:`Reescribe con tono formal, claro y profesional:\n${txt}`}], 240);
        }),
        chip('Más creativo', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres copywriter creativo.'},
              {role:'user',content:`Haz el texto más creativo y atractivo, manteniendo el significado:\n${txt}`}], 240);
        }),
        chip('Cambiar tono…', ()=>{ const txt=needText(); if(!txt) return;
          const tono=prompt('Tono (formal, cercano, profesional, divertido, inspirador...)','profesional')||'profesional';
          go([{role:'system',content:'Eres editor de estilo.'},
              {role:'user',content:`Reescribe con tono ${tono} y mejor legibilidad:\n${txt}`}], 260);
        }),
      ]},

      // SEO/MKT
      { title:'SEO / Marketing', items:[
        chip('Título SEO', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres experto en SEO.'},
              {role:'user',content:`Propón 5 títulos SEO (<=60 caracteres) con variantes y enfoque de intención para: ${txt}`}], 220);
        }, 'primary'),
        chip('Meta + keywords', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres experto en SEO.'},
              {role:'user',content:`Genera: Título SEO (<=60), Meta descripción (<=155) y 5 keywords para: ${txt}`}], 260);
        }),
        chip('Copy para email', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres copywriter de email marketing.'},
              {role:'user',content:`Escribe asunto + cuerpo breve (120–180 palabras) con CTA claro sobre:\n${txt}`}], 320);
        }),
        chip('Post Instagram', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres social media manager para Instagram.'},
              {role:'user',content:`Escribe una caption con gancho, 5–8 hashtags y CTA, sobre:\n${txt}`}], 260);
        }),
        chip('Post LinkedIn', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres creador de contenido para LinkedIn.'},
              {role:'user',content:`Escribe un post claro con hook, valor y CTA, sobre:\n${txt}`}], 280);
        }),
      ]},

      // LEGAL / FORMAL
      { title:'Legal / Formal', items:[
        chip('Contrato simple', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres abogado y redactas cláusulas simples. No es asesoría legal.'},
              {role:'user',content:`Redacta un contrato simple (plantilla base) sobre:\n${txt}`}], 500);
        }, 'primary'),
        chip('Política de privacidad', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres abogado y redactas textos legales claros. No es asesoría legal.'},
              {role:'user',content:`Redacta una política de privacidad breve y clara para:\n${txt}`}], 600);
        }),
        chip('Aviso legal', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres abogado y redactas textos legales claros. No es asesoría legal.'},
              {role:'user',content:`Redacta un aviso legal básico para:\n${txt}`}], 420);
        }),
        chip('Tono “abogado”', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres abogado y cuidas el lenguaje técnico.'},
              {role:'user',content:`Reescribe el texto con tono jurídico preciso y formal:\n${txt}`}], 300);
        }),
        chip('Tono “fácil de entender”', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres redactor legal y simplificas sin perder exactitud.'},
              {role:'user',content:`Reescribe el texto legal en lenguaje sencillo y comprensible:\n${txt}`}], 300);
        }),
      ]},

      // CREATIVO
      { title:'Creativo', items:[
        chip('Poema', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres poeta contemporáneo.'},
              {role:'user',content:`Escribe un poema breve inspirado en:\n${txt}`}], 240);
        }, 'primary'),
        chip('Rap', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres letrista de rap (rimas internas y ritmo).'},
              {role:'user',content:`Escribe 16 barras de rap sobre:\n${txt}`}], 260);
        }),
        chip('Cuento corto', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres cuentista.'},
              {role:'user',content:`Escribe un microrrelato (<=200 palabras) sobre:\n${txt}`}], 280);
        }),
        chip('Chiste / humor', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Cuentas chistes sanos y breves.'},
              {role:'user',content:`Cuenta 3 chistes breves relacionados con:\n${txt}`}], 180);
        }),
        chip('Estilo Shakespeare', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Imitas estilo isabelino (Shakespeare).'},
              {role:'user',content:`Reescribe con estilo shakespeariano:\n${txt}`}], 280);
        }),
      ]},

      // GUÍAME
      { title:'Guíame', items:[
        chip('Guía paso a paso', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres instructor técnico.'},
              {role:'user',content:`Crea una guía paso a paso, numerada y accionable, con notas y errores comunes sobre:\n${txt}`}], 420);
        }, 'primary'),
        chip('FAQs (5–7)', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres redactor técnico.'},
              {role:'user',content:`Genera 5–7 preguntas frecuentes con respuestas claras sobre:\n${txt}`}], 320);
        }),
      ]},

      // ESPECIAL
      { title:'Especial (Hazme el prompt)', items:[
        chip('Hazme el prompt', ()=>{ const txt=textIn();
          go([{role:'system',content:'Generas prompts precisos para modelos de lenguaje.'},
              {role:'user',content:`Genera un prompt muy claro para este objetivo: ${txt||'(indicar objetivo)'} (audiencia, tono, longitud).`}], 240);
        }, 'primary'),
        chip('Hazlo viral', ()=>{ const txt=needText(); if(!txt) return;
          go([{role:'system',content:'Eres estratega de contenido viral (sin clickbait engañoso).'},
              {role:'user',content:`Genera un hilo/guion con ángulo viral, ganchos y CTA para redes, sobre:\n${txt}`}], 320);
        }),
        chip('Enfócalo a mi objetivo', ()=>{ const txt=needText(); if(!txt) return;
          const obj = prompt('¿Cuál es tu objetivo? (ej. leads, awareness, ventas, registro webinar)','leads')||'leads';
          go([{role:'system',content:'Eres estratega de comunicación.'},
              {role:'user',content:`Reescribe y orienta el mensaje para maximizar ${obj}:\n${txt}`}], 300);
        }),
        chip('Explícamelo como si…', ()=>{ const txt=needText(); if(!txt) return;
          const perfil = prompt('Perfil/Edad (ej: 10 años, principiante, directivo):','principiante')||'principiante';
          go([{role:'system',content:'Explicas con analogías simples.'},
              {role:'user',content:`Explica el contenido para ${perfil}:\n${txt}`}], 260);
        }),
        chip('Prompt libre…', ()=>{ const txt=textIn()||'(sin texto pegado)';
          const instr = prompt('¿Qué quieres hacer con el texto?', 'Resume con ejemplos y bullets'); if(!instr) return;
          go([{role:'system',content:'Eres un asistente flexible.'},
              {role:'user',content:`${instr}:\n${txt}`}], 500);
        }),
      ]},
    ];

    grupos.forEach(g => host.appendChild(card(g.title, g.items)));
    if (!host.children.length) setTimeout(() => grupos.forEach(g => host.appendChild(card(g.title, g.items))), 50);
  });
})();
