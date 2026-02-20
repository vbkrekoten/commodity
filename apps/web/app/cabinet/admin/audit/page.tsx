import { CabinetShell } from '@/components/cabinet-shell';
import { apiGet } from '@/lib/api';

export default async function AdminAuditPage(): Promise<JSX.Element> {
  const logs = await apiGet<Array<{ id: string; action: string; createdAt: string }>>('/audit-logs', true);
  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Admin: Аудит</h1>
      <div className="space-y-2">
        {logs.map((item) => (
          <div key={item.id} className="rounded border p-3 text-xs">
            {new Date(item.createdAt).toLocaleString('ru-RU')} · {item.action}
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
