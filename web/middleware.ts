import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';

const CANONICAL_HOST = 'www.solutionsimpactweb.ca';

// Create next-intl middleware
// Using 'always' prefix to prevent redirect loop with manual / -> /fr redirect
const intlMiddleware = createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  localeDetection: false,
});

/**
 * Check if user is authenticated as admin via Supabase
 * Uses Supabase SSR helpers for cookie-based auth
 */
async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase is not configured, allow access in dev mode only
    return process.env.NODE_ENV === 'development';
  }

  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // For now, allow any authenticated user
    // In production, you might want to check for a specific email domain or user metadata
    return !!user;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const isAuthenticated = await isAdminAuthenticated(request);
    if (!isAuthenticated) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Allow access to /admin/login without auth
  if (pathname === '/admin/login') {
    const isAuthenticated = await isAdminAuthenticated(request);
    if (isAuthenticated) {
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  // PRODUCTION ONLY: Force canonical host and HTTPS
  // In development, skip host checks to allow localhost testing
  if (process.env.NODE_ENV === 'production') {
    if (hostname !== CANONICAL_HOST) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      url.port = '';
      return NextResponse.redirect(url, 308);
    }

    // Ensure HTTPS in production
    if (request.nextUrl.protocol !== 'https:') {
      url.protocol = 'https:';
      return NextResponse.redirect(url, 308);
    }
  }

  // Root redirect: Redirect / to /fr (explicit redirect)
  // This ensures the Header component's smooth scrolling works correctly
  // since it expects /fr as the home path for path comparisons.
  // Applied in both dev and prod to maintain consistency.
  if (pathname === '/') {
    url.pathname = '/fr';
    return NextResponse.redirect(url, 308);
  }

  // Run next-intl middleware for locale handling
  // Note: We need to use 'always' prefix mode to prevent next-intl from
  // redirecting /fr back to /, which would create a loop
  return intlMiddleware(request);
}

// Export static config (Next.js requires static config, not conditional)
// The middleware function handles dev/prod logic internally
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

