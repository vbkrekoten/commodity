import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../common/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import { MailerService } from './mailer.service';

interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async register(dto: RegisterDto): Promise<{ id: string; email: string; verifyToken: string }> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const organization = dto.organizationName
      ? await this.prisma.organization.create({
          data: {
            name: dto.organizationName,
            status: 'pending',
          },
        })
      : null;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
        memberships: organization
          ? {
              create: [{ organizationId: organization.id, role: Role.org_admin }],
            }
          : undefined,
      },
    });

    const verifyToken = randomBytes(16).toString('hex');
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'auth.verify.request',
        entityType: 'user',
        entityId: user.id,
        payload: { verifyToken },
      },
    });
    await this.mailerService.sendReset(user.email, verifyToken);

    return { id: user.id, email: user.email, verifyToken };
  }

  async login(dto: LoginDto): Promise<SessionTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { memberships: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const membership = user.memberships[0];
    const role = membership?.role ?? Role.viewer;

    return this.issueTokens({
      sub: user.id,
      email: user.email,
      role,
      orgId: membership?.organizationId,
    });
  }

  async refresh(refreshToken: string): Promise<SessionTokens> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
      });
      return this.issueTokens(payload as { sub: string; email: string; role: string; orgId?: string });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgot(email: string): Promise<{ resetToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { resetToken: 'noop' };
    }

    const resetToken = randomBytes(16).toString('hex');
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'auth.forgot',
        entityType: 'user',
        entityId: user.id,
        payload: { resetToken },
      },
    });
    await this.mailerService.sendReset(email, resetToken);

    return { resetToken };
  }

  async reset(token: string, password: string): Promise<boolean> {
    const event = await this.prisma.auditLog.findFirst({
      where: {
        action: 'auth.forgot',
        payload: {
          path: ['resetToken'],
          equals: token,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!event?.userId) {
      return false;
    }

    await this.prisma.user.update({
      where: { id: event.userId },
      data: { passwordHash: await bcrypt.hash(password, 10) },
    });

    return true;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const event = await this.prisma.auditLog.findFirst({
      where: {
        action: 'auth.verify.request',
        payload: {
          path: ['verifyToken'],
          equals: token,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!event?.userId) {
      return false;
    }

    await this.prisma.user.update({
      where: { id: event.userId },
      data: { emailVerifiedAt: new Date() },
    });
    return true;
  }

  private issueTokens(payload: { sub: string; email: string; role: string; orgId?: string }): SessionTokens {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'dev_access_secret_change_me'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_TTL', '15m'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_TTL', '7d'),
    });

    return { accessToken, refreshToken };
  }
}
