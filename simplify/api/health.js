export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ ok: false, message: 'Method not allowed' });
}
