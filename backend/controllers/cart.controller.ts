import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  emptyCart,
} from '@/backend/services/cart.service';
import type { AddToCartRequest, UpdateCartRequest } from '@/backend/types/api';

/**
 * cart.controller.ts
 * Handles HTTP request/response for cart endpoints.
 */

export async function handleGetCart(userId: string): Promise<Response> {
  const cart = await getCart(userId);
  return Response.json({ success: true, data: cart });
}

export async function handleAddToCart(
  userId: string,
  body: AddToCartRequest
): Promise<Response> {
  if (!body.plant_id) {
    return Response.json(
      { success: false, error: 'plant_id wajib diisi.' },
      { status: 400 }
    );
  }
  if (!body.quantity || body.quantity < 1) {
    return Response.json(
      { success: false, error: 'Jumlah minimal 1.' },
      { status: 400 }
    );
  }

  const result = await addToCart(userId, body.plant_id, body.quantity);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, data: result.data }, { status: 201 });
}

export async function handleUpdateCartItem(
  userId: string,
  cartId: string,
  body: UpdateCartRequest
): Promise<Response> {
  if (!body.quantity || body.quantity < 1) {
    return Response.json(
      { success: false, error: 'Jumlah minimal 1.' },
      { status: 400 }
    );
  }

  const result = await updateCartItem(userId, cartId, body.quantity);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, data: result.data });
}

export async function handleRemoveCartItem(
  userId: string,
  cartId: string
): Promise<Response> {
  const result = await removeFromCart(userId, cartId);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 404 });
  }
  return Response.json({ success: true, message: 'Item dihapus dari keranjang.' });
}

export async function handleClearCart(userId: string): Promise<Response> {
  const result = await emptyCart(userId);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 500 });
  }
  return Response.json({ success: true, message: 'Keranjang berhasil dikosongkan.' });
}
