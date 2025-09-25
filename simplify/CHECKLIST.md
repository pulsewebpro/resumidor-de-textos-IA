# Simplify Launch Checklist

- [x] `vercel.json` rewrites for `/api/*` and SPA fallback.
- [x] `/api/health`, `/api/ai`, `/api/checkout`, `/api/stripe-webhook` upgraded to ESM + CORS + stable JSON (AI fallback when no key).
- [x] Stripe plans aligned (`one`, `pack10`, `sub`) with success/cancel URLs and webhook credit logging.
- [x] Premium SPA UI: avatar header, calculator chips, accessible tabs with focus states, aria-live feedback.
- [x] 3 free uses via `localStorage`, unlimited when `?admin=on` or admin toggle.
- [x] User modal with stored email, credits, “Gestionar plan” CTA.
- [x] Admin panel (Ctrl+Alt+A / `?admin=on`) with reset credits, force language, dark/light toggle, export logs stub.
- [x] i18n loader with 50+ locales, English fallback, updated `en`/`es` bundles.
- [x] SEO basics (`<title>`, meta description, OG/Twitter tags, `robots.txt`, `sitemap.xml`).
- [x] Accessibility AA sweep: focus-visible controls, keyboard tabs, high-contrast theme support.
- [x] Added `.env.example`, `QA_DEPLOY.md`, and deployment instructions.
