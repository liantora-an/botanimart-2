import type { NextRequest } from 'next/server';
import {
  handleGetPlantReviews,
  handleCreateReview,
} from '@/backend/controllers/review.controller';
import { requireAuth, getSessionUser } from '@/backend/middlewares/auth.middleware';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/catalog/[id]/reviews — public reviews reading, optionally personalized
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params;
  const user = await getSessionUser();
  return handleGetPlantReviews(id, user?.id);
}

// POST /api/catalog/[id]/reviews — submit ulasan (authenticated)
export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<Response> {
  const { id } = await context.params;
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  try {
    const body = await request.json();
    return handleCreateReview(id, authResult.id, body);
  } catch (err: any) {
    return Response.json(
      { success: false, error: 'Format JSON request tidak valid.' },
      { status: 400 }
    );
  }
}
