export default function handler(req, res) {
  const now = new Date();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    service: 'simplify-ai',
    ts: now.toISOString(),
    uptime: process.uptime?.() ?? null,
    adminHint: 'Toggle with ?admin=on or Ctrl+Alt+A',
    features: {
      DOC_UPLOAD: Boolean(process.env.FEATURE_DOC_UPLOAD) || false,
      EXPORT_DOCX: Boolean(process.env.FEATURE_EXPORT_DOCX) || false,
      EXPORT_PDF: Boolean(process.env.FEATURE_EXPORT_PDF) || false,
      SOCIAL_POSTS: process.env.FEATURE_SOCIAL_POSTS !== 'false'
    }
  });
}
