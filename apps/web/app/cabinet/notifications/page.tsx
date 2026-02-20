import { CabinetShell } from '@/components/cabinet-shell';

export default function NotificationsPage(): JSX.Element {
  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Уведомления</h1>
      <div className="rounded border p-4 text-sm">
        <p>Email уведомления: включены.</p>
        <p>Webhook уведомления: выключены.</p>
        <p className="text-slate-600">TODO: сохранить настройки в БД.</p>
      </div>
    </CabinetShell>
  );
}
