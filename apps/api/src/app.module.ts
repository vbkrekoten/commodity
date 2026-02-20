import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './common/prisma.service';
import { RolesGuard } from './common/roles.guard';
import { AuthModule } from './auth/auth.module';
import { ReferenceModule } from './markets/reference.module';
import { SearchModule } from './search/search.module';
import { FilesModule } from './files/files.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { OtcModule } from './otc/otc.module';
import { TicketsModule } from './tickets/tickets.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { AuditModule } from './audit/audit.module';
import { OrganizationModule } from './organizations/organization.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OrganizationModule,
    ReferenceModule,
    SearchModule,
    FilesModule,
    OnboardingModule,
    OtcModule,
    TicketsModule,
    ApiKeysModule,
    AuditModule,
  ],
  providers: [PrismaService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
