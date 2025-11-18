// /api/gas-proxy.js
// Vercel Serverless function: يقوم بعمل proxy لكل طلبات API إلى Google Apps Script (GAS)
// يحميك من CORS لأن المتصفح يتصل الآن إلى نفس النطاق (Vercel).

const https = require('https');

const GAS_BASE = process.env.GAS_URL || 'https://script.google.com/macros/s/AKfycbywXNM6aisDcxRHMbKihH-zjU7tad99tT70a7hk4Le5eCpAjWt6DGGzW2Te9uulQ30A3g/exec';

function forwardRequest(url, method, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + (u.search || ''),
      method: method || 'POST',
      headers: headers || {}
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });

    req.on('error', (e) => reject(e));

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

module.exports = async (req, res) => {
  try {
    // Allow CORS from your front-end (Vercel will be same origin in prod).
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    // Build target URL: forward query string if present
    const qs = req.url && req.url.split('?')[1] ? '?' + req.url.split('?')[1] : '';
    const targetUrl = GAS_BASE + qs;

    // Forward headers: keep content-type
    const headers = {
      'Content-Type': req.headers['content-type'] || 'application/json'
    };

    // If you want to forward cookies or auth, include here (careful)
    const body = req.body && typeof req.body === 'string' ? req.body : (req.rawBody ? req.rawBody : JSON.stringify(req.body || {}));

    const result = await forwardRequest(targetUrl, req.method, headers, body);

    // Mirror status and body
    res.status(result.status || 200);
    // Copy relevant headers from GAS (not all)
    if (result.headers && result.headers['content-type']) {
      res.setHeader('Content-Type', result.headers['content-type']);
    } else {
      res.setHeader('Content-Type', 'application/json');
    }
    res.send(result.body);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ ok: false, error: 'proxy_error', details: String(err) });
  }
};
