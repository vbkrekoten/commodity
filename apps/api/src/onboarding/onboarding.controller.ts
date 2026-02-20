import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('cases')
  list(@CurrentUser() user: RequestUser): Promise<unknown[]> {
    return this.onboardingService.listByOrg(user.orgId ?? '');
  }

  @Post('cases')
  create(@CurrentUser() user: RequestUser): Promise<unknown> {
    return this.onboardingService.create(user.orgId ?? '', user.userId);
  }

  @Post('documents')
  attach(@Body() body: { onboardingCaseId: string; fileId: string; type: string }): Promise<unknown> {
    return this.onboardingService.attachDocument(body);
  }
}
