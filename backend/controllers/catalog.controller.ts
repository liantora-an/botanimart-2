import {
  getCatalog,
  getPlant,
  addPlant,
  editPlant,
  removePlant,
  changeStock,
  getCategories,
  addCategory,
  editCategory,
  removeCategory,
} from '@/backend/services/catalog.service';
import type { PlantQueryParams, CreatePlantRequest, UpdatePlantRequest } from '@/backend/types/api';

/**
 * catalog.controller.ts
 * Handles HTTP request/response for catalog endpoints.
 */

export async function handleListPlants(searchParams: URLSearchParams): Promise<Response> {
  const params: PlantQueryParams = {
    page: Number(searchParams.get('page') ?? 1),
    limit: Number(searchParams.get('limit') ?? 12),
    search: searchParams.get('search') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    sort: (searchParams.get('sort') as PlantQueryParams['sort']) ?? 'newest',
    is_recommended: searchParams.has('is_recommended')
      ? searchParams.get('is_recommended') === 'true'
      : undefined,
    tags: searchParams.get('tags') ?? undefined,
  };

  const result = await getCatalog(params);
  return Response.json({ success: true, data: result });
}

export async function handleGetPlant(id: string): Promise<Response> {
  const plant = await getPlant(id);
  if (!plant) {
    return Response.json(
      { success: false, error: 'Produk tidak ditemukan.' },
      { status: 404 }
    );
  }
  return Response.json({ success: true, data: plant });
}

export async function handleCreatePlant(body: CreatePlantRequest): Promise<Response> {
  if (!body.name || body.price === undefined || body.stock === undefined) {
    return Response.json(
      { success: false, error: 'Nama, harga, dan stok wajib diisi.' },
      { status: 400 }
    );
  }

  const result = await addPlant(body);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, data: result.plant }, { status: 201 });
}

export async function handleUpdatePlant(
  id: string,
  body: UpdatePlantRequest
): Promise<Response> {
  const result = await editPlant(id, body);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, data: result.plant });
}

export async function handleDeletePlant(id: string): Promise<Response> {
  const result = await removePlant(id);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, message: 'Produk berhasil dihapus.' });
}

export async function handleAdjustStock(
  id: string,
  body: { delta: number }
): Promise<Response> {
  if (typeof body.delta !== 'number') {
    return Response.json(
      { success: false, error: 'Field delta harus berupa angka.' },
      { status: 400 }
    );
  }
  const result = await changeStock(id, body.delta);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, data: { stock: result.newStock } });
}

// ─── Category Handlers ────────────────────────────────────────────────────────

export async function handleListCategories(): Promise<Response> {
  const categories = await getCategories();
  return Response.json({ success: true, data: categories });
}

export async function handleCreateCategory(body: {
  name: string;
  slug: string;
  icon_name?: string;
}): Promise<Response> {
  if (!body.name || !body.slug) {
    return Response.json(
      { success: false, error: 'Nama dan slug wajib diisi.' },
      { status: 400 }
    );
  }
  const result = await addCategory(body);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, data: result.category }, { status: 201 });
}

export async function handleUpdateCategory(
  id: string,
  body: Partial<{ name: string; slug: string; icon_name: string }>
): Promise<Response> {
  const result = await editCategory(id, body);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, data: result.category });
}

export async function handleDeleteCategory(id: string): Promise<Response> {
  const result = await removeCategory(id);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, message: 'Kategori berhasil dihapus.' });
}
