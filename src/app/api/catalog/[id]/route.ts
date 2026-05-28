import type { NextRequest } from 'next/server';
import {
  handleGetPlant,
  handleUpdatePlant,
  handleDeletePlant,
} from '@/backend/controllers/catalog.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';

// GET /api/catalog/[id] — public
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  return handleGetPlant(id);
}

// PUT /api/catalog/[id] — Admin only
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
  return handleUpdatePlant(id, body);
}

// DELETE /api/catalog/[id] — Admin only
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const { id } = await params;
  return handleDeletePlant(id);
}
