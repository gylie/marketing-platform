import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (path.startsWith('/admin') && token?.role !== 'MASTER_ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (path.startsWith('/partner') && token?.role !== 'PARTNER') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (path.startsWith('/client') && token?.role !== 'CLIENT') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/partner/:path*', '/client/:path*'],
}
