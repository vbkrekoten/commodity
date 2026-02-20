import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  list(@CurrentUser() user: RequestUser): Promise<unknown[]> {
    if (user.role === 'admin') {
      return this.ticketsService.list();
    }
    return this.ticketsService.list(user.orgId ?? '');
  }

  @Post()
  @Roles('org_admin', 'trader', 'compliance', 'viewer', 'admin')
  create(
    @CurrentUser() user: RequestUser,
    @Body() body: { subject: string; category: string; message: string },
  ): Promise<unknown> {
    return this.ticketsService.create({
      organizationId: user.orgId ?? '',
      createdById: user.userId,
      subject: body.subject,
      category: body.category,
      message: body.message,
    });
  }

  @Post(':id/messages')
  @Roles('org_admin', 'trader', 'compliance', 'viewer', 'admin')
  addMessage(@Param('id') id: string, @CurrentUser() user: RequestUser, @Body() body: { message: string; fileId?: string }): Promise<unknown> {
    return this.ticketsService.addMessage({ ticketId: id, authorId: user.userId, message: body.message, fileId: body.fileId });
  }

  @Patch(':id/status')
  @Roles('admin', 'org_admin', 'compliance')
  updateStatus(@Param('id') id: string, @Body() body: { status: 'open' | 'in_progress' | 'resolved' | 'closed' }): Promise<unknown> {
    return this.ticketsService.updateStatus(id, body.status);
  }
}
