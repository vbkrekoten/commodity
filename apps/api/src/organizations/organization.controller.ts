import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { OrganizationService } from './organization.service';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @Roles('admin')
  list(): Promise<unknown[]> {
    return this.organizationService.list();
  }

  @Patch(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }): Promise<unknown> {
    return this.organizationService.updateStatus(id, body.status);
  }

  @Get('me/members')
  @Roles('org_admin', 'compliance', 'viewer', 'trader', 'admin')
  members(@CurrentUser() user: RequestUser): Promise<unknown[]> {
    return this.organizationService.members(user.orgId ?? '');
  }
}
