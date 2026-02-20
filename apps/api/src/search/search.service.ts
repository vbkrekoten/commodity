import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(q: string): Promise<{ markets: unknown[]; docs: unknown[]; news: unknown[]; faq: unknown[] }> {
    if (!q) {
      return { markets: [], docs: [], news: [], faq: [] };
    }

    const [markets, docs, news] = await Promise.all([
      this.prisma.market.findMany({
        where: {
          OR: [{ title: { contains: q, mode: 'insensitive' } }, { tags: { has: q.toLowerCase() } }],
        },
        take: 10,
      }),
      this.prisma.document.findMany({
        where: {
          OR: [{ title: { contains: q, mode: 'insensitive' } }, { tags: { has: q.toLowerCase() } }],
        },
        take: 10,
      }),
      this.prisma.newsArticle.findMany({
        where: {
          OR: [{ title: { contains: q, mode: 'insensitive' } }, { tags: { has: q.toLowerCase() } }],
        },
        take: 10,
      }),
    ]);

    const faq = [
      { id: 'faq-1', title: 'Как пройти онбординг?', slug: '/how-to-start' },
      { id: 'faq-2', title: 'Как загрузить документы?', slug: '/cabinet/onboarding' },
    ].filter((item) => item.title.toLowerCase().includes(q.toLowerCase()));

    return { markets, docs, news, faq };
  }
}
