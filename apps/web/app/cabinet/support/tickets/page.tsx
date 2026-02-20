import { CabinetShell } from '@/components/cabinet-shell';
import { TicketCreateForm } from '@/components/cabinet-actions';
import { apiGet } from '@/lib/api';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category: string;
}

export default async function TicketsPage(): Promise<JSX.Element> {
  const tickets = await apiGet<Ticket[]>('/tickets', true);

  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Тикеты</h1>
      <TicketCreateForm />
      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded border p-4 text-sm">
            {ticket.subject} · {ticket.category} · {ticket.status}
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
