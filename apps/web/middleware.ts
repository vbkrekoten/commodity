import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface AccessPayload {
  role?: string;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/cabinet')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;
  if (!token && pathname !== '/cabinet/login' && pathname !== '/cabinet/register') {
    return NextResponse.redirect(new URL('/cabinet/login', request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret_change_me');
      const payload = (await jwtVerify(token, secret)).payload as AccessPayload;

      if (pathname.startsWith('/cabinet/admin') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/cabinet', request.url));
      }

      if ((pathname === '/cabinet/login' || pathname === '/cabinet/register') && payload.role) {
        return NextResponse.redirect(new URL('/cabinet', request.url));
      }
    } catch {
      if (pathname !== '/cabinet/login' && pathname !== '/cabinet/register') {
        return NextResponse.redirect(new URL('/cabinet/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cabinet/:path*'],
};
