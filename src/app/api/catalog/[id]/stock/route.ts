import type { NextRequest } from 'next/server';
import { handleAdjustStock } from '@/backend/controllers/catalog.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';

// PATCH /api/catalog/[id]/stock — Admin only
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const { id } = await params;
  const body = await request.json();
  return handleAdjustStock(id, body);
}
