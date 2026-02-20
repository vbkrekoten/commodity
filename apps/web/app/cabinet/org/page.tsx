import { CabinetShell } from '@/components/cabinet-shell';
import { apiGet } from '@/lib/api';

export default async function OrgPage(): Promise<JSX.Element> {
  const me = await apiGet<{ email: string; orgId?: string; role: string }>('/auth/me', true);
  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Профиль организации</h1>
      <div className="space-y-2 rounded border p-4">
        <div>Org ID: {me.orgId ?? 'n/a'}</div>
        <div>Ответственный: {me.email}</div>
        <div>Роль: {me.role}</div>
      </div>
    </CabinetShell>
  );
}
