import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path is a protected route
  const isProtectedRoute = path === '/tryon' || path === '/dashboard' || path.startsWith('/dashboard/');
  
  // Check for authentication via session or token cookie
  // Note: In a real app, you'd verify this token on the server
  const authSession = request.cookies.get('auth-session')?.value;
  
  // For development/testing: also check localStorage if available
  const isAuthenticated = !!authSession;
  
  // If the route is protected and user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('redirectTo', path);
    return NextResponse.redirect(url);
  }
  
  // Continue with the request if authenticated or not a protected route
  return NextResponse.next();
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: ['/tryon', '/tryon/:path*', '/dashboard', '/dashboard/:path*']
}; 