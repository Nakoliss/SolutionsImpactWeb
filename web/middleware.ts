import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['fr'], // English temporarily disabled
  defaultLocale: 'fr',
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split('/')[1];

  // Redirect all English requests to French
  if (locale === 'en') {
    const frenchPath = pathname.replace('/en', '/fr');
    return NextResponse.redirect(new URL(frenchPath, request.url));
  }

  // If no locale or root path, redirect to French
  if (pathname === '/' || !locale) {
    return NextResponse.redirect(new URL('/fr', request.url));
  }

  const response = intlMiddleware(request);

  if (locale === 'fr') {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/', '/(fr|en)/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
