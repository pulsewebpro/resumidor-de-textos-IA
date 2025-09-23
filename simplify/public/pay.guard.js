(() => {
  const USES_KEY = 'simplify_uses';
  const ADMIN_KEY = 'simplify_admin';

  // Toggle por URL
  try {
    const q = new URLSearchParams(location.search);
    if (q.get('admin') === 'on')  localStorage.setItem(ADMIN_KEY, '1');
    if (q.get('admin') === 'off') localStorage.removeItem(ADMIN_KEY);
  } catch {}

  const isAdmin = localStorage.getItem(ADMIN_KEY) === '1';
  window.SIMPLIFY_IS_ADMIN = isAdmin;
  window.SIMPLIFY_MAX_FREE = isAdmin ? Infinity : (window.SIMPLIFY_MAX_FREE || 3);

  // Reset rápido desde consola
  window.__simplifyReset = () => localStorage.setItem(USES_KEY, '0');

  // Atajo: Ctrl+Alt+A  -> alterna admin y recarga
  document.addEventListener('keydown', (e) => {
    const k = e.key?.toLowerCase();
    if (e.ctrlKey && e.altKey && k === 'a') {
      if (localStorage.getItem(ADMIN_KEY) === '1') localStorage.removeItem(ADMIN_KEY);
      else localStorage.setItem(ADMIN_KEY, '1');
      location.reload();
    }
  });
})();
