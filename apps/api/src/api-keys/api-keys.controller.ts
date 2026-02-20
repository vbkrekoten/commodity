import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { ApiKeysService } from './api-keys.service';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
@Roles('org_admin', 'admin')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  list(@CurrentUser() user: RequestUser): Promise<unknown[]> {
    return this.apiKeysService.list(user.orgId ?? '');
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() body: { name: string; scopes: string[] }): Promise<{ id: string; key: string }> {
    return this.apiKeysService.create({
      organizationId: user.orgId ?? '',
      createdById: user.userId,
      name: body.name,
      scopes: body.scopes,
    });
  }

  @Patch(':id/revoke')
  revoke(@Param('id') id: string): Promise<unknown> {
    return this.apiKeysService.revoke(id);
  }
}
