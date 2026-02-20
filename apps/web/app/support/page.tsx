import { SiteLayout } from '@/components/layout';
import Link from 'next/link';

export default function SupportPage(): JSX.Element {
  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">Поддержка</h1>
      <section className="mb-6 rounded border bg-white p-4">
        <h2 className="mb-2 font-semibold">База знаний</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Как зарегистрировать организацию</li>
          <li>Как загрузить документы в MinIO</li>
          <li>Как импортировать OTC сделки из CSV</li>
        </ul>
      </section>
      <Link href="/cabinet/support/tickets" className="rounded bg-blue-600 px-4 py-2 text-white">
        Создать тикет
      </Link>
    </SiteLayout>
  );
}
