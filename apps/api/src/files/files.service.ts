import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class FilesService {
  private readonly minioClient: Client;
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.bucket = this.configService.get<string>('MINIO_BUCKET', 'files');
    this.minioClient = new Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: Number(this.configService.get<string>('MINIO_PORT', 9000)),
      useSSL: this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  async ensureBucket(): Promise<void> {
    const exists = await this.minioClient.bucketExists(this.bucket);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucket, 'us-east-1');
    }
  }

  async presign(input: { filename: string; mimeType: string }): Promise<{ objectKey: string; url: string }> {
    await this.ensureBucket();
    const objectKey = `${Date.now()}-${input.filename}`;
    const url = await this.minioClient.presignedPutObject(this.bucket, objectKey, 60 * 10);
    return { objectKey, url };
  }

  async confirm(input: {
    objectKey: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedById?: string;
  }): Promise<unknown> {
    await this.ensureBucket();
    return this.prisma.file.create({
      data: {
        bucket: this.bucket,
        objectKey: input.objectKey,
        originalName: input.originalName,
        mimeType: input.mimeType,
        size: input.size,
        uploadedById: input.uploadedById,
      },
    });
  }
}
