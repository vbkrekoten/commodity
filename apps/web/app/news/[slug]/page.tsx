import { SiteLayout } from '@/components/layout';
import { apiGet } from '@/lib/api';

interface NewsArticle {
  title: string;
  body: string;
  publishedAt: string;
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }): Promise<JSX.Element> {
  const { slug } = await params;
  const article = await apiGet<NewsArticle>(`/news/${slug}`);

  return (
    <SiteLayout>
      <h1 className="mb-3 text-2xl font-semibold">{article.title}</h1>
      <p className="mb-4 text-sm text-slate-600">{new Date(article.publishedAt).toLocaleDateString('ru-RU')}</p>
      <article className="rounded border bg-white p-4">{article.body}</article>
    </SiteLayout>
  );
}
