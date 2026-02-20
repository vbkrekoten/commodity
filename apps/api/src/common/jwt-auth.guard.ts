import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ cookies?: Record<string, string> }>();
    if (!request.cookies?.access_token) {
      throw new UnauthorizedException('Unauthorized');
    }
    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
