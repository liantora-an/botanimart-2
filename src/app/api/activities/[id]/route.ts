import type { NextRequest } from 'next/server';
import {
  handleGetActivity,
  handleUpdateActivity,
  handleDeleteActivity,
} from '@/backend/controllers/activity.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';

// GET /api/activities/[id] — public
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  return handleGetActivity(id);
}

// PUT /api/activities/[id] — Admin only
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
  return handleUpdateActivity(id, body);
}

// DELETE /api/activities/[id] — Admin only
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const { id } = await params;
  return handleDeleteActivity(id);
}
