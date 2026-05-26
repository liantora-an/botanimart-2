import { createClient } from '@/lib/supabase/server';
import type { User } from '@/backend/types';

/**
 * user.repository.ts
 * Data access layer for the public.users table.
 * All Supabase queries for user profiles live here.
 */

/**
 * Fetches a user profile by their auth UUID.
 */
export async function getUserById(id: string): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as User;
}

/**
 * Creates a new user profile row in public.users.
 * Called after Supabase Auth sign-up succeeds.
 */
export async function createUserProfile(params: {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role?: 'User' | 'Admin';
}): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: params.id,
      email: params.email,
      full_name: params.full_name ?? null,
      phone: params.phone ?? null,
      role: params.role ?? 'User',
    })
    .select()
    .single();

  if (error) {
    console.error('[user.repository] createUserProfile error:', error.message);
    return null;
  }
  return data as User;
}

/**
 * Updates a user profile (name, phone, address).
 */
export async function updateUserProfile(
  id: string,
  updates: Partial<Pick<User, 'full_name' | 'phone' | 'address'>>
): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data as User;
}

/**
 * Gets user role by auth UUID (used in middleware).
 */
export async function getUserRole(id: string): Promise<'User' | 'Admin' | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data.role as 'User' | 'Admin';
}

/**
 * Lists all users — Admin only feature.
 */
export async function listUsers(): Promise<User[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as User[];
}
