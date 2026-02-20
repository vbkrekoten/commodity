import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  listByOrg(organizationId: string): Promise<unknown[]> {
    return this.prisma.onboardingCase.findMany({
      where: { organizationId },
      include: { documents: { include: { file: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(organizationId: string, createdById: string): Promise<unknown> {
    return this.prisma.onboardingCase.create({
      data: {
        organizationId,
        createdById,
        checklist: {
          profile: false,
          documents: false,
          approvals: false,
        },
      },
    });
  }

  attachDocument(input: { onboardingCaseId: string; fileId: string; type: string }): Promise<unknown> {
    return this.prisma.onboardingDocument.create({ data: input });
  }
}
