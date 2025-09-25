# Quick tests

## Producción (2025-09-25)

- `curl -i -s https://simplify.pulsewebpro.com/api/health`
  - `HTTP/1.1 403 Forbidden`
- `curl -i -s -H "Origin: https://simplify.pulsewebpro.com" -H "X-Anon-Id: test123" https://simplify.pulsewebpro.com/api/wallet`
  - `HTTP/1.1 403 Forbidden`
- `curl -i -s -X POST https://simplify.pulsewebpro.com/api/checkout -H "Origin: https://simplify.pulsewebpro.com" -H "Content-Type: application/json" -H "X-Anon-Id: test123" -d '{"plan":"one"}'`
  - `HTTP/1.1 403 Forbidden`
- `curl -i -s -X POST https://simplify.pulsewebpro.com/api/stripe-webhook -H "Content-Type: application/json" -d '{"type":"checkout.session.completed"}'`
  - `HTTP/1.1 403 Forbidden`
