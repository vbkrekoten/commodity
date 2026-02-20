import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  ['/cabinet', 'Dashboard'],
  ['/cabinet/onboarding', 'Onboarding'],
  ['/cabinet/org', 'Организация'],
  ['/cabinet/org/users', 'Пользователи'],
  ['/cabinet/otc-deals', 'OTC сделки'],
  ['/cabinet/reports', 'Отчеты'],
  ['/cabinet/api-keys', 'API ключи'],
  ['/cabinet/notifications', 'Уведомления'],
  ['/cabinet/support/tickets', 'Тикеты'],
  ['/cabinet/audit-log', 'Аудит'],
  ['/cabinet/admin/organizations', 'Admin'],
] as const;

export function CabinetShell({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-6">
        <aside className="w-64 rounded border bg-white p-4">
          <h2 className="mb-3 font-semibold">Кабинет</h2>
          <ul className="space-y-2 text-sm">
            {nav.map(([href, label]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 rounded border bg-white p-6">{children}</main>
      </div>
    </div>
  );
}
