import {
  listPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  adjustStock,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/backend/repositories/catalog.repository';
import type { Plant, PlantWithCategory, Category } from '@/backend/types';
import type {
  PlantQueryParams,
  CreatePlantRequest,
  UpdatePlantRequest,
  PaginatedResponse,
} from '@/backend/types/api';

/**
 * catalog.service.ts
 * Business logic for the product catalog and categories.
 */

// ─── Plant Operations ─────────────────────────────────────────────────────────

export async function getCatalog(
  params: PlantQueryParams
): Promise<PaginatedResponse<PlantWithCategory>> {
  const { data, total } = await listPlants(params);
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPlant(id: string): Promise<PlantWithCategory | null> {
  return getPlantById(id);
}

export async function addPlant(
  input: CreatePlantRequest
): Promise<{ success: boolean; plant?: Plant; error?: string }> {
  if (!input.name || input.name.trim().length < 2) {
    return { success: false, error: 'Nama produk minimal 2 karakter.' };
  }
  if (input.price === undefined || input.price < 0) {
    return { success: false, error: 'Harga tidak valid.' };
  }
  if (input.stock === undefined || input.stock < 0) {
    return { success: false, error: 'Stok tidak boleh negatif.' };
  }

  const plant = await createPlant(input);
  if (!plant) {
    return { success: false, error: 'Gagal menambahkan produk.' };
  }
  return { success: true, plant };
}

export async function editPlant(
  id: string,
  updates: UpdatePlantRequest
): Promise<{ success: boolean; plant?: Plant; error?: string }> {
  if (updates.price !== undefined && updates.price < 0) {
    return { success: false, error: 'Harga tidak valid.' };
  }
  if (updates.stock !== undefined && updates.stock < 0) {
    return { success: false, error: 'Stok tidak boleh negatif.' };
  }

  const plant = await updatePlant(id, updates);
  if (!plant) {
    return { success: false, error: 'Produk tidak ditemukan atau gagal diperbarui.' };
  }
  return { success: true, plant };
}

export async function removePlant(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const ok = await deletePlant(id);
  if (!ok) {
    return { success: false, error: 'Gagal menghapus produk.' };
  }
  return { success: true };
}

export async function changeStock(
  id: string,
  delta: number
): Promise<{ success: boolean; newStock?: number; error?: string }> {
  if (!Number.isInteger(delta)) {
    return { success: false, error: 'Delta stok harus bilangan bulat.' };
  }

  const result = await adjustStock(id, delta);
  if (!result) {
    return { success: false, error: 'Stok tidak mencukupi atau produk tidak ditemukan.' };
  }
  return { success: true, newStock: result.new_stock };
}

// ─── Category Operations ──────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  return listCategories();
}

export async function addCategory(input: {
  name: string;
  slug: string;
  icon_name?: string;
}): Promise<{ success: boolean; category?: Category; error?: string }> {
  if (!input.name.trim()) {
    return { success: false, error: 'Nama kategori wajib diisi.' };
  }
  const category = await createCategory(input);
  if (!category) {
    return { success: false, error: 'Gagal membuat kategori. Slug mungkin sudah digunakan.' };
  }
  return { success: true, category };
}

export async function editCategory(
  id: string,
  updates: Partial<{ name: string; slug: string; icon_name: string }>
): Promise<{ success: boolean; category?: Category; error?: string }> {
  const category = await updateCategory(id, updates);
  if (!category) {
    return { success: false, error: 'Kategori tidak ditemukan atau gagal diperbarui.' };
  }
  return { success: true, category };
}

export async function removeCategory(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const ok = await deleteCategory(id);
  if (!ok) return { success: false, error: 'Gagal menghapus kategori.' };
  return { success: true };
}
