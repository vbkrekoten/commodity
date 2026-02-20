import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@packages/ui';

export function EmptyState({ title, ctaHref, ctaLabel }: { title: string; ctaHref: string; ctaLabel: string }): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Link href={ctaHref} className="inline-flex rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          {ctaLabel}
        </Link>
      </CardContent>
    </Card>
  );
}
