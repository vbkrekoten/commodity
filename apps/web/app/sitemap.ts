import type { MetadataRoute } from 'next';

const pages = [
  '/',
  '/markets',
  '/prices',
  '/indices',
  '/how-to-start',
  '/docs',
  '/support',
  '/news',
  '/about',
  '/search',
  '/cabinet',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return pages.map((page) => ({
    url: `${base}${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: page === '/' ? 1 : 0.7,
  }));
}
