import { CabinetShell } from '@/components/cabinet-shell';
import { apiGet } from '@/lib/api';

export default async function AdminTicketsPage(): Promise<JSX.Element> {
  const tickets = await apiGet<Array<{ id: string; subject: string; status: string }>>('/tickets', true);
  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Admin: Тикеты</h1>
      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded border p-3 text-sm">
            {ticket.subject} · {ticket.status}
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
