import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { ReferenceService } from './reference.service';

@Controller()
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get('markets')
  markets(): Promise<unknown[]> {
    return this.referenceService.markets();
  }

  @Get('markets/:slug')
  marketBySlug(@Param('slug') slug: string): Promise<unknown | null> {
    return this.referenceService.marketBySlug(slug);
  }

  @Post('admin/markets')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  upsertMarket(@Body() body: { id?: string; slug: string; title: string; description: string; tags?: string[] }): Promise<unknown> {
    return this.referenceService.upsertMarket(body);
  }

  @Get('prices')
  prices(@Query('marketSlug') marketSlug?: string): Promise<unknown[]> {
    return this.referenceService.prices(marketSlug);
  }

  @Get('indices')
  indices(): Promise<unknown[]> {
    return this.referenceService.indices();
  }

  @Get('indices/:slug')
  indexBySlug(@Param('slug') slug: string): Promise<unknown | null> {
    return this.referenceService.indexBySlug(slug);
  }

  @Get('documents')
  documents(@Query('category') category?: string, @Query('marketSlug') marketSlug?: string): Promise<unknown[]> {
    return this.referenceService.documents({ category, marketSlug });
  }

  @Post('admin/documents')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  upsertDocument(
    @Body()
    body: {
      id?: string;
      slug: string;
      title: string;
      category: string;
      version: string;
      effectiveDate: string;
      tags: string[];
      marketId?: string;
      fileUrl?: string;
    },
  ): Promise<unknown> {
    return this.referenceService.upsertDocument(body);
  }

  @Get('news')
  news(): Promise<unknown[]> {
    return this.referenceService.news();
  }

  @Get('news/:slug')
  newsBySlug(@Param('slug') slug: string): Promise<unknown | null> {
    return this.referenceService.newsBySlug(slug);
  }

  @Post('admin/news')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  upsertNews(
    @Body() body: { id?: string; slug: string; title: string; summary: string; body: string; tags: string[]; publishedAt: string },
  ): Promise<unknown> {
    return this.referenceService.upsertNews(body);
  }
}
