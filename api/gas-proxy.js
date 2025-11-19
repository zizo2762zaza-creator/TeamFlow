export default async function handler(req, res) {
  try {
    const GAS_URL = process.env.GAS_URL;

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body || {})
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ ok: false, error: "proxy_failed" });
  }
}
