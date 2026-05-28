import { createClient } from '@/lib/supabase/server';
import type { Plant, PlantWithCategory, Category } from '@/backend/types';
import type { PlantQueryParams, CreatePlantRequest, UpdatePlantRequest } from '@/backend/types/api';

/**
 * catalog.repository.ts
 * Data access layer for the public.plants and public.categories tables.
 */

const PLANT_SELECT = `
  *,
  category:categories (id, name, slug, icon_name)
`;

// ─── Plant Queries ────────────────────────────────────────────────────────────

/**
 * Lists plants with optional filtering, sorting, and pagination.
 */
export async function listPlants(params: PlantQueryParams = {}): Promise<{
  data: PlantWithCategory[];
  total: number;
}> {
  const supabase = await createClient();

  const page = params.page ?? 1;
  const limit = Math.min(params.limit ?? 12, 50);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('plants')
    .select(PLANT_SELECT, { count: 'exact' });

  // Filters
  if (params.is_recommended !== undefined) {
    query = query.eq('is_recommended', params.is_recommended);
  }
  if (params.category) {
    query = query.eq('categories.slug', params.category);
  }
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`);
  }
  if (params.tags) {
    query = query.contains('tags', [params.tags]);
  }

  // Sorting
  switch (params.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'popular':
      query = query.order('sold_count', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  // Pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('[catalog.repository] listPlants error:', error.message);
    return { data: [], total: 0 };
  }

  return { data: (data ?? []) as PlantWithCategory[], total: count ?? 0 };
}

/**
 * Fetches a single plant by UUID.
 */
export async function getPlantById(id: string): Promise<PlantWithCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('plants')
    .select(PLANT_SELECT)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as PlantWithCategory;
}

/**
 * Fetches a single plant by slug.
 */
export async function getPlantBySlug(slug: string): Promise<PlantWithCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('plants')
    .select(PLANT_SELECT)
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as PlantWithCategory;
}

/**
 * Creates a new plant record.
 */
export async function createPlant(input: CreatePlantRequest): Promise<Plant | null> {
  const supabase = await createClient();
  const slug = generateSlug(input.name);

  const { data, error } = await supabase
    .from('plants')
    .insert({
      ...input,
      slug,
      unit: input.unit ?? 'buah',
      is_recommended: input.is_recommended ?? false,
      pickup_methods: input.pickup_methods ?? ['Kirim', 'Ambil Langsung'],
      tags: input.tags ?? [],
    })
    .select()
    .single();

  if (error) {
    console.error('[catalog.repository] createPlant error:', error.message);
    return null;
  }
  return data as Plant;
}

/**
 * Updates plant fields. Only updates provided fields.
 */
export async function updatePlant(
  id: string,
  updates: UpdatePlantRequest
): Promise<Plant | null> {
  const supabase = await createClient();

  const payload: Record<string, unknown> = { ...updates, updated_at: new Date().toISOString() };
  if (updates.name) {
    payload.slug = generateSlug(updates.name);
  }

  const { data, error } = await supabase
    .from('plants')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[catalog.repository] updatePlant error:', error.message);
    return null;
  }
  return data as Plant;
}

/**
 * Deletes a plant. Returns true on success.
 */
export async function deletePlant(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('plants').delete().eq('id', id);
  if (error) {
    console.error('[catalog.repository] deletePlant error:', error.message);
    return false;
  }
  return true;
}

/**
 * Atomically adjusts stock. Positive delta = add stock, negative = remove.
 * Returns the new stock value, or null if insufficient stock.
 */
export async function adjustStock(
  id: string,
  delta: number
): Promise<{ new_stock: number } | null> {
  const supabase = await createClient();

  // Use RPC for atomic update with check
  const { data, error } = await supabase.rpc('adjust_plant_stock', {
    p_plant_id: id,
    p_delta: delta,
  });

  if (error) {
    console.error('[catalog.repository] adjustStock error:', error.message);
    return null;
  }
  return data as { new_stock: number };
}

/**
 * Decrements stock for multiple plants atomically after payment.
 * Returns false if any plant has insufficient stock.
 */
export async function decrementStockForOrder(
  items: Array<{ plant_id: string; quantity: number }>
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('decrement_stock_for_order', {
    p_items: items,
  });

  if (error) {
    console.error('[catalog.repository] decrementStockForOrder error:', error.message);
    return false;
  }
  return data === true;
}

// ─── Category Queries ─────────────────────────────────────────────────────────

export async function listCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) return [];
  return (data ?? []) as Category[];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Category;
}

export async function createCategory(input: {
  name: string;
  slug: string;
  icon_name?: string;
}): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('[catalog.repository] createCategory error:', error.message);
    return null;
  }
  return data as Category;
}

export async function updateCategory(
  id: string,
  updates: Partial<{ name: string; slug: string; icon_name: string }>
): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  return !error;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    + '-' + Math.random().toString(36).slice(2, 7);
}
