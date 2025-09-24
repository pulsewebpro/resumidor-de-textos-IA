(() => {
  const ADMIN_KEY = 'ADMIN';

  function setAdmin(on) {
    if (on) localStorage.setItem(ADMIN_KEY, 'on');
    else localStorage.removeItem(ADMIN_KEY);
    window.SIMPLIFY_IS_ADMIN = on === true;
    window.dispatchEvent(new Event('admin:toggle'));
  }

  try {
    const q = new URLSearchParams(location.search);
    if (q.get('admin') === 'on') setAdmin(true);
    if (q.get('admin') === 'off') setAdmin(false);
  } catch {}

  if (!window.SIMPLIFY_IS_ADMIN) {
    window.SIMPLIFY_IS_ADMIN = localStorage.getItem(ADMIN_KEY) === 'on';
  }

  document.addEventListener('keydown', (e) => {
    const k = e.key?.toLowerCase();
    if (e.ctrlKey && e.altKey && k === 'a') {
      const isAdmin = localStorage.getItem(ADMIN_KEY) === 'on';
      setAdmin(!isAdmin);
    }
  });

  window.__simplifyAdmin = {
    enable: () => setAdmin(true),
    disable: () => setAdmin(false),
    isAdmin: () => localStorage.getItem(ADMIN_KEY) === 'on'
  };
})();
