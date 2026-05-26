import type { NextRequest } from 'next/server';
import {
  handleGetCart,
  handleAddToCart,
  handleClearCart,
} from '@/backend/controllers/cart.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';

// GET /api/cart — get current user's cart
export async function GET(): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  return handleGetCart(authResult.id);
}

// POST /api/cart — add item to cart
export async function POST(request: NextRequest): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const body = await request.json();
  return handleAddToCart(authResult.id, body);
}

// DELETE /api/cart — clear entire cart
export async function DELETE(): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  return handleClearCart(authResult.id);
}
