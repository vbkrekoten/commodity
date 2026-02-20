import { CabinetShell } from '@/components/cabinet-shell';
import { apiGet } from '@/lib/api';

export default async function AuditLogPage(): Promise<JSX.Element> {
  const logs = await apiGet<Array<{ id: string; action: string; entityType: string; createdAt: string }>>('/audit-logs', true);
  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Audit log</h1>
      <div className="space-y-2">
        {logs.slice(0, 50).map((log) => (
          <div key={log.id} className="rounded border p-3 text-xs">
            {new Date(log.createdAt).toLocaleString('ru-RU')} · {log.action} · {log.entityType}
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
