import { createClient } from '@/lib/supabase/server';
import type { User } from '@/backend/types';

/**
 * auth.middleware.ts
 * Verifies that the incoming request has a valid Supabase session.
 * Returns the authenticated user or throws an error.
 */

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'User' | 'Admin';
}

/**
 * Resolves the current user from the Supabase SSR session.
 * Returns null when no session exists.
 */
export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  // Fetch role from public.users table
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', authUser.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    role: profile.role as 'User' | 'Admin',
  };
}

/**
 * Requires authentication. Returns the user or a 401 Response.
 */
export async function requireAuth(): Promise<AuthenticatedUser | Response> {
  const user = await getSessionUser();
  if (!user) {
    return Response.json(
      { success: false, error: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }
  return user;
}
