import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// --- Admin mode siempre activado ---
let ADMIN_MODE = true;

// Health
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "simplify", ts: Date.now(), admin: ADMIN_MODE });
});

// Toggle admin (opcional: http://localhost:5500/api/toggle-admin)
app.get("/api/toggle-admin", (_req, res) => {
  ADMIN_MODE = !ADMIN_MODE;
  res.json({ ok: true, admin: ADMIN_MODE });
});

// AI (mock local)
app.post("/api/ai", (req, res) => {
  const raw = req.body || {};
  const input =
    (raw.text ||
      raw.input ||
      (Array.isArray(raw.prompt) && raw.prompt[0]?.content) ||
      "").toString().trim();

  if (!input) {
    return res.json({
      ok: true,
      admin: ADMIN_MODE,
      outputs: [{ label: "Aviso", content: "Escribe un texto y pulsa Generar." }],
    });
  }

  const tldr = (input.split(/[.!?]\s/)[0] || input).slice(0, 180);
  const bullets =
    input.split(/\n+/).filter(Boolean).slice(0, 5).map((x) => "• " + x).join("\n") ||
    "• Sin puntos destacados.";

  res.json({
    ok: true,
    admin: ADMIN_MODE,
    outputs: [
      { label: "TL;DR", content: tldr.endsWith(".") ? tldr : tldr + "." },
      { label: "Puntos clave", content: bullets },
    ],
  });
});

// estáticos
app.use(express.static("public"));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`✅ Dev server con Admin ON => http://localhost:${PORT}`);
});
