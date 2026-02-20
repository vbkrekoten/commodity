import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { MailerService } from './mailer.service';
import { PrismaService } from '../common/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    organization: { create: jest.fn() },
    auditLog: { create: jest.fn(), findFirst: jest.fn() },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: MailerService,
          useValue: { sendReset: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: (_key: string, fallback: string) => fallback,
          },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it('throws on invalid credentials', async () => {
    prismaMock.user.findUnique = jest.fn().mockResolvedValue(null);
    await expect(service.login({ email: 'x', password: 'y' })).rejects.toThrow(UnauthorizedException);
  });
});
