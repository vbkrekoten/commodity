import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { AuditService } from './audit.service';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
@Roles('admin', 'org_admin', 'compliance')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(): Promise<unknown[]> {
    return this.auditService.list();
  }
}
