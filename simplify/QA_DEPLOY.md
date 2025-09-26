# QA Deploy — Simplify AI v1.3

## Checklist funcional
- [x] Hero cinematográfico con CTA animada, avatar y selector de idioma.
- [x] Textarea `#input` operativo con estados de foco accesibles.
- [x] Botón `#btn-generate` ejecuta generación con streaming visible en `#result` (aria-live).
- [x] Chips `.chip` con `data-action="grupo:clave"` y envío completo a `/api/ai`.
- [x] Créditos en localStorage (`simplify_credits`) inicializados a 3 y decremento tras uso.
- [x] Modo admin (`?admin=on` o Ctrl+Alt+A) sin consumo de créditos y acceso a `#btn-health`.
- [x] Sección de planes (`data-plan`) conectada a `/api/checkout` y portal gestionado desde `#btn-manage-plan`.
- [x] `/api/wallet` refleja plan y créditos; `/api/stripe-webhook` actualiza store en memoria.
- [x] Modal usuario `#user-modal` con role="dialog" y cierre por `Esc`.
- [x] i18n dinámico (ES/EN/FR) con fallback a EN y persistencia en `simplify_lang`.
- [x] Feature flags (`window.FEATURES`) ocultan elementos con `data-feature`.
- [x] SEO listo: meta title/description, OG tags, `robots.txt`, `sitemap.xml`, footer legal.

## Checklist accesibilidad
- [x] Contraste >4.5:1 en texto principal y botones.
- [x] Foco visible 2px cian en elementos interactivos.
- [x] `#result` con `aria-live="polite"` y modal accesible (`tabindex="-1"`).
- [x] Navegación por teclado mantiene orden lógico.

## QA API
- [x] `/api/ai` devuelve JSON válido `{ ok:true, outputs:[...] }` con streaming y fallback sin clave OpenAI.
- [x] `/api/health` responde con estado, uptime y flags.
- [x] `/api/checkout`, `/api/wallet`, `/api/portal`, `/api/stripe-webhook` manejan flujo completo (mock in-memory).

## Observaciones
- Fallback creativo/legal garantiza respuesta coherente cuando no hay clave OpenAI.
- Store de créditos en memoria se reinicia por despliegue (comportamiento aceptado en serverless).
