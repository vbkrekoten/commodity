import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Сайт Товарной биржи',
  description: 'Публичный сайт, личный кабинет и админка товарной биржи',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
