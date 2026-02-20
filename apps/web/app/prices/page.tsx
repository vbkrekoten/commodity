import { SiteLayout } from '@/components/layout';
import { apiGet } from '@/lib/api';

interface PricePoint {
  id: string;
  value: string;
  date: string;
  market: { slug: string; title: string };
}

export default async function PricesPage(): Promise<JSX.Element> {
  const prices = await apiGet<PricePoint[]>('/prices');
  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">Цены</h1>
      <div className="mb-6 rounded border bg-white p-4">
        <p className="text-sm text-slate-600">График (MVP): линейный набор за 90 дней будет подключен через chart lib.</p>
        <p>Точек: {prices.length}</p>
      </div>
      <div className="overflow-x-auto rounded border bg-white p-2">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Дата</th>
              <th className="p-2 text-left">Рынок</th>
              <th className="p-2 text-left">Цена</th>
            </tr>
          </thead>
          <tbody>
            {prices.slice(-30).map((point) => (
              <tr key={point.id}>
                <td className="p-2">{new Date(point.date).toLocaleDateString('ru-RU')}</td>
                <td className="p-2">{point.market.title}</td>
                <td className="p-2">{String(point.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SiteLayout>
  );
}
