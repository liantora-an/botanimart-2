import { createClient } from '@/lib/supabase/server';
import type { Activity } from '@/backend/types';
import type { CreateActivityRequest, UpdateActivityRequest } from '@/backend/types/api';

/**
 * activity.repository.ts
 * Data access layer for the public.activities table.
 */

/**
 * Lists published activities, newest first. Paginated.
 */
export async function listActivities(params: {
  page?: number;
  limit?: number;
  published?: boolean;
}): Promise<{ data: Activity[]; total: number }> {
  const supabase = await createClient();

  const page = params.page ?? 1;
  const limit = Math.min(params.limit ?? 10, 50);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('activities')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params.published !== undefined) {
    query = query.eq('published', params.published);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[activity.repository] listActivities error:', error.message);
    return { data: [], total: 0 };
  }
  return { data: (data ?? []) as Activity[], total: count ?? 0 };
}

/**
 * Fetches a single activity by ID.
 */
export async function getActivityById(id: string): Promise<Activity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Activity;
}

/**
 * Fetches a single activity by slug.
 */
export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) return null;
  return data as Activity;
}

/**
 * Creates a new activity.
 */
export async function createActivity(
  input: CreateActivityRequest
): Promise<Activity | null> {
  const supabase = await createClient();
  const slug = generateSlug(input.title);

  const { data, error } = await supabase
    .from('activities')
    .insert({
      ...input,
      slug,
      published: input.published ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error('[activity.repository] createActivity error:', error.message);
    return null;
  }
  return data as Activity;
}

/**
 * Updates an activity by ID.
 */
export async function updateActivity(
  id: string,
  updates: UpdateActivityRequest
): Promise<Activity | null> {
  const supabase = await createClient();

  const payload: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
  };
  if (updates.title) {
    payload.slug = generateSlug(updates.title);
  }

  const { data, error } = await supabase
    .from('activities')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[activity.repository] updateActivity error:', error.message);
    return null;
  }
  return data as Activity;
}

/**
 * Deletes an activity by ID.
 */
export async function deleteActivity(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) {
    console.error('[activity.repository] deleteActivity error:', error.message);
    return false;
  }
  return true;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    + '-' + Date.now().toString(36);
}
