import { CabinetShell } from '@/components/cabinet-shell';
import { apiGet } from '@/lib/api';

export default async function OrgUsersPage(): Promise<JSX.Element> {
  const members = await apiGet<Array<{ id: string; role: string; user: { email: string; fullName: string } }>>(
    '/organizations/me/members',
    true,
  );

  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Пользователи и инвайты</h1>
      <div className="space-y-2 rounded border p-4">
        {members.map((member) => (
          <div key={member.id} className="rounded border p-2 text-sm">
            {member.user.fullName} ({member.user.email}) · {member.role}
          </div>
        ))}
        <p className="text-sm text-slate-600">TODO: endpoint приглашений + отправка invite email.</p>
      </div>
    </CabinetShell>
  );
}
