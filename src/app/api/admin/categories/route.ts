import type { NextRequest } from 'next/server';
import {
  handleListCategories,
  handleCreateCategory,
  handleUpdateCategory,
  handleDeleteCategory,
} from '@/backend/controllers/catalog.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';

// GET /api/admin/categories — public (list all categories)
export async function GET(): Promise<Response> {
  return handleListCategories();
}

// POST /api/admin/categories — Admin only (create category)
export async function POST(request: NextRequest): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const body = await request.json();
  return handleCreateCategory(body);
}
