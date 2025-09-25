# QA & Deploy – Simplify

## Pre-flight
- [ ] Install dependencies (`npm install`) locally if needed.
- [ ] ⚠️ Configure environment variables in Vercel project:
  - `OPENAI_API_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_ONESHOT`
  - `STRIPE_PRICE_PACK10`
  - `STRIPE_PRICE_SUBS`
  - `STRIPE_WEBHOOK_SECRET`
  - `SIMPLIFY_JWT_SECRET`
  - `CORS_ORIGIN` (e.g. `https://simplify.pulsewebpro.com`)
- [ ] ⚠️ In Stripe dashboard, create test prices matching the price IDs above and link them to the project.
- [ ] ⚠️ Point the Stripe webhook to `https://simplify.pulsewebpro.com/api/stripe-webhook` (test mode) with the secret set above.

## API smoke test
- [ ] `curl -i https://simplify.pulsewebpro.com/api/health` → `200` with `{ ok: true }`.
- [ ] `curl -i -X OPTIONS https://simplify.pulsewebpro.com/api/ai` → `204` and correct CORS headers.
- [ ] `curl -i https://simplify.pulsewebpro.com/api/ai` without body → should return fallback `{ ok:true, outputs:[...] }` when `OPENAI_API_KEY` missing.
- [ ] `curl -i -X POST https://simplify.pulsewebpro.com/api/checkout?plan=one` with JSON body `{ "walletUserId": "test" }` using Stripe test key → `200` and `url` points to Stripe Checkout.
- [ ] ⚠️ Trigger Stripe test webhook event (`checkout.session.completed`) and confirm Vercel logs show `{ ok: true }` from `/api/stripe-webhook`.

## Front-end QA
- [ ] Load `https://simplify.pulsewebpro.com` → verify hero avatar, premium layout, visible focus outlines.
- [ ] Confirm `localStorage` grants exactly 3 free runs: after three clicks on “Generar” the purchase modal appears; `?admin=on` unlocks infinite credits.
- [ ] Tabs (Resultado/JSON/Raw) switch via mouse and keyboard arrows; `aria-live` updates announce result.
- [ ] Open the user modal (button “Usuario”): email persists in localStorage, credits count updates after each run, “Gestionar plan” scrolls to pricing.
- [ ] Activate admin panel (`?admin=on` or `Ctrl+Alt+A`) → panel appears, can reset créditos, force idioma, toggle dark/light, export logs (stub alert + console).
- [ ] Switch language selector and ensure >50 locales listed with English fallback where missing.
- [ ] Validate AA contrast with browser devtools (Result cards, buttons, tabs) in light & dark themes.
- [ ] Run Lighthouse (desktop) → Performance, Accessibility, Best Practices, SEO ≥ 90. Capture scores for the PR note.

## Payments
- [ ] ⚠️ Perform Stripe test Checkout for `plan=one`, `plan=pack10`, `plan=sub`. Each success should redirect to `/?paid=1` and webhook adds credits (see logs).
- [ ] ⚠️ Cancel a Checkout to ensure redirect to `/?canceled=1` with no credits consumed.

## Deployment
- [ ] ⚠️ Trigger production deployment in Vercel (ensure `rootDirectory` is `simplify`).
- [ ] After deploy, re-run the smoke tests above against production alias `https://simplify.pulsewebpro.com`.
- [ ] Document final Lighthouse results and Stripe test receipts in the PR description.
