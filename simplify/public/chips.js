(() => {
  const onReady = (fn) => (document.readyState !== 'loading')
    ? fn()
    : document.addEventListener('DOMContentLoaded', fn);

  onReady(() => {
    try {
      const host = document.getElementById('chips-panel');
      if (!host) return console.warn('[chips] no #chips-panel');

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
      const getText = () => (document.getElementById('input')?.value||'').trim() || 'Pega un texto arriba.';

      // Fallback: si main.js no cargó aún, llamamos al backend y pintamos nosotros
      async function callAI_fallback(messages, maxTokens=400){
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
        }catch(e){
          if (resEl) resEl.textContent = 'Error al generar (fallback).';
        }
      }
      const go = (messages, maxTokens=400) => {
        if (typeof window.simplifyCallAI === 'function') {
          window.simplifyCallAI(messages, maxTokens);
        } else {
          callAI_fallback(messages, maxTokens);
        }
      };

      const grupos = [
        {
          title:'Resumir',
          items:[
            chip('Ultra breve (1 frase)',   ()=>go([{role:'system',content:'Eres un asistente que resume.'},{role:'user',content:`Resume en 1 frase: ${getText()}`}]),'primary'),
            chip('Puntos clave (bullets)', ()=>go([{role:'system',content:'Eres un asistente que resume.'},{role:'user',content:`Extrae bullets claros y concisos del texto:\n${getText()}`}], 260)),
            chip('Para niños',             ()=>go([{role:'system',content:'Explica con lenguaje sencillo para niños.'},{role:'user',content:getText()}])),
            chip('En tono experto',        ()=>go([{role:'system',content:'Eres un experto en el tema.'},{role:'user',content:`Haz un resumen experto y preciso del texto:\n${getText()}`}]))
          ]
        },
        {
          title:'Traducir',
          items:[
            chip('→ Inglés',   ()=>go([{role:'system',content:'Eres traductor profesional.'},{role:'user',content:`Traduce al inglés: ${getText()}`}]),'primary'),
            chip('→ Francés',  ()=>go([{role:'system',content:'Eres traductor profesional.'},{role:'user',content:`Traduce al francés: ${getText()}`}])),
            chip('→ Alemán',   ()=>go([{role:'system',content:'Eres traductor profesional.'},{role:'user',content:`Traduce al alemán: ${getText()}`}])),
          ]
        },
        {
          title:'Reescribir',
          items:[
            chip('Más claro',      ()=>go([{role:'system',content:'Eres editor profesional.'},{role:'user',content:`Reescribe con máxima claridad: ${getText()}`}], 260),'primary'),
            chip('Más corto',      ()=>go([{role:'system',content:'Eres editor profesional.'},{role:'user',content:`Acorta y mantén el significado: ${getText()}`}])),
            chip('Más convincente',()=>go([{role:'system',content:'Eres copywriter persuasivo.'},{role:'user',content:`Haz este texto más convincente: ${getText()}`}])),
          ]
        },
        {
          title:'SEO / Marketing',
          items:[
            chip('Meta descripción',()=>go([{role:'system',content:'Eres experto en SEO.'},{role:'user',content:`Crea un título + meta descripción y 5 keywords para: ${getText()}`}], 260),'primary'),
            chip('Anuncio corto',  ()=>go([{role:'system',content:'Eres copywriter publicitario.'},{role:'user',content:`Escribe 3 variantes de anuncio corto para: ${getText()}`}]))
          ]
        },
        {
          title:'Legal',
          items:[
            chip('Cláusula NDA', ()=>go([{role:'system',content:'Eres abogado y escribes cláusulas simples.'},{role:'user',content:`Escribe una cláusula de confidencialidad breve para: ${getText()}`}], 240),'primary')
          ]
        },
        {
          title:'Especial',
          items:[
            chip('Hazme el prompt', ()=>go([{role:'system',content:'Generas prompts precisos.'},{role:'user',content:`Genera un prompt muy claro para este objetivo: ${getText()} (audiencia, tono, longitud)`}], 240),'primary'),
            chip('Explícamelo como si…', ()=>go([{role:'system',content:'Explicas con analogías simples.'},{role:'user',content:`Explícalo como si tuviera 10 años: ${getText()}`}], 220))
          ]
        }
      ];

      // Render
      grupos.forEach(g => host.appendChild(card(g.title, g.items)));
      // Seguridad extra: si algo borró el contenido, reintenta una vez
      if (!host.children.length) {
        setTimeout(() => grupos.forEach(g => host.appendChild(card(g.title, g.items))), 50);
      }
    } catch (e) {
      console.error('[chips] error', e);
    }
  });
})();
