// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/home',
  '/practice',
  '/packs',
  '/profile',
  '/settings',
];

// Define public routes that don't require authentication
// Note: Currently not used in middleware logic but kept for future reference

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Check for session cookie (backend sets this as httpOnly)
  // Note: We can't read httpOnly cookies in middleware, so we'll be less strict
  // and rely on client-side auth initialization to handle authentication
  const hasSessionCookie =
    request.cookies.has('JSESSIONID') ||
    request.cookies.has('jwt-token') ||
    request.cookies.has('auth-session'); // Check common session cookie names

  console.log(
    `Middleware: isProtectedRoute=${isProtectedRoute}, hasSessionCookie=${hasSessionCookie}`
  );

  // For protected routes without a session cookie, redirect to login
  // Note: This is a basic check - full auth validation happens client-side
  if (isProtectedRoute && !hasSessionCookie) {
    // Store the attempted URL for redirect after login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
