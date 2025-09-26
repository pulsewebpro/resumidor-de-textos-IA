const GLOBAL_KEY = '__SIMPLIFY_WALLET__';

function getStore() {
  if (!globalThis[GLOBAL_KEY]) {
    globalThis[GLOBAL_KEY] = new Map();
  }
  return globalThis[GLOBAL_KEY];
}

export function getWallet(userId) {
  const store = getStore();
  if (!userId) return { plan: 'free', credits: 3 };
  if (!store.has(userId)) {
    store.set(userId, { plan: 'free', credits: 3, updatedAt: Date.now() });
  }
  const value = store.get(userId);
  return { plan: value.plan, credits: value.credits, updatedAt: value.updatedAt };
}

export function setWallet(userId, nextState) {
  if (!userId) return;
  const store = getStore();
  const current = getWallet(userId);
  const merged = {
    ...current,
    ...nextState,
    updatedAt: Date.now()
  };
  store.set(userId, merged);
  return merged;
}

export function adjustCredits(userId, delta) {
  const wallet = getWallet(userId);
  const credits = Math.max(0, wallet.credits + delta);
  return setWallet(userId, { credits });
}

export function resetForSubscription(userId) {
  return setWallet(userId, { plan: 'sub', credits: 9999 });
}

export function ensureWallet(userId) {
  return getWallet(userId);
}
