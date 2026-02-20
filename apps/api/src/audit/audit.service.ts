import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  list(): Promise<unknown[]> {
    return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 500 });
  }

  log(input: { userId?: string; action: string; entityType: string; entityId?: string; payload?: unknown }): Promise<unknown> {
    return this.prisma.auditLog.create({ data: input });
  }
}
