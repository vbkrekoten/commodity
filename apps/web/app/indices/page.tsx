import Link from 'next/link';
import { SiteLayout } from '@/components/layout';
import { apiGet } from '@/lib/api';

interface ExchangeIndex {
  id: string;
  slug: string;
  title: string;
}

export default async function IndicesPage(): Promise<JSX.Element> {
  const indices = await apiGet<ExchangeIndex[]>('/indices');
  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">Индексы</h1>
      <ul className="space-y-2">
        {indices.map((index) => (
          <li key={index.id} className="rounded border bg-white p-4">
            <Link href={`/indices/${index.slug}`}>{index.title}</Link>
          </li>
        ))}
      </ul>
    </SiteLayout>
  );
}
