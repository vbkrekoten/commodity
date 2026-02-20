import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  list(): Promise<unknown[]> {
    return this.prisma.organization.findMany({
      include: {
        memberships: {
          include: { user: true },
        },
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<unknown> {
    return this.prisma.organization.update({ where: { id }, data: { status } });
  }

  members(organizationId: string): Promise<unknown[]> {
    return this.prisma.orgMembership.findMany({
      where: { organizationId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
