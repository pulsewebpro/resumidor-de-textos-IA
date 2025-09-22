const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'sv', name: 'Svenska' },
  { code: 'no', name: 'Norsk' },
  { code: 'da', name: 'Dansk' },
  { code: 'fi', name: 'Suomi' },
  { code: 'pl', name: 'Polski' },
  { code: 'cs', name: 'Čeština' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'ro', name: 'Română' },
  { code: 'bg', name: 'Български' },
  { code: 'hu', name: 'Magyar' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ar', name: 'العربية' },
  { code: 'he', name: 'עברית' },
  { code: 'fa', name: 'فارسی' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ur', name: 'اردو' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'th', name: 'ไทย' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'mr', name: 'मराठी' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'fil', name: 'Filipino' },
  { code: 'et', name: 'Eesti' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'is', name: 'Íslenska' },
  { code: 'ga', name: 'Gaeilge' },
  { code: 'sq', name: 'Shqip' },
  { code: 'mk', name: 'Македонски' },
  { code: 'ka', name: 'ქართული' },
  { code: 'hy', name: 'Հայերեն' }
];

const explainRoles = [
  'Niño 6 años',
  'Estudiante secundaria',
  'Profesor universitario',
  'Persona mayor no técnica',
  'Empresario',
  'Abogado',
  'Científico',
  'Influencer',
  'Rapero',
  'Comediante',
  'Pirata',
  'Astronauta',
  'Mago',
  'Superhéroe',
  'Rey/Reina',
  'Perro',
  'Gato',
  'Robot',
  'Chef',
  'Entrenador personal',
  'Gamer',
  'Escritor clásico (Shakespeare/Cervantes)',
  'Cantautor romántico',
  'Periodista',
  'Político',
  'Mecánico',
  'Médico',
  'Maestro de yoga',
  'Actor de teatro',
  'Villano de película'
];

const chipFamilies = [
  {
    id: 'summarize',
    labelKey: 'family_summarize',
    multi: false,
    items: [
      { id: 'ultra_brief', label: 'Ultra breve (1 frase)', prompt: 'Resume el texto en una sola frase clara y contundente.' },
      { id: 'bullet_points', label: 'Puntos clave (bullets)', prompt: 'Resume los puntos esenciales en viñetas concisas.' },
      { id: 'for_kids', label: 'Para niños', prompt: 'Explica el contenido con lenguaje sencillo y amigable para niños.' },
      { id: 'expert_tone', label: 'En tono experto', prompt: 'Resume con tono analítico y experto, destacando implicaciones y datos relevantes.' }
    ]
  },
  {
    id: 'translate',
    labelKey: 'family_translate',
    multi: false,
    items: [
      { id: 'en', label: 'Inglés 🇬🇧', prompt: 'Traduce al inglés con precisión y fluidez natural.' },
      { id: 'fr', label: 'Francés 🇫🇷', prompt: 'Traduce al francés con naturalidad y estilo nativo.' },
      { id: 'de', label: 'Alemán 🇩🇪', prompt: 'Traduce al alemán con tono profesional y preciso.' }
    ]
  },
  {
    id: 'rewrite',
    labelKey: 'family_rewrite',
    multi: false,
    items: [
      { id: 'clearer', label: 'Más claro', prompt: 'Reescribe con mayor claridad y estructura lógica.' },
      { id: 'shorter', label: 'Más corto', prompt: 'Reescribe reduciendo longitud pero manteniendo el sentido.' },
      { id: 'formal', label: 'Más formal', prompt: 'Reescribe con tono formal y profesional.' },
      { id: 'convincing', label: 'Más convincente', prompt: 'Reescribe con tono persuasivo y orientado a resultados.' },
      { id: 'creative', label: 'Más creativo', prompt: 'Reescribe con creatividad, metáforas suaves y ritmo atractivo.' }
    ]
  },
  {
    id: 'seo',
    labelKey: 'family_seo',
    multi: false,
    items: [
      { id: 'meta_description', label: 'Meta descripción', prompt: 'Redacta una meta descripción de máximo 160 caracteres.' },
      { id: 'seo_title', label: 'Título SEO', prompt: 'Propón un título SEO de máximo 60 caracteres y alto CTR.' },
      { id: 'short_ad', label: 'Anuncio corto', prompt: 'Genera un anuncio breve con llamada a la acción clara.' },
      { id: 'email_copy', label: 'Copy para email', prompt: 'Crea un copy para email con saludo cálido, cuerpo persuasivo y CTA.' },
      { id: 'social_post', label: 'Post LinkedIn / Instagram', prompt: 'Crea un post adaptable a LinkedIn e Instagram con tono inspirador.' }
    ]
  },
  {
    id: 'legal',
    labelKey: 'family_legal',
    multi: false,
    items: [
      { id: 'simple_contract', label: 'Contrato simple', prompt: 'Esquema un contrato sencillo con cláusulas básicas.' },
      { id: 'privacy_policy', label: 'Política de privacidad', prompt: 'Redacta una política de privacidad clara y completa.' },
      { id: 'legal_notice', label: 'Aviso legal', prompt: 'Genera un aviso legal estándar con responsabilidades y limitaciones.' },
      { id: 'lawyer_tone', label: 'Tono “abogado”', prompt: 'Usa un tono jurídico preciso, con terminología especializada.' },
      { id: 'easy_tone', label: 'Tono “fácil de entender”', prompt: 'Explica los términos legales en lenguaje llano y accesible.' }
    ]
  },
  {
    id: 'creative',
    labelKey: 'family_creative',
    multi: false,
    items: [
      { id: 'poem', label: 'Poema', prompt: 'Transforma el texto en un poema armonioso con ritmo.' },
      { id: 'rap', label: 'Rap 🎤', prompt: 'Crea un rap con rimas internas y flow moderno.' },
      { id: 'short_story', label: 'Cuento corto', prompt: 'Convierte el contenido en un cuento breve con inicio, nudo y desenlace.' },
      { id: 'joke', label: 'Chiste / humor', prompt: 'Genera una versión humorística con remate claro.' },
      { id: 'shakespeare', label: 'Estilo Shakespeare / Cervantes', prompt: 'Reescribe con estilo clásico renacentista, vocabulario rico y tono épico.' }
    ]
  },
  {
    id: 'documents',
    labelKey: 'family_documents',
    multi: true,
    items: [
      { id: 'pdf_summarize', label: 'Subir PDF y resumir', prompt: 'Resume el PDF destacando secciones y datos clave.' },
      { id: 'export_docx', label: 'Exportar a DOCX', prompt: 'Prepara el resultado con títulos y secciones listas para DOCX.' },
      { id: 'export_pdf', label: 'Exportar a PDF', prompt: 'Incluye estructura clara para exportar a PDF.' }
    ]
  },
  {
    id: 'special',
    labelKey: 'family_special',
    multi: true,
    items: [
      { id: 'make_prompt', label: 'Hazme el prompt 🤖', prompt: 'Genera un prompt reutilizable para un LLM con roles, pasos, inputs y ejemplo.' },
      { id: 'make_viral', label: 'Hazlo viral', prompt: 'Incluye ideas para viralizar en redes sociales.' },
      { id: 'focus_goal', label: 'Enfócalo a mi objetivo', prompt: 'Enfoca el contenido al objetivo declarado por el usuario, destacando beneficios.' },
      { id: 'explain_like', label: 'Explícamelo como si…', prompt: 'Explica usando metáforas y lenguaje propio del rol elegido. Extensión 120-200 palabras.' },
      { id: 'guide', label: '🧭 Guíame paso a paso', prompt: 'Devuelve pasos numerados claros y una checklist final.' },
      { id: 'faq', label: '📋 Preguntas frecuentes', prompt: 'Produce entre 5 y 10 preguntas frecuentes con respuestas breves.' },
      { id: 'exam', label: '🎯 Resumen tipo examen', prompt: 'Genera 10 preguntas tipo test y lista respuestas correctas al final.' },
      { id: 'tweet', label: '🐦 Hazlo tweet', prompt: 'Crea un tweet de máximo 280 caracteres listo para publicar.' },
      { id: 'thread', label: '💬 Hilo Twitter (5 tweets)', prompt: 'Genera un hilo de 5 tweets numerados manteniendo coherencia.' }
    ]
  }
];

const i18n = {
  locale: 'en',
  strings: {}
};

const uiState = {
  langTarget: 'es',
  culturalize: false,
  selectedChips: {},
  promptOutputs: [],
  pdfPayload: null,
  explainRole: explainRoles[0]
};

function getLanguageName(code) {
  const item = languageOptions.find((opt) => opt.code === code);
  return item ? item.name : code;
}

async function initI18n() {
  const browserLocale = (navigator.language || 'en').slice(0, 2).toLowerCase();
  const storedLocale = localStorage.getItem('simplify_locale');
  const targetLocale = storedLocale || (languageOptions.some((l) => l.code === browserLocale) ? browserLocale : 'en');
  await loadLocale(targetLocale);
  applyI18n();
}

async function loadLocale(locale) {
  try {
    const res = await fetch(`./locales/${locale}.json`);
    if (!res.ok) throw new Error('locale not found');
    i18n.locale = locale;
    i18n.strings = await res.json();
  } catch (err) {
    if (locale !== 'en') {
      await loadLocale('en');
      return;
    }
    console.warn('i18n fallback to default', err);
    i18n.locale = 'en';
    i18n.strings = {};
  }
}

function t(key) {
  return i18n.strings[key] || key;
}

function applyI18n() {
  document.documentElement.lang = i18n.locale;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  const textarea = document.getElementById('user-text');
  if (textarea && i18n.strings.placeholder) {
    textarea.placeholder = i18n.strings.placeholder;
  }
}

function renderLanguageSelect() {
  const select = document.getElementById('language-select');
  const search = document.getElementById('language-search');
  select.innerHTML = '';
  languageOptions.forEach((lang) => {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = `${lang.name} (${lang.code})`;
    select.appendChild(option);
  });
  const stored = localStorage.getItem('simplify_lang');
  const defaultLang = stored || 'es';
  select.value = defaultLang;
  uiState.langTarget = defaultLang;

  select.addEventListener('change', () => {
    uiState.langTarget = select.value;
    localStorage.setItem('simplify_lang', select.value);
  });

  search.addEventListener('input', () => {
    const term = search.value.toLowerCase();
    Array.from(select.options).forEach((opt) => {
      const match = opt.textContent.toLowerCase().includes(term);
      opt.hidden = !match;
    });
  });
}

function createAccordion(family) {
  const wrapper = document.createElement('section');
  wrapper.className = 'accordion';
  wrapper.dataset.family = family.id;

  const header = document.createElement('button');
  header.className = 'accordion-header';
  header.setAttribute('aria-expanded', 'true');
  header.innerHTML = `<h3>${t(family.labelKey)}</h3><span aria-hidden="true">▾</span>`;
  wrapper.appendChild(header);

  const content = document.createElement('div');
  content.className = 'accordion-content';
  wrapper.appendChild(content);

  const chipGroup = document.createElement('div');
  chipGroup.className = 'chip-group';
  content.appendChild(chipGroup);

  family.items.forEach((item) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = item.label;
    chip.dataset.id = item.id;
    chip.dataset.family = family.id;
    chip.setAttribute('aria-pressed', 'false');
    chip.dataset.prompt = item.prompt;
    chip.addEventListener('click', () => toggleChip(family, item, chip));
    chipGroup.appendChild(chip);
  });

  if (family.id === 'translate') {
    const customSelect = document.createElement('select');
    customSelect.className = 'chip-select';
    customSelect.setAttribute('aria-label', 'Otros idiomas');
    customSelect.innerHTML = `<option value="">${t('select_language') || 'Selecciona idioma extra'}</option>`;
    languageOptions.forEach((lang) => {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = `${lang.name} (${lang.code})`;
      customSelect.appendChild(opt);
    });
    customSelect.addEventListener('change', () => {
      if (customSelect.value) {
        uiState.selectedChips[family.id] = [customSelect.value];
        chipGroup.querySelectorAll('.chip').forEach((chip) => chip.setAttribute('aria-pressed', 'false'));
      } else {
        uiState.selectedChips[family.id] = [];
      }
      persistState();
    });
    content.appendChild(customSelect);
  }

  if (family.id === 'special') {
    const explainSelect = document.createElement('select');
    explainSelect.className = 'chip-select';
    explainSelect.setAttribute('aria-label', 'Explícamelo como si');
    explainRoles.forEach((role) => {
      const opt = document.createElement('option');
      opt.value = role;
      opt.textContent = role;
      opt.dataset.role = role;
      explainSelect.appendChild(opt);
    });
    explainSelect.addEventListener('change', () => {
      uiState.explainRole = explainSelect.value;
      persistState();
    });
    content.appendChild(explainSelect);
  }

  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', String(!expanded));
    content.style.display = expanded ? 'none' : 'grid';
    header.querySelector('span').textContent = expanded ? '▸' : '▾';
  });

  return wrapper;
}

function toggleChip(family, item, chipElement) {
  const isActive = chipElement.getAttribute('aria-pressed') === 'true';
  if (family.multi) {
    chipElement.setAttribute('aria-pressed', String(!isActive));
    const current = new Set(uiState.selectedChips[family.id] || []);
    if (isActive) {
      current.delete(item.id);
    } else {
      current.add(item.id);
    }
    uiState.selectedChips[family.id] = Array.from(current);
  } else {
    const group = chipElement.parentElement;
    group.querySelectorAll('.chip').forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
    chipElement.setAttribute('aria-pressed', String(!isActive));
    uiState.selectedChips[family.id] = !isActive ? [item.id] : [];
  }
  persistState();
}

function renderChips() {
  const container = document.getElementById('chips-container');
  container.innerHTML = '';
  chipFamilies.forEach((family) => {
    const accordion = createAccordion(family);
    container.appendChild(accordion);
  });
}

function persistState() {
  localStorage.setItem('simplify_chips', JSON.stringify(uiState.selectedChips));
  localStorage.setItem('simplify_culturalize', String(uiState.culturalize));
  localStorage.setItem('simplify_role', uiState.explainRole);
}

function restoreState() {
  try {
    const savedChips = JSON.parse(localStorage.getItem('simplify_chips') || '{}');
    uiState.selectedChips = savedChips;
    const savedCult = localStorage.getItem('simplify_culturalize');
    uiState.culturalize = savedCult === 'true';
    const savedRole = localStorage.getItem('simplify_role');
    if (savedRole && explainRoles.includes(savedRole)) {
      uiState.explainRole = savedRole;
    }
  } catch (err) {
    console.warn('No state to restore', err);
  }
}

function hydrateChips() {
  Object.entries(uiState.selectedChips).forEach(([familyId, items]) => {
    const accordion = document.querySelector(`.accordion[data-family="${familyId}"]`);
    if (!accordion) return;
    items.forEach((itemId) => {
      const chip = accordion.querySelector(`.chip[data-id="${itemId}"]`);
      if (chip) {
        chip.setAttribute('aria-pressed', 'true');
      }
      if (familyId === 'translate') {
        const select = accordion.querySelector('select');
        if (select && !['en', 'es', 'fr', 'de'].includes(itemId)) {
          select.value = itemId;
        }
      }
    });
  });
  const culturalizeSwitch = document.getElementById('culturalize-switch');
  culturalizeSwitch.checked = uiState.culturalize;
  const specialSelect = document.querySelector('.accordion[data-family="special"] select.chip-select');
  if (specialSelect) {
    specialSelect.value = uiState.explainRole;
  }
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function setupTextarea() {
  const textarea = document.getElementById('user-text');
  textarea.addEventListener('input', () => {
    autoResize(textarea);
    localStorage.setItem('simplify_text', textarea.value);
  });
  textarea.addEventListener('dragover', (event) => {
    event.preventDefault();
    textarea.classList.add('dragging');
  });
  textarea.addEventListener('dragleave', () => textarea.classList.remove('dragging'));
  textarea.addEventListener('drop', handleDrop);
  const savedText = localStorage.getItem('simplify_text');
  if (savedText) {
    textarea.value = savedText;
    autoResize(textarea);
  }
  textarea.addEventListener('change', () => {
    localStorage.setItem('simplify_text', textarea.value);
  });
}

async function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  const textarea = document.getElementById('user-text');
  textarea.classList.remove('dragging');
  if (!file) return;
  if (file.type !== 'application/pdf') {
    const text = await file.text();
    textarea.value = text.slice(0, 4000);
    autoResize(textarea);
    localStorage.setItem('simplify_text', textarea.value);
    showToast('Texto cargado.');
    return;
  }
  if (file.size <= 1024 * 1024) {
    const arrayBuffer = await file.arrayBuffer();
    if (window.pdfjsLib) {
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str).join(' ');
        fullText += `${strings}\n`;
      }
      textarea.value = fullText.trim().slice(0, 4000);
      autoResize(textarea);
      localStorage.setItem('simplify_text', textarea.value);
      showToast('PDF importado.');
      return;
    }
  }
  const base64 = await fileToBase64(file);
  uiState.pdfPayload = {
    name: file.name,
    size: file.size,
    base64
  };
  showToast('PDF listo para enviar.');
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = typeof result === 'string' ? result.split(',').pop() : '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

function buildPrompt({ text, langTarget, culturalize, chips }) {
  const sanitizedText = (text || '').trim().slice(0, 4000) || 'El usuario no proporcionó texto. Trabaja con instrucciones.';
  const tasks = [];
  const outputs = [];

  const languageName = getLanguageName(langTarget);
  tasks.push(`Responde en ${languageName} (${langTarget}).`);
  if (chips.translate && chips.translate.length) {
    tasks.push(`Traduce al ${languageName}. ${culturalize ? `Localiza referencias, unidades y tono para ${languageName}.` : 'Mantén equivalencias culturales neutrales.'}`);
    outputs.push({ id: 'translation', label: `Traducción (${languageName})` });
  }

  if (chips.summarize && chips.summarize.length) {
    const summarizeMap = {
      ultra_brief: { label: 'Resumen ultra breve', instruction: 'Resume el texto en una sola frase contundente.' },
      bullet_points: { label: 'Puntos clave', instruction: 'Expón los puntos clave en viñetas claras.' },
      for_kids: { label: 'Resumen para niños', instruction: 'Explica el texto con vocabulario accesible para un niño de 9 años.' },
      expert_tone: { label: 'Resumen experto', instruction: 'Resume con tono analítico experto destacando implicaciones.' }
    };
    const selected = summarizeMap[chips.summarize[0]];
    if (selected) {
      tasks.push(selected.instruction);
      outputs.push({ id: 'summary', label: selected.label });
    }
  }

  if (chips.rewrite && chips.rewrite.length) {
    const rewriteMap = {
      clearer: { label: 'Versión clara', instruction: 'Reescribe con máxima claridad y estructura lógica.' },
      shorter: { label: 'Versión corta', instruction: 'Reduce la extensión manteniendo el significado esencial.' },
      formal: { label: 'Versión formal', instruction: 'Adopta un tono formal y profesional.' },
      convincing: { label: 'Versión persuasiva', instruction: 'Adopta un tono convincente orientado a la acción.' },
      creative: { label: 'Versión creativa', instruction: 'Incorpora creatividad, metáforas suaves y ritmo atractivo.' }
    };
    const selected = rewriteMap[chips.rewrite[0]];
    if (selected) {
      tasks.push(selected.instruction);
      outputs.push({ id: `rewrite_${chips.rewrite[0]}`, label: selected.label });
    }
  }

  if (chips.seo && chips.seo.length) {
    const seoMap = {
      meta_description: { label: 'Meta descripción', instruction: 'Redacta una meta descripción ≤160 caracteres, incluye CTA suave.' },
      seo_title: { label: 'Título SEO', instruction: 'Genera un título SEO ≤60 caracteres, altamente clicable.' },
      short_ad: { label: 'Anuncio corto', instruction: 'Crea un anuncio breve con beneficio principal y CTA.' },
      email_copy: { label: 'Copy de email', instruction: 'Redacta un email con saludo cálido, cuerpo persuasivo y despedida.' },
      social_post: { label: 'Post social', instruction: 'Genera un post adaptable a LinkedIn/Instagram con tono inspirador.' }
    };
    const selected = seoMap[chips.seo[0]];
    if (selected) {
      tasks.push(selected.instruction);
      outputs.push({ id: `seo_${chips.seo[0]}`, label: selected.label });
    }
  }

  if (chips.legal && chips.legal.length) {
    const legalMap = {
      simple_contract: { label: 'Contrato simple', instruction: 'Crea un contrato sencillo con cláusulas numeradas y lenguaje claro.' },
      privacy_policy: { label: 'Política de privacidad', instruction: 'Redacta una política de privacidad clara con secciones estándar.' },
      legal_notice: { label: 'Aviso legal', instruction: 'Genera un aviso legal con responsabilidades, jurisdicción y contacto.' },
      lawyer_tone: { label: 'Versión jurídica', instruction: 'Utiliza tono jurídico técnico y referencias normativas generales.' },
      easy_tone: { label: 'Versión accesible', instruction: 'Explica los puntos legales en lenguaje sencillo y directo.' }
    };
    const selected = legalMap[chips.legal[0]];
    if (selected) {
      tasks.push(selected.instruction);
      outputs.push({ id: `legal_${chips.legal[0]}`, label: selected.label });
    }
  }

  if (chips.creative && chips.creative.length) {
    const creativeMap = {
      poem: { label: 'Poema', instruction: 'Transforma el texto en un poema armonioso.' },
      rap: { label: 'Rap', instruction: 'Convierte el contenido en rap con rimas internas y ritmo marcado.' },
      short_story: { label: 'Cuento corto', instruction: 'Crea un cuento corto con inicio, nudo y desenlace.' },
      joke: { label: 'Versión humorística', instruction: 'Genera una versión humorística con remate final.' },
      shakespeare: { label: 'Estilo clásico', instruction: 'Emula el estilo de Shakespeare/Cervantes con lenguaje arcaico.' }
    };
    const selected = creativeMap[chips.creative[0]];
    if (selected) {
      tasks.push(selected.instruction);
      outputs.push({ id: `creative_${chips.creative[0]}`, label: selected.label });
    }
  }

  if (chips.documents && chips.documents.length) {
    const documentsMap = {
      pdf_summarize: { label: 'Resumen de PDF', instruction: 'Integra hallazgos clave del PDF y ofrece resumen estructurado.' },
      export_docx: { label: 'Preparado para DOCX', instruction: 'Estructura el contenido con encabezados y listas aptas para DOCX.' },
      export_pdf: { label: 'Preparado para PDF', instruction: 'Organiza el contenido con títulos y subtítulos listos para PDF.' }
    };
    chips.documents.forEach((docId) => {
      const selected = documentsMap[docId];
      if (selected) {
        tasks.push(selected.instruction);
        if (!outputs.find((out) => out.id === `documents_${docId}`)) {
          outputs.push({ id: `documents_${docId}`, label: selected.label });
        }
      }
    });
  }

  if (chips.special && chips.special.length) {
    const specialMap = {
      make_prompt: { label: 'Prompt reutilizable', instruction: 'Genera un prompt listo para usar con roles, pasos, entradas esperadas y ejemplo.' },
      make_viral: { label: 'Plan viral', instruction: 'Sugiere estrategias para hacerlo viral en redes sociales.' },
      focus_goal: { label: 'Enfocado al objetivo', instruction: 'Adapta el contenido al objetivo principal indicado por el usuario.' },
      explain_like: { label: `Explicación como ${uiState.explainRole}`, instruction: `Explica con metáforas y vocabulario de ${uiState.explainRole}, extensión 120-200 palabras.` },
      guide: { label: 'Guía paso a paso', instruction: 'Entrega pasos numerados y una checklist final.' },
      faq: { label: 'Preguntas frecuentes', instruction: 'Crea entre 5 y 10 preguntas frecuentes con respuestas breves.' },
      exam: { label: 'Resumen tipo examen', instruction: 'Formula 10 preguntas tipo test y lista respuestas correctas al final.' },
      tweet: { label: 'Tweet', instruction: 'Redacta un tweet ≤280 caracteres con hashtags pertinentes.' },
      thread: { label: 'Hilo de Twitter', instruction: 'Genera un hilo de 5 tweets numerados y coherentes.' }
    };
    chips.special.forEach((specialId) => {
      const selected = specialMap[specialId];
      if (selected) {
        tasks.push(selected.instruction);
        outputs.push({ id: `special_${specialId}`, label: selected.label });
      }
    });
  }

  if (!outputs.length) {
    outputs.push({ id: 'default', label: 'Resultado' });
    tasks.push('Mejora el texto, corrige estilo y ofrece versión optimizada.');
  }

  const culturalNote = culturalize
    ? `Adapta referencias culturales, unidades, nombres propios y ejemplos al contexto de ${languageName}.`
    : 'Mantén referencias universales salvo que el texto indique lo contrario.';

  const prompt = `SYSTEM: Eres un asistente de escritura y traducción conciso, claro y situado culturalmente cuando se solicita. Responde en el idioma de salida indicado y formatea según el modo.\n` +
    `USER:\n` +
    `Texto base:\n<<<\n${sanitizedText}\n>>>\n` +
    `Contexto adicional: ${culturalNote}\n` +
    `Instrucciones específicas:\n- ${tasks.join('\n- ')}\n` +
    `Entrega la respuesta en formato JSON válido exactamente con la forma {"ok":true,"outputs":[{"label":"Nombre Pestaña","content":"texto"},...]}.\n` +
    `Las claves label deben corresponder a: ${outputs.map((o) => o.label).join(', ')}. Si no hay contenido para alguna etiqueta, omítela. El campo content debe respetar el modo solicitado.`;

  return { prompt, outputs };
}

function selectTab(index) {
  const tabs = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach((tab, i) => {
    const isActive = i === index;
    tab.setAttribute('aria-selected', String(isActive));
    tab.classList.toggle('active', isActive);
    panels[i].classList.toggle('active', isActive);
  });
}

function renderResults(outputs) {
  uiState.promptOutputs = outputs;
  const tabsContainer = document.getElementById('result-tabs');
  const panelsContainer = document.getElementById('result-panels');
  tabsContainer.innerHTML = '';
  panelsContainer.innerHTML = '';
  outputs.forEach((item, index) => {
    const tab = document.createElement('button');
    tab.className = 'tab-button';
    tab.textContent = item.label;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.addEventListener('click', () => selectTab(index));
    tabsContainer.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = `tab-panel${index === 0 ? ' active' : ''}`;
    panel.textContent = item.content;
    panelsContainer.appendChild(panel);
  });
}

function getActiveResult() {
  const activeIndex = Array.from(document.querySelectorAll('.tab-button')).findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
  return uiState.promptOutputs[activeIndex] || uiState.promptOutputs[0];
}

async function callApi(payload) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error ${res.status}`);
  }
  return res.json();
}

async function onGenerate() {
  const textarea = document.getElementById('user-text');
  const generateBtn = document.getElementById('generate-btn');
  const loader = document.getElementById('loader');
  generateBtn.disabled = true;
  loader.hidden = false;
  try {
    const { prompt, outputs } = buildPrompt({
      text: textarea.value,
      langTarget: uiState.langTarget,
      culturalize: uiState.culturalize,
      chips: uiState.selectedChips
    });

    const body = {
      text: textarea.value,
      prompt,
      mode: 'compose',
      langTarget: uiState.langTarget,
      culturalize: uiState.culturalize,
      chips: uiState.selectedChips,
      expectedOutputs: outputs,
      maxTokens: 800,
      pdf: uiState.pdfPayload
    };

    const data = await callApi(body);
    if (data.ok && data.result && Array.isArray(data.result.outputs)) {
      renderResults(data.result.outputs);
      showToast('Hecho.');
    } else {
      throw new Error('Respuesta incompleta de la IA.');
    }
  } catch (error) {
    console.error(error);
    const message = error.message && error.message.includes('429')
      ? 'Demasiadas solicitudes. Intenta nuevamente en unos segundos.'
      : (error.message || 'Algo salió mal, inténtalo otra vez.');
    showToast(message);
  } finally {
    generateBtn.disabled = false;
    loader.hidden = true;
  }
}

function onClear() {
  const textarea = document.getElementById('user-text');
  textarea.value = '';
  autoResize(textarea);
  uiState.pdfPayload = null;
  localStorage.removeItem('simplify_text');
  showToast('Listo.');
}

function copyResult() {
  const active = getActiveResult();
  if (!active) return;
  navigator.clipboard.writeText(active.content).then(() => {
    showToast('Copiado.');
  });
}

async function exportDocx() {
  const active = getActiveResult();
  if (!active || !window.docx) return;
  const doc = new window.docx.Document({
    sections: [
      {
        children: [
          new window.docx.Paragraph({ text: active.label, heading: window.docx.HeadingLevel.HEADING_1 }),
          ...active.content.split('\n').map((line) => new window.docx.Paragraph(line))
        ]
      }
    ]
  });
  const blob = await window.docx.Packer.toBlob(doc);
  saveBlob(blob, `${slugify(active.label)}.docx`);
}

async function exportPdf() {
  const active = getActiveResult();
  if (!active || !window.jspdf) return;
  const doc = new window.jspdf.jsPDF();
  const lines = doc.splitTextToSize(`${active.label}\n\n${active.content}`, 180);
  doc.text(lines, 15, 20);
  doc.save(`${slugify(active.label)}.pdf`);
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').slice(0, 40) || 'resultado';
}

function saveBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function setupActions() {
  document.getElementById('generate-btn').addEventListener('click', onGenerate);
  document.getElementById('clear-btn').addEventListener('click', onClear);
  document.getElementById('copy-btn').addEventListener('click', copyResult);
  document.getElementById('export-docx').addEventListener('click', exportDocx);
  document.getElementById('export-pdf').addEventListener('click', exportPdf);
  const culturalizeSwitch = document.getElementById('culturalize-switch');
  culturalizeSwitch.addEventListener('change', () => {
    uiState.culturalize = culturalizeSwitch.checked;
    persistState();
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  restoreState();
  renderLanguageSelect();
  await initI18n();
  renderChips();
  hydrateChips();
  setupTextarea();
  setupActions();
  renderResults([{ label: 'Resultado', content: '' }]);
});
