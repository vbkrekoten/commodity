import { CabinetShell } from '@/components/cabinet-shell';
import { AdminNewsCreateForm } from '@/components/admin-forms';
import { apiGet } from '@/lib/api';

export default async function AdminNewsPage(): Promise<JSX.Element> {
  const news = await apiGet<Array<{ id: string; title: string; publishedAt: string }>>('/news', true);
  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Admin: Новости</h1>
      <AdminNewsCreateForm />
      <div className="space-y-2">
        {news.map((item) => (
          <div key={item.id} className="rounded border p-3 text-sm">
            {item.title} · {new Date(item.publishedAt).toLocaleDateString('ru-RU')}
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
