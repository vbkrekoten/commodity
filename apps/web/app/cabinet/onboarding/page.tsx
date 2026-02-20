import { CabinetShell } from '@/components/cabinet-shell';
import { PresignedUploadForm } from '@/components/file-upload';
import { apiGet } from '@/lib/api';

export default async function OnboardingPage(): Promise<JSX.Element> {
  const cases = await apiGet<Array<{ id: string; status: string; checklist: Record<string, boolean> }>>('/onboarding/cases', true);

  return (
    <CabinetShell>
      <h1 className="mb-4 text-2xl font-semibold">Онбординг</h1>
      <div className="space-y-3">
        {cases.map((item) => (
          <div key={item.id} className="rounded border p-4">
            <div>Кейс: {item.id}</div>
            <div>Статус: {item.status}</div>
            <pre className="text-xs">{JSON.stringify(item.checklist, null, 2)}</pre>
            <PresignedUploadForm />
          </div>
        ))}
      </div>
    </CabinetShell>
  );
}
