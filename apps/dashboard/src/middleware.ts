import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes (no auth required)
  const publicRoutes = ['/login', '/register', '/forgot-password'];

  // Check if user has auth token (JWT in cookies)
  const token = request.cookies.get('auth-token')?.value;

  // Redirect to login if accessing protected routes without token
  if (!token && !publicRoutes.includes(pathname) && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to onboarding or app if already authenticated and trying to access auth pages
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // Redirect root to app or login depending on auth status
  if (pathname === '/') {
    return NextResponse.redirect(new URL(token ? '/app' : '/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
