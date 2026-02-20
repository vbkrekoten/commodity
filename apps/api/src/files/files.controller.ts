import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { FilesService } from './files.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('presign')
  presign(@Body() body: { filename: string; mimeType: string }): Promise<{ objectKey: string; url: string }> {
    return this.filesService.presign(body);
  }

  @Post('confirm')
  confirm(
    @Body() body: { objectKey: string; originalName: string; mimeType: string; size: number },
    @CurrentUser() user: RequestUser,
  ): Promise<unknown> {
    return this.filesService.confirm({ ...body, uploadedById: user.userId });
  }
}
