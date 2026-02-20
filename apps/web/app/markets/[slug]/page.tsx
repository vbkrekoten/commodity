import { SiteLayout } from '@/components/layout';
import { apiGet } from '@/lib/api';

interface MarketDetails {
  title: string;
  description: string;
  contractSpecs: Array<{ id: string; version: string; params: Record<string, unknown>; tariff: string }>;
  docs: Array<{ id: string; title: string; version: string }>;
}

export default async function MarketPage({ params }: { params: Promise<{ slug: string }> }): Promise<JSX.Element> {
  const { slug } = await params;
  const market = await apiGet<MarketDetails>(`/markets/${slug}`);

  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">{market.title}</h1>
      <p className="mb-6">{market.description}</p>

      <section className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Параметры и тарифы</h2>
        <div className="space-y-2">
          {market.contractSpecs.map((spec) => (
            <div key={spec.id} className="rounded border bg-white p-4">
              <div>Версия: {spec.version}</div>
              <div>Тариф: {String(spec.tariff)}</div>
              <pre className="overflow-auto text-xs">{JSON.stringify(spec.params, null, 2)}</pre>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Документы и FAQ</h2>
        <ul className="list-disc space-y-1 pl-5">
          {market.docs.map((doc) => (
            <li key={doc.id}>
              {doc.title} v{doc.version}
            </li>
          ))}
          <li>FAQ: как подключиться к торгам</li>
          <li>FAQ: требования к поставщику</li>
        </ul>
      </section>
    </SiteLayout>
  );
}
