export default function handler(req, res) {
  const ts = new Date().toISOString();
  res.status(200).json({
    ok: true,
    service: "simplify",
    ts,
    admin: true,
    routes: {
      normal: "/",
      admin: "/?admin=on",
      status: "/api/health"
    },
    msg: "Simplify API online, modo admin activo ⚡"
  });
}
