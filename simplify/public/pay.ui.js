(() => {
  const WALLET_KEY = 'SIMPLIFY_WALLET';
  const USER_KEY = 'SIMPLIFY_USER_ID';

  const $ = (id) => document.getElementById(id);
  const usesLeft = $('uses-left');
  const payTitle = $('pay-title');
  const buttons = Array.from(document.querySelectorAll('#pay-panel [data-plan]'));

  buttons.forEach((btn) => {
    btn.type = 'button';
  });

  function decodeWallet(token) {
    if (!token) return null;
    try {
      const [, payload] = token.split('.');
      if (!payload) return null;
      const str = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(str);
    } catch (error) {
      return null;
    }
  }

  function getWallet() {
    const token = localStorage.getItem(WALLET_KEY);
    return decodeWallet(token);
  }

  function ensureUserId() {
    let id = localStorage.getItem(USER_KEY);
    if (!id) {
      const rnd = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `u_${Date.now()}_${Math.random().toString(16).slice(2,8)}`;
      id = rnd;
      localStorage.setItem(USER_KEY, id);
    }
    window.__simplifyUserId = id;
    return id;
  }

  ensureUserId();

  function render(wallet) {
    if (!usesLeft) return;
    if (!wallet) {
      usesLeft.textContent = '—';
      return;
    }
    if (wallet.plan === 'sub' || wallet.uses == null) {
      usesLeft.textContent = '∞';
    } else {
      usesLeft.textContent = String(Math.max(0, Number(wallet.uses || 0)));
    }
    if (payTitle) {
      const existing = payTitle.querySelector('.badge-admin');
      if (wallet.uses == null) {
        if (!existing) {
          const span = document.createElement('span');
          span.className = 'badge-admin';
          span.textContent = 'ADMIN';
          span.style.cssText = 'margin-left:8px;padding:2px 6px;border-radius:999px;background:#1d4ed8;color:#fff;font-weight:700;font-size:11px;vertical-align:middle;';
          payTitle.appendChild(span);
        }
      } else if (existing) {
        existing.remove();
      }
    }
  }

  render(getWallet());

  window.addEventListener('wallet:update', (event) => {
    render(event.detail || getWallet());
  });

  function setBusy(button, busy) {
    if (!button) return;
    if (busy) button.setAttribute('disabled', 'disabled');
    else button.removeAttribute('disabled');
  }

  async function startCheckout(plan, button) {
    if (!plan) return;
    const userId = ensureUserId();
    setBusy(button, true);
    try {
      const payload = {
        walletUserId: userId,
        requestId: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `req_${Date.now()}`
      };
      const res = await fetch(`/api/checkout?plan=${encodeURIComponent(plan)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-user': userId
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok || !data?.url) {
        window.dispatchEvent(new CustomEvent('wallet:error', { detail: { code: data?.code || 'CHECKOUT_ERROR' } }));
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      window.dispatchEvent(new CustomEvent('wallet:error', { detail: { code: 'CHECKOUT_ERROR' } }));
    } finally {
      setBusy(button, false);
    }
  }

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const plan = button.getAttribute('data-plan');
      startCheckout(plan, button);
    });
  });
})();
