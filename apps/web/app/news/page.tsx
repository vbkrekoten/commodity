import Link from 'next/link';
import { SiteLayout } from '@/components/layout';
import { apiGet } from '@/lib/api';

interface News {
  id: string;
  slug: string;
  title: string;
  summary: string;
}

export default async function NewsPage(): Promise<JSX.Element> {
  const news = await apiGet<News[]>('/news');
  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">Новости</h1>
      <div className="space-y-2">
        {news.map((article) => (
          <Link key={article.id} href={`/news/${article.slug}`} className="block rounded border bg-white p-4">
            <h2 className="font-semibold">{article.title}</h2>
            <p className="text-sm text-slate-600">{article.summary}</p>
          </Link>
        ))}
      </div>
    </SiteLayout>
  );
}
