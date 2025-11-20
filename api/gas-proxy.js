export default async function handler(req, res) {
  const url = process.env.VITE_GAS_URL;

  try {
    const response = await fetch(url + req.url.replace("/api/gas", ""), {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
