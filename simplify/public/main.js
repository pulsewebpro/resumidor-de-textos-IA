const DEFAULT_COPY = {
  'hero.title': 'Transforma tus textos en segundos con Simplify AI',
  'hero.subtitle': 'Resumir texto con IA, traductor inteligente y reescribir online en una sola web. 3 usos gratis por navegador.',
  'cta.start': 'Empezar ahora',
  'textarea.placeholder': 'Pega tu texto o idea aquí...',
  'btn.health': 'Check /api/health',
  'section.input': 'Tu texto',
  'section.chips': 'Modos IA',
  'section.result': 'Resultado',
  'section.plans': 'Planes y créditos',
  'plans.subtitle': '3 usos gratis por navegador. Cuando se agoten, elige un plan.',
  'plans.one': '1 crédito — pago único',
  'plans.one.desc': 'Ideal para urgencias. Entrega inmediata tras el pago.',
  'plans.ten': '10 créditos — pack ahorro',
  'plans.ten.desc': 'Perfecto para equipos. 10 usos que nunca caducan.',
  'plans.sub': 'Suscripción ilimitada',
  'plans.sub.desc': 'Todo el poder de Simplify AI sin límites por mes.',
  'plans.cta.buy': 'Comprar crédito',
  'plans.cta.pack': 'Comprar pack',
  'plans.cta.sub': 'Suscribirme',
  'chips.helper': 'Elige chips para guiar la IA o genera tal cual.',
  'status.credits': 'Créditos disponibles:',
  'status.account': 'Ver cuenta',
  'status.noCredits': 'Sin créditos disponibles. Elige un plan para seguir.',
  'status.healthOk': 'Health OK',
  'status.healthFail': 'Health check failed',
  'status.done': 'Listo',
  'legal.terms': 'Términos',
  'legal.privacy': 'Privacidad',
  'legal.cookies': 'Cookies',
  'user.modal.title': 'Tu cuenta Simplify',
  'user.email': 'Email',
  'user.plan': 'Plan actual',
  'user.credits': 'Créditos disponibles',
  'user.manage': 'Gestionar plan',
  'user.reset': 'Resetear créditos',
  'chips.summarize.title': 'Resumir texto con IA',
  'chips.summarize.tldr': 'TL;DR (1 frase)',
  'chips.summarize.bullets': 'Puntos clave',
  'chips.summarize.general': 'Resumen general',
  'chips.summarize.kids': 'Para niños',
  'chips.summarize.expert': 'En tono experto',
  'chips.translate.title': 'Traducir con inteligencia artificial',
  'chips.translate.pick': 'Elegir idioma…',
  'chips.translate.en': '→ Inglés',
  'chips.translate.fr': '→ Francés',
  'chips.translate.de': '→ Alemán',
  'chips.translate.it': '→ Italiano',
  'chips.translate.pt': '→ Portugués',
  'chips.translate.local': 'Adaptar culturalmente',
  'chips.rewrite.title': 'Reescribir texto online',
  'chips.rewrite.clear': 'Más claro',
  'chips.rewrite.short': 'Más corto',
  'chips.rewrite.formal': 'Más formal',
  'chips.rewrite.convincing': 'Más convincente',
  'chips.seo.title': 'SEO y marketing con IA',
  'chips.seo.titleTag': 'Título SEO',
  'chips.seo.meta': 'Meta descripción',
  'chips.seo.email': 'Copy para email',
  'chips.seo.ig': 'Post Instagram',
  'chips.seo.linkedin': 'Post LinkedIn',
  'chips.legal.title': 'Legal y formal',
  'chips.legal.contract': 'Contrato simple',
  'chips.legal.privacy': 'Política de privacidad',
  'chips.legal.disclaimer': 'Aviso legal',
  'chips.legal.lawyer': 'Tono abogado',
  'chips.legal.easy': 'Tono fácil de entender',
  'chips.creative.title': 'Creativo con IA',
  'chips.creative.poem': 'Poema',
  'chips.creative.rap': 'Rap',
  'chips.creative.story': 'Cuento corto',
  'chips.creative.joke': 'Chiste / humor',
  'chips.creative.classic': 'Estilo clásico',
  'chips.docs.title': 'Documentos inteligentes',
  'chips.docs.summary': 'Subir PDF y resumir',
  'chips.docs.docx': 'Exportar a DOCX',
  'chips.docs.pdf': 'Exportar a PDF',
  'chips.prompt.title': 'Especial: Hazme el prompt 🤖',
  'chips.prompt.make': 'Hazme el prompt',
  'chips.prompt.viral': 'Hazlo viral',
  'chips.prompt.goal': 'Enfócalo a mi objetivo',
  'chips.prompt.role': 'Explícamelo como…',
  'chips.prompt.business': 'Hazlo negocio',
  'chips.prompt.twist': 'Dame un giro divertido',
  'chips.prompt.pro': 'Ponlo profesional',
  'chips.prompt.adapt': 'Adáptalo al mundo',
  'result.empty': 'Tu resultado aparecerá aquí.',
  'result.streaming': 'Generando respuesta…',
  'result.error': 'No se pudo generar. Inténtalo de nuevo.'
};

const CHIP_GROUPS = [
  {
    id: 'summarize',
    titleKey: 'chips.summarize.title',
    chips: [
      { action: 'summarize:tldr', labelKey: 'chips.summarize.tldr' },
      { action: 'summarize:bullets', labelKey: 'chips.summarize.bullets' },
      { action: 'summarize:general', labelKey: 'chips.summarize.general' },
      { action: 'summarize:kids', labelKey: 'chips.summarize.kids' },
      { action: 'summarize:expert', labelKey: 'chips.summarize.expert' }
    ]
  },
  {
    id: 'translate',
    titleKey: 'chips.translate.title',
    chips: [
      { action: 'translate:en', labelKey: 'chips.translate.en' },
      { action: 'translate:fr', labelKey: 'chips.translate.fr' },
      { action: 'translate:de', labelKey: 'chips.translate.de' },
      { action: 'translate:it', labelKey: 'chips.translate.it' },
      { action: 'translate:pt', labelKey: 'chips.translate.pt' },
      { action: 'translate:localize', labelKey: 'chips.translate.local' }
    ]
  },
  {
    id: 'rewrite',
    titleKey: 'chips.rewrite.title',
    chips: [
      { action: 'rewrite:clear', labelKey: 'chips.rewrite.clear' },
      { action: 'rewrite:short', labelKey: 'chips.rewrite.short' },
      { action: 'rewrite:formal', labelKey: 'chips.rewrite.formal' },
      { action: 'rewrite:convincing', labelKey: 'chips.rewrite.convincing' }
    ]
  },
  {
    id: 'seo',
    titleKey: 'chips.seo.title',
    chips: [
      { action: 'seo:title', labelKey: 'chips.seo.titleTag' },
      { action: 'seo:meta', labelKey: 'chips.seo.meta' },
      { action: 'seo:email', labelKey: 'chips.seo.email' },
      { action: 'seo:ig', labelKey: 'chips.seo.ig', feature: 'SOCIAL_POSTS' },
      { action: 'seo:linkedin', labelKey: 'chips.seo.linkedin', feature: 'SOCIAL_POSTS' }
    ]
  },
  {
    id: 'legal',
    titleKey: 'chips.legal.title',
    chips: [
      { action: 'legal:contract', labelKey: 'chips.legal.contract' },
      { action: 'legal:privacy', labelKey: 'chips.legal.privacy' },
      { action: 'legal:disclaimer', labelKey: 'chips.legal.disclaimer' },
      { action: 'legal:lawyer', labelKey: 'chips.legal.lawyer' },
      { action: 'legal:easy', labelKey: 'chips.legal.easy' }
    ]
  },
  {
    id: 'creative',
    titleKey: 'chips.creative.title',
    chips: [
      { action: 'creative:poem', labelKey: 'chips.creative.poem' },
      { action: 'creative:rap', labelKey: 'chips.creative.rap' },
      { action: 'creative:story', labelKey: 'chips.creative.story' },
      { action: 'creative:joke', labelKey: 'chips.creative.joke' },
      { action: 'creative:classic', labelKey: 'chips.creative.classic' }
    ]
  },
  {
    id: 'docs',
    titleKey: 'chips.docs.title',
    feature: 'DOC_UPLOAD',
    chips: [
      { action: 'docs:pdf:summary', labelKey: 'chips.docs.summary', feature: 'DOC_UPLOAD' },
      { action: 'docs:export:docx', labelKey: 'chips.docs.docx', feature: 'EXPORT_DOCX' },
      { action: 'docs:export:pdf', labelKey: 'chips.docs.pdf', feature: 'EXPORT_PDF' }
    ]
  },
  {
    id: 'prompt',
    titleKey: 'chips.prompt.title',
    chips: [
      { action: 'prompt:make', labelKey: 'chips.prompt.make' },
      { action: 'prompt:viral', labelKey: 'chips.prompt.viral', feature: 'SOCIAL_POSTS' },
      { action: 'prompt:goal', labelKey: 'chips.prompt.goal' },
      { action: 'prompt:as:role', labelKey: 'chips.prompt.role' },
      { action: 'prompt:business', labelKey: 'chips.prompt.business' },
      { action: 'prompt:twist', labelKey: 'chips.prompt.twist' },
      { action: 'prompt:pro', labelKey: 'chips.prompt.pro' },
      { action: 'prompt:adapt:world', labelKey: 'chips.prompt.adapt' }
    ]
  }
];

const ACTION_PROMPTS = {
  'summarize:tldr': {
    system: 'Eres un asistente que resume cualquier texto en una sola frase clara de 20-30 palabras.',
    user: (input) => `Resume el siguiente texto en UNA sola frase de máximo 30 palabras.\n\nTexto:\n${input}`
  },
  'summarize:bullets': {
    system: 'Eres un asistente que extrae puntos clave claros y accionables.',
    user: (input) => `Resume el siguiente texto en una lista de 3 a 7 viñetas concisas:\n${input}`
  },
  'summarize:general': {
    system: 'Eres un asistente que sintetiza textos en párrafos breves con subtítulos.',
    user: (input) => `Crea un resumen estructurado en 2-3 párrafos con subtítulos claros del siguiente texto:\n${input}`
  },
  'summarize:kids': {
    system: 'Explicas conceptos con lenguaje sencillo para niños de 8-10 años.',
    user: (input) => `Explica el siguiente contenido con palabras simples, ejemplos cotidianos y tono didáctico:\n${input}`
  },
  'summarize:expert': {
    system: 'Redactas como especialista académico con precisión y concisión.',
    user: (input) => `Crea un resumen ejecutivo con rigor profesional y datos relevantes (sin inventar).\nContenido:\n${input}`
  },
  'translate:en': {
    system: 'You are a professional translator.',
    user: (input) => `Translate into English keeping tone and intent.\n\n${input}`
  },
  'translate:fr': {
    system: 'Vous êtes un traducteur professionnel.',
    user: (input) => `Traduisez en français en respectant le ton et le contexte.\n\n${input}`
  },
  'translate:de': {
    system: 'Du bist ein professioneller Übersetzer.',
    user: (input) => `Übersetze den folgenden Text ins Deutsche unter Beibehaltung von Ton und Aussage.\n\n${input}`
  },
  'translate:it': {
    system: 'Sei un traduttore professionista.',
    user: (input) => `Traduci in italiano mantenendo tono e messaggio.\n\n${input}`
  },
  'translate:pt': {
    system: 'Você é um tradutor profissional.',
    user: (input) => `Traduza para português mantendo tom e objetivo.\n\n${input}`
  },
  'translate:localize': {
    system: 'Eres experto en localización y adaptación cultural.',
    user: (input) => `Traduce y adapta culturalmente el siguiente texto al mercado indicado por el usuario. Mantén el sentido original y ajusta referencias locales.\n${input}`
  },
  'rewrite:clear': {
    system: 'Eres editor profesional y mejoras la claridad.',
    user: (input) => `Reescribe el texto con máxima claridad y frases directas, manteniendo el significado.\n\n${input}`
  },
  'rewrite:short': {
    system: 'Eres editor profesional y eliminas redundancias.',
    user: (input) => `Acorta el texto eliminando redundancias, mantén la información esencial.\n\n${input}`
  },
  'rewrite:formal': {
    system: 'Escribes en tono formal y profesional.',
    user: (input) => `Reescribe el contenido en tono formal y corporativo sin cambiar el mensaje.\n\n${input}`
  },
  'rewrite:convincing': {
    system: 'Eres copywriter persuasivo.',
    user: (input) => `Reescribe el texto con lenguaje persuasivo, destacando beneficios y un llamado a la acción suave.\n\n${input}`
  },
  'seo:title': {
    system: 'Eres especialista SEO.',
    user: (input) => `Genera cinco títulos SEO (<=60 caracteres) con distintos enfoques para: ${input}`
  },
  'seo:meta': {
    system: 'Eres especialista SEO.',
    user: (input) => `Escribe una meta descripción de 150-160 caracteres y lista 5 palabras clave para: ${input}`
  },
  'seo:email': {
    system: 'Eres copywriter de email marketing.',
    user: (input) => `Redacta asunto y cuerpo breve (120-180 palabras) con CTA claro sobre:\n${input}`
  },
  'seo:ig': {
    system: 'Eres social media manager para Instagram.',
    user: (input) => `Escribe una caption creativa con gancho, 5-8 hashtags y CTA para:\n${input}`
  },
  'seo:linkedin': {
    system: 'Eres creador de contenido profesional para LinkedIn.',
    user: (input) => `Escribe un post profesional con hook inicial, desarrollo y CTA final sobre:\n${input}`
  },
  'legal:contract': {
    system: 'Eres abogado que redacta contratos claros (sin asesoría legal).',
    user: (input) => `Redacta un contrato simple con secciones de partes, objeto, obligaciones, pagos, plazo y ley aplicable sobre:\n${input}`
  },
  'legal:privacy': {
    system: 'Eres abogado especializado en privacidad.',
    user: (input) => `Redacta una política de privacidad clara con secciones básicas (datos, uso, derechos, contacto) para:\n${input}`
  },
  'legal:disclaimer': {
    system: 'Eres abogado.',
    user: (input) => `Redacta un aviso legal básico con identificador, finalidad y responsabilidades para:\n${input}`
  },
  'legal:lawyer': {
    system: 'Eres abogado y escribes con precisión jurídica.',
    user: (input) => `Reescribe el texto con tono jurídico formal, precisión y referencias a obligaciones.\n\n${input}`
  },
  'legal:easy': {
    system: 'Eres redactor legal que simplifica conceptos.',
    user: (input) => `Explica el siguiente texto legal con lenguaje sencillo y ejemplos concretos.\n\n${input}`
  },
  'creative:poem': {
    system: 'Eres poeta contemporáneo.',
    user: (input) => `Escribe un poema breve inspirado en:\n${input}`
  },
  'creative:rap': {
    system: 'Eres letrista de rap con rimas internas y flow moderno.',
    user: (input) => `Escribe 16 barras de rap sobre:\n${input}`
  },
  'creative:story': {
    system: 'Eres cuentista.',
    user: (input) => `Escribe un microrrelato de máximo 200 palabras sobre:\n${input}`
  },
  'creative:joke': {
    system: 'Cuentas chistes breves y aptos para todo público.',
    user: (input) => `Cuenta tres chistes breves relacionados con:\n${input}`
  },
  'creative:classic': {
    system: 'Imitas a Shakespeare o Cervantes según convenga.',
    user: (input) => `Reescribe el texto con estilo clásico inspirado en Shakespeare/Cervantes.\n\n${input}`
  },
  'docs:pdf:summary': {
    system: 'Analizas documentos extensos y das un resumen ejecutivo.',
    user: (input) => `Imagina que el usuario ha subido un PDF. Resume los puntos clave en formato ejecutivo:\n${input}`
  },
  'docs:export:docx': {
    system: 'Generas estructuras listas para exportar a Word.',
    user: (input) => `Genera una estructura con encabezados y secciones listos para exportar a DOCX a partir de:\n${input}`
  },
  'docs:export:pdf': {
    system: 'Generas estructuras listas para exportar a PDF.',
    user: (input) => `Genera una estructura lista para maquetar en PDF a partir de:\n${input}`
  },
  'prompt:make': {
    system: 'Eres prompt engineer.',
    user: (input) => `Crea un prompt listo para usar en otra IA que realice la tarea descrita.\nDescripción:\n${input}`
  },
  'prompt:viral': {
    system: 'Eres estratega de contenidos virales.',
    user: (input) => `Redacta un prompt e indicaciones para que una IA genere contenido con potencial viral sobre:\n${input}`
  },
  'prompt:goal': {
    system: 'Eres consultor enfocado en objetivos.',
    user: (input) => `Define un prompt que guíe a una IA a lograr el objetivo descrito, incluyendo pasos y métricas.\nObjetivo:\n${input}`
  },
  'prompt:as:role': {
    system: 'Eres especialista en adaptar explicaciones a distintos roles.',
    user: (input) => `Crea un prompt para que una IA explique el tema como el rol indicado por el usuario.\nTema o petición:\n${input}`
  },
  'prompt:business': {
    system: 'Eres consultor de negocios.',
    user: (input) => `Formula un prompt para convertir la idea del usuario en una propuesta comercial clara.\nIdea:\n${input}`
  },
  'prompt:twist': {
    system: 'Eres guionista creativo.',
    user: (input) => `Crea un prompt que añada un giro creativo e inesperado al contenido siguiente:\n${input}`
  },
  'prompt:pro': {
    system: 'Eres redactor corporativo.',
    user: (input) => `Crea un prompt que fuerce un tono profesional y corporativo sobre el siguiente contexto:\n${input}`
  },
  'prompt:adapt:world': {
    system: 'Eres estratega global.',
    user: (input) => `Crea un prompt para adaptar el contenido a distintos países y culturas.\nContexto base:\n${input}`
  }
};

const DEFAULT_FEATURES = {
  DOC_UPLOAD: false,
  EXPORT_DOCX: false,
  EXPORT_PDF: false,
  SOCIAL_POSTS: true
};

const STORAGE_KEYS = {
  credits: 'simplify_credits',
  plan: 'simplify_plan',
  lang: 'simplify_lang',
  admin: 'simplify_admin',
  user: 'simplify_user_id'
};

const state = {
  admin: false,
  credits: 3,
  plan: 'free',
  lang: 'es',
  userId: '',
  locale: { ...DEFAULT_COPY },
  selectedActions: new Map(),
  abortController: null,
  walletSyncing: false,
  currentLabel: 'AI',
  rawResponse: ''
};

const els = {};

init();

function init() {
  cacheElements();
  ensureResultPanels();
  renderChipGroups();
  attachEvents();
  ensureUserId();
  ensurePlan();
  ensureCredits();
  applyAdminFromQuery();
  applyAdminFromStorage();
  applyFeatureFlags();
  hydrateYear();
  applyDefaultCopy();
  restoreLanguage();
  updateCreditsUI();
  updateUserEmail();
  showEmptyResult();
  syncWallet();
}

function cacheElements() {
  els.textarea = document.getElementById('input');
  els.btnGenerate = document.getElementById('btn-generate');
  els.btnHealth = document.getElementById('btn-health');
  els.btnUser = document.getElementById('btn-user');
  els.btnManagePlan = document.getElementById('btn-manage-plan');
  els.btnCloseUser = document.getElementById('btn-close-user');
  els.btnCloseSession = document.getElementById('btn-close-session');
  els.modalBackdrop = document.getElementById('modal-backdrop');
  els.modal = document.getElementById('user-modal');
  els.result = document.getElementById('result');
  els.resultStatus = document.getElementById('result-status');
  els.creditCount = document.getElementById('credit-count');
  els.userPlan = document.getElementById('user-plan');
  els.userCredits = document.getElementById('user-credits');
  els.userEmail = document.getElementById('user-email');
  els.paywall = document.getElementById('paywall');
  els.langSelect = document.getElementById('lang-select');
  els.planCards = Array.from(document.querySelectorAll('[data-plan]'));
}

function ensureResultPanels() {
  if (!els.result) return;
  let tabRes = document.getElementById('tab-res');
  let tabJson = document.getElementById('tab-json');
  let tabRaw = document.getElementById('tab-raw');

  if (!tabRes || !tabJson || !tabRaw) {
    els.result.innerHTML = '';

    const tablist = document.createElement('div');
    tablist.className = 'result-tabs';
    tablist.setAttribute('role', 'tablist');

    const btnRes = createTabButton('tabbtn-res', 'tab-res', 'Resultado');
    const btnJson = createTabButton('tabbtn-json', 'tab-json', 'JSON');
    const btnRaw = createTabButton('tabbtn-raw', 'tab-raw', 'Raw');

    tablist.append(btnRes, btnJson, btnRaw);

    tabRes = createTabPanel('tab-res', 'tabbtn-res');
    tabJson = createTabPanel('tab-json', 'tabbtn-json');
    tabRaw = createTabPanel('tab-raw', 'tabbtn-raw');

    els.result.append(tablist, tabRes, tabJson, tabRaw);
  }

  els.tabBtnRes = document.getElementById('tabbtn-res');
  els.tabBtnJson = document.getElementById('tabbtn-json');
  els.tabBtnRaw = document.getElementById('tabbtn-raw');
  els.tabRes = document.getElementById('tab-res');
  els.tabJson = document.getElementById('tab-json');
  els.tabRaw = document.getElementById('tab-raw');

  els.tabBtnRes?.addEventListener('click', () => activateTab('tab-res'));
  els.tabBtnJson?.addEventListener('click', () => activateTab('tab-json'));
  els.tabBtnRaw?.addEventListener('click', () => activateTab('tab-raw'));

  activateTab('tab-res');
}

function createTabButton(id, controls, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.id = id;
  button.className = 'result-tab';
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-controls', controls);
  button.textContent = label;
  return button;
}

function createTabPanel(id, labelledBy) {
  const panel = document.createElement('pre');
  panel.id = id;
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('tabindex', '0');
  panel.setAttribute('aria-labelledby', labelledBy);
  panel.hidden = id !== 'tab-res';
  return panel;
}

function activateTab(targetId) {
  const buttons = [els.tabBtnRes, els.tabBtnJson, els.tabBtnRaw];
  const panels = [els.tabRes, els.tabJson, els.tabRaw];
  buttons.forEach((btn) => {
    if (!btn) return;
    const isActive = btn.getAttribute('aria-controls') === targetId;
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    btn.classList.toggle('active', isActive);
  });
  panels.forEach((panel) => {
    if (!panel) return;
    panel.hidden = panel.id !== targetId;
  });
}

function renderChipGroups() {
  const host = document.getElementById('chip-groups');
  if (!host) return;
  host.innerHTML = '';

  CHIP_GROUPS.forEach((group) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'chip-group';
    wrapper.dataset.group = group.id;
    if (group.feature) {
      wrapper.dataset.feature = group.feature;
    }

    const header = document.createElement('header');
    const title = document.createElement('h3');
    title.dataset.i18n = group.titleKey;
    title.textContent = DEFAULT_COPY[group.titleKey] || group.titleKey;
    header.appendChild(title);
    wrapper.appendChild(header);

    const list = document.createElement('div');
    list.className = 'chip-list';

    group.chips.forEach((chip) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.dataset.action = chip.action;
      button.dataset.group = group.id;
      button.dataset.i18n = chip.labelKey;
      button.textContent = DEFAULT_COPY[chip.labelKey] || chip.labelKey;
      if (chip.feature) {
        button.dataset.feature = chip.feature;
      }
      button.addEventListener('click', () => toggleChip(button));
      list.appendChild(button);
    });

    wrapper.appendChild(list);
    host.appendChild(wrapper);
  });
}

function attachEvents() {
  els.btnGenerate?.addEventListener('click', handleGenerateClick);
  els.btnHealth?.addEventListener('click', handleHealthCheck);
  els.btnUser?.addEventListener('click', openModal);
  els.btnCloseUser?.addEventListener('click', closeModal);
  els.btnCloseSession?.addEventListener('click', resetCredits);
  els.btnManagePlan?.addEventListener('click', openPortal);

  els.modalBackdrop?.addEventListener('click', (event) => {
    if (event.target === els.modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') {
      toggleAdmin();
    }
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      generateFromInput();
    }
  });

  els.textarea?.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      generateFromInput();
    }
  });

  els.langSelect?.addEventListener('change', (event) => {
    setLanguage(event.target.value);
  });

  document.querySelectorAll('[data-plan-action]').forEach((btn) => {
    btn.addEventListener('click', () => initiateCheckout(btn.dataset.planAction));
  });
}
function ensureUserId() {
  const stored = localStorage.getItem(STORAGE_KEYS.user);
  if (stored) {
    state.userId = stored;
    return stored;
  }
  const id = (crypto?.randomUUID?.() || `user-${Date.now()}`) + Math.random().toString(16).slice(2, 8);
  const safeId = id.replace(/[^a-z0-9-]/gi, '').slice(0, 36);
  localStorage.setItem(STORAGE_KEYS.user, safeId);
  state.userId = safeId;
  return safeId;
}

function ensurePlan() {
  const plan = localStorage.getItem(STORAGE_KEYS.plan) || 'free';
  state.plan = plan;
  return plan;
}

function ensureCredits() {
  const raw = localStorage.getItem(STORAGE_KEYS.credits);
  if (raw === 'Infinity') {
    state.credits = Infinity;
    return state.credits;
  }
  const stored = Number(raw);
  if (Number.isFinite(stored) && stored >= 0) {
    state.credits = stored;
    return stored;
  }
  localStorage.setItem(STORAGE_KEYS.credits, '3');
  state.credits = 3;
  return 3;
}

function applyAdminFromQuery() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') === 'on') {
    setAdmin(true);
  } else if (params.get('admin') === 'off') {
    setAdmin(false);
  }
}

function applyAdminFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEYS.admin);
  if (stored === 'on') {
    setAdmin(true);
  } else if (!stored) {
    setAdmin(false);
  }
}

function setAdmin(value) {
  state.admin = Boolean(value);
  if (state.admin) {
    localStorage.setItem(STORAGE_KEYS.admin, 'on');
  } else {
    localStorage.removeItem(STORAGE_KEYS.admin);
  }
  updateAdminUI();
  enforceCreditState();
}

function toggleAdmin() {
  setAdmin(!state.admin);
  showStatus(state.admin ? 'Modo admin activo.' : 'Modo admin desactivado.');
}

function updateAdminUI() {
  if (state.admin) {
    els.btnHealth?.classList.add('visible');
    els.btnHealth?.removeAttribute('hidden');
  } else {
    els.btnHealth?.classList.remove('visible');
    els.btnHealth?.setAttribute('hidden', 'true');
  }
}

function applyFeatureFlags() {
  const features = { ...DEFAULT_FEATURES, ...(window.FEATURES || {}) };
  document.querySelectorAll('[data-feature]').forEach((node) => {
    const featureKey = node.dataset.feature;
    if (!featureKey) return;
    const active = features[featureKey] !== false;
    node.hidden = !active;
    node.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
}

function hydrateYear() {
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}

function applyDefaultCopy() {
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (DEFAULT_COPY[key]) {
      node.textContent = DEFAULT_COPY[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (DEFAULT_COPY[key]) {
      node.setAttribute('placeholder', DEFAULT_COPY[key]);
    }
  });
}

function restoreLanguage() {
  const stored = localStorage.getItem(STORAGE_KEYS.lang);
  const lang = stored || state.lang;
  setLanguage(lang, false);
}

async function setLanguage(lang, persist = true) {
  state.lang = lang || 'es';
  if (persist) {
    localStorage.setItem(STORAGE_KEYS.lang, state.lang);
  }
  document.documentElement.lang = state.lang.split('-')[0];
  if (els.langSelect && els.langSelect.value !== state.lang) {
    els.langSelect.value = state.lang;
  }

  const dictionary = await loadLocaleFile(state.lang);
  if (dictionary) {
    state.locale = { ...DEFAULT_COPY, ...dictionary };
  } else {
    state.locale = { ...DEFAULT_COPY };
  }
  applyTranslations();
}

async function loadLocaleFile(lang) {
  const code = lang.toLowerCase();
  const candidates = [code, code.split('-')[0]];
  for (const candidate of candidates) {
    try {
      const response = await fetch(`/locales/${candidate}.json`, { cache: 'no-cache' });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.warn('No locale for', candidate);
    }
  }
  return null;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    const value = state.locale[key];
    if (typeof value === 'string') {
      node.textContent = value;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    const value = state.locale[key];
    if (typeof value === 'string') {
      node.setAttribute('placeholder', value);
    }
  });
  updateSelectedChipLabels();
  updateCreditsUI();
  if (!state.rawResponse) {
    showEmptyResult();
  }
}

function updateSelectedChipLabels() {
  document.querySelectorAll('.chip.active').forEach((chip) => {
    const key = chip.dataset.i18n;
    if (key && state.locale[key]) {
      chip.textContent = state.locale[key];
    }
  });
}
function handleGenerateClick() {
  if (!els.textarea) return;
  const text = (els.textarea.value || '').trim();
  if (!text) {
    els.textarea.focus();
    els.textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  generateFromInput();
}

function generateFromInput() {
  const text = (els.textarea?.value || '').trim();
  if (!text) {
    showStatus(state.locale['result.error'] || DEFAULT_COPY['result.error']);
    return;
  }
  if (!state.admin && state.plan !== 'sub' && state.credits <= 0) {
    showStatus(state.locale['status.noCredits'] || DEFAULT_COPY['status.noCredits']);
    scrollToPaywall();
    return;
  }
  requestAI(text);
}

function getSelectedActions() {
  const actions = Array.from(state.selectedActions.values());
  return actions.length ? actions : ['summarize:general'];
}

function toggleChip(button) {
  const action = button.dataset.action;
  if (!action) return;
  const group = button.dataset.group || 'default';
  if (button.classList.contains('active')) {
    button.classList.remove('active');
    state.selectedActions.delete(group);
  } else {
    document.querySelectorAll(`.chip[data-group="${group}"]`).forEach((chip) => {
      chip.classList.remove('active');
    });
    button.classList.add('active');
    state.selectedActions.set(group, action);
  }
}

function buildPromptMessages(text, actions) {
  const messages = [];
  const seenSystems = new Set();
  actions.forEach((action) => {
    const def = ACTION_PROMPTS[action];
    if (!def?.system) return;
    const meta = `[simplify-action:${action}] ${def.system}`;
    if (seenSystems.has(meta)) return;
    messages.push({ role: 'system', content: meta });
    seenSystems.add(meta);
  });
  const mainAction = ACTION_PROMPTS[actions[0]];
  if (mainAction?.user) {
    messages.push({ role: 'user', content: mainAction.user(text) });
  } else {
    messages.push({ role: 'user', content: text });
  }
  return messages;
}

function requestAI(text) {
  if (!text) return;
  abortCurrentRequest();
  const actions = getSelectedActions();
  state.currentLabel = getLabelForAction(actions[0]);
  const payload = {
    input: text,
    prompt: buildPromptMessages(text, actions),
    maxTokens: 320
  };
  const headers = { 'Content-Type': 'application/json' };
  if (state.userId) {
    headers['X-Simplify-User'] = state.userId;
  }
  state.abortController = new AbortController();
  showStreamingState();
  els.btnGenerate?.setAttribute('disabled', 'true');

  fetch('/api/ai', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: state.abortController.signal
  })
    .then(async (response) => {
      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }
      const { data, raw } = await readStream(response);
      const outputs = data?.outputs || [];
      renderOutputs(outputs, raw, data);
      showStatus(state.locale['status.done'] || DEFAULT_COPY['status.done']);
      if (!state.admin && state.plan !== 'sub') {
        decrementCredits();
      }
      syncWallet();
    })
    .catch((error) => {
      if (error.name === 'AbortError') return;
      console.error('AI error', error);
      showStatus(state.locale['result.error'] || DEFAULT_COPY['result.error']);
    })
    .finally(() => {
      els.btnGenerate?.removeAttribute('disabled');
      state.abortController = null;
      enforceCreditState();
    });
}

function abortCurrentRequest() {
  if (state.abortController) {
    state.abortController.abort();
    state.abortController = null;
  }
}

function getLabelForAction(action) {
  if (!action) return 'AI';
  const found = CHIP_GROUPS.flatMap((group) => group.chips.map((chip) => ({ ...chip, group }))).find((chip) => chip.action === action);
  if (found) {
    return state.locale[found.labelKey] || DEFAULT_COPY[found.labelKey] || 'AI';
  }
  return 'AI';
}

function showStreamingState() {
  state.rawResponse = '';
  if (els.tabRes) {
    els.tabRes.textContent = state.locale['result.streaming'] || DEFAULT_COPY['result.streaming'];
  }
  if (els.tabJson) {
    els.tabJson.textContent = '';
  }
  if (els.tabRaw) {
    els.tabRaw.textContent = '';
  }
  showStatus(state.locale['result.streaming'] || DEFAULT_COPY['result.streaming']);
  activateTab('tab-res');
}

function updateStreamingOutput(content) {
  if (els.tabRes) {
    els.tabRes.textContent = content || '';
  }
  if (els.tabRaw) {
    els.tabRaw.textContent = state.rawResponse;
  }
}

function updateRawBuffer(chunk) {
  state.rawResponse += chunk;
  if (els.tabRaw) {
    els.tabRaw.textContent = state.rawResponse;
  }
}

async function readStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let raw = '';
  let streamBuffer = '';
  let started = false;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    raw += chunk;
    updateRawBuffer(chunk);
    if (!started) {
      const idx = raw.indexOf('"content":"');
      if (idx >= 0) {
        started = true;
        streamBuffer = raw.slice(idx + 11);
      }
    } else {
      streamBuffer += chunk;
    }
    if (started) {
      const closingIndex = streamBuffer.indexOf('"}]}');
      const partial = closingIndex >= 0 ? streamBuffer.slice(0, closingIndex) : streamBuffer;
      const text = unescapeJson(partial);
      updateStreamingOutput(text);
    }
  }
  raw += decoder.decode();
  const data = JSON.parse(raw);
  state.rawResponse = raw;
  return { data, raw };
}

function unescapeJson(text) {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function renderOutputs(outputs = [], raw = '', data = {}) {
  const first = outputs[0];
  const content = first?.content || '';
  state.rawResponse = raw || '';
  if (els.tabRes) {
    els.tabRes.textContent = content || '';
  }
  if (els.tabJson) {
    els.tabJson.textContent = JSON.stringify(data, null, 2);
  }
  if (els.tabRaw) {
    els.tabRaw.textContent = raw || '';
  }
  if (!outputs.length) {
    showEmptyResult();
  }
  activateTab('tab-res');
}

function showEmptyResult() {
  state.rawResponse = '';
  if (els.tabRes) {
    els.tabRes.textContent = state.locale['result.empty'] || DEFAULT_COPY['result.empty'];
  }
  if (els.tabJson) {
    els.tabJson.textContent = '';
  }
  if (els.tabRaw) {
    els.tabRaw.textContent = '';
  }
}

function showStatus(message) {
  if (els.resultStatus) {
    els.resultStatus.textContent = message;
  }
}

function scrollToPaywall() {
  els.paywall?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function decrementCredits() {
  if (state.admin || state.plan === 'sub') return;
  state.credits = Math.max(0, state.credits - 1);
  localStorage.setItem(STORAGE_KEYS.credits, String(state.credits));
  updateCreditsUI();
}
function enforceCreditState() {
  const shouldDisable = !state.admin && state.plan !== 'sub' && state.credits <= 0;
  if (shouldDisable) {
    els.btnGenerate?.setAttribute('disabled', 'true');
  } else {
    if (!state.abortController) {
      els.btnGenerate?.removeAttribute('disabled');
    }
  }
}

function resetCredits() {
  state.plan = 'free';
  state.credits = 3;
  localStorage.setItem(STORAGE_KEYS.plan, state.plan);
  localStorage.setItem(STORAGE_KEYS.credits, '3');
  updateCreditsUI();
  closeModal();
}

function updateCreditsUI() {
  if (els.creditCount) {
    els.creditCount.textContent = String(state.plan === 'sub' ? '∞' : state.credits);
  }
  if (els.userCredits) {
    els.userCredits.textContent = String(state.plan === 'sub' ? '∞' : state.credits);
  }
  if (els.userPlan) {
    els.userPlan.textContent = state.plan;
  }
  updatePlanCards();
  enforceCreditState();
}

function updatePlanCards() {
  els.planCards?.forEach((card) => {
    const plan = card.dataset.plan;
    if (plan === state.plan) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

function updateUserEmail() {
  if (!els.userEmail) return;
  const anonymized = `${state.userId || 'guest'}@simplify.ai`;
  els.userEmail.textContent = anonymized;
}

function openModal() {
  if (!els.modalBackdrop) return;
  els.modalBackdrop.classList.add('open');
  els.modalBackdrop.setAttribute('aria-hidden', 'false');
  els.modal?.focus();
}

function closeModal() {
  if (!els.modalBackdrop) return;
  els.modalBackdrop.classList.remove('open');
  els.modalBackdrop.setAttribute('aria-hidden', 'true');
}

function openPortal() {
  const headers = {};
  if (state.userId) {
    headers['X-Simplify-User'] = state.userId;
  }
  fetch(`/api/portal?user=${encodeURIComponent(state.userId)}`, { headers })
    .then((res) => res.json())
    .then((data) => {
      if (data?.url) {
        window.open(data.url, '_blank', 'noopener');
      }
    })
    .catch((error) => console.error('portal error', error));
}

function initiateCheckout(plan) {
  if (!plan) return;
  const headers = { 'Content-Type': 'application/json' };
  if (state.userId) headers['X-Simplify-User'] = state.userId;
  fetch('/api/checkout', {
    method: 'POST',
    headers,
    body: JSON.stringify({ plan, userId: state.userId })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.url) {
        window.open(data.url, '_blank', 'noopener');
      }
    })
    .catch((error) => console.error('checkout error', error));
}

function syncWallet() {
  if (state.walletSyncing) return;
  state.walletSyncing = true;
  const headers = {};
  if (state.userId) headers['X-Simplify-User'] = state.userId;
  fetch(`/api/wallet?user=${encodeURIComponent(state.userId)}`, { headers })
    .then((res) => res.json())
    .then((data) => {
      if (!data?.ok) return;
      state.plan = data.plan || 'free';
      localStorage.setItem(STORAGE_KEYS.plan, state.plan);
      if (Number.isFinite(data.credits)) {
        if (state.plan === 'sub') {
          state.credits = Number.isFinite(data.credits) ? Number(data.credits) : Infinity;
        } else {
          state.credits = Number(data.credits);
        }
        localStorage.setItem(STORAGE_KEYS.credits, String(state.credits));
      }
      updateCreditsUI();
    })
    .catch((error) => console.error('wallet error', error))
    .finally(() => {
      state.walletSyncing = false;
    });
}

function handleHealthCheck() {
  const headers = {};
  if (state.userId) headers['X-Simplify-User'] = state.userId;
  fetch('/api/health', { headers })
    .then((res) => res.json())
    .then((data) => {
      const status = JSON.stringify(data, null, 2);
      showStatus(state.locale['status.healthOk'] || DEFAULT_COPY['status.healthOk']);
      renderOutputs([{ label: 'Health', content: status }], status, { ok: true, status });
    })
    .catch((error) => {
      showStatus(state.locale['status.healthFail'] || DEFAULT_COPY['status.healthFail']);
      console.error('health error', error);
    });
}
