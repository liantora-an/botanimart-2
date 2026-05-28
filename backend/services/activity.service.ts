import {
  listActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from '@/backend/repositories/activity.repository';
import type { Activity } from '@/backend/types';
import type {
  CreateActivityRequest,
  UpdateActivityRequest,
  PaginatedResponse,
} from '@/backend/types/api';

/**
 * activity.service.ts
 * Business logic for activity/news articles.
 */

export async function getActivities(params: {
  page?: number;
  limit?: number;
  publishedOnly?: boolean;
}): Promise<PaginatedResponse<Activity>> {
  const { data, total } = await listActivities({
    page: params.page,
    limit: params.limit,
    published: params.publishedOnly ? true : undefined,
  });
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getActivity(
  id: string
): Promise<{ success: boolean; activity?: Activity; error?: string }> {
  const activity = await getActivityById(id);
  if (!activity) {
    return { success: false, error: 'Kegiatan tidak ditemukan.' };
  }
  return { success: true, activity };
}

export async function addActivity(
  input: CreateActivityRequest
): Promise<{ success: boolean; activity?: Activity; error?: string }> {
  if (!input.title.trim() || input.title.trim().length < 3) {
    return { success: false, error: 'Judul minimal 3 karakter.' };
  }
  if (!input.summary.trim()) {
    return { success: false, error: 'Ringkasan wajib diisi.' };
  }
  if (!input.author.trim()) {
    return { success: false, error: 'Penulis wajib diisi.' };
  }

  const activity = await createActivity(input);
  if (!activity) {
    return { success: false, error: 'Gagal membuat kegiatan.' };
  }
  return { success: true, activity };
}

export async function editActivity(
  id: string,
  updates: UpdateActivityRequest
): Promise<{ success: boolean; activity?: Activity; error?: string }> {
  const activity = await updateActivity(id, updates);
  if (!activity) {
    return { success: false, error: 'Kegiatan tidak ditemukan atau gagal diperbarui.' };
  }
  return { success: true, activity };
}

export async function removeActivity(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const ok = await deleteActivity(id);
  if (!ok) return { success: false, error: 'Gagal menghapus kegiatan.' };
  return { success: true };
}
