import { CabinetShell } from '@/components/cabinet-shell';
import { AdminDocCreateForm } from '@/components/admin-forms';
import { apiGet } from '@/lib/api';

export default async function AdminDocsPage(): Promise<JSX.Element> {
  const docs = await apiGet<Array<{ id: string; title: string; version: string }>>('/documents', true);
  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Admin: Документы</h1>
      <AdminDocCreateForm />
      <div className="space-y-2">
        {docs.map((doc) => (
          <div key={doc.id} className="rounded border p-3 text-sm">
            {doc.title} · v{doc.version}
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
