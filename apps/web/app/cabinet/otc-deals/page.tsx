import { CabinetShell } from '@/components/cabinet-shell';
import { OtcCreateForm } from '@/components/cabinet-actions';
import { apiGet } from '@/lib/api';

interface Deal {
  id: string;
  marketSlug: string;
  volume: string;
  price: string;
  dealDate: string;
}

export default async function OtcDealsPage(): Promise<JSX.Element> {
  const deals = await apiGet<Deal[]>('/otc-deals', true);

  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">OTC сделки</h1>
      <OtcCreateForm />
      <a href={`${process.env.NEXT_PUBLIC_API_URL}/otc-deals/export/csv`} className="mb-4 inline-block text-sm">
        Экспорт CSV
      </a>
      <div className="space-y-2">
        {deals.map((deal) => (
          <div key={deal.id} className="rounded border p-3 text-sm">
            {deal.marketSlug} · {String(deal.volume)} · {String(deal.price)} · {new Date(deal.dealDate).toLocaleDateString('ru-RU')}
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
