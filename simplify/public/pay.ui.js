(() => {
  const k='simplify_uses';
  const max = Number(window.SIMPLIFY_MAX_FREE||3);
  const get = ()=>Number(localStorage.getItem(k)||0);
  const left = ()=>Math.max(0, max-get());
  const L = (window.SIMPLIFY_PAYLINKS||{});
  const $ = id => document.getElementById(id);

  // Enlaces Stripe
  const one  = $('pay-one');  if(one)  one.href  = L.ONE   || '/legal/checkout.html';
  const pack = $('pay-pack'); if(pack) pack.href = L.PACK10|| '/legal/checkout.html';
  const sub  = $('pay-sub');  if(sub)  sub.href  = L.SUB   || '/legal/checkout.html';

  // Contador visible
  const usesLeft = $('uses-left');
  const upd = ()=>{ if(usesLeft) usesLeft.textContent = `${left()}/${max}`; };
  upd();
  window.addEventListener('ai:used', upd);
})();
