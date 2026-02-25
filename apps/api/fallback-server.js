const http = require('http');
const { URL } = require('url');

const markets = [
  'wheat',
  'corn',
  'soy',
  'sunflower-meal',
  'sunflower-seed',
  'sunflower-oil',
  'pork-half-carcass',
].map((slug, i) => ({
  id: `m${i + 1}`,
  slug,
  title: slug,
  description: `Market ${slug}`,
  contractSpecs: [
    { id: `s${i + 1}`, version: '1.0.0', params: { lot: 10 + i, basis: 'EXW' }, tariff: 100 + i },
  ],
  docs: [{ id: `d${i + 1}`, title: `Doc for ${slug}`, version: '1.0' }],
}));

const indices = [
  { id: 'i1', slug: 'grain-composite', title: 'Grain Composite', methodology: 'Weighted basket', points: [] },
  { id: 'i2', slug: 'oilseed-composite', title: 'Oilseed Composite', methodology: 'Weighted basket', points: [] },
];

const news = Array.from({ length: 10 }).map((_, i) => ({
  id: `n${i + 1}`,
  slug: `news-${i + 1}`,
  title: `Новость ${i + 1}`,
  summary: `Summary ${i + 1}`,
  body: `Body ${i + 1}`,
  publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const prices = Array.from({ length: 60 }).map((_, i) => ({
  id: `p${i + 1}`,
  value: String(10000 + i * 15),
  date: new Date(Date.now() - (60 - i) * 86400000).toISOString(),
  market: { slug: markets[i % markets.length].slug, title: markets[i % markets.length].title },
}));

function send(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data, error: null, meta: {} }));
}

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data: null, error: { message: 'Not found' }, meta: {} }));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  const path = url.pathname;

  if (path === '/api/v1/markets') return send(res, markets.map(({ contractSpecs, docs, ...m }) => m));
  if (path.startsWith('/api/v1/markets/')) {
    const slug = path.split('/').pop();
    return send(res, markets.find((m) => m.slug === slug) || null);
  }
  if (path === '/api/v1/prices') return send(res, prices);
  if (path === '/api/v1/indices') return send(res, indices.map(({ points, ...x }) => x));
  if (path.startsWith('/api/v1/indices/')) {
    const slug = path.split('/').pop();
    return send(res, indices.find((i) => i.slug === slug) || null);
  }
  if (path === '/api/v1/documents') {
    return send(
      res,
      Array.from({ length: 10 }).map((_, i) => ({
        id: `doc-${i + 1}`,
        title: `Документ ${i + 1}`,
        category: i % 2 ? 'rules' : 'methodology',
        version: `1.${i}`,
        effectiveDate: new Date(Date.now() - i * 86400000).toISOString(),
      })),
    );
  }
  if (path === '/api/v1/news') return send(res, news);
  if (path.startsWith('/api/v1/news/')) {
    const slug = path.split('/').pop();
    return send(res, news.find((n) => n.slug === slug) || null);
  }
  if (path === '/api/v1/search') {
    const q = (url.searchParams.get('q') || '').toLowerCase();
    return send(res, {
      markets: markets.filter((m) => m.title.toLowerCase().includes(q)).map((m) => ({ id: m.id, title: m.title })),
      docs: [{ id: 'doc-1', title: 'Документ 1' }].filter((d) => d.title.toLowerCase().includes(q)),
      news: news.filter((n) => n.title.toLowerCase().includes(q)).map((n) => ({ id: n.id, title: n.title })),
      faq: [{ id: 'faq-1', title: 'Как начать работу?' }].filter((f) => f.title.toLowerCase().includes(q)),
    });
  }
  if (path === '/api/v1/auth/me') return send(res, { email: 'demo@example.com', role: 'admin', orgId: 'org-demo' });

  if (path === '/' || path === '/healthz') {
    return send(res, { ok: true, service: 'fallback-api' });
  }

  return notFound(res);
});

const port = Number(process.env.PORT || 10000);
server.listen(port, '0.0.0.0', () => {
  console.log(`Fallback API listening on ${port}`);
});
