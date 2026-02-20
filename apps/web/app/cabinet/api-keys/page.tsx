import { CabinetShell } from '@/components/cabinet-shell';
import { ApiKeyCreateForm } from '@/components/cabinet-actions';
import { apiGet } from '@/lib/api';

interface ApiKey {
  id: string;
  name: string;
  scopes: string[];
  revokedAt?: string;
}

export default async function ApiKeysPage(): Promise<JSX.Element> {
  const apiKeys = await apiGet<ApiKey[]>('/api-keys', true);

  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">API ключи</h1>
      <ApiKeyCreateForm />
      <div className="space-y-2">
        {apiKeys.map((item) => (
          <div key={item.id} className="rounded border p-4 text-sm">
            {item.name} · scopes: {item.scopes.join(', ')} · {item.revokedAt ? 'revoked' : 'active'}
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
