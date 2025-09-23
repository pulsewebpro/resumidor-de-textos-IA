export const CREDIT_TOPUPS = new Map();

export function addCredits(userId, credits) {
  if (!userId || !Number.isFinite(credits) || credits <= 0) return;
  const current = CREDIT_TOPUPS.get(userId) || 0;
  CREDIT_TOPUPS.set(userId, current + Math.floor(credits));
}

export function takeCredits(userId) {
  if (!userId) return 0;
  const current = CREDIT_TOPUPS.get(userId) || 0;
  CREDIT_TOPUPS.delete(userId);
  return current;
}
