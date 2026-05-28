import type { NextRequest } from 'next/server';
import { handleAdminUpdateOrderStatus } from '@/backend/controllers/order.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';

// PATCH /api/admin/orders/[orderId]/status — Admin: manually update status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const { orderId } = await params;
  const body = await request.json();
  return handleAdminUpdateOrderStatus(orderId, body);
}
