import { SiteLayout } from '@/components/layout';
import { apiGet } from '@/lib/api';

interface SearchData {
  markets: Array<{ id: string; title: string }>;
  docs: Array<{ id: string; title: string }>;
  news: Array<{ id: string; title: string }>;
  faq: Array<{ id: string; title: string }>;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<JSX.Element> {
  const { q = '' } = await searchParams;
  const result = await apiGet<SearchData>(`/search?q=${encodeURIComponent(q)}`);

  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">Поиск</h1>
      <form className="mb-4">
        <input name="q" defaultValue={q} className="w-full rounded border px-3 py-2" placeholder="Поиск по рынкам, документам, новостям, FAQ" />
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['Рынки', result.markets],
          ['Документы', result.docs],
          ['Новости', result.news],
          ['FAQ', result.faq],
        ].map(([title, items]) => (
          <section key={title} className="rounded border bg-white p-4">
            <h2 className="mb-2 font-semibold">{title}</h2>
            {(items as Array<{ id: string; title: string }>).length === 0 ? (
              <p className="text-sm text-slate-500">Нет результатов</p>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {(items as Array<{ id: string; title: string }>).map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
