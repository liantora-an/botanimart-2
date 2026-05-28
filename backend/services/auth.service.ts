import { createClient } from '@/lib/supabase/server';
import { createUserProfile, getUserById, updateUserProfile } from '@/backend/repositories/user.repository';
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

  // 1. Register with Supabase Auth (passing raw metadata for DB triggers)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.full_name,
        phone: params.phone,
      }
    }
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message ?? 'Registrasi gagal. Silakan coba lagi.',
    };
  }

  // 2. Update profile row if trigger already ran, otherwise create it
  let profile = await updateUserProfile(authData.user.id, {
    full_name: params.full_name,
    phone: params.phone,
  });

  if (!profile) {
    profile = await createUserProfile({
      id: authData.user.id,
      email: params.email,
      full_name: params.full_name,
      phone: params.phone,
      role: 'User',
    });
  }

  // Clear auto-login session from cookie store so user is not automatically logged in
  try {
    await supabase.auth.signOut();
  } catch (signOutErr) {
    console.warn('[signUp] Failed to clear auto-login session:', signOutErr);
  }

  if (!profile) {
    // Return temporary user info if DB operations failed
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
  let profile = await getUserById(data.user.id);
  if (!profile) {
    // Self-healing: if the user exists in Supabase Auth but their public profile row is missing, recreate it!
    profile = await createUserProfile({
      id: data.user.id,
      email: data.user.email ?? '',
      full_name: data.user.user_metadata?.full_name || 'Pengguna',
      phone: data.user.user_metadata?.phone || undefined,
      role: 'User',
    });
  }

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

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  let profile = await getUserById(authUser.id);
  if (!profile) {
    // Stale session detected: user has auth credentials but no public profile
    // (e.g. they deleted their account row from public.users)
    // Self-healing: recreate public profile row if deleted but auth session is active
    profile = await createUserProfile({
      id: authUser.id,
      email: authUser.email ?? '',
      full_name: authUser.user_metadata?.full_name || 'Pengguna',
      phone: authUser.user_metadata?.phone || undefined,
      role: 'User',
    });

    if (!profile) {
      // Re-creation failed, sign out to clear browser cookies and prevent redirect loops
      await supabase.auth.signOut();
      return null;
    }
  }

  return profile;
}

/**
 * Updates the current user's profile and auth metadata.
 */
export async function updateCurrentUser(
  userId: string,
  updates: { full_name?: string; phone?: string; address?: string }
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Sync full name and phone with Supabase Auth user metadata
  if (updates.full_name || updates.phone) {
    try {
      const supabase = await createClient();
      const metadata: Record<string, any> = {};
      if (updates.full_name) metadata.full_name = updates.full_name;
      if (updates.phone) metadata.phone = updates.phone;

      const { error: authErr } = await supabase.auth.updateUser({
        data: metadata
      });
      if (authErr) {
        console.warn('[auth.service] Failed to update auth metadata:', authErr.message);
      }
    } catch (err: any) {
      console.warn('[auth.service] Auth metadata update exception:', err.message || err);
    }
  }

  const profile = await updateUserProfile(userId, updates);
  if (!profile) {
    return { success: false, error: 'Gagal memperbarui profil di database.' };
  }

  return { success: true, user: profile };
}
