import {
  getActivities,
  getActivity,
  addActivity,
  editActivity,
  removeActivity,
} from '@/backend/services/activity.service';
import type { CreateActivityRequest, UpdateActivityRequest } from '@/backend/types/api';

/**
 * activity.controller.ts
 * Handles HTTP request/response for activity/kegiatan endpoints.
 */

export async function handleListActivities(
  searchParams: URLSearchParams,
  adminMode = false
): Promise<Response> {
  const result = await getActivities({
    page: Number(searchParams.get('page') ?? 1),
    limit: Number(searchParams.get('limit') ?? 10),
    publishedOnly: !adminMode, // admin can see all, public sees only published
  });
  return Response.json({ success: true, data: result });
}

export async function handleGetActivity(id: string): Promise<Response> {
  const result = await getActivity(id);
  if (!result.success) {
    return Response.json(
      { success: false, error: result.error },
      { status: 404 }
    );
  }
  return Response.json({ success: true, data: result.activity });
}

export async function handleCreateActivity(
  body: CreateActivityRequest
): Promise<Response> {
  if (!body.title || !body.author || !body.summary || !body.category) {
    return Response.json(
      { success: false, error: 'Judul, penulis, kategori, dan ringkasan wajib diisi.' },
      { status: 400 }
    );
  }

  const result = await addActivity(body);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, data: result.activity }, { status: 201 });
}

export async function handleUpdateActivity(
  id: string,
  body: UpdateActivityRequest
): Promise<Response> {
  const result = await editActivity(id, body);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, data: result.activity });
}

export async function handleDeleteActivity(id: string): Promise<Response> {
  const result = await removeActivity(id);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, message: 'Kegiatan berhasil dihapus.' });
}
