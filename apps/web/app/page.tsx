import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@packages/ui';
import { SiteLayout } from '@/components/layout';

export default function HomePage(): JSX.Element {
  return (
    <SiteLayout>
      <h1 className="mb-6 text-3xl font-bold">Сайт Товарной биржи</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Продаю', href: '/how-to-start' },
          { title: 'Покупаю', href: '/markets' },
          { title: 'Партнер', href: '/about' },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={item.href}>Открыть</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </SiteLayout>
  );
}
