const STORAGE = {
  uid: 'simplify_uid',
  token: 'simplify_set',
  lang: 'simplify_lang',
  admin: 'simplify_admin'
};

const SUPPORTED_LANGS = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  sv: 'Svenska',
  da: 'Dansk',
  no: 'Norsk',
  fi: 'Suomi',
  pl: 'Polski',
  cs: 'Čeština',
  ro: 'Română',
  hu: 'Magyar',
  el: 'Ελληνικά',
  tr: 'Türkçe',
  ar: 'العربية',
  he: 'עברית',
  ru: 'Русский',
  uk: 'Українська',
  bg: 'Български',
  hr: 'Hrvatski',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  sr: 'Српски',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  et: 'Eesti',
  ga: 'Gaeilge',
  cy: 'Cymraeg',
  eu: 'Euskara',
  gl: 'Galego',
  ca: 'Català',
  af: 'Afrikaans',
  sw: 'Kiswahili',
  zu: 'isiZulu',
  xh: 'isiXhosa',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  fil: 'Filipino',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  ml: 'മലയാളം',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  pa: 'ਪੰਜਾਬੀ',
  ur: 'اردو',
  fa: 'فارسی',
  zh: '中文',
  ja: '日本語',
  ko: '한국어'
};

const CHIP_GROUPS = [
  {
    title: 'Summaries',
    chips: [
      { label: 'Ultra brief', mode: 'resumir_ultrabreve' },
      { label: 'Key bullet points', mode: 'resumir_puntos' },
      { label: 'Explain for kids', mode: 'resumir_ninos' },
      { label: 'Expert tone', mode: 'resumir_experto' }
    ]
  },
  {
    title: 'Translate',
    chips: [
      { label: 'To English', mode: 'traducir_en' },
      { label: 'To French', mode: 'traducir_fr' },
      { label: 'To German', mode: 'traducir_de' },
      {
        label: 'Choose language',
        mode: 'traducir_selector',
        action: async () => {
          const target = askForLanguage();
          if (!target) return;
          await selectModeAndCall('traducir_selector', { target });
        }
      },
      {
        label: 'Cultural adaptation',
        mode: 'traducir_adaptar',
        action: async () => {
          const target = askForRegion();
          if (!target) return;
          await selectModeAndCall('traducir_adaptar', { target });
        }
      }
    ]
  },
  {
    title: 'Rewrite',
    chips: [
      { label: 'Clearer version', mode: 'reescribir_claro' },
      { label: 'Shorter version', mode: 'reescribir_corto' },
      { label: 'More formal', mode: 'reescribir_formal' },
      { label: 'More persuasive', mode: 'reescribir_convincente' },
      { label: 'More creative', mode: 'reescribir_creativo' }
    ]
  },
  {
    title: 'SEO / Marketing',
    chips: [
      { label: 'Meta description', mode: 'seo_meta' },
      { label: 'SEO title', mode: 'seo_titulo' },
      { label: 'Ad copy', mode: 'seo_anuncio' },
      { label: 'Email copy', mode: 'seo_email' },
      { label: 'Social post', mode: 'seo_social_post' }
    ]
  },
  {
    title: 'Legal & Formal',
    chips: [
      { label: 'Simple contract', mode: 'legal_contrato_simple' },
      { label: 'Privacy policy', mode: 'legal_privacidad' },
      { label: 'Legal notice', mode: 'legal_aviso' },
      { label: 'Lawyer tone', mode: 'legal_tono_abogado' },
      { label: 'Plain language', mode: 'legal_tono_facil' }
    ]
  },
  {
    title: 'Creative',
    chips: [
      { label: 'Poem', mode: 'creativo_poema' },
      { label: 'Rap song', mode: 'creativo_rap' },
      { label: 'Short story', mode: 'creativo_cuento' },
      { label: 'Humour', mode: 'creativo_chiste' },
      { label: 'Classic style', mode: 'creativo_clasico' }
    ]
  },
  {
    title: 'Documents',
    chips: [
      {
        label: 'Summarise PDF',
        mode: 'documentos_resumir_pdf',
        action: async () => {
          triggerPdfSelection();
        }
      }
    ]
  },
  {
    title: 'Special 🤖',
    chips: [
      { label: 'Build my prompt', mode: 'especial_prompt' },
      { label: 'Make it viral', mode: 'especial_viral' },
      {
        label: 'Focus on my goal',
        mode: 'especial_objetivo',
        action: async () => {
          const goal = askForGoal();
          if (!goal) return;
          await selectModeAndCall('especial_objetivo', { goal });
        }
      },
      {
        label: 'Explain as…',
        mode: 'especial_roles',
        action: async () => {
          const role = askForRole();
          if (!role) return;
          await selectModeAndCall('especial_roles', { role });
        }
      },
      { label: 'Turn into a business', mode: 'especial_negocio' },
      { label: 'Add a fun twist', mode: 'especial_divertido' },
      { label: 'Make it professional', mode: 'especial_profesional' },
      { label: 'Global neutral tone', mode: 'especial_mundial' }
    ]
  },
  {
    title: 'Extras',
    chips: [
      { label: 'Step-by-step guide', mode: 'extra_guia' },
      { label: 'FAQ list', mode: 'extra_faq' },
      { label: 'Exam-style quiz', mode: 'extra_examen' },
      { label: 'Tweet', mode: 'extra_tweet' },
      { label: '5-tweet thread', mode: 'extra_hilo5' }
    ]
  }
];

const state = {
  locale: 'en',
  translations: {},
  wallet: { uses: 0, plan: 'free', exp: null, uid: null },
  token: null,
  admin: false,
  lastText: '',
  lastJson: null,
  lastRaw: '',
  isLoading: false
};

const elements = {
  input: document.getElementById('input'),
  langSelect: document.getElementById('lang-select'),
  walletCount: document.getElementById('wallet-count'),
  walletPlan: document.getElementById('wallet-plan'),
  status: document.getElementById('status-banner'),
  loader: document.getElementById('loader'),
  panelResult: document.getElementById('panel-result'),
  panelJson: document.getElementById('panel-json'),
  panelRaw: document.getElementById('panel-raw'),
  pdfInput: document.getElementById('pdf-input'),
  pdfButton: document.getElementById('pdf-upload'),
  adminBanner: document.getElementById('admin-banner'),
  copyButton: document.getElementById('copy-result'),
  docxButton: document.getElementById('export-docx'),
  pdfExportButton: document.getElementById('export-pdf'),
  buyOne: document.getElementById('buy-one'),
  buyTen: document.getElementById('buy-ten'),
  buySub: document.getElementById('buy-sub'),
  chipsGrid: document.getElementById('chips-grid')
};

const tabs = [
  { button: document.getElementById('tab-result'), panel: document.getElementById('panel-result') },
  { button: document.getElementById('tab-json'), panel: document.getElementById('panel-json') },
  { button: document.getElementById('tab-raw'), panel: document.getElementById('panel-raw') }
];

function t(path, fallback = '') {
  if (!path) return fallback;
  const parts = path.split('.');
  let ref = state.translations;
  for (const part of parts) {
    if (ref && Object.prototype.hasOwnProperty.call(ref, part)) {
      ref = ref[part];
    } else {
      return fallback;
    }
  }
  return typeof ref === 'string' ? ref : fallback;
}

function ensureUid() {
  try {
    let uid = localStorage.getItem(STORAGE.uid);
    if (!uid) {
      uid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(STORAGE.uid, uid);
    }
    state.wallet.uid = uid;
    return uid;
  } catch (error) {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function getStoredToken() {
  if (state.token) return state.token;
  try {
    const stored = localStorage.getItem(STORAGE.token);
    if (stored) {
      state.token = stored;
    }
    return stored || null;
  } catch (error) {
    return null;
  }
}

function decodeSet(token) {
  try {
    const [payload] = token.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    const json = atob(normalized + pad);
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

function applyToken(token) {
  if (!token) return;
  state.token = token;
  try {
    localStorage.setItem(STORAGE.token, token);
  } catch (error) {
    // ignore storage errors (private browsing)
  }
  const payload = decodeSet(token);
  if (payload) {
    state.wallet.uses = typeof payload.uses === 'number' ? payload.uses : null;
    state.wallet.plan = payload.plan;
    state.wallet.exp = payload.exp || null;
    state.wallet.uid = payload.uid || state.wallet.uid;
  }
  updateBalanceUI();
}

function planLabel(plan) {
  const map = {
    free: t('wallet.plan_free', 'Free trial'),
    one: t('wallet.plan_one', 'Single add-on'),
    pack10: t('wallet.plan_pack10', '10-pack'),
    sub: t('wallet.plan_sub', 'Subscription')
  };
  return map[plan] || '';
}

function formatExp(exp) {
  if (!exp) return '';
  try {
    const date = new Date(exp);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(state.locale || 'en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return '';
  }
}

function updateBalanceUI() {
  const uses = state.wallet.uses;
  const count = uses === null ? t('wallet.infinite', '∞') : String(Math.max(0, uses ?? 0));
  if (elements.walletCount) {
    elements.walletCount.textContent = count;
  }
  if (elements.walletPlan) {
    const label = planLabel(state.wallet.plan);
    const exp = formatExp(state.wallet.exp);
    elements.walletPlan.textContent = exp ? `${label} · ${exp}` : label;
  }
  updateChipAvailability();
}

function setStatus(message = '', type = 'info') {
  if (!elements.status) return;
  if (!message) {
    elements.status.hidden = true;
    elements.status.textContent = '';
    elements.status.className = 'status';
    return;
  }
  elements.status.hidden = false;
  elements.status.textContent = message;
  elements.status.className = `status status-${type}`;
}

function setLoading(isLoading) {
  state.isLoading = isLoading;
  if (elements.loader) {
    elements.loader.hidden = !isLoading;
  }
  updateChipAvailability();
}

function updateChipAvailability() {
  const disableForWallet = !state.admin && typeof state.wallet.uses === 'number' && state.wallet.uses <= 0;
  const disable = state.isLoading || disableForWallet;
  const buttons = elements.chipsGrid?.querySelectorAll('.chip-button') || [];
  buttons.forEach(btn => {
    btn.disabled = disable;
  });
  if (elements.pdfButton) {
    elements.pdfButton.disabled = disable;
  }
}

function renderOutputs(text, json, raw) {
  state.lastText = text || '';
  state.lastJson = json || null;
  state.lastRaw = raw || '';
  if (elements.panelResult) {
    elements.panelResult.textContent = state.lastText;
  }
  if (elements.panelJson) {
    elements.panelJson.textContent = json ? JSON.stringify(json, null, 2) : '';
  }
  if (elements.panelRaw) {
    elements.panelRaw.textContent = raw || '';
  }
  setTab(0, false);
}

function setTab(index, focusPanel = true) {
  tabs.forEach((item, i) => {
    const selected = i === index;
    item.button?.setAttribute('aria-selected', String(selected));
    if (item.panel) {
      item.panel.hidden = !selected;
      item.panel.tabIndex = selected ? 0 : -1;
      if (selected && focusPanel) {
        setTimeout(() => item.panel?.focus(), 0);
      }
    }
  });
}

function setupTabs() {
  tabs.forEach((item, index) => {
    item.button?.addEventListener('click', () => setTab(index, false));
    item.button?.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const dir = event.key === 'ArrowRight' ? 1 : -1;
        const next = (index + dir + tabs.length) % tabs.length;
        tabs[next].button?.focus();
      }
    });
  });
  setTab(0, false);
}

function renderChips() {
  if (!elements.chipsGrid) return;
  elements.chipsGrid.innerHTML = '';
  CHIP_GROUPS.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'chip-group';
    const title = document.createElement('p');
    title.className = 'chip-title';
    title.textContent = group.title;
    groupEl.appendChild(title);
    const wrap = document.createElement('div');
    wrap.className = 'chip-buttons';
    group.chips.forEach(chip => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip-button';
      button.textContent = chip.label;
      button.dataset.mode = chip.mode;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', async () => {
        await onChipClick(chip, button);
      });
      wrap.appendChild(button);
    });
    groupEl.appendChild(wrap);
    elements.chipsGrid.appendChild(groupEl);
  });
  updateChipAvailability();
}

async function onChipClick(chip, button) {
  if (state.isLoading) return;
  if (chip.mode !== 'documentos_resumir_pdf') {
    const value = elements.input?.value.trim();
    if (!value) {
      setStatus(t('status.no_text', 'Enter some text first.'), 'warning');
      elements.input?.focus();
      return;
    }
  }
  button.setAttribute('aria-pressed', 'true');
  try {
    if (typeof chip.action === 'function') {
      await chip.action(button);
    } else {
      await selectModeAndCall(chip.mode);
    }
  } finally {
    setTimeout(() => button.setAttribute('aria-pressed', 'false'), 400);
  }
}

function askForLanguage() {
  const promptText = t('prompts.language', 'Target language (code or name)');
  const answer = window.prompt(promptText, 'en');
  if (!answer) return null;
  const lookup = answer.trim().toLowerCase();
  if (!lookup) return null;
  if (SUPPORTED_LANGS[lookup]) return lookup;
  const match = Object.entries(SUPPORTED_LANGS).find(([code, label]) => label.toLowerCase().includes(lookup));
  return match ? match[0] : lookup.slice(0, 16);
}

function askForRegion() {
  const promptText = t('prompts.region', 'Which region or market should we adapt to?');
  const answer = window.prompt(promptText, 'Mexico');
  return answer ? answer.trim() : null;
}

function askForGoal() {
  const promptText = t('prompts.goal', 'What goal should we focus on?');
  const answer = window.prompt(promptText, 'increase sign-ups');
  return answer ? answer.trim() : null;
}

function askForRole() {
  const promptText = t('prompts.role', 'Explain it as…');
  const answer = window.prompt(promptText, 'a teacher');
  return answer ? answer.trim() : null;
}

async function selectModeAndCall(mode, extra = undefined) {
  if (mode !== 'documentos_resumir_pdf') {
    const value = elements.input?.value.trim();
    if (!value) {
      setStatus(t('status.no_text', 'Enter some text first.'), 'warning');
      elements.input?.focus();
      return;
    }
    await callAI({ input: value, mode, extra });
  }
}

async function callAI(payload) {
  try {
    await ensureWallet();
  } catch (error) {
    setStatus(t('status.network_error', 'Network error. Try again.'), 'error');
    return;
  }
  const token = getStoredToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  setLoading(true);
  setStatus(t('status.loading', 'Generating…'), 'info');
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    const raw = await response.text();
    let data = null;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      data = null;
    }
    if (response.status === 402 || data?.error === 'NO_CREDITS') {
      updateWalletFromResponse(response, data);
      setStatus(t('blocked', "You're out of credits. Buy a pack to continue."), 'warning');
      renderOutputs('', data, raw);
      return;
    }
    if (!response.ok || !data?.ok) {
      updateWalletFromResponse(response, data);
      setStatus(t('status.network_error', 'Network error. Try again.'), 'error');
      renderOutputs('', data, raw);
      return;
    }
    updateWalletFromResponse(response, data);
    const content = data.outputs?.[0]?.content || '';
    renderOutputs(content, data, raw);
    setStatus(t('status.ready', 'Ready'), 'success');
  } catch (error) {
    setStatus(t('status.network_error', 'Network error. Try again.'), 'error');
  } finally {
    setLoading(false);
  }
}

function updateWalletFromResponse(response, data) {
  const headerToken = response.headers.get('x-simplify-set');
  if (headerToken) {
    applyToken(headerToken);
    return;
  }
  if (data?.wallet) {
    state.wallet.uses = typeof data.wallet.uses === 'number' ? data.wallet.uses : null;
    state.wallet.plan = data.wallet.plan;
    state.wallet.exp = data.wallet.exp || null;
    state.wallet.uid = data.wallet.uid || state.wallet.uid;
    updateBalanceUI();
  }
}

function triggerPdfSelection() {
  if (!elements.pdfInput) return;
  elements.pdfInput.value = '';
  elements.pdfInput.click();
}

async function processPdf(file) {
  if (!file) return;
  if (!window.pdfjsLib) {
    setStatus(t('status.pdf_error', "We couldn't extract text from that PDF."), 'error');
    return;
  }
  setStatus(t('status.pdf_loading', 'Reading PDF…'), 'info');
  try {
    if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const buffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
    let combined = '';
    const maxPages = Math.min(pdf.numPages, 40);
    for (let i = 1; i <= maxPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map(item => item.str || '').join(' ');
      combined += `${text}\n\n`;
    }
    const clean = combined.replace(/\s+/g, ' ').trim();
    if (!clean) {
      setStatus(t('status.pdf_error', "We couldn't extract text from that PDF."), 'error');
      return;
    }
    const truncated = clean.slice(0, 15000);
    if (elements.input) {
      elements.input.value = truncated.slice(0, 10000);
    }
    await callAI({ input: truncated, mode: 'documentos_resumir_pdf' });
  } catch (error) {
    setStatus(t('status.pdf_error', "We couldn't extract text from that PDF."), 'error');
  }
}

async function exportDocx() {
  if (!state.lastText) {
    setStatus(t('status.no_text', 'Enter some text first.'), 'warning');
    return;
  }
  if (!window.docx) {
    setStatus('DOCX export unavailable.', 'error');
    return;
  }
  const paragraphs = state.lastText.split(/\n+/).map(line => new window.docx.Paragraph({
    children: [new window.docx.TextRun({ text: line })]
  }));
  const doc = new window.docx.Document({
    sections: [
      {
        properties: {},
        children: paragraphs.length ? paragraphs : [new window.docx.Paragraph('')]
      }
    ]
  });
  const blob = await window.docx.Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'simplify-output.docx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  setStatus(t('status.ready', 'Ready'), 'success');
}

function exportPdf() {
  if (!state.lastText) {
    setStatus(t('status.no_text', 'Enter some text first.'), 'warning');
    return;
  }
  if (!window.jspdf || !window.jspdf.jsPDF) {
    setStatus('PDF export unavailable.', 'error');
    return;
  }
  const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
  const lines = doc.splitTextToSize(state.lastText, 500);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(lines, 40, 60);
  doc.save('simplify-output.pdf');
  setStatus(t('status.ready', 'Ready'), 'success');
}

async function copyResult() {
  if (!state.lastText) {
    setStatus(t('status.no_text', 'Enter some text first.'), 'warning');
    return;
  }
  try {
    await navigator.clipboard.writeText(state.lastText);
    setStatus(t('status.copied', 'Copied!'), 'success');
  } catch (error) {
    setStatus(t('status.copy_error', 'Unable to copy.'), 'error');
  }
}

async function ensureWallet() {
  const uid = ensureUid();
  const headers = { 'Content-Type': 'application/json' };
  const existingToken = getStoredToken();
  if (existingToken) {
    headers.Authorization = `Bearer ${existingToken}`;
  }
  const response = await fetch('/api/wallet-init', {
    method: 'POST',
    headers,
    body: JSON.stringify({ uid })
  });
  if (!response.ok) throw new Error('wallet');
  const data = await response.json().catch(() => null);
  const headerToken = response.headers.get('x-simplify-set');
  if (headerToken) {
    applyToken(headerToken);
  } else if (data?.wallet) {
    state.wallet.uses = typeof data.wallet.uses === 'number' ? data.wallet.uses : null;
    state.wallet.plan = data.wallet.plan;
    state.wallet.exp = data.wallet.exp || null;
    state.wallet.uid = data.wallet.uid || uid;
    updateBalanceUI();
  }
}

async function buy(plan) {
  try {
    await ensureWallet();
    const uid = state.wallet.uid || ensureUid();
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, uid })
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.url) {
      setStatus(t('status.network_error', 'Network error. Try again.'), 'error');
      return;
    }
    window.location.href = data.url;
  } catch (error) {
    setStatus(t('status.network_error', 'Network error. Try again.'), 'error');
  }
}

async function handleCheckoutReturn() {
  const url = new URL(window.location.href);
  const success = url.searchParams.get('success');
  const cancelled = url.searchParams.get('cancelled');
  const sessionId = url.searchParams.get('session_id');
  if (success === 'true' && sessionId) {
    setStatus(t('status.loading', 'Generating…'), 'info');
    try {
      const headers = {};
      const token = getStoredToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`/api/claim?session_id=${encodeURIComponent(sessionId)}`, {
        method: 'GET',
        headers
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setStatus(t('status.purchase_fail', "We couldn't validate the purchase."), 'error');
      } else {
        updateWalletFromResponse(response, data);
        setStatus(t('status.wallet_updated', 'Wallet updated.'), 'success');
      }
    } catch (error) {
      setStatus(t('status.purchase_fail', "We couldn't validate the purchase."), 'error');
    }
  } else if (cancelled === 'true') {
    setStatus(t('status.checkout_cancelled', 'Checkout cancelled.'), 'warning');
  }
  if (success || cancelled) {
    url.searchParams.delete('success');
    url.searchParams.delete('cancelled');
    url.searchParams.delete('session_id');
    window.history.replaceState({}, '', url.toString());
  }
}

async function loadLocale(lang) {
  const res = await fetch(`./locales/${lang}.json`);
  if (!res.ok) throw new Error('locale');
  return res.json();
}

async function setLocale(lang) {
  const code = SUPPORTED_LANGS[lang] ? lang : 'en';
  try {
    const data = await loadLocale(code);
    state.locale = code;
    state.translations = data;
    try {
      localStorage.setItem(STORAGE.lang, code);
    } catch (error) {
      // ignore
    }
    applyTranslations();
    populateLanguageSelector();
    updateBalanceUI();
  } catch (error) {
    if (code !== 'en') {
      await setLocale('en');
    }
  }
}

function applyTranslations() {
  document.title = t('title', 'Simplify — AI Text Tools');
  document.documentElement.lang = state.locale;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key, null);
    if (text) el.textContent = text;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key, null);
    if (text) el.setAttribute('placeholder', text);
  });
  [elements.buyOne, elements.buyTen, elements.buySub].forEach(btn => {
    if (btn) {
      btn.setAttribute('aria-label', btn.textContent.trim());
    }
  });
}

function populateLanguageSelector() {
  if (!elements.langSelect) return;
  const entries = Object.entries(SUPPORTED_LANGS).sort((a, b) => a[1].localeCompare(b[1], state.locale || 'en', { sensitivity: 'base' }));
  elements.langSelect.innerHTML = '';
  entries.forEach(([code, label]) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = `${label} (${code})`;
    elements.langSelect.appendChild(option);
  });
  elements.langSelect.value = state.locale;
}

function initAdmin() {
  const stored = (() => {
    try {
      return localStorage.getItem(STORAGE.admin);
    } catch (error) {
      return null;
    }
  })();
  const params = new URL(window.location.href).searchParams;
  const param = params.get('admin');
  if (param === 'on') {
    setAdminMode(true);
  } else if (param === 'off') {
    setAdminMode(false);
  } else if (stored === '1') {
    setAdminMode(true);
  }
  window.addEventListener('keydown', event => {
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      setAdminMode(!state.admin);
      setStatus(state.admin ? t('admin', 'Admin mode active') : t('status.ready', 'Ready'), state.admin ? 'success' : 'info');
    }
  });
}

function setAdminMode(enabled) {
  state.admin = Boolean(enabled);
  if (state.admin) {
    try {
      localStorage.setItem(STORAGE.admin, '1');
    } catch (error) {
      // ignore
    }
    if (elements.adminBanner) elements.adminBanner.hidden = false;
  } else {
    try {
      localStorage.removeItem(STORAGE.admin);
    } catch (error) {
      // ignore
    }
    if (elements.adminBanner) elements.adminBanner.hidden = true;
  }
  updateChipAvailability();
}

function setupEventListeners() {
  elements.langSelect?.addEventListener('change', event => {
    const lang = event.target.value;
    setLocale(lang);
  });
  elements.pdfButton?.addEventListener('click', () => triggerPdfSelection());
  elements.pdfInput?.addEventListener('change', async event => {
    const file = event.target.files?.[0];
    await processPdf(file);
  });
  elements.copyButton?.addEventListener('click', copyResult);
  elements.docxButton?.addEventListener('click', exportDocx);
  elements.pdfExportButton?.addEventListener('click', exportPdf);
  elements.buyOne?.addEventListener('click', () => buy('one'));
  elements.buyTen?.addEventListener('click', () => buy('pack10'));
  elements.buySub?.addEventListener('click', () => buy('sub'));
}

async function bootstrap() {
  initAdmin();
  renderChips();
  setupTabs();
  setupEventListeners();
  const storedLang = (() => {
    try {
      return localStorage.getItem(STORAGE.lang);
    } catch (error) {
      return null;
    }
  })();
  const detected = storedLang || (navigator.language || 'en').split('-')[0].toLowerCase();
  await setLocale(detected);
  await ensureWallet().catch(() => {});
  updateBalanceUI();
  await handleCheckoutReturn();
  setStatus(t('status.ready', 'Ready'), 'success');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
