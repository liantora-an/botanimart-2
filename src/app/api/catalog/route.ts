import type { NextRequest } from 'next/server';
import {
  handleListPlants,
  handleCreatePlant,
} from '@/backend/controllers/catalog.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';

// GET /api/catalog — public
export async function GET(request: NextRequest): Promise<Response> {
  return handleListPlants(request.nextUrl.searchParams);
}

// POST /api/catalog — Admin only
export async function POST(request: NextRequest): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const body = await request.json();
  return handleCreatePlant(body);
}
