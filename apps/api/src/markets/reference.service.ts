import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  markets(): Promise<unknown[]> {
    return this.prisma.market.findMany({ include: { contractSpecs: true } });
  }

  marketBySlug(slug: string): Promise<unknown | null> {
    return this.prisma.market.findUnique({
      where: { slug },
      include: {
        contractSpecs: true,
        docs: true,
        pricePoints: { orderBy: { date: 'desc' }, take: 20 },
      },
    });
  }

  async upsertMarket(input: {
    id?: string;
    slug: string;
    title: string;
    description: string;
    tags?: string[];
  }): Promise<unknown> {
    if (input.id) {
      return this.prisma.market.update({
        where: { id: input.id },
        data: {
          slug: input.slug,
          title: input.title,
          description: input.description,
          tags: input.tags ?? [],
        },
      });
    }

    return this.prisma.market.create({
      data: {
        slug: input.slug,
        title: input.title,
        description: input.description,
        tags: input.tags ?? [],
      },
    });
  }

  prices(marketSlug?: string): Promise<unknown[]> {
    return this.prisma.pricePoint.findMany({
      where: marketSlug
        ? {
            market: { slug: marketSlug },
          }
        : undefined,
      include: { market: true },
      orderBy: { date: 'asc' },
      take: 500,
    });
  }

  indices(): Promise<unknown[]> {
    return this.prisma.index.findMany({ include: { points: { take: 20, orderBy: { date: 'desc' } } } });
  }

  indexBySlug(slug: string): Promise<unknown | null> {
    return this.prisma.index.findUnique({
      where: { slug },
      include: { points: { orderBy: { date: 'asc' }, take: 120 } },
    });
  }

  documents(params: { category?: string; marketSlug?: string }): Promise<unknown[]> {
    return this.prisma.document.findMany({
      where: {
        category: params.category,
        market: params.marketSlug ? { slug: params.marketSlug } : undefined,
      },
      include: { market: true },
      orderBy: { effectiveDate: 'desc' },
    });
  }

  async upsertDocument(input: {
    id?: string;
    slug: string;
    title: string;
    category: string;
    version: string;
    effectiveDate: string;
    tags: string[];
    marketId?: string;
    fileUrl?: string;
  }): Promise<unknown> {
    const data = {
      slug: input.slug,
      title: input.title,
      category: input.category,
      version: input.version,
      effectiveDate: new Date(input.effectiveDate),
      tags: input.tags,
      marketId: input.marketId,
      fileUrl: input.fileUrl,
    };

    if (input.id) {
      return this.prisma.document.update({ where: { id: input.id }, data });
    }

    return this.prisma.document.create({ data });
  }

  news(): Promise<unknown[]> {
    return this.prisma.newsArticle.findMany({ orderBy: { publishedAt: 'desc' } });
  }

  newsBySlug(slug: string): Promise<unknown | null> {
    return this.prisma.newsArticle.findUnique({ where: { slug } });
  }

  async upsertNews(input: {
    id?: string;
    slug: string;
    title: string;
    summary: string;
    body: string;
    tags: string[];
    publishedAt: string;
  }): Promise<unknown> {
    const data = {
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      body: input.body,
      tags: input.tags,
      publishedAt: new Date(input.publishedAt),
    };

    if (input.id) {
      return this.prisma.newsArticle.update({ where: { id: input.id }, data });
    }

    return this.prisma.newsArticle.create({ data });
  }
}
