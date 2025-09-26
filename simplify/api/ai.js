import { randomUUID } from 'crypto';

const DEFAULT_OUTPUT_LABEL = 'AI';
const FALLBACK_MODEL_NAME = 'fallback';

const PROMPT_TEMPLATES = {
  'summarize:tldr': {
    label: 'TL;DR',
    system: 'Eres un asistente que resume cualquier texto en una sola frase clara de 20-30 palabras.',
    user: (input) => `Resume el siguiente texto en UNA sola frase de máximo 30 palabras.\n\nTexto:\n${input}`,
    fallback: (input) => createSentenceSummary(input, 30)
  },
  'summarize:bullets': {
    label: 'Puntos clave',
    system: 'Eres un asistente que extrae puntos clave claros y accionables.',
    user: (input) => `Resume el siguiente texto en una lista de 3 a 7 viñetas concisas:\n${input}`,
    fallback: (input) => createBulletSummary(input)
  },
  'summarize:general': {
    label: 'Resumen',
    system: 'Eres un asistente que sintetiza textos en párrafos breves con subtítulos.',
    user: (input) => `Crea un resumen estructurado en 2-3 párrafos con subtítulos claros del siguiente texto:\n${input}`,
    fallback: (input) => createParagraphSummary(input)
  },
  'summarize:kids': {
    label: 'Explicado para niños',
    system: 'Explicas conceptos con lenguaje sencillo para niños de 8-10 años.',
    user: (input) => `Explica el siguiente contenido con palabras simples, ejemplos cotidianos y tono didáctico:\n${input}`,
    fallback: (input) => simplifyForKids(input)
  },
  'summarize:expert': {
    label: 'En tono experto',
    system: 'Redactas como especialista académico con precisión y concisión.',
    user: (input) => `Crea un resumen ejecutivo con rigor profesional y datos relevantes (sin inventar).\nContenido:\n${input}`,
    fallback: (input) => emphasizeExpertTone(createParagraphSummary(input))
  },
  'translate:en': {
    label: 'English translation',
    system: 'You are a professional translator.',
    user: (input) => `Translate into English keeping tone and intent.\n\n${input}`,
    fallback: (input) => pseudoTranslate(input, 'en')
  },
  'translate:fr': {
    label: 'Traduction française',
    system: 'Vous êtes un traducteur professionnel.',
    user: (input) => `Traduisez en français en respectant le ton et le contexte.\n\n${input}`,
    fallback: (input) => pseudoTranslate(input, 'fr')
  },
  'translate:de': {
    label: 'Übersetzung Deutsch',
    system: 'Du bist ein professioneller Übersetzer.',
    user: (input) => `Übersetze den folgenden Text ins Deutsche unter Beibehaltung von Ton und Aussage.\n\n${input}`,
    fallback: (input) => pseudoTranslate(input, 'de')
  },
  'translate:it': {
    label: 'Traduzione italiana',
    system: 'Sei un traduttore professionista.',
    user: (input) => `Traduci in italiano mantenendo tono e messaggio.\n\n${input}`,
    fallback: (input) => pseudoTranslate(input, 'it')
  },
  'translate:pt': {
    label: 'Tradução português',
    system: 'Você é um tradutor profissional.',
    user: (input) => `Traduza para português mantendo tom e objetivo.\n\n${input}`,
    fallback: (input) => pseudoTranslate(input, 'pt')
  },
  'translate:localize': {
    label: 'Adaptación cultural',
    system: 'Eres experto en localización y adaptación cultural.',
    user: (input) => `Traduce y adapta culturalmente el siguiente texto al mercado indicado por el usuario. Mantén el sentido original:\n${input}`,
    fallback: (input) => pseudoTranslate(input, 'local')
  },
  'rewrite:clear': {
    label: 'Más claro',
    system: 'Eres editor profesional y mejoras la claridad.',
    user: (input) => `Reescribe el texto con máxima claridad y frases directas, manteniendo el significado.\n\n${input}`,
    fallback: (input) => rewriteClarity(input)
  },
  'rewrite:short': {
    label: 'Más corto',
    system: 'Eres editor profesional y eliminas redundancias.',
    user: (input) => `Acorta el texto eliminando redundancias, mantén la información esencial.\n\n${input}`,
    fallback: (input) => shortenText(input)
  },
  'rewrite:formal': {
    label: 'Más formal',
    system: 'Escribes en tono formal y profesional.',
    user: (input) => `Reescribe el contenido en tono formal y corporativo sin cambiar el mensaje.\n\n${input}`,
    fallback: (input) => formalizeText(input)
  },
  'rewrite:convincing': {
    label: 'Más convincente',
    system: 'Eres copywriter persuasivo.',
    user: (input) => `Reescribe el texto con lenguaje persuasivo, destacando beneficios y un llamado a la acción suave.\n\n${input}`,
    fallback: (input) => persuasiveRewrite(input)
  },
  'seo:title': {
    label: 'Título SEO',
    system: 'Eres especialista SEO.',
    user: (input) => `Genera cinco títulos SEO (<=60 caracteres) con distintos enfoques para: ${input}`,
    fallback: (input) => seoTitles(input)
  },
  'seo:meta': {
    label: 'Meta description',
    system: 'Eres especialista SEO.',
    user: (input) => `Escribe una meta descripción de 150-160 caracteres y lista 5 palabras clave para: ${input}`,
    fallback: (input) => seoMeta(input)
  },
  'seo:email': {
    label: 'Email copy',
    system: 'Eres copywriter de email marketing.',
    user: (input) => `Redacta asunto y cuerpo breve (120-180 palabras) con CTA claro sobre:\n${input}`,
    fallback: (input) => emailCopy(input)
  },
  'seo:ig': {
    label: 'Post Instagram',
    system: 'Eres social media manager para Instagram.',
    user: (input) => `Escribe una caption creativa con gancho, 5-8 hashtags y CTA para:\n${input}`,
    fallback: (input) => instagramCopy(input)
  },
  'seo:linkedin': {
    label: 'Post LinkedIn',
    system: 'Eres creador de contenido profesional para LinkedIn.',
    user: (input) => `Escribe un post profesional con hook inicial, desarrollo y CTA final sobre:\n${input}`,
    fallback: (input) => linkedinCopy(input)
  },
  'legal:contract': {
    label: 'Contrato simple',
    system: 'Eres abogado que redacta contratos claros (sin asesoría legal).',
    user: (input) => `Redacta un contrato simple con secciones de partes, objeto, obligaciones, pagos, plazo y ley aplicable sobre:\n${input}`,
    fallback: (input) => legalTemplate('Contrato simple', input)
  },
  'legal:privacy': {
    label: 'Política de privacidad',
    system: 'Eres abogado especializado en privacidad.',
    user: (input) => `Redacta una política de privacidad clara con secciones básicas (datos, uso, derechos, contacto) para:\n${input}`,
    fallback: (input) => legalTemplate('Política de privacidad', input)
  },
  'legal:disclaimer': {
    label: 'Aviso legal',
    system: 'Eres abogado.',
    user: (input) => `Redacta un aviso legal básico con identificador, finalidad y responsabilidades para:\n${input}`,
    fallback: (input) => legalTemplate('Aviso legal', input)
  },
  'legal:lawyer': {
    label: 'Tono abogado',
    system: 'Eres abogado y escribes con precisión jurídica.',
    user: (input) => `Reescribe el texto con tono jurídico formal, precisión y referencias a obligaciones.\n\n${input}`,
    fallback: (input) => formalizeText(input, true)
  },
  'legal:easy': {
    label: 'Tono sencillo',
    system: 'Eres redactor legal que simplifica conceptos.',
    user: (input) => `Explica el siguiente texto legal con lenguaje sencillo y ejemplos concretos.\n\n${input}`,
    fallback: (input) => simplifyForKids(input)
  },
  'creative:poem': {
    label: 'Poema',
    system: 'Eres poeta contemporáneo.',
    user: (input) => `Escribe un poema breve inspirado en:\n${input}`,
    fallback: (input) => poem(input)
  },
  'creative:rap': {
    label: 'Rap',
    system: 'Eres letrista de rap con rimas internas y flow moderno.',
    user: (input) => `Escribe 16 barras de rap sobre:\n${input}`,
    fallback: (input) => rap(input)
  },
  'creative:story': {
    label: 'Cuento corto',
    system: 'Eres cuentista.',
    user: (input) => `Escribe un microrrelato de máximo 200 palabras sobre:\n${input}`,
    fallback: (input) => shortStory(input)
  },
  'creative:joke': {
    label: 'Humor',
    system: 'Cuentas chistes breves y aptos para todo público.',
    user: (input) => `Cuenta tres chistes breves relacionados con:\n${input}`,
    fallback: (input) => jokes(input)
  },
  'creative:classic': {
    label: 'Estilo clásico',
    system: 'Imitas a Shakespeare o Cervantes según convenga.',
    user: (input) => `Reescribe el texto con estilo clásico inspirado en Shakespeare/Cervantes.\n\n${input}`,
    fallback: (input) => classicStyle(input)
  },
  'docs:pdf:summary': {
    label: 'Resumen de PDF',
    system: 'Analizas documentos extensos y das un resumen ejecutivo.',
    user: (input) => `Imagina que el usuario ha subido un PDF. Resume los puntos clave en formato ejecutivo:\n${input}`,
    fallback: (input) => createParagraphSummary(input)
  },
  'docs:export:docx': {
    label: 'Exportar DOCX',
    system: 'Generas estructuras listas para exportar a Word.',
    user: (input) => `Genera una estructura con encabezados y secciones listos para exportar a DOCX a partir de:\n${input}`,
    fallback: (input) => docExportOutline('DOCX', input)
  },
  'docs:export:pdf': {
    label: 'Exportar PDF',
    system: 'Generas secciones listas para maquetar en PDF.',
    user: (input) => `Propón secciones y contenido listo para exportar a PDF sobre:\n${input}`,
    fallback: (input) => docExportOutline('PDF', input)
  },
  'prompt:make': {
    label: 'Hazme el prompt',
    system: 'Eres prompt engineer.',
    user: (input) => `Crea un prompt listo para usar en otra IA que realice la tarea descrita.\nDescripción:\n${input}`,
    fallback: (input) => promptMaker(input)
  },
  'prompt:viral': {
    label: 'Hazlo viral',
    system: 'Eres estratega de contenidos virales.',
    user: (input) => `Transforma el contenido en una pieza con potencial viral en redes sociales.\n\n${input}`,
    fallback: (input) => viralSpin(input)
  },
  'prompt:goal': {
    label: 'Enfócalo a mi objetivo',
    system: 'Eres consultor estratégico.',
    user: (input) => `Redacta el contenido optimizado para lograr el objetivo descrito.\n\n${input}`,
    fallback: (input) => goalOriented(input)
  },
  'prompt:as:role': {
    label: 'Explícamelo como…',
    system: 'Actúas en el rol que pida el usuario.',
    user: (input) => `Explica el contenido asumiendo un rol específico según lo indicado por el usuario.\n\n${input}`,
    fallback: (input) => roleExplain(input)
  },
  'prompt:business': {
    label: 'Hazlo negocio',
    system: 'Eres consultor de negocios.',
    user: (input) => `Convierte la idea en una propuesta de negocio con modelo, audiencia y pasos.\n\n${input}`,
    fallback: (input) => businessPlan(input)
  },
  'prompt:twist': {
    label: 'Dame un giro divertido',
    system: 'Aportas creatividad inesperada.',
    user: (input) => `Añade un giro creativo y sorprendente al contenido siguiente.\n\n${input}`,
    fallback: (input) => twist(input)
  },
  'prompt:pro': {
    label: 'Ponlo profesional',
    system: 'Eres consultor profesional.',
    user: (input) => `Reescribe el contenido con tono profesional, estructurado y directo.\n\n${input}`,
    fallback: (input) => formalizeText(input)
  },
  'prompt:adapt:world': {
    label: 'Adáptalo al mundo',
    system: 'Eres estratega global.',
    user: (input) => `Adapta el mensaje para audiencias internacionales destacando matices culturales y lingüísticos.\n\n${input}`,
    fallback: (input) => globalAdaptation(input)
  }
};

const STREAM_CHUNK_SIZE = 320;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    setCors(res);
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  setCors(res);

  let body = req.body;
  if (!body) {
    body = await readBody(req);
  }

  const normalizedPrompt = normalizePrompt(body?.prompt);
  const extraActions = extractActionStrings(body?.actions);
  const legacyActions = extractActionStrings(body?.prompt);
  const actions = selectActions([...normalizedPrompt.actions, ...extraActions, ...legacyActions]);
  const inputSource = normalizedPrompt.messages.length ? normalizedPrompt.messages : Array.isArray(body?.prompt) ? body.prompt : [];
  const input = sanitizeText(body?.input ?? body?.text ?? extractFirstUserMessage(inputSource)) || '';
  const maxTokens = clampNumber(body?.maxTokens, 64, 1024, 320);

  if (!input) {
    res.status(400).json({ ok: false, error: 'Missing input' });
    return;
  }

  const requestId = randomUUID();
  const firstAction = PROMPT_TEMPLATES[actions[0]];
  const label = firstAction?.label ?? DEFAULT_OUTPUT_LABEL;

  const openaiKey = process.env.OPENAI_API_KEY;
  const shouldCallOpenAI = Boolean(openaiKey);

  const aiResponse = shouldCallOpenAI
    ? await callOpenAI({
        input,
        actions,
        maxTokens,
        label,
        openaiKey,
        messages: normalizedPrompt.messages
      }).catch((err) => ({ error: err?.message || String(err) }))
    : null;

  if (aiResponse?.error) {
    console.error('[api/ai] OpenAI error', aiResponse.error);
  }

  const fallbackText = buildFallbackOutput(input, actions, maxTokens);
  const finalText = sanitizeForOutput(aiResponse?.content || fallbackText);
  const outputs = buildOutputs(finalText, label);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Request-Id', requestId);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Transfer-Encoding', 'chunked');

  streamJsonResponse(res, { ok: true, model: aiResponse?.model ?? FALLBACK_MODEL_NAME, outputs });
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) {
    return {};
  }
}

function extractFirstUserMessage(promptArray) {
  if (!Array.isArray(promptArray)) return '';
  for (const item of promptArray) {
    if (!item || typeof item !== 'object') continue;
    const role = String(item.role || '').toLowerCase();
    if (role === 'user' && typeof item.content === 'string') {
      return item.content;
    }
  }
  return '';
}

function normalizePrompt(promptValue) {
  const result = { messages: [], actions: [] };
  if (!Array.isArray(promptValue)) return result;

  promptValue.forEach((entry) => {
    if (!entry) return;
    if (typeof entry === 'string') {
      if (PROMPT_TEMPLATES[entry] && !result.actions.includes(entry)) {
        result.actions.push(entry);
      }
      return;
    }
    if (typeof entry !== 'object') return;
    const role = normalizeRole(entry.role);
    let content = typeof entry.content === 'string' ? entry.content : '';
    if (!content) return;

    const matches = [...content.matchAll(/\[simplify-action:([^\]]+)\]/gi)];
    if (matches.length) {
      matches.forEach((match) => {
        const actionKey = match[1]?.trim();
        if (actionKey && PROMPT_TEMPLATES[actionKey] && !result.actions.includes(actionKey)) {
          result.actions.push(actionKey);
        }
      });
      content = content.replace(/\[simplify-action:[^\]]+\]\s*/gi, '').trimStart();
    }

    if (!content.trim()) return;
    result.messages.push({ role, content });
  });

  return result;
}

function normalizeRole(role) {
  const value = typeof role === 'string' ? role.toLowerCase() : '';
  if (value === 'system') return 'system';
  if (value === 'assistant') return 'assistant';
  return 'user';
}

function extractActionStrings(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string');
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [];
}

function selectActions(candidates) {
  const result = [];
  candidates.forEach((action) => {
    if (typeof action !== 'string') return;
    if (!PROMPT_TEMPLATES[action]) return;
    if (!result.includes(action)) {
      result.push(action);
    }
  });
  if (!result.length) {
    result.push('summarize:general');
  }
  return result;
}

function clampNumber(value, min, max, fallback) {
  const num = Number(value);
  if (Number.isFinite(num)) {
    return Math.min(max, Math.max(min, num));
  }
  return fallback;
}

function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[\u0000-\u001f\u007f]+/g, '').trim();
}

function buildFallbackOutput(input, actions, maxTokens) {
  const [primary] = actions;
  const template = PROMPT_TEMPLATES[primary];
  if (template?.fallback) {
    try {
      return template.fallback(input, { actions, maxTokens });
    } catch (error) {
      console.error('[api/ai] fallback error', error);
    }
  }
  return createParagraphSummary(input);
}

function buildOutputs(content, label) {
  return [{ label: label || DEFAULT_OUTPUT_LABEL, content }];
}

async function callOpenAI({ input, actions, maxTokens, label, openaiKey, messages }) {
  try {
    const finalMessages = Array.isArray(messages) && messages.length ? messages : buildMessages(input, actions);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: finalMessages,
        max_tokens: maxTokens,
        temperature: 0.35,
        n: 1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `OpenAI HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    return {
      model: data?.model || 'openai',
      content: content || '',
      label
    };
  } catch (error) {
    return { error: error?.message || String(error) };
  }
}

function buildMessages(input, actions) {
  const seen = new Set();
  const messages = [];

  actions.forEach((action) => {
    const template = PROMPT_TEMPLATES[action];
    if (!template) return;

    if (template.system && !seen.has(template.system)) {
      messages.push({ role: 'system', content: template.system });
      seen.add(template.system);
    }
  });

  const mainAction = PROMPT_TEMPLATES[actions[0]];
  if (mainAction?.user) {
    messages.push({ role: 'user', content: mainAction.user(input) });
  } else {
    messages.push({ role: 'user', content: input });
  }

  return messages;
}

function streamJsonResponse(res, payload) {
  const jsonOpen = '{"ok":true,"model":' + JSON.stringify(payload.model ?? FALLBACK_MODEL_NAME) + ',"outputs":[{"label":' + JSON.stringify(payload.outputs?.[0]?.label ?? DEFAULT_OUTPUT_LABEL) + ',"content":"';
  res.write(jsonOpen);

  const content = payload.outputs?.[0]?.content ?? '';
  const escaped = escapeJsonString(content);
  for (let i = 0; i < escaped.length; i += STREAM_CHUNK_SIZE) {
    const chunk = escaped.slice(i, i + STREAM_CHUNK_SIZE);
    res.write(chunk);
  }

  res.write('"}]}');
  res.end();
}

function escapeJsonString(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

function createSentenceSummary(input, maxWords = 30) {
  const sentences = splitSentences(input);
  const first = sentences[0] || input;
  const words = first.split(/\s+/).slice(0, maxWords);
  return words.join(' ').replace(/[,;:\-]+$/, '') + '.';
}

function createBulletSummary(input) {
  const sentences = splitSentences(input).slice(0, 7);
  if (!sentences.length) return '• Sin información disponible.';
  return sentences.map((sentence) => `• ${sentence.trim()}`).join('\n');
}

function createParagraphSummary(input) {
  const sentences = splitSentences(input).slice(0, 6);
  if (!sentences.length) return 'Sin contenido que resumir.';
  const midpoint = Math.ceil(sentences.length / 2);
  const part1 = sentences.slice(0, midpoint).join(' ');
  const part2 = sentences.slice(midpoint).join(' ');
  let output = `Resumen ejecutivo\n${part1.trim()}`;
  if (part2.trim()) {
    output += `\n\nDetalles clave\n${part2.trim()}`;
  }
  return output;
}

function simplifyForKids(input) {
  const sentences = splitSentences(input).slice(0, 4);
  if (!sentences.length) return 'Explícalo con ejemplos sencillos.';
  return sentences
    .map((sentence, index) => {
      const simple = sentence.replace(/(\butilizar\b)/gi, 'usar');
      return `${index + 1}. ${simple.trim()}`;
    })
    .join('\n');
}

function emphasizeExpertTone(text) {
  return `${text}\n\nNota experta: Revisa fuentes oficiales para validar datos y añade métricas específicas en la versión final.`;
}

function pseudoTranslate(input, lang) {
  const tag = lang === 'local' ? 'Adaptación cultural' : `Traducción (${lang.toUpperCase()})`;
  return `${tag}\n${input}`;
}

function rewriteClarity(input) {
  return splitSentences(input)
    .map((sentence) => sentence.replace(/\b(?:utilizar|realizar|emplear)\b/gi, 'usar'))
    .join(' ');
}

function shortenText(input) {
  const words = input.split(/\s+/);
  if (words.length <= 40) return input;
  return words.slice(0, Math.max(20, Math.floor(words.length * 0.6))).join(' ') + '…';
}

function formalizeText(input, extraLegal = false) {
  let text = input.replace(/\b(tú|tu|tus)\b/gi, 'usted');
  text = text.replace(/\b(quiero|quieres|queremos)\b/gi, 'solicito');
  if (extraLegal) {
    text += '\n\nCláusula de responsabilidad: el presente texto es una aproximación y debe revisarse legalmente.';
  }
  return text;
}

function persuasiveRewrite(input) {
  return `Beneficio principal\n${createSentenceSummary(input)}\n\nPor qué importa\n${createParagraphSummary(input)}\n\nSiguiente paso\nComparte este mensaje con tu equipo y ejecuta la acción recomendada.`;
}

function seoTitles(topic) {
  const base = sanitizeText(topic).slice(0, 60);
  const variants = ['Guía esencial', 'Plantilla definitiva', 'Pasos rápidos', 'Checklist express', 'Resuelve tu duda'];
  return variants
    .map((variant, index) => `${index + 1}. ${variant}: ${base}`.slice(0, 60))
    .join('\n');
}

function seoMeta(topic) {
  const focus = sanitizeText(topic).slice(0, 120);
  const meta = `${focus}. Solución rápida con IA en 3 pasos.`.slice(0, 160);
  const keywords = ['resumen IA', 'traductor inteligente', 'reescribir texto', 'SEO IA', 'poema con IA'];
  return `Meta descripción\n${meta}\n\nKeywords\n${keywords.join(', ')}`;
}

function emailCopy(topic) {
  const hook = createSentenceSummary(topic);
  return `Asunto: ${hook.slice(0, 60)}\n\nHola,\n${createParagraphSummary(topic)}\n\n¿Lo vemos juntos esta semana?`;
}

function instagramCopy(topic) {
  return `Hook\n${createSentenceSummary(topic)}\n\nHistoria\n${createParagraphSummary(topic)}\n\n#IA #Productividad #TextoInteligente #Copywriting #MarketingDigital #Innovación`;
}

function linkedinCopy(topic) {
  return `Introducción\n${createSentenceSummary(topic)}\n\nContexto\n${createParagraphSummary(topic)}\n\nCTA\nComparte tu experiencia y guardemos este recurso.`;
}

function legalTemplate(title, topic) {
  return `${title}\n\n1. Partes\nDescribe quién firma el acuerdo.\n\n2. Objeto\n${createSentenceSummary(topic)}\n\n3. Obligaciones\nDetalla tareas principales.\n\n4. Pagos y plazos\nIncluye importes, fechas y forma de pago.\n\n5. Duración y terminación\nIndica vigencia y cómo finalizar.\n\n6. Ley aplicable\nMenciona jurisdicción competente.`;
}

function poem(topic) {
  const lines = splitSentences(topic).slice(0, 4);
  return ['En luces de neón la idea despierta,', 'Un soplo de datos que late sin prisa,', `Tu mensaje:${lines[0] || 'voz abierta'},`, 'Lo volvemos arte con toque de brisa.'].join('\n');
}

function rap(topic) {
  const core = createSentenceSummary(topic, 12);
  return `Yeah, check it\n${core}\nSube el beat, ritmo late con razón,\nSimplify en la casa, convierte tu visión.`;
}

function shortStory(topic) {
  return `Inicio\n${createSentenceSummary(topic)}\n\nNudo\n${createParagraphSummary(topic)}\n\nDesenlace\nTodo cambia cuando decides probar Simplify AI.`;
}

function jokes(topic) {
  const idea = createSentenceSummary(topic, 12);
  return `1) Dicen que ${idea.toLowerCase()} y Simplify se conocieron… ahora todo es TL;DR.\n2) Intenté traducirlo solo, pero el corrector me dijo: "¿No tienes Simplify?"\n3) El contrato pidió vacaciones: tanta claridad lo dejó sin cláusulas.`;
}

function classicStyle(topic) {
  return `Oh musa digital, inspira esta pluma. ${createSentenceSummary(topic)} Así, cual cervantina prosa, elevamos tu mensaje.`;
}

function docExportOutline(type, topic) {
  return `${type} ready\n\n1. Portada\nTítulo y datos clave.\n\n2. Resumen ejecutivo\n${createSentenceSummary(topic)}\n\n3. Desarrollo\n${createParagraphSummary(topic)}\n\n4. Acciones\nLista numerada con próximos pasos.`;
}

function promptMaker(topic) {
  return `Prompt listo\n\nObjetivo: ${createSentenceSummary(topic)}\nContexto: ${createParagraphSummary(topic)}\nFormato: Lista de viñetas claras.\nRestricciones: Sin datos inventados, tono profesional.`;
}

function viralSpin(topic) {
  return `Gancho viral\n${createSentenceSummary(topic)}\n\nStory beat\n${createParagraphSummary(topic)}\n\nCall to action\nEtiqueta a quien necesita verlo.`;
}

function goalOriented(topic) {
  return `Objetivo principal\n${createSentenceSummary(topic)}\n\nMensajes clave\n${createParagraphSummary(topic)}\n\nAcciones sugeridas\n1. Define métrica.\n2. Ejecuta experimento.\n3. Evalúa resultados.`;
}

function roleExplain(topic) {
  return `Rol sugerido\nProfesor paciente\n\nExplicación\n${simplifyForKids(topic)}\n\nSi necesitas otro rol, repite especificándolo.`;
}

function businessPlan(topic) {
  return `Propuesta de negocio\nProblema\n${createSentenceSummary(topic)}\n\nSolución\n${createParagraphSummary(topic)}\n\nModelo\nSuscripción mensual con IA asistente.\n\nMétricas clave\nUsuarios activos, retención, LTV.`;
}

function twist(topic) {
  return `Versión original\n${createSentenceSummary(topic)}\n\nGiro inesperado\nAñade un robot narrador que cambia el final a cada lector.`;
}

function globalAdaptation(topic) {
  return `Mensaje base\n${createSentenceSummary(topic)}\n\nAdaptación global\nEuropa: destaca privacidad.\nLatAm: enfatiza oportunidad económica.\nAsia: subraya precisión tecnológica.`;
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function sanitizeForOutput(text) {
  return text.replace(/[\u0000-\u001f\u007f]+/g, '').trim();
}
