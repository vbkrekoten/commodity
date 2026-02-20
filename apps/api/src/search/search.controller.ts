import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query('q') q = ''): Promise<{ markets: unknown[]; docs: unknown[]; news: unknown[]; faq: unknown[] }> {
    return this.searchService.search(q);
  }
}
