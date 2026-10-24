const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const root = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 3000);
const securityCode = process.env.AMAP_SECURITY_CODE || '';
const amapKey = process.env.AMAP_JS_API_KEY || '';
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/health') { res.writeHead(200, {'content-type':'text/plain'}); return res.end('ok'); }
  if (url.pathname === '/amap-config.js') {
    if (!amapKey) { res.writeHead(503, {'content-type':'text/plain'}); return res.end('AMAP_JS_API_KEY is not configured'); }
    res.writeHead(200, {'content-type':'application/javascript; charset=utf-8','cache-control':'no-store'});
    return res.end(`window.AMAP_KEY=${JSON.stringify(amapKey)};window._AMapSecurityConfig={serviceHost:location.origin+'/_AMapService'};`);
  }
  if (url.pathname.startsWith('/_AMapService/')) {
    if (!securityCode) { res.writeHead(503, {'content-type':'text/plain'}); return res.end('AMAP_SECURITY_CODE is not configured'); }
    const upstreamPath = url.pathname.slice('/_AMapService'.length);
    if (!/^\/(v3|v4|v5)\/[a-zA-Z0-9_./-]+$/.test(upstreamPath)) { res.writeHead(404); return res.end('Not found'); }
    const query = new URLSearchParams(url.searchParams); query.set('jscode', securityCode);
    try {
      const upstream = await fetch(`https://restapi.amap.com${upstreamPath}?${query}`, {headers:{accept:req.headers.accept || '*/*'}});
      res.writeHead(upstream.status, {'content-type':upstream.headers.get('content-type') || 'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':req.headers.origin || '*'});
      return res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch { res.writeHead(502, {'content-type':'text/plain'}); return res.end('Map service unavailable'); }
  }
  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const file = path.resolve(root, `.${requested}`);
  if (!file.startsWith(root + path.sep) && file !== path.join(root,'index.html')) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, body) => {
    if (err) { res.writeHead(404, {'content-type':'text/plain'}); return res.end('Not found'); }
    res.writeHead(200, {'content-type':mime[path.extname(file)] || 'application/octet-stream','x-content-type-options':'nosniff'}); res.end(body);
  });
}).listen(port, '0.0.0.0', () => console.log(`Hong Kong food trip server listening on ${port}`));
