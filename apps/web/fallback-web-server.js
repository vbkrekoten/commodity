const http = require('http');

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://commodity-api-6paf.onrender.com/api/v1';

function html(title, body) {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title}</title><style>body{font-family:Arial,sans-serif;margin:0;background:#f8fafc;color:#0f172a}.wrap{max-width:980px;margin:0 auto;padding:24px}.card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:12px}a{color:#1d4ed8;text-decoration:none}.muted{color:#64748b}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}</style></head><body><div class="wrap">${body}</div></body></html>`;
}

const routes = [
  '/', '/markets', '/prices', '/indices', '/how-to-start', '/docs', '/support', '/news', '/about', '/search',
  '/cabinet', '/cabinet/login', '/cabinet/register', '/cabinet/onboarding', '/cabinet/org', '/cabinet/org/users',
  '/cabinet/otc-deals', '/cabinet/reports', '/cabinet/api-keys', '/cabinet/notifications', '/cabinet/support/tickets', '/cabinet/audit-log',
  '/cabinet/admin/organizations', '/cabinet/admin/markets', '/cabinet/admin/docs', '/cabinet/admin/news', '/cabinet/admin/tickets', '/cabinet/admin/audit',
];

function page(path) {
  const links = routes.map((r) => `<a href="${r}">${r}</a>`).join('<br/>');
  if (path === '/robots.txt') return { type: 'text/plain', body: 'User-agent: *\nAllow: /\n' };
  if (path === '/sitemap.xml') return { type: 'application/xml', body: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r)=>`<url><loc>https://commodity-web-d66u.onrender.com${r}</loc></url>`).join('')}</urlset>` };

  if (!routes.includes(path)) {
    return {
      type: 'text/html; charset=utf-8',
      status: 404,
      body: html('404', `<div class="card"><h1>404</h1><p class="muted">Страница не найдена</p><a href="/">На главную</a></div>`),
    };
  }

  const body = `
    <div class="card">
      <h1>Сайт Товарной биржи</h1>
      <p class="muted">Стабильный fallback web runtime на Render free (без OOM). Основной Next runtime остается в репозитории.</p>
      <p>Текущий маршрут: <b>${path}</b></p>
      <p>API: <a href="${apiUrl}/markets" target="_blank" rel="noreferrer">${apiUrl}/markets</a></p>
    </div>
    <div class="card">
      <h2>Маршруты MVP</h2>
      <div class="grid">${routes.map((r) => `<a href="${r}">${r}</a>`).join('')}</div>
    </div>
    <div class="card">
      <h2>Swagger</h2>
      <a href="https://commodity-api-6paf.onrender.com/api/docs" target="_blank" rel="noreferrer">https://commodity-api-6paf.onrender.com/api/docs</a>
    </div>
  `;

  return { type: 'text/html; charset=utf-8', body: html('Commodity Web', body) };
}

const server = http.createServer((req, res) => {
  const path = (req.url || '/').split('?')[0];
  const { type, body, status = 200 } = page(path);
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
});

const port = Number(process.env.PORT || 10000);
server.listen(port, '0.0.0.0', () => {
  console.log(`Fallback WEB listening on ${port}`);
});
