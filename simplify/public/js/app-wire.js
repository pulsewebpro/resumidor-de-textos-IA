(function(){
  const $in   = document.getElementById('ai-input') || document.querySelector('textarea');
  const $btn  = document.getElementById('btn-generate') || Array.from(document.querySelectorAll('button')).find(b=>/generar/i.test(b.textContent||''));
  const $outC = document.getElementById('ai-result') || document.querySelector('#resultado, .resultado, .result, #result');

  function paintOutputs(outputs){
    const txt = (outputs||[]).map(o=>`### ${o.label}\n${o.content}`).join('\n\n');
    if($outC){
      $outC.style.display='block';
      $outC.innerText = txt;
    } else {
      // fallback: busca un <pre> dentro de la sección de Resultado
      const pre = document.querySelector('pre, code') || document.createElement('pre');
      pre.textContent = txt; 
      if(!pre.parentNode) document.body.appendChild(pre);
    }
  }

  async function generate(){
    const value = ($in?.value || '').trim();
    if(!value){ paintOutputs([{label:'Aviso', content:'Por favor, escribe un texto.'}]); return; }

    // Enviamos TODOS los formatos posibles: text, input, prompt[]…
    const body = { text:value, input:value, prompt:[{role:'user', content:value}] };

    try{
      const r = await fetch('/api/ai', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body)
      });

      const ct = r.headers.get('content-type')||'';
      if(!ct.includes('application/json')){
        const t = await r.text();
        throw new Error('La API no devolvió JSON (¿server estático o 404?). Resumen: '+t.slice(0,200));
      }

      const data = await r.json();
      if(!data?.ok){ throw new Error('API devolvió ok:false'); }
      paintOutputs(data.outputs || [{label:'Resultado', content: JSON.stringify(data, null, 2)}]);

    }catch(err){
      paintOutputs([{label:'Error', content: String(err.message||err)}]);
      console.error(err);
    }
  }

  if($btn){ $btn.addEventListener('click', (e)=>{ e.preventDefault(); generate(); }); }
})();
