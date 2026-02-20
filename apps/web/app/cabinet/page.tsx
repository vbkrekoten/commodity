import { CabinetShell } from '@/components/cabinet-shell';
import { apiGet } from '@/lib/api';

export default async function CabinetDashboard(): Promise<JSX.Element> {
  const me = await apiGet<{ email: string; role: string; orgId?: string }>('/auth/me', true);
  const deals = await apiGet<Array<{ id: string }>>('/otc-deals', true);
  const tickets = await apiGet<Array<{ id: string }>>('/tickets', true);

  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded border p-4">Пользователь: {me.email}</div>
        <div className="rounded border p-4">Роль: {me.role}</div>
        <div className="rounded border p-4">Сделок: {deals.length}</div>
        <div className="rounded border p-4">Тикетов: {tickets.length}</div>
      </div>
    </CabinetShell>
  );
}
