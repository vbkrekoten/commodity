import { SiteLayout } from '@/components/layout';
import { apiGet } from '@/lib/api';

interface Doc {
  id: string;
  title: string;
  category: string;
  version: string;
  effectiveDate: string;
}

export default async function DocsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }): Promise<JSX.Element> {
  const params = await searchParams;
  const docs = await apiGet<Doc[]>(`/documents${params.category ? `?category=${params.category}` : ''}`);

  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">Документы</h1>
      <form className="mb-4">
        <label htmlFor="category" className="mr-2 text-sm">Категория:</label>
        <input id="category" name="category" defaultValue={params.category ?? ''} className="rounded border px-2 py-1" />
        <button className="ml-2 rounded bg-blue-600 px-3 py-1 text-white" type="submit">Фильтр</button>
      </form>
      <div className="space-y-2">
        {docs.map((doc) => (
          <div key={doc.id} className="rounded border bg-white p-4">
            <h2 className="font-semibold">{doc.title}</h2>
            <p className="text-sm">{doc.category} · v{doc.version} · {new Date(doc.effectiveDate).toLocaleDateString('ru-RU')}</p>
          </div>
        ))}
      </div>
    </SiteLayout>
  );
}
