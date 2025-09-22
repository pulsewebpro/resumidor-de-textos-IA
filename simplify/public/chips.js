/* Catálogo Simplify v1 (mínimo funcional) */
window.SIMPLIFY_CHIPS = [
  { cat:'Resumir', items:[
    { id:'res-1', label:'Ultra breve', build:(t)=>[
      {role:'system',content:'Eres un asistente que resume con precisión.'},
      {role:'user',content:`Resume en 1 frase, sin adornos:\n\n${t}`} ] },
    { id:'res-2', label:'Puntos clave', build:(t)=>[
      {role:'system',content:'Resumes en bullets claros y breves.'},
      {role:'user',content:`Dame 5 puntos clave del siguiente texto:\n\n${t}`} ] },
    { id:'res-3', label:'Para niños', build:(t)=>[
      {role:'system',content:'Explicas para un niño de 10 años, lenguaje sencillo.'},
      {role:'user',content:`Explícalo fácil y corto para un niño:\n\n${t}`} ] },
    { id:'res-4', label:'Experto', build:(t)=>[
      {role:'system',content:'Explicas como experto, preciso y formal.'},
      {role:'user',content:`Resume para un informe técnico:\n\n${t}`} ] },
  ]},
  { cat:'Traducir', items:[
    { id:'tr-1', label:'→ Inglés', build:(t)=>[
      {role:'system',content:'Eres traductor profesional.'},
      {role:'user',content:`Traduce al inglés, mantén el tono:\n\n${t}`} ] },
    { id:'tr-2', label:'→ Francés', build:(t)=>[
      {role:'system',content:'Eres traducteur professionnel.'},
      {role:'user',content:`Traduire en français, ton cohérent:\n\n${t}`} ] },
    { id:'tr-3', label:'→ Alemán', build:(t)=>[
      {role:'system',content:'Du bist ein professioneller Übersetzer.'},
      {role:'user',content:`Ins Deutsche übersetzen, Ton beibehalten:\n\n${t}`} ] },
    { id:'tr-4', label:'Otro idioma…', build:(t)=>{
      const lang = prompt('¿A qué idioma? (ej. Italiano)')||'Inglés';
      return [
        {role:'system',content:'Eres traductor profesional.'},
        {role:'user',content:`Traduce al ${lang}, respeta nombres propios, formato y tono:\n\n${t}`}
      ];
    }},
  ]},
  { cat:'Reescribir', items:[
    { id:'rw-1', label:'Más claro', build:(t)=>[
      {role:'system',content:'Eres editor profesional.'},
      {role:'user',content:`Reescribe con mayor claridad y simplicidad, mantén el significado:\n\n${t}`} ] },
    { id:'rw-2', label:'Más corto', build:(t)=>[
      {role:'system',content:'Eres editor conciso.'},
      {role:'user',content:`Reduce a la mitad manteniendo lo esencial:\n\n${t}`} ] },
    { id:'rw-3', label:'Más formal', build:(t)=>[
      {role:'system',content:'Eres redactor formal.'},
      {role:'user',content:`Reescribe en tono profesional y formal:\n\n${t}`} ] },
    { id:'rw-4', label:'Más convincente', build:(t)=>[
      {role:'system',content:'Eres copywriter persuasivo.'},
      {role:'user',content:`Hazlo más persuasivo con beneficios y llamada a la acción:\n\n${t}`} ] },
  ]},
  { cat:'SEO/Marketing', items:[
    { id:'seo-1', label:'Meta + Título', build:(t)=>[
      {role:'system',content:'Eres experto SEO.'},
      {role:'user',content:`Escribe Título (≤60) y Meta descripción (≤155) para:\n\n${t}\n\nIncluye 5 keywords.`} ] },
    { id:'seo-2', label:'Anuncio corto', build:(t)=>[
      {role:'system',content:'Eres media buyer.'},
      {role:'user',content:`Escribe 3 anuncios cortos (máx 90 chars) para:\n\n${t}`} ] },
    { id:'seo-3', label:'Post Instagram', build:(t)=>[
      {role:'system',content:'Eres social media manager.'},
      {role:'user',content:`Escribe un post para Instagram con 5 hashtags, tono cercano:\n\n${t}`} ] },
  ]},
  { cat:'Legal', items:[
    { id:'lg-1', label:'Cláusula NDA', build:(t)=>[
      {role:'system',content:'Eres abogado, texto claro y simple.'},
      {role:'user',content:`Redacta una cláusula de confidencialidad breve sobre:\n\n${t}`} ] },
    { id:'lg-2', label:'Aviso legal (breve)', build:(t)=>[
      {role:'system',content:'Eres abogado, tono claro.'},
      {role:'user',content:`Escribe un aviso legal breve (no sustituto de asesoría) sobre:\n\n${t}`} ] },
  ]},
  { cat:'Creativo', items:[
    { id:'cr-1', label:'Poema', build:(t)=>[
      {role:'system',content:'Eres poeta.'},
      {role:'user',content:`Haz un poema breve sobre:\n\n${t}`} ] },
    { id:'cr-2', label:'Cuento corto', build:(t)=>[
      {role:'system',content:'Eres cuentista.'},
      {role:'user',content:`Escribe un cuento corto (≤150 palabras) sobre:\n\n${t}`} ] },
    { id:'cr-3', label:'Estilo Cervantes', build:(t)=>[
      {role:'system',content:'Imitas estilo de Cervantes evitando citas literales.'},
      {role:'user',content:`Reescribe con estilo cervantino sin copiar frases exactas:\n\n${t}`} ] },
  ]},
  { cat:'Especial', items:[
    { id:'sp-1', label:'Hazme el prompt 🤖', build:(t)=>[
      {role:'system',content:'Eres generador de prompts.'},
      {role:'user',content:`Genera un prompt potente para este objetivo. Incluye: audiencia, tono, longitud y variables editables.\n\nObjetivo:\n${t}`} ] },
    { id:'sp-2', label:'Explícamelo como si…', build:(t)=>{
      const rol = prompt('¿Como si fuera…? (ej. 5 años / CEO / abogada)')||'5 años';
      return [
        {role:'system',content:'Adaptas el nivel y ejemplos a la audiencia indicada.'},
        {role:'user',content:`Explica el siguiente texto como si el lector fuese ${rol}:\n\n${t}`}
      ];
    }},
  ]},
];
