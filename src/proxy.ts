import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * proxy.ts  (Next.js 16 — replaces middleware.ts)
 *
 * Runs before every request to:
 * 1. Refresh Supabase session cookies
 * 2. Protect routes based on auth state and user role
 *
 * NOTE: Proxy in Next.js 16 defaults to Node.js runtime.
 * We read role from cookies only (optimistic check) — DB
 * checks happen in route handlers via auth.middleware.ts.
 */

// ─── Route Categories ─────────────────────────────────────────────────────────

const ADMIN_ROUTES = ['/admin'];
const AUTH_REQUIRED_ROUTES = ['/keranjang', '/checkout', '/akun'];
const AUTH_PAGE_ROUTES = ['/login', '/register'];

// ─── Supabase session refresh helper ─────────────────────────────────────────

async function refreshSession(request: NextRequest): Promise<{
  response: NextResponse;
  userId: string | null;
}> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, userId: user?.id ?? null };
}

// ─── Proxy Function ───────────────────────────────────────────────────────────

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Refresh Supabase session on every request
  const { response, userId } = await refreshSession(request);

  const isAuthenticated = !!userId;

  // 1. Protect /admin routes
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Role check happens server-side in route handlers — proxy does optimistic check only
    // Admin pages themselves will handle role validation via requireAdmin()
  }

  // 2. Protect user-only routes (cart, checkout, account)
  const isAuthRequired = AUTH_REQUIRED_ROUTES.some((r) =>
    pathname.startsWith(r)
  );
  if (isAuthRequired && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Redirect authenticated users away from login/register pages
  const isAuthPage = AUTH_PAGE_ROUTES.some((r) => pathname.startsWith(r));
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Run proxy on all paths EXCEPT:
     * - api routes (protected by route-level middleware)
     * - _next/static, _next/image (static assets)
     * - favicon.ico, public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp|css|js)$).*)',
  ],
};
