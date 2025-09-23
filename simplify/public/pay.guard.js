(() => {
  const USES_KEY = 'simplify_uses';
  const ADMIN_KEY = 'simplify_admin';

  // Activación por URL: ?admin=on | ?admin=off
  try {
    const q = new URLSearchParams(location.search);
    if (q.get('admin') === 'on')  localStorage.setItem(ADMIN_KEY, '1');
    if (q.get('admin') === 'off') localStorage.removeItem(ADMIN_KEY);
  } catch {}

  const isAdmin = localStorage.getItem(ADMIN_KEY) === '1';
  // Hacemos visibles estas señales para otros scripts
  window.SIMPLIFY_IS_ADMIN = isAdmin;
  window.SIMPLIFY_MAX_FREE = isAdmin ? Infinity : (window.SIMPLIFY_MAX_FREE || 3);

  // Helper para reset desde consola
  window.__simplifyReset = () => localStorage.setItem(USES_KEY, '0');

  // Atajo rápido: Ctrl+Alt+A -> toggle admin y recarga
  document.addEventListener('keydown', (e) => {
    const k = e.key?.toLowerCase();
    if (e.ctrlKey && e.altKey && k === 'a') {
      if (localStorage.getItem(ADMIN_KEY) === '1') localStorage.removeItem(ADMIN_KEY);
      else localStorage.setItem(ADMIN_KEY, '1');
      location.reload();
    }
  });
})();
