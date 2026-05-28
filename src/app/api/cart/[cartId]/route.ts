import type { NextRequest } from 'next/server';
import {
  handleUpdateCartItem,
  handleRemoveCartItem,
} from '@/backend/controllers/cart.controller';
import { requireAuth } from '@/backend/middlewares/auth.middleware';

// PUT /api/cart/[cartId] — update quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const { cartId } = await params;
  const body = await request.json();
  return handleUpdateCartItem(authResult.id, cartId, body);
}

// DELETE /api/cart/[cartId] — remove single item
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const { cartId } = await params;
  return handleRemoveCartItem(authResult.id, cartId);
}
