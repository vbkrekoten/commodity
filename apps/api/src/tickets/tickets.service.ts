import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId?: string): Promise<unknown[]> {
    return this.prisma.ticket.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { messages: true, organization: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(input: { organizationId: string; createdById: string; subject: string; category: string; message: string }): Promise<unknown> {
    const ticket = await this.prisma.ticket.create({
      data: {
        organizationId: input.organizationId,
        createdById: input.createdById,
        subject: input.subject,
        category: input.category,
        messages: {
          create: [{ authorId: input.createdById, message: input.message }],
        },
      },
      include: { messages: true },
    });
    await this.prisma.auditLog.create({
      data: {
        userId: input.createdById,
        action: 'ticket.created',
        entityType: 'ticket',
        entityId: ticket.id,
      },
    });
    return ticket;
  }

  addMessage(input: { ticketId: string; authorId: string; message: string; fileId?: string }): Promise<unknown> {
    return this.prisma.ticketMessage.create({ data: input });
  }

  updateStatus(ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed'): Promise<unknown> {
    return this.prisma.ticket.update({ where: { id: ticketId }, data: { status } });
  }
}
