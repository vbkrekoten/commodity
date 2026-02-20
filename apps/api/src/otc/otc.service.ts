import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { PrismaService } from '../common/prisma.service';

interface CreateDealInput {
  organizationId: string;
  createdById: string;
  marketSlug: string;
  volume: number;
  price: number;
  dealDate: string;
  comment?: string;
}

@Injectable()
export class OtcService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string): Promise<unknown[]> {
    return this.prisma.otcDeal.findMany({
      where: { organizationId },
      orderBy: { dealDate: 'desc' },
    });
  }

  async create(input: CreateDealInput): Promise<unknown> {
    const deal = await this.prisma.otcDeal.create({
      data: {
        organizationId: input.organizationId,
        createdById: input.createdById,
        marketSlug: input.marketSlug,
        volume: input.volume,
        price: input.price,
        dealDate: new Date(input.dealDate),
        comment: input.comment,
      },
    });
    await this.prisma.auditLog.create({
      data: {
        userId: input.createdById,
        action: 'otc.deal.created',
        entityType: 'otc_deal',
        entityId: deal.id,
      },
    });
    return deal;
  }

  async update(id: string, input: Partial<CreateDealInput>): Promise<unknown> {
    return this.prisma.otcDeal.update({
      where: { id },
      data: {
        marketSlug: input.marketSlug,
        volume: input.volume,
        price: input.price,
        dealDate: input.dealDate ? new Date(input.dealDate) : undefined,
        comment: input.comment,
      },
    });
  }

  async delete(id: string): Promise<unknown> {
    const deal = await this.prisma.otcDeal.delete({ where: { id } });
    await this.prisma.auditLog.create({
      data: { action: 'otc.deal.deleted', entityType: 'otc_deal', entityId: id },
    });
    return deal;
  }

  async importCsv(organizationId: string, createdById: string, csv: string): Promise<{ created: number }> {
    const records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
    }) as Array<{ marketSlug: string; volume: string; price: string; dealDate: string; comment?: string }>;

    await this.prisma.otcDeal.createMany({
      data: records.map((record) => ({
        organizationId,
        createdById,
        marketSlug: record.marketSlug,
        volume: Number(record.volume),
        price: Number(record.price),
        dealDate: new Date(record.dealDate),
        comment: record.comment,
      })),
    });
    await this.prisma.auditLog.create({
      data: {
        userId: createdById,
        action: 'otc.deal.import_csv',
        entityType: 'otc_deal',
        payload: { rows: records.length },
      },
    });

    return { created: records.length };
  }

  async exportCsv(organizationId: string): Promise<string> {
    const deals = await this.prisma.otcDeal.findMany({ where: { organizationId }, orderBy: { dealDate: 'desc' } });
    const head = 'marketSlug,volume,price,dealDate,comment';
    const rows = deals.map((deal) =>
      [deal.marketSlug, deal.volume.toString(), deal.price.toString(), deal.dealDate.toISOString(), deal.comment ?? ''].join(','),
    );
    return [head, ...rows].join('\n');
  }
}
