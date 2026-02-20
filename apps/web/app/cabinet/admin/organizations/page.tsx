import { CabinetShell } from '@/components/cabinet-shell';
import { OrgStatusActions } from '@/components/org-status-actions';
import { apiGet } from '@/lib/api';

export default async function AdminOrganizationsPage(): Promise<JSX.Element> {
  const orgs = await apiGet<Array<{ id: string; name: string; status: string }>>('/organizations', true);
  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Admin: Организации</h1>
      <div className="space-y-2">
        {orgs.map((org) => (
          <div key={org.id} className="rounded border p-4 text-sm">
            <div>
              {org.name} · {org.status}
            </div>
            <OrgStatusActions orgId={org.id} />
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
