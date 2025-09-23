(() => {
  const k = 'simplify_uses';
  const isAdmin = window.SIMPLIFY_IS_ADMIN === true || localStorage.getItem('simplify_admin') === '1';
  const max = Number(window.SIMPLIFY_MAX_FREE || 3);
  const get = () => Number(localStorage.getItem(k) || 0);
  const left = () => Math.max(0, max - get());
  const L = (window.SIMPLIFY_PAYLINKS || {});
  const $ = (id) => document.getElementById(id);

  // Enlaces Stripe (fallback a /legal/checkout.html)
  const one  = $('pay-one');  if (one)  one.href  = L.ONE    || '/legal/checkout.html';
  const pack = $('pay-pack'); if (pack) pack.href = L.PACK10 || '/legal/checkout.html';
  const sub  = $('pay-sub');  if (sub)  sub.href  = L.SUB    || '/legal/checkout.html';

  // Contador visible
  const usesLeft = $('uses-left');
  const upd = () => {
    if (!usesLeft) return;
    if (isAdmin || !Number.isFinite(max)) {
      usesLeft.textContent = '∞';
    } else {
      usesLeft.textContent = `${left()}/${max}`;
    }
  };
  upd();
  window.addEventListener('ai:used', upd);

  // Badge Admin junto al título (opcional)
  const title = document.getElementById('pay-title');
  if (title && (isAdmin || !Number.isFinite(max))) {
    const b = document.createElement('span');
    b.textContent = 'ADMIN';
    b.style.cssText = 'margin-left:8px;padding:2px 6px;border-radius:999px;background:#1d4ed8;color:#fff;font-weight:700;font-size:11px;vertical-align:middle;';
    title.appendChild(b);
  }
})();
