/* Define chips por categorías. Cada chip aporta un builder de mensajes (chat). */
window.SIMPLIFY_CHIPS = [
  {
    cat: 'Resumir',
    items: [
      { label:'Ultra breve (1 frase)', build: t => [
        {role:'system', content:'Eres un asistente que resume con precisión.'},
        {role:'user', content:`Resume en 1 sola frase, clara y concreta: \n\n${t}`}
      ]},
      { label:'Puntos clave (bullets)', build: t => [
        {role:'system', content:'Eres un asistente que extrae bullets útiles.'},
        {role:'user', content:`Resume en 5-7 bullets, sin adornos: \n\n${t}`}
      ]},
      { label:'Para niños', build: t => [
        {role:'system', content:'Eres profesor de primaria.'},
        {role:'user', content:`Explica el texto para un niño de 9 años, con ejemplos simples: \n\n${t}`}
      ]},
      { label:'En tono experto', build: t => [
        {role:'system', content:'Eres un analista senior que sintetiza para directivos.'},
        {role:'user', content:`Haz un brief ejecutivo en 4-6 frases: \n\n${t}`}
      ]},
    ]
  },
  {
    cat: 'Traducir',
    items: [
      { label:'→ Inglés', build: t => [
        {role:'system', content:'Eres traductor profesional.'},
        {role:'user', content:`Traduce al inglés manteniendo sentido y tono: \n\n${t}`}
      ]},
      { label:'→ Francés', build: t => [
        {role:'system', content:'Eres traductor profesional.'},
        {role:'user', content:`Traduce al francés con estilo natural: \n\n${t}`}
      ]},
      { label:'→ Alemán', build: t => [
        {role:'system', content:'Eres traductor profesional.'},
        {role:'user', content:`Traduce al alemán: \n\n${t}`}
      ]},
    ]
  },
  {
    cat: 'Reescribir',
    items: [
      { label:'Más claro', build: t => [
        {role:'system', content:'Eres editor profesional.'},
        {role:'user', content:`Reescribe más claro y directo, sin perder significado: \n\n${t}`}
      ]},
      { label:'Más corto', build: t => [
        {role:'system', content:'Eres editor profesional.'},
        {role:'user', content:`Reduce a la mitad, manteniendo información importante: \n\n${t}`}
      ]},
      { label:'Más convincente', build: t => [
        {role:'system', content:'Eres copywriter persuasivo.'},
        {role:'user', content:`Convierte el texto para convencer a un cliente: \n\n${t}`}
      ]},
    ]
  },
  {
    cat: 'SEO / Marketing',
    items: [
      { label:'Meta descripción', build: t => [
        {role:'system', content:'Eres experto en SEO.'},
        {role:'user', content:`Genera título y meta descripción SEO para: \n\n${t}\n\nIncluye 5 keywords.`}
      ]},
      { label:'Anuncio corto', build: t => [
        {role:'system', content:'Eres media buyer.'},
        {role:'user', content:`Escribe 3 anuncios cortos (máx 110 caracteres) para promocionar: \n\n${t}`}
      ]},
    ]
  },
  {
    cat: 'Legal',
    items: [
      { label:'Cláusula NDA', build: t => [
        {role:'system', content:'Eres abogado y escribes cláusulas simples.'},
        {role:'user', content:`Escribe una cláusula de confidencialidad breve para: \n\n${t}`}
      ]},
    ]
  },
  {
    cat: 'Especial',
    items: [
      { label:'Hazme el prompt', build: t => [
        {role:'system', content:'Eres generador de prompts.'},
        {role:'user', content:`Genera un prompt preciso para este objetivo: \n\n${t}\n\nIncluye audiencia, tono y longitud.`}
      ]},
      { label:'Explícamelo como si…', build: t => [
        {role:'system', content:'Eres docente experto.'},
        {role:'user', content:`Explícalo como si tuviera 12 años, con ejemplos y analogías: \n\n${t}`}
      ]},
    ]
  }
];
