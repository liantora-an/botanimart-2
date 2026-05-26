import type { NextRequest } from 'next/server';
import { handleAdminListOrders } from '@/backend/controllers/order.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';

// GET /api/admin/orders — Admin: list all orders
export async function GET(request: NextRequest): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  return handleAdminListOrders(request.nextUrl.searchParams);
}
