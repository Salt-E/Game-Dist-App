// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Define protected and auth routes
  const isProtectedRoute = ['/dashboard', '/library', '/family', '/store'].some(
    path => req.nextUrl.pathname.startsWith(path)
  );
  
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');

  // If there's no session and trying to access protected route
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/auth', req.url);
    // Store the original URL to redirect back after auth
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and trying to access auth route
  if (session && isAuthRoute) {
    // Get the intended destination or default to dashboard
    const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/library/:path*',
    '/family/:path*',
    '/store/:path*',
    '/auth/:path*'
  ]
}