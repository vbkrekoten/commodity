import Link from 'next/link';
import { SiteLayout } from '@/components/layout';

export default function HowToStartPage(): JSX.Element {
  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">Как начать</h1>
      <ol className="mb-4 list-decimal space-y-2 pl-6">
        <li>Регистрация компании</li>
        <li>Заполнение онбординга и загрузка документов</li>
        <li>Проверка комплаенс</li>
        <li>Доступ к сделкам и API</li>
      </ol>
      <Link href="/cabinet/register" className="rounded bg-blue-600 px-4 py-2 text-white">
        Начать онбординг
      </Link>
    </SiteLayout>
  );
}
