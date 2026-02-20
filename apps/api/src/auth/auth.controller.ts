import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentUser, RequestUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { AuthService } from './auth.service';
import { ForgotDto, LoginDto, RegisterDto, ResetDto, VerifyEmailDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto): Promise<{ id: string; email: string; verifyToken: string }> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<{ ok: true }> {
    const tokens = await this.authService.login(dto);
    response.cookie('access_token', tokens.accessToken, { httpOnly: true, sameSite: 'lax', path: '/' });
    response.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, sameSite: 'lax', path: '/' });
    return { ok: true };
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<{ ok: true }> {
    const refreshToken = request.cookies?.refresh_token;
    const tokens = await this.authService.refresh(refreshToken);
    response.cookie('access_token', tokens.accessToken, { httpOnly: true, sameSite: 'lax', path: '/' });
    response.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, sameSite: 'lax', path: '/' });
    return { ok: true };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): { ok: true } {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return { ok: true };
  }

  @Post('forgot')
  forgot(@Body() dto: ForgotDto): Promise<{ resetToken: string }> {
    return this.authService.forgot(dto.email);
  }

  @Post('reset')
  reset(@Body() dto: ResetDto): Promise<boolean> {
    return this.authService.reset(dto.token, dto.password);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto): Promise<boolean> {
    return this.authService.verifyEmail(dto.token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: RequestUser): RequestUser {
    return user;
  }
}
