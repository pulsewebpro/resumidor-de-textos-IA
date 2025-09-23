import OpenAI from 'openai';
import {
  handleCors,
  readBody,
  sendJSON,
  assertAllowedMethods,
  getTokenFromHeader,
  issueToken
} from './_shared.js';

const MODE_DEFS = {
  resumir_ultrabreve: {
    system: 'Eres un asistente que resume de forma ultra breve sin perder el mensaje principal.',
    template: input => `Resume el siguiente texto en una sola frase de máximo 25 palabras.\nTexto:\n${input}`
  },
  resumir_puntos: {
    system: 'Eres un asistente que sintetiza información en bullets claros y accionables.',
    template: input => `Extrae entre 3 y 7 puntos clave del siguiente texto. Usa viñetas claras y directas.\nTexto:\n${input}`
  },
  resumir_ninos: {
    system: 'Explicas conceptos complejos a niños de 8 a 10 años usando ejemplos cotidianos y frases cortas.',
    template: input => `Explica el siguiente contenido para niños. Usa 6 a 10 frases sencillas.\nTexto:\n${input}`
  },
  resumir_experto: {
    system: 'Eres un experto en el tema y escribes resúmenes técnicos precisos con rigor.',
    template: input => `Elabora un resumen experto en 1 o 2 párrafos con terminología precisa.\nTexto:\n${input}`
  },
  traducir_en: {
    system: 'Eres traductor profesional. Mantienes el significado y los formatos del texto.',
    template: input => `Traduce al inglés respetando tono y formato.\nTexto:\n${input}`
  },
  traducir_fr: {
    system: 'Eres traductor profesional. Mantienes el significado y los formatos del texto.',
    template: input => `Traduce al francés respetando tono y formato.\nTexto:\n${input}`
  },
  traducir_de: {
    system: 'Eres traductor profesional. Mantienes el significado y los formatos del texto.',
    template: input => `Traduce al alemán respetando tono y formato.\nTexto:\n${input}`
  },
  traducir_selector: {
    system: 'Eres traductor profesional y adaptas el texto a diferentes idiomas manteniendo su estructura.',
    template: (input, extra) => {
      const target = (extra?.target || 'en').trim();
      return `Traduce el texto al idioma ${target}. Mantén los párrafos y el tono.\nTexto:\n${input}`;
    }
  },
  traducir_adaptar: {
    system: 'Eres experto en localización cultural. Adaptas referencias y formatos sin perder el mensaje.',
    template: (input, extra) => {
      const target = (extra?.target || 'México').trim();
      return `Adapta culturalmente el texto para ${target}. Indica brevemente los cambios culturales si los hay.\nTexto:\n${input}`;
    }
  },
  reescribir_claro: {
    system: 'Eres editor profesional que maximiza claridad y coherencia.',
    template: input => `Reescribe el texto para que sea más claro, directo y fácil de leer sin cambiar el significado.\nTexto:\n${input}`
  },
  reescribir_corto: {
    system: 'Eres editor que condensa textos manteniendo la información clave.',
    template: input => `Reduce el texto a aproximadamente 50-60% de su longitud original manteniendo la información esencial.\nTexto:\n${input}`
  },
  reescribir_formal: {
    system: 'Eres editor de estilo formal y profesional.',
    template: input => `Reescribe el texto con tono formal, profesional y respetuoso.\nTexto:\n${input}`
  },
  reescribir_convincente: {
    system: 'Eres copywriter persuasivo enfocado en CTA claros.',
    template: input => `Reescribe el texto con tono persuasivo, incluyendo una llamada a la acción clara.\nTexto:\n${input}`
  },
  reescribir_creativo: {
    system: 'Eres escritor creativo que usa imágenes evocadoras sin perder el mensaje.',
    template: input => `Reescribe el texto con un estilo creativo, con metáforas e imágenes vívidas manteniendo el sentido original.\nTexto:\n${input}`
  },
  seo_meta: {
    system: 'Eres especialista SEO que optimiza títulos y descripciones.',
    template: input => `Escribe una meta descripción de máximo 160 caracteres y altamente clicable sobre: ${input}`
  },
  seo_titulo: {
    system: 'Eres especialista SEO enfocado en títulos atractivos y precisos.',
    template: input => `Propón un título SEO de máximo 60 caracteres con palabras clave relevantes para: ${input}`
  },
  seo_anuncio: {
    system: 'Eres copywriter de anuncios digitales orientado a conversiones.',
    template: input => `Escribe un anuncio corto (1-2 líneas) altamente atractivo para: ${input}`
  },
  seo_email: {
    system: 'Eres copywriter especializado en email marketing.',
    template: input => `Redacta asunto y cuerpo breve (100-150 palabras) con CTA claro sobre:\n${input}`
  },
  seo_social_post: {
    system: 'Eres social media manager. Optimizas posts para engagement y hashtags.',
    template: input => `Escribe un post breve optimizado para redes con gancho inicial y 3-5 hashtags. Tema:\n${input}`
  },
  legal_contrato_simple: {
    system: 'Eres abogado que crea plantillas claras y estándar. No das asesoría legal.',
    template: input => `Redacta un contrato simple con cláusulas básicas, avisando que es una plantilla general. Tema:\n${input}`
  },
  legal_privacidad: {
    system: 'Eres abogado que redacta políticas de privacidad generales y claras. No das asesoría legal.',
    template: input => `Genera una política de privacidad breve, internacional y genérica. Incluye secciones clave. Contexto:\n${input}`
  },
  legal_aviso: {
    system: 'Eres abogado que redacta disclaimers generales y claros. No das asesoría legal.',
    template: input => `Redacta un aviso legal/disclaimer general para:\n${input}`
  },
  legal_tono_abogado: {
    system: 'Eres abogado que reescribe con precisión jurídica.',
    template: input => `Reescribe el texto con tono jurídico formal y preciso.\nTexto:\n${input}`
  },
  legal_tono_facil: {
    system: 'Eres redactor legal que simplifica sin perder exactitud.',
    template: input => `Reescribe el texto legal en lenguaje sencillo y comprensible.\nTexto:\n${input}`
  },
  creativo_poema: {
    system: 'Eres poeta contemporáneo con voz emotiva.',
    template: input => `Crea un poema libre de 12 a 16 versos inspirado en:\n${input}`
  },
  creativo_rap: {
    system: 'Eres letrista de rap con rimas internas y ritmo consistente.',
    template: input => `Escribe una canción de rap de 12 a 20 versos con rimas sólidas y referencias creativas sobre:\n${input}`
  },
  creativo_cuento: {
    system: 'Eres cuentista que narra historias con inicio, desarrollo y cierre.',
    template: input => `Escribe un cuento corto de 2 a 4 párrafos con cierre claro inspirado en:\n${input}`
  },
  creativo_chiste: {
    system: 'Cuentas chistes respetuosos y ligeros.',
    template: input => `Escribe entre 1 y 3 chistes cortos y respetuosos sobre:\n${input}`
  },
  creativo_clasico: {
    system: 'Imitas el estilo literario clásico (Shakespeare/Cervantes) sin copiar obras existentes.',
    template: input => `Reescribe el texto con un estilo clásico inspirado en Shakespeare o Cervantes.\nTexto:\n${input}`
  },
  documentos_resumir_pdf: {
    system: 'Eres experto en resumir documentos extensos en bullets accionables.',
    template: input => `Resume el documento en 5 a 10 bullets claros y concisos.\nTexto:\n${input}`
  },
  especial_prompt: {
    system: 'Eres diseñador de prompts que crea instrucciones reutilizables y claras.',
    template: input => `Crea un prompt detallado y reusable para conseguir el objetivo del siguiente texto/idea:\n${input}`
  },
  especial_viral: {
    system: 'Eres estratega de contenidos virales.',
    template: input => `Propón ideas virales con hooks cortos y compartibles basadas en:\n${input}`
  },
  especial_objetivo: {
    system: 'Eres consultor que adapta textos a objetivos específicos.',
    template: (input, extra) => {
      const goal = (extra?.goal || 'un objetivo concreto').trim();
      return `Adapta el texto para lograr ${goal}. Mantén coherencia y claridad.\nTexto:\n${input}`;
    }
  },
  especial_roles: {
    system: 'Adoptas roles específicos para explicar conceptos con el tono adecuado.',
    template: (input, extra) => {
      const role = (extra?.role || 'profesor').trim();
      return `Explica el contenido como si fueras ${role}, usando ejemplos acordes.\nTexto:\n${input}`;
    }
  },
  especial_negocio: {
    system: 'Eres consultor de negocios enfocado en modelos sostenibles.',
    template: input => `Propón un modelo de negocio y pasos clave para ejecutarlo basándote en:\n${input}`
  },
  especial_divertido: {
    system: 'Eres guionista que añade un giro humorístico breve.',
    template: input => `Da un giro divertido al contenido, manteniendo el mensaje original.\nTexto:\n${input}`
  },
  especial_profesional: {
    system: 'Eres editor corporativo que pule el texto a tono profesional.',
    template: input => `Reescribe el texto con tono corporativo pulido y claro.\nTexto:\n${input}`
  },
  especial_mundial: {
    system: 'Eres redactor global que evita localismos.',
    template: input => `Adapta el texto para una audiencia global, neutralizando regionalismos.\nTexto:\n${input}`
  },
  extra_guia: {
    system: 'Eres instructor que crea guías paso a paso claras.',
    template: input => `Genera pasos numerados y concretos para realizar lo siguiente:\n${input}`
  },
  extra_faq: {
    system: 'Eres redactor que crea FAQs breves y útiles.',
    template: input => `Crea entre 6 y 10 preguntas frecuentes con respuestas concisas sobre:\n${input}`
  },
  extra_examen: {
    system: 'Eres profesor que diseña autoevaluaciones.',
    template: input => `Genera 10 preguntas tipo test con respuesta correcta indicada al final basándote en:\n${input}`
  },
  extra_tweet: {
    system: 'Eres estratega de redes. Condensas ideas en tweets.',
    template: input => `Resume el contenido en un único tweet (<=280 caracteres) con voz atractiva.\nTexto:\n${input}`
  },
  extra_hilo5: {
    system: 'Eres estratega de Twitter. Creas hilos estructurados.',
    template: input => `Genera un hilo de 5 tweets numerados, cada uno claro y atractivo, sobre:\n${input}`
  }
};

const requiresInput = new Set(Object.keys(MODE_DEFS));

const sanitizeInput = value => {
  if (!value) return '';
  const trimmed = String(value).trim();
  return trimmed.slice(0, 12000);
};

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (assertAllowedMethods(req, res, ['POST', 'OPTIONS'])) return;

  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
  }

  const tokenData = getTokenFromHeader(req);
  if (!tokenData) {
    return sendJSON(res, 401, { ok: false, error: 'INVALID_TOKEN' });
  }

  if (typeof tokenData.uses === 'number' && tokenData.uses <= 0) {
    return sendJSON(res, 402, { ok: false, error: 'NO_CREDITS' });
  }

  const mode = body?.mode;
  const input = sanitizeInput(body?.input || '');
  const extra = body?.extra || {};

  if (!mode || !MODE_DEFS[mode]) {
    return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
  }

  if (requiresInput.has(mode) && !input) {
    return sendJSON(res, 400, { ok: false, error: 'BAD_REQUEST' });
  }

  const devBypass = process.env.SIMPLIFY_DEV_ADMIN_KEY && req.headers['x-dev-admin'] === process.env.SIMPLIFY_DEV_ADMIN_KEY;

  const def = MODE_DEFS[mode];
  const messages = [
    { role: 'system', content: def.system },
    { role: 'user', content: def.template(input, extra) }
  ];

  let content = '';
  if (!openaiClient) {
    content = `⚠️ Demo sin clave. ${input}`.trim();
  } else {
    try {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3
      });
      content = completion.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
      return sendJSON(res, 500, { ok: false, error: 'AI_ERROR' });
    }
  }

  if (!content) {
    content = 'No se pudo generar contenido.';
  }

  let uses = tokenData.uses;
  if (!devBypass && typeof uses === 'number') {
    uses = Math.max(0, uses - 1);
  }

  const { token, payload } = issueToken({
    uid: tokenData.uid,
    uses,
    plan: tokenData.plan,
    exp: tokenData.exp
  });

  res.setHeader('x-simplify-set', token);

  return sendJSON(res, 200, {
    ok: true,
    outputs: [
      {
        label: mode,
        content
      }
    ]
  });
}
