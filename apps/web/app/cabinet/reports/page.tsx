import { CabinetShell } from '@/components/cabinet-shell';
import { apiGet } from '@/lib/api';

export default async function ReportsPage(): Promise<JSX.Element> {
  const deals = await apiGet<Array<{ id: string }>>('/otc-deals', true);
  const tickets = await apiGet<Array<{ id: string; status: string }>>('/tickets', true);

  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Отчеты</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded border p-4">Сделок всего: {deals.length}</div>
        <div className="rounded border p-4">Тикетов всего: {tickets.length}</div>
      </div>
    </CabinetShell>
  );
}
