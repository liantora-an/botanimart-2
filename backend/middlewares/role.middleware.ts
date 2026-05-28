import type { AuthenticatedUser } from './auth.middleware';

/**
 * role.middleware.ts
 * Enforces role-based access control after authentication.
 */

/**
 * Requires Admin role. Call after requireAuth() resolves.
 * Returns 403 Response when user is not Admin.
 */
export function requireAdmin(user: AuthenticatedUser): Response | null {
  if (user.role !== 'Admin') {
    return Response.json(
      { success: false, error: 'Forbidden. Admin access required.' },
      { status: 403 }
    );
  }
  return null; // null means OK — no error
}

/**
 * Checks if user is Admin (non-throwing).
 */
export function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === 'Admin';
}
