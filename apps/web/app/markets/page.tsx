import Link from 'next/link';
import { SiteLayout } from '@/components/layout';
import { apiGet } from '@/lib/api';

interface Market {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export default async function MarketsPage(): Promise<JSX.Element> {
  const markets = await apiGet<Market[]>('/markets');
  return (
    <SiteLayout>
      <h1 className="mb-6 text-2xl font-semibold">Каталог рынков</h1>
      <div className="grid gap-3">
        {markets.map((market) => (
          <Link key={market.id} href={`/markets/${market.slug}`} className="rounded border bg-white p-4">
            <h2 className="font-semibold">{market.title}</h2>
            <p className="text-sm text-slate-600">{market.description}</p>
          </Link>
        ))}
      </div>
    </SiteLayout>
  );
}
