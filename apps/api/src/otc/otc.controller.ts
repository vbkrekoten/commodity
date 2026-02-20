import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { OtcService } from './otc.service';

@Controller('otc-deals')
@UseGuards(JwtAuthGuard)
export class OtcController {
  constructor(private readonly otcService: OtcService) {}

  @Get()
  @Roles('org_admin', 'trader', 'compliance', 'viewer', 'admin')
  list(@CurrentUser() user: RequestUser): Promise<unknown[]> {
    return this.otcService.list(user.orgId ?? '');
  }

  @Post()
  @Roles('org_admin', 'trader', 'admin')
  create(
    @CurrentUser() user: RequestUser,
    @Body() body: { marketSlug: string; volume: number; price: number; dealDate: string; comment?: string },
  ): Promise<unknown> {
    return this.otcService.create({ ...body, organizationId: user.orgId ?? '', createdById: user.userId });
  }

  @Put(':id')
  @Roles('org_admin', 'trader', 'admin')
  update(
    @Param('id') id: string,
    @Body() body: { marketSlug?: string; volume?: number; price?: number; dealDate?: string; comment?: string },
  ): Promise<unknown> {
    return this.otcService.update(id, body);
  }

  @Delete(':id')
  @Roles('org_admin', 'trader', 'admin')
  remove(@Param('id') id: string): Promise<unknown> {
    return this.otcService.delete(id);
  }

  @Post('import')
  @Roles('org_admin', 'trader', 'admin')
  importCsv(@CurrentUser() user: RequestUser, @Body() body: { csv: string }): Promise<{ created: number }> {
    return this.otcService.importCsv(user.orgId ?? '', user.userId, body.csv);
  }

  @Get('export/csv')
  @Roles('org_admin', 'trader', 'compliance', 'viewer', 'admin')
  exportCsv(@CurrentUser() user: RequestUser): Promise<string> {
    return this.otcService.exportCsv(user.orgId ?? '');
  }
}
