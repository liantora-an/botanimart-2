import { validateCartForCheckout, emptyCart } from './cart.service';
import { createSnapToken } from './payment.service';
import {
  createOrderWithItems,
  saveSnapToken,
  getOrdersByUserId,
  getOrderById,
  listAllOrders,
  updateOrderStatusByAdmin,
} from '@/backend/repositories/order.repository';
import { decrementStockForOrder } from '@/backend/repositories/catalog.repository';
import type { Order, OrderStatus } from '@/backend/types';
import type { PaginatedResponse } from '@/backend/types/api';
import { randomUUID } from 'crypto';

/**
 * order.service.ts
 * Business logic for checkout and order management.
 */

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  snapToken?: string;
  error?: string;
}

/**
 * Full checkout flow:
 * 1. Validate cart (stock check)
 * 2. Create order + items in DB
 * 3. Request Snap Token from Midtrans
 * 4. Save token to order
 * 5. Clear cart
 * Returns Snap Token for client to open payment popup.
 */
export async function checkout(params: {
  userId: string;
  userEmail: string;
  userName: string | null;
  notes?: string;
}): Promise<CheckoutResult> {
  // 1. Validate cart
  const { valid, items, insufficientItems, totalAmount } =
    await validateCartForCheckout(params.userId);

  if (items.length === 0) {
    return { success: false, error: 'Keranjang belanja kosong.' };
  }
  if (!valid) {
    const names = insufficientItems.map((i) => i.name).join(', ');
    return {
      success: false,
      error: `Stok tidak mencukupi untuk: ${names}. Silakan perbarui keranjang Anda.`,
    };
  }

  // 2. Generate unique Midtrans order ID
  const midtransOrderId = `BM-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

  // 3. Create order + items in DB transaction
  const order = await createOrderWithItems({
    userId: params.userId,
    totalAmount,
    midtransOrderId,
    notes: params.notes,
    items: items.map((item) => ({
      plant_id: item.plant_id,
      plant_name: item.plant!.name,
      price_at_purchase: item.plant!.price,
      quantity: item.quantity,
    })),
  });

  if (!order) {
    return { success: false, error: 'Gagal membuat pesanan. Silakan coba lagi.' };
  }

  // 4. Request Snap Token from Midtrans
  const tokenResult = await createSnapToken({
    orderId: midtransOrderId,
    grossAmount: totalAmount,
    customerName: params.userName ?? params.userEmail,
    customerEmail: params.userEmail,
    items: items.map((item) => ({
      id: item.plant_id,
      name: item.plant!.name,
      price: item.plant!.price,
      quantity: item.quantity,
    })),
  });

  if (!tokenResult.success || !tokenResult.token) {
    return {
      success: false,
      error: 'Gagal menghubungi payment gateway. Silakan coba lagi.',
    };
  }

  // 5. Save token to order
  await saveSnapToken(order.id, tokenResult.token);

  // 6. Clear cart
  await emptyCart(params.userId);

  return {
    success: true,
    orderId: order.id,
    snapToken: tokenResult.token,
  };
}

/**
 * Returns order history for the authenticated user.
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  return getOrdersByUserId(userId);
}

/**
 * Returns a single order, verifying ownership.
 */
export async function getOrder(
  orderId: string,
  userId: string
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const order = await getOrderById(orderId, userId);
  if (!order) {
    return { success: false, error: 'Pesanan tidak ditemukan.' };
  }
  return { success: true, order };
}

/**
 * Admin: list all orders with pagination.
 */
export async function getAllOrders(params: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Order>> {
  const { data, total } = await listAllOrders(params);
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

/**
 * Admin: manually update order status (processing → shipped → completed, or canceled).
 */
export async function adminUpdateOrderStatus(
  orderId: string,
  status: Extract<OrderStatus, 'processing' | 'shipped' | 'completed' | 'canceled'>
): Promise<{ success: boolean; error?: string }> {
  // Fetch current order to check previous status
  const order = await getOrderById(orderId);
  if (!order) {
    return { success: false, error: 'Pesanan tidak ditemukan.' };
  }

  // If transitioning from pending to an active/fulfilled state, decrement stock and increment sold_count
  if (order.status === 'pending' && ['processing', 'shipped', 'completed'].includes(status)) {
    await handleSuccessfulPayment(order);
  }

  const ok = await updateOrderStatusByAdmin(orderId, status);
  if (!ok) {
    return { success: false, error: 'Gagal memperbarui status pesanan.' };
  }
  return { success: true };
}

/**
 * Called by the webhook handler after Midtrans confirms payment.
 * Decrements stock for paid orders.
 */
export async function handleSuccessfulPayment(order: Order): Promise<void> {
  if (!order.order_items || order.order_items.length === 0) return;

  await decrementStockForOrder(
    order.order_items.map((item) => ({
      plant_id: item.plant_id,
      quantity: item.quantity,
    }))
  );
}
