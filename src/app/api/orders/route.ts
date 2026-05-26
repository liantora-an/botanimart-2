import type { NextRequest } from 'next/server';
import {
  handleGetUserOrders,
} from '@/backend/controllers/order.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';

// GET /api/orders — get current user's order history
export async function GET(): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  return handleGetUserOrders(authResult.id);
}
