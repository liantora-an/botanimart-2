import type { NextRequest } from 'next/server';
import {
  handleUpdateCategory,
  handleDeleteCategory,
} from '@/backend/controllers/catalog.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';

// PUT /api/admin/categories/[id] — Admin only (update category)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const { id } = await params;
  const body = await request.json();
  return handleUpdateCategory(id, body);
}

// DELETE /api/admin/categories/[id] — Admin only (delete category)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const { id } = await params;
  return handleDeleteCategory(id);
}
