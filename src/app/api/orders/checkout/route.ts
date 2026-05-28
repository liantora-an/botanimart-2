import type { NextRequest } from 'next/server';
import { handleCheckout } from '@/backend/controllers/order.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { getUserById } from '@/backend/repositories/user.repository';

// POST /api/orders/checkout — create order and get Snap Token
export async function POST(request: NextRequest): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  // Fetch full profile for name
  const profile = await getUserById(authResult.id);

  const body = await request.json();
  return handleCheckout(
    authResult.id,
    authResult.email,
    profile?.full_name ?? null,
    body
  );
}
