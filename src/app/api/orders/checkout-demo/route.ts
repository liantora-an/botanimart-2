import type { NextRequest } from 'next/server';
import { handleCheckoutDemo } from '@/backend/controllers/order.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { getUserById } from '@/backend/repositories/user.repository';

// POST /api/orders/checkout-demo — create order and set status immediately to PAID
export async function POST(request: NextRequest): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  // Fetch full profile for name
  const profile = await getUserById(authResult.id);

  let body = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine
  }

  return handleCheckoutDemo(
    authResult.id,
    authResult.email,
    profile?.full_name ?? null,
    body
  );
}
