import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('nhostRefreshToken')

  // List of public routes that don't require authentication
  const publicRoutes = ['/auth', '/api/webhook']

  if (!authCookie && !publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    // Redirect to auth page if not authenticated and not accessing a public route
    return NextResponse.redirect(new URL('/auth', process.env.NEXT_PUBLIC_URL!))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next/static|favicon.ico).*)',
}

