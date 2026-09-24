import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const locale = request.nextUrl.pathname === '/en' || request.nextUrl.pathname.startsWith('/en/')
    ? 'en'
    : 'uk';
  requestHeaders.set('x-promedia-locale', locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/|favicon\\.ico|favicon\\.png|robots\\.txt|sitemap\\.xml|data/|img/|js/).*)'],
};
