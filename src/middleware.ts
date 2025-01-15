import { getAuthenticationResult } from '@nhost/nhost-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  authUrl: process.env.NEXT_PUBLIC_NHOST_AUTH_URL!
  
  // List of public routes that don't require authentication
  const publicRoutes = ['/auth', '/api/summarize']
  
  if (!getAuthenticationResult && !publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}