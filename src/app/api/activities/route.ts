import type { NextRequest } from 'next/server';
import {
  handleListActivities,
  handleCreateActivity,
} from '@/backend/controllers/activity.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';

// GET /api/activities — public (only published)
export async function GET(request: NextRequest): Promise<Response> {
  return handleListActivities(request.nextUrl.searchParams, false);
}

// POST /api/activities — Admin only
export async function POST(request: NextRequest): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const body = await request.json();
  return handleCreateActivity(body);
}
