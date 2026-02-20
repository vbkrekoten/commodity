import Link from 'next/link';
import type { ReactNode } from 'react';

export function SiteLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-semibold">
            Сайт Товарной биржи
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/markets">Рынки</Link>
            <Link href="/prices">Цены</Link>
            <Link href="/indices">Индексы</Link>
            <Link href="/docs">Документы</Link>
            <Link href="/news">Новости</Link>
            <Link href="/cabinet">Кабинет</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
