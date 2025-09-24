(() => {
  const WALLET_KEY = 'SIMPLIFY_WALLET';
  const USER_KEY = 'SIMPLIFY_USER_ID';
  const ADMIN_KEY = 'ADMIN';
  const LANG_KEY = 'SIMPLIFY_LANG';
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
    fallback: {}
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const tabBtns = ['#tabbtn-res', '#tabbtn-json', '#tabbtn-raw'].map((id) => $(id));
  const panes = ['#tab-res', '#tab-json', '#tab-raw'].map((id) => $(id));
  const loadingEl = $('#loading');
  const langSelect = $('#lang-select');
  const modal = $('#purchase-modal');
  const modalClose = $('#modal-close');
  const modalPlans = $('#modal-go-plans');

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

  function setWalletToken(token) {
    if (token) {
      localStorage.setItem(WALLET_KEY, token);
    }
    const wallet = decodeWallet(token);
    state.wallet = wallet;
    window.__simplifyWalletState = wallet;
    window.dispatchEvent(new CustomEvent('wallet:update', { detail: wallet }));
  }

  function getWalletToken() {
    return localStorage.getItem(WALLET_KEY);
  }

  function isAdmin() {
    return localStorage.getItem(ADMIN_KEY) === 'on';
  }

  function getUsesLabel() {
    const wallet = state.wallet;
    if (!wallet) return '—';
    if (wallet.plan === 'sub' || wallet.uses == null) return '∞';
    return String(Math.max(0, Number(wallet.uses || 0)));
  }

  function translate(key, vars) {
    const dict = state.translations[key] ?? state.fallback[key];
    if (!dict) return key;
    return dict.replace(/\{(\w+)\}/g, (_, name) => {
      return (vars && typeof vars[name] !== 'undefined') ? String(vars[name]) : `{${name}}`;
    });
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
      const html = translate(key, { uses: `<strong id="uses-left">${getUsesLabel()}</strong>` });
      if (html) el.innerHTML = html;
    });
    if (langSelect) {
      langSelect.value = state.locale;
    }
    // re-emit wallet update so dynamic elements (uses-left) refresh
    window.dispatchEvent(new CustomEvent('wallet:update', { detail: state.wallet }));
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
      panes.forEach((pane) => { if (pane) pane.hidden = true; });
    } else {
      loadingEl.hidden = true;
    }
  }

  function setTab(idx) {
    tabBtns.forEach((btn, i) => {
      if (!btn) return;
      const selected = i === idx;
      btn.setAttribute('aria-selected', String(selected));
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

  function ensureWalletEventListeners() {
    if (!modal) return;
    modal.addEventListener('click', (event) => {
      if (event.target === modal) hideModal();
    });
    modalClose?.addEventListener('click', () => hideModal());
    modalPlans?.addEventListener('click', () => {
      hideModal();
      $('#pay-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.hidden) {
        hideModal();
      }
    });
  }

  async function refreshWallet() {
    ensureUserId();
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
      }
    } catch (error) {
      console.warn('[simplify] wallet-init error', error?.message || error);
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
    const token = getWalletToken();
    if (!token) {
      await refreshWallet();
    }
    const authToken = getWalletToken();
    if (!authToken) {
      showModal();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'x-wallet-user': window.__simplifyUserId || ensureUserId()
        },
        body: JSON.stringify({ prompt: messages, maxTokens })
      });
      const raw = await res.text();
      const newToken = res.headers.get('x-simplify-token');
      let json = null;
      try { json = JSON.parse(raw); } catch (error) {}

      if (newToken) {
        setWalletToken(newToken);
      } else if (json?.token) {
        setWalletToken(json.token);
      }

      if (!res.ok) {
        const code = json?.code || 'ERROR';
        handleAiError(code);
        setLoading(false);
        if (panes[0]) {
          if (code === 'NO_CREDITS') panes[0].textContent = translate('toast.nocredits');
          else if (code === 'ENV_MISSING') panes[0].textContent = translate('toast.envmissing');
          else panes[0].textContent = json?.message || 'Error al generar.';
        }
        setTab(0);
        return;
      }

      const content = json?.outputs?.[0]?.content ?? raw;
      if (panes[0]) panes[0].textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      if (panes[1]) panes[1].textContent = json ? JSON.stringify(json, null, 2) : '(no JSON)';
      if (panes[2]) panes[2].textContent = raw;
      setLoading(false);
      setTab(0);
    } catch (error) {
      setLoading(false);
      panes[0] && (panes[0].textContent = 'Error al generar.');
      setTab(0);
    }
  }

  window.simplifyCallAI = callAI;

  async function init() {
    ensureUserId();
    await initI18n();
    ensureWalletEventListeners();
    await refreshWallet();

    setTab(0);

    const textarea = $('#input');
    $('#btn-gen')?.addEventListener('click', () => {
      const text = (textarea?.value || '').trim();
      callAI([{ role: 'user', content: text || 'Escribe un texto arriba.' }], 320);
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
    });

    window.addEventListener('admin:toggle', () => {
      refreshWallet();
    });

    window.addEventListener('wallet:error', handleWalletError);
    window.addEventListener('focus', () => {
      refreshWallet();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
