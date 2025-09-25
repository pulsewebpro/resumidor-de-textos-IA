(() => {
  const WALLET_KEY = 'SIMPLIFY_WALLET';
  const USER_KEY = 'SIMPLIFY_USER_ID';
  const ADMIN_KEY = 'ADMIN';
  const LANG_KEY = 'SIMPLIFY_LANG';
  const FREE_KEY = 'SIMPLIFY_FREE_COUNT';
  const FREE_LIMIT = 3;
  const EMAIL_KEY = 'SIMPLIFY_EMAIL';
  const THEME_KEY = 'SIMPLIFY_THEME';
  const THEMES = ['light', 'dark'];
  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'sv', label: 'Svenska' },
    { code: 'da', label: 'Dansk' },
    { code: 'no', label: 'Norsk' },
    { code: 'fi', label: 'Suomi' },
    { code: 'pl', label: 'Polski' },
    { code: 'cs', label: 'Čeština' },
    { code: 'sk', label: 'Slovenčina' },
    { code: 'ro', label: 'Română' },
    { code: 'hu', label: 'Magyar' },
    { code: 'bg', label: 'Български' },
    { code: 'el', label: 'Ελληνικά' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'ar', label: 'العربية' },
    { code: 'he', label: 'עברית' },
    { code: 'ru', label: 'Русский' },
    { code: 'uk', label: 'Українська' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'ur', label: 'اردو' },
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'ms', label: 'Bahasa Melayu' },
    { code: 'th', label: 'ไทย' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'zh', label: '中文 (简体)' },
    { code: 'zh-TW', label: '中文 (繁體)' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'fa', label: 'فارسی' },
    { code: 'sr', label: 'Српски' },
    { code: 'hr', label: 'Hrvatski' },
    { code: 'sl', label: 'Slovenščina' },
    { code: 'lt', label: 'Lietuvių' },
    { code: 'lv', label: 'Latviešu' },
    { code: 'et', label: 'Eesti' },
    { code: 'fil', label: 'Filipino' },
    { code: 'ca', label: 'Català' },
    { code: 'eu', label: 'Euskara' },
    { code: 'gl', label: 'Galego' },
    { code: 'is', label: 'Íslenska' },
    { code: 'ga', label: 'Gaeilge' },
    { code: 'sq', label: 'Shqip' },
    { code: 'mk', label: 'Македонски' },
    { code: 'az', label: 'Azərbaycan dili' },
    { code: 'ka', label: 'ქართული' }
  ];

  const state = {
    wallet: null,
    locale: DEFAULT_LANG,
    translations: {},
    fallback: {},
    freeUses: FREE_LIMIT,
    email: ''
  };

  let themeListenerBound = false;
  let adminLangPopulated = false;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const tabBtns = ['#tabbtn-res', '#tabbtn-json', '#tabbtn-raw'].map((id) => $(id));
  const panes = ['#tab-res', '#tab-json', '#tab-raw'].map((id) => $(id));
  const loadingEl = $('#loading');
  const langSelect = $('#lang-select');
  const modal = $('#purchase-modal');
  const modalClose = $('#modal-close');
  const modalPlans = $('#modal-go-plans');
  const userButton = $('#user-button');
  const userModal = $('#user-modal');
  const userClose = $('#user-close');
  const userManage = $('#user-manage');
  const userEmailInput = $('#user-email');
  const userPlanEl = $('#user-plan');
  const userCreditsEl = $('#user-credits');
  const adminPanel = $('#admin-panel');
  const adminReset = $('#admin-reset');
  const adminLang = $('#admin-lang');
  const adminTheme = $('#admin-theme');
  const adminExport = $('#admin-export');
  const adminCredits = $('#admin-credits');

  function ensureUserId() {
    let id = window.__simplifyUserId || localStorage.getItem(USER_KEY);
    if (!id) {
      id = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `u_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
      localStorage.setItem(USER_KEY, id);
    }
    window.__simplifyUserId = id;
    return id;
  }

  function loadUserEmail() {
    const email = localStorage.getItem(EMAIL_KEY) || '';
    state.email = email;
    if (userEmailInput && userEmailInput.value !== email) {
      userEmailInput.value = email;
    }
    return email;
  }

  function saveUserEmail(value) {
    const cleaned = (value || '').trim();
    state.email = cleaned;
    if (cleaned) {
      localStorage.setItem(EMAIL_KEY, cleaned);
    } else {
      localStorage.removeItem(EMAIL_KEY);
    }
  }

  function decodeWallet(token) {
    if (!token) return null;
    try {
      const [, payload] = token.split('.');
      if (!payload) return null;
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
  }

  function getFreeUsedRaw() {
    const stored = Number(localStorage.getItem(FREE_KEY) || '0');
    if (!Number.isFinite(stored)) return 0;
    return Math.max(0, stored);
  }

  function setFreeUsedRaw(value) {
    const next = Math.max(0, Math.min(FREE_LIMIT, value));
    localStorage.setItem(FREE_KEY, String(next));
    return getFreeUsedRaw();
  }

  function refreshFreeUses() {
    const used = getFreeUsedRaw();
    state.freeUses = Math.max(0, FREE_LIMIT - used);
    return state.freeUses;
  }

  function markFreeUse() {
    const used = setFreeUsedRaw(getFreeUsedRaw() + 1);
    state.freeUses = Math.max(0, FREE_LIMIT - used);
    return state.freeUses;
  }

  function resetFreeUses() {
    localStorage.removeItem(FREE_KEY);
    state.freeUses = FREE_LIMIT;
    return state.freeUses;
  }

  function getFreeRemaining() {
    if (typeof state.freeUses === 'number') {
      return state.freeUses;
    }
    return refreshFreeUses();
  }

  function setWalletToken(token) {
    if (token) {
      localStorage.setItem(WALLET_KEY, token);
    }
    const wallet = decodeWallet(token);
    state.wallet = wallet;
    window.__simplifyWalletState = wallet;
    notifyWalletChange();
  }

  function getWalletToken() {
    return localStorage.getItem(WALLET_KEY);
  }

  function isAdmin() {
    return localStorage.getItem(ADMIN_KEY) === 'on';
  }

  function getEffectiveUses() {
    if (isAdmin()) return Infinity;
    const wallet = state.wallet;
    if (wallet?.plan === 'sub' || wallet?.uses == null) return Infinity;
    if (wallet?.plan === 'credits') {
      return Math.max(0, Number(wallet.uses || 0));
    }
    if (wallet?.plan === 'free' && Number.isFinite(Number(wallet.uses))) {
      return Math.max(0, Number(wallet.uses));
    }
    return getFreeRemaining();
  }

  function getUsesLabel() {
    const value = getEffectiveUses();
    if (value === Infinity) return '∞';
    if (!Number.isFinite(value)) return String(getFreeRemaining());
    return String(Math.max(0, value));
  }

  function translate(key, vars) {
    const dict = state.translations[key] ?? state.fallback[key];
    if (!dict) return key;
    return dict.replace(/\{(\w+)\}/g, (_, name) => {
      return (vars && typeof vars[name] !== 'undefined') ? String(vars[name]) : `{${name}}`;
    });
  }

  function syncWalletWithFree() {
    const remaining = getFreeRemaining();
    if (!state.wallet) {
      state.wallet = { plan: 'free', uses: remaining };
      window.__simplifyWalletState = state.wallet;
      return;
    }
    if (state.wallet.plan === 'free' && state.wallet.uses !== null) {
      state.wallet.uses = remaining;
    }
  }

  function updateCreditsDisplay() {
    const usesLabel = getUsesLabel();
    const usesEl = document.getElementById('uses-left');
    if (usesEl) usesEl.textContent = usesLabel;
    if (userCreditsEl) userCreditsEl.textContent = usesLabel;
    if (adminCredits) adminCredits.textContent = usesLabel;
  }

  function resolvePlanLabel() {
    if (isAdmin()) return translate('user.plan.admin');
    const wallet = state.wallet;
    if (wallet?.plan === 'sub') return translate('user.plan.sub');
    if (wallet?.plan === 'credits') return translate('user.plan.paid');
    return translate('user.plan.free');
  }

  function updateUserSummary() {
    if (userPlanEl) {
      userPlanEl.textContent = resolvePlanLabel();
    }
    if (userCreditsEl) {
      userCreditsEl.textContent = getUsesLabel();
    }
    if (userButton) {
      const plan = resolvePlanLabel();
      userButton.setAttribute('data-plan', plan);
    }
  }

  function notifyWalletChange() {
    syncWalletWithFree();
    updateCreditsDisplay();
    updateUserSummary();
    window.dispatchEvent(new CustomEvent('wallet:update', { detail: { wallet: state.wallet, freeUses: getFreeRemaining() } }));
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const resolved = THEMES.includes(theme) ? theme : getSystemTheme();
    document.documentElement.dataset.theme = resolved;
    localStorage.setItem(THEME_KEY, resolved);
    updateThemeControls();
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme || getSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      applyTheme(stored);
    } else {
      applyTheme(getSystemTheme());
    }
    if (!themeListenerBound && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (event) => {
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(event.matches ? 'dark' : 'light');
        }
      };
      media.addEventListener('change', listener);
      themeListenerBound = true;
    }
  }

  function updateThemeControls() {
    if (!adminTheme) return;
    const current = document.documentElement.dataset.theme || getSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    const key = next === 'dark' ? 'admin.theme.dark' : 'admin.theme.light';
    const label = translate('admin.theme', { mode: translate(key) });
    adminTheme.textContent = label;
  }

  function renderAdminPanel() {
    if (!adminPanel) return;
    const active = isAdmin();
    adminPanel.hidden = !active;
    if (active) {
      populateAdminLangSelector();
      updateCreditsDisplay();
      updateThemeControls();
    }
  }

  async function loadLocale(code) {
    const res = await fetch(`/locales/${code}/app.json`);
    if (!res.ok) throw new Error('LOCALE_NOT_FOUND');
    return res.json();
  }

  function applyTranslations() {
    document.documentElement.lang = state.locale;
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const text = translate(key);
      if (text) el.textContent = text;
    });
    $$('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key) return;
      const text = translate(key);
      if (text) el.setAttribute('placeholder', text);
    });
    $$('[data-i18n-template]').forEach((el) => {
      const key = el.getAttribute('data-i18n-template');
      if (!key) return;
      if (key === 'admin.theme') return;
      const html = translate(key, { uses: `<strong id="uses-left">${getUsesLabel()}</strong>` });
      if (html) el.innerHTML = html;
    });
    if (langSelect) {
      langSelect.value = state.locale;
    }
    updateThemeControls();
    notifyWalletChange();
    renderAdminPanel();
  }

  function populateLanguageSelector() {
    if (!langSelect) return;
    langSelect.innerHTML = '';
    SUPPORTED_LANGS.forEach(({ code, label }) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = label;
      langSelect.appendChild(option);
    });
    langSelect.value = state.locale;
    langSelect.addEventListener('change', async (event) => {
      const lang = event.target.value;
      await setLocale(lang);
    });
  }

  function populateAdminLangSelector() {
    if (!adminLang) return;
    if (!adminLangPopulated) {
      adminLang.innerHTML = '';
      SUPPORTED_LANGS.forEach(({ code, label }) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = label;
        adminLang.appendChild(option);
      });
      adminLangPopulated = true;
    }
    adminLang.value = state.locale;
  }

  function normalizeLang(code) {
    if (!code) return DEFAULT_LANG;
    const lower = code.toLowerCase();
    const direct = SUPPORTED_LANGS.find((l) => l.code.toLowerCase() === lower);
    if (direct) return direct.code;
    const short = lower.split('-')[0];
    const shortMatch = SUPPORTED_LANGS.find((l) => l.code.toLowerCase() === short);
    return shortMatch ? shortMatch.code : DEFAULT_LANG;
  }

  async function setLocale(lang) {
    const normalized = normalizeLang(lang);
    if (normalized === state.locale && Object.keys(state.translations).length) {
      localStorage.setItem(LANG_KEY, normalized);
      applyTranslations();
      return;
    }
    try {
      const data = normalized === DEFAULT_LANG ? state.fallback : await loadLocale(normalized);
      state.locale = normalized;
      state.translations = normalized === DEFAULT_LANG ? state.fallback : { ...state.fallback, ...data };
      localStorage.setItem(LANG_KEY, normalized);
      applyTranslations();
      populateAdminLangSelector();
    } catch (error) {
      console.warn('[simplify] locale load error', error?.message || error);
    }
  }

  async function initI18n() {
    try {
      const fallback = await loadLocale(DEFAULT_LANG);
      state.fallback = fallback;
      state.translations = fallback;
    } catch (error) {
      console.warn('[simplify] fallback locale missing', error?.message || error);
      state.fallback = {};
      state.translations = {};
    }
    const stored = localStorage.getItem(LANG_KEY);
    const detected = stored || normalizeLang(navigator.language || DEFAULT_LANG);
    state.locale = detected;
    populateLanguageSelector();
    await setLocale(detected);
  }

  function setLoading(active) {
    if (!loadingEl) return;
    if (active) {
      loadingEl.hidden = false;
      loadingEl.setAttribute('aria-busy', 'true');
      panes.forEach((pane) => { if (pane) pane.hidden = true; });
    } else {
      loadingEl.setAttribute('aria-busy', 'false');
      loadingEl.hidden = true;
    }
  }

  function setTab(idx) {
    tabBtns.forEach((btn, i) => {
      if (!btn) return;
      const selected = i === idx;
      btn.setAttribute('aria-selected', String(selected));
      btn.tabIndex = selected ? 0 : -1;
    });
    panes.forEach((pane, i) => {
      if (!pane) return;
      const selected = i === idx;
      pane.hidden = !selected;
      pane.tabIndex = selected ? 0 : -1;
      if (selected) pane.focus();
    });
  }

  function showModal() {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.modal__dialog')?.focus();
  }

  function hideModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
  }

  function openUserModal() {
    if (!userModal) return;
    userModal.hidden = false;
    userModal.setAttribute('aria-hidden', 'false');
    loadUserEmail();
    const dialog = userModal.querySelector('.modal__dialog');
    dialog?.focus();
    userButton?.setAttribute('aria-expanded', 'true');
  }

  function closeUserModal() {
    if (!userModal) return;
    userModal.hidden = true;
    userModal.setAttribute('aria-hidden', 'true');
    userButton?.setAttribute('aria-expanded', 'false');
  }

  function ensureWalletEventListeners() {
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) hideModal();
      });
      modalClose?.addEventListener('click', () => hideModal());
      modalPlans?.addEventListener('click', () => {
        hideModal();
        $('#pay-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (modal && !modal.hidden) hideModal();
        if (userModal && !userModal.hidden) closeUserModal();
      }
    });
    if (userModal) {
      userModal.addEventListener('click', (event) => {
        if (event.target === userModal) closeUserModal();
      });
    }
    userClose?.addEventListener('click', () => closeUserModal());
    userManage?.addEventListener('click', (event) => {
      event.preventDefault();
      closeUserModal();
      $('#pay-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    userButton?.addEventListener('click', () => openUserModal());
    userEmailInput?.addEventListener('input', (event) => {
      saveUserEmail(event.target.value);
    });
  }

  async function refreshWallet() {
    ensureUserId();
    refreshFreeUses();
    try {
      const headers = {
        'Accept': 'application/json',
        'x-wallet-user': window.__simplifyUserId
      };
      const token = getWalletToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (isAdmin()) headers['x-simplify-admin'] = 'on';
      const res = await fetch('/api/wallet-init', { headers });
      const data = await res.json().catch(() => null);
      if (data?.token) {
        setWalletToken(data.token);
        return;
      }
      syncWalletWithFree();
      notifyWalletChange();
    } catch (error) {
      console.warn('[simplify] wallet-init error', error?.message || error);
      syncWalletWithFree();
      notifyWalletChange();
    }
  }

  function handleWalletError(event) {
    const code = event?.detail?.code;
    if (code === 'ENV_MISSING') {
      alert(translate('toast.envmissing'));
    } else if (code === 'NO_CREDITS') {
      showModal();
    } else if (code === 'CHECKOUT_ERROR') {
      alert(translate('toast.checkout'));
    }
  }

  function handleAiError(code) {
    if (code === 'NO_CREDITS') {
      showModal();
    } else if (code === 'ENV_MISSING') {
      alert(translate('toast.envmissing'));
    }
  }

  async function callAI(messages, maxTokens = 500) {
    const userId = window.__simplifyUserId || ensureUserId();
    let authToken = getWalletToken();
    const adminMode = isAdmin();

    if (!authToken) {
      await refreshWallet();
      authToken = getWalletToken();
    }

    const usingWalletInitially = Boolean(authToken);
    const freeRemaining = getFreeRemaining();

    if (!usingWalletInitially && !adminMode && freeRemaining <= 0) {
      showModal();
      return;
    }

    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-wallet-user': userId
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt: messages, maxTokens, walletUserId: userId })
      });

      const raw = await res.text();
      let json = null;
      try { json = JSON.parse(raw); } catch (error) {}

      const newToken = res.headers.get('x-simplify-token') || json?.token;
      if (newToken) {
        setWalletToken(newToken);
        authToken = newToken;
      } else if (!usingWalletInitially) {
        syncWalletWithFree();
        notifyWalletChange();
      }

      if (!res.ok) {
        const code = json?.code || 'ERROR';
        handleAiError(code);
        setLoading(false);
        if (panes[0]) {
          if (code === 'NO_CREDITS') panes[0].textContent = translate('toast.nocredits');
          else if (code === 'ENV_MISSING') panes[0].textContent = translate('toast.envmissing');
          else panes[0].textContent = json?.message || translate('toast.error');
        }
        setTab(0);
        return;
      }

      const content = json?.outputs?.[0]?.content ?? raw;
      if (panes[0]) panes[0].textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      if (panes[1]) panes[1].textContent = json ? JSON.stringify(json, null, 2) : '(no JSON)';
      if (panes[2]) panes[2].textContent = raw;

      if (!authToken && !adminMode) {
        markFreeUse();
        notifyWalletChange();
      }

      setLoading(false);
      setTab(0);
    } catch (error) {
      setLoading(false);
      if (panes[0]) panes[0].textContent = translate('toast.error');
      setTab(0);
    }
  }

  window.simplifyCallAI = callAI;
  window.simplifyTranslate = translate;

  async function init() {
    ensureUserId();
    refreshFreeUses();
    loadUserEmail();
    await initI18n();
    initTheme();
    ensureWalletEventListeners();
    renderAdminPanel();
    adminLang?.addEventListener('change', (event) => {
      setLocale(event.target.value);
    });
    adminTheme?.addEventListener('click', () => toggleTheme());
    adminReset?.addEventListener('click', () => {
      resetFreeUses();
      localStorage.removeItem(WALLET_KEY);
      state.wallet = { plan: 'free', uses: FREE_LIMIT };
      notifyWalletChange();
      alert(translate('admin.reset.done'));
    });
    adminExport?.addEventListener('click', () => {
      console.info('[simplify] export logs', {
        wallet: state.wallet,
        email: state.email,
        freeUses: getFreeRemaining()
      });
      alert(translate('admin.export.ready'));
    });
    await refreshWallet();

    setTab(0);

    const textarea = $('#input');
    $('#btn-gen')?.addEventListener('click', () => {
      const text = (textarea?.value || '').trim();
      callAI([{ role: 'user', content: text || translate('chips.defaultPrompt') }], 320);
    });

    $('#btn-health')?.addEventListener('click', async () => {
      setTab(1);
      setLoading(true);
      panes[0] && (panes[0].textContent = '');
      panes[1] && (panes[1].textContent = '');
      panes[2] && (panes[2].textContent = '');
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setLoading(false);
        panes[1] && (panes[1].textContent = JSON.stringify(data, null, 2));
        setTab(1);
      } catch (error) {
        setLoading(false);
        panes[1] && (panes[1].textContent = 'Error /api/health');
      }
    });

    tabBtns.forEach((btn, idx) => {
      btn?.addEventListener('click', () => setTab(idx));
      btn?.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          const next = (idx + 1) % tabBtns.length;
          tabBtns[next]?.focus();
          setTab(next);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          const prev = (idx - 1 + tabBtns.length) % tabBtns.length;
          tabBtns[prev]?.focus();
          setTab(prev);
        }
      });
    });

    window.addEventListener('admin:toggle', () => {
      renderAdminPanel();
      refreshWallet();
    });

    window.addEventListener('wallet:error', handleWalletError);
    window.addEventListener('focus', () => {
      refreshFreeUses();
      notifyWalletChange();
      refreshWallet();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
/* === UI Premium helpers (no intrusivos) === */
(() => {
  // 1) Placeholder nuevo si está vacío/corto
  const ta = document.querySelector('textarea#input, textarea[name="input"], textarea');
  if (ta && (!ta.placeholder || ta.placeholder.length < 5)) {
    ta.placeholder = "Pega aquí tu texto… o prueba un chip abajo";
  }

  // 2) Micro-descripciones por texto aproximado
  const micro = new Map([
    ["Resumir","Condensa en 3 frases claras"],
    ["TL;DR","Condensa en 3 frases claras"],
    ["Traducir","Traduce y adapta como nativo"],
    ["Reescribir","Haz tu texto claro, corto o convincente"],
    ["SEO","Genera títulos y copys que venden"],
    ["Marketing","Genera títulos y copys que venden"],
    ["Legal","Convierte ideas en contratos o políticas"],
    ["Formal","Convierte ideas en contratos o políticas"],
    ["Creativo","Poema, rap o cuento en segundos"],
    ["Documentos","Sube PDF y resume o exporta"],
    ["Especial","Hazlo viral, negocio o experto en 1 click"]
  ]);

  const chipEls = Array.from(document.querySelectorAll('.chip, .pill, .chip__item, .qa-btn, button'));
  for (const el of chipEls) {
    const label = (el.innerText || el.textContent || "").trim();
    if (!label) continue;

    for (const [key, desc] of micro.entries()) {
      if (label.toLowerCase().includes(key.toLowerCase())) {
        const next = el.nextElementSibling;
        const already = next && next.classList && next.classList.contains('chip-sub');
        if (!already) {
          const sub = document.createElement('small');
          sub.className = 'chip-sub';
          sub.textContent = desc;
          el.after(sub);
        }
        break;
      }
    }
  }
})();
