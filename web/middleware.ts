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

  // Let next-intl handle all locale routing
  // With localePrefix: 'as-needed' and defaultLocale: 'fr':
  // - / serves French content (no prefix needed for default locale)
  // - /fr redirects to / (default locale doesn't need prefix)
  // - /en serves English content (prefix required for non-default locale)
  // Note: Domain redirects (.com to .ca, non-www to www) should be handled
  // by Vercel's domain settings to avoid redirect loops
  return intlMiddleware(request);
}

// Export static config (Next.js requires static config, not conditional)
// The middleware function handles dev/prod logic internally
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

