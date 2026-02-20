import { SiteLayout } from '@/components/layout';

export default function AboutPage(): JSX.Element {
  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">О проекте</h1>
      <p className="rounded border bg-white p-4">
        Товарная биржа: публичный портал, кабинет участников и админ-панель с RBAC, API и аудитом.
      </p>
    </SiteLayout>
  );
}
