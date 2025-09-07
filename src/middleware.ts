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
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/about',
  '/contact',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);
  
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  console.log(`Middleware: isProtectedRoute=${isProtectedRoute}, isPublicRoute=${isPublicRoute}, isAuthenticated=${isAuthenticated}`);
  if (isProtectedRoute && !isAuthenticated) {
    // Store the attempted URL for redirect after login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/home', request.url));
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