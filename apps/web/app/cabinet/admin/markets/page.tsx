import { CabinetShell } from '@/components/cabinet-shell';
import { AdminMarketCreateForm } from '@/components/admin-forms';
import { apiGet } from '@/lib/api';

export default async function AdminMarketsPage(): Promise<JSX.Element> {
  const markets = await apiGet<Array<{ id: string; slug: string; title: string }>>('/markets', true);
  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Admin: Рынки</h1>
      <AdminMarketCreateForm />
      <div className="space-y-2">
        {markets.map((market) => (
          <div key={market.id} className="rounded border p-3 text-sm">
            {market.slug} · {market.title}
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
