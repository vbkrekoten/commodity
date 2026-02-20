import { SiteLayout } from '@/components/layout';
import { apiGet } from '@/lib/api';

interface IndexPageData {
  title: string;
  methodology: string;
  points: Array<{ id: string; date: string; value: string }>;
}

export default async function IndexDetailPage({ params }: { params: Promise<{ slug: string }> }): Promise<JSX.Element> {
  const { slug } = await params;
  const index = await apiGet<IndexPageData>(`/indices/${slug}`);

  return (
    <SiteLayout>
      <h1 className="mb-4 text-2xl font-semibold">{index.title}</h1>
      <p className="mb-4">{index.methodology}</p>
      <div className="rounded border bg-white p-4">
        <p className="text-sm text-slate-600">График (MVP): массив точек {index.points.length}</p>
      </div>
    </SiteLayout>
  );
}
