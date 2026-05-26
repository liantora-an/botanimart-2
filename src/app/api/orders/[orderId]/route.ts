import type { NextRequest } from 'next/server';
import { handleGetOrderDetail } from '@/backend/controllers/order.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';

// GET /api/orders/[orderId] — get order detail (user sees own, admin sees any)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const { orderId } = await params;

  // Admin can see any order — pass no userId filter
  const userId = authResult.role === 'Admin' ? undefined : authResult.id;
  return handleGetOrderDetail(userId ?? '', orderId);
}
