import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export function middleware(request: NextRequest) {
  // IN DEVELOPMENT: DO ABSOLUTELY NOTHING - NO REDIRECTS EVER
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  
  // Root redirect: Redirect / to /fr (explicit redirect)
  // Note: Domain redirects (.com to .ca, non-www to www) should be handled
  // by Vercel's domain settings to avoid redirect loops
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/fr';
    return NextResponse.redirect(url, 308);
  }

  // Run next-intl middleware for locale handling in production
  return intlMiddleware(request);
}

// Export static config (Next.js requires static config, not conditional)
// The middleware function handles dev/prod logic internally
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

