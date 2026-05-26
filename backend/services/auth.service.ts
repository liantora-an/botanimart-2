import { createClient } from '@/lib/supabase/server';
import { createUserProfile, getUserById } from '@/backend/repositories/user.repository';
import type { User } from '@/backend/types';

/**
 * auth.service.ts
 * Business logic for authentication flows.
 */

export interface SignUpResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface SignInResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Registers a new user with Supabase Auth and creates their profile.
 */
export async function signUp(params: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}): Promise<SignUpResult> {
  const supabase = await createClient();

  // 1. Register with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message ?? 'Registrasi gagal. Silakan coba lagi.',
    };
  }

  // 2. Create public profile row
  const profile = await createUserProfile({
    id: authData.user.id,
    email: params.email,
    full_name: params.full_name,
    phone: params.phone,
    role: 'User',
  });

  if (!profile) {
    // Auth user was created but profile failed — still return partial success
    // The trigger on the DB will handle this if configured
    return {
      success: true,
      user: {
        id: authData.user.id,
        email: params.email,
        full_name: params.full_name,
        phone: params.phone ?? null,
        address: null,
        role: 'User',
        created_at: new Date().toISOString(),
      },
    };
  }

  return { success: true, user: profile };
}

/**
 * Signs in a user with email + password.
 */
export async function signIn(params: {
  email: string;
  password: string;
}): Promise<SignInResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: 'Email atau kata sandi salah. Silakan coba lagi.',
    };
  }

  // Fetch full profile for role info
  const profile = await getUserById(data.user.id);

  return {
    success: true,
    user: profile ?? {
      id: data.user.id,
      email: data.user.email ?? '',
      full_name: null,
      phone: null,
      address: null,
      role: 'User',
      created_at: data.user.created_at,
    },
  };
}

/**
 * Signs out the current user.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/**
 * Returns the current authenticated user profile.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;
  return getUserById(authUser.id);
}
