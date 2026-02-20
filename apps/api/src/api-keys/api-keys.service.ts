import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string): Promise<unknown[]> {
    return this.prisma.apiKey.findMany({ where: { organizationId }, orderBy: { createdAt: 'desc' } });
  }

  async create(input: { organizationId: string; createdById: string; name: string; scopes: string[] }): Promise<{ id: string; key: string }> {
    const rawKey = `ex_${randomBytes(24).toString('hex')}`;
    const keyHash = await bcrypt.hash(rawKey, 10);

    const record = await this.prisma.apiKey.create({
      data: {
        organizationId: input.organizationId,
        createdById: input.createdById,
        name: input.name,
        scopes: input.scopes,
        keyHash,
      },
    });

    return { id: record.id, key: rawKey };
  }

  revoke(id: string): Promise<unknown> {
    return this.prisma.apiKey.update({ where: { id }, data: { revokedAt: new Date() } });
  }
}
