import { createClient } from '@/lib/supabase/server';
import type { Order, OrderItem, OrderStatus } from '@/backend/types';

/**
 * order.repository.ts
 * Data access layer for public.orders and public.order_items tables.
 */

const ORDER_SELECT = `
  *,
  order_items (
    id, plant_id, plant_name, price_at_purchase, quantity, subtotal,
    plant:plants (id, name, image_url, slug)
  )
`;

const ORDER_WITH_USER_SELECT = `
  *,
  user:users (id, email, full_name),
  order_items (
    id, plant_id, plant_name, price_at_purchase, quantity, subtotal,
    plant:plants (id, name, image_url, slug)
  )
`;

// ─── User-facing queries ──────────────────────────────────────────────────────

/**
 * Lists all orders for a specific user, newest first.
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[order.repository] getOrdersByUserId error:', error.message);
    return [];
  }
  return (data ?? []) as Order[];
}

/**
 * Fetches a single order by ID. Verifies ownership unless admin.
 */
export async function getOrderById(
  orderId: string,
  userId?: string
): Promise<Order | null> {
  const supabase = await createClient();
  let query = supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', orderId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();
  if (error) return null;
  return data as Order;
}

/**
 * Finds an order by its Midtrans order ID (for webhook processing).
 */
export async function getOrderByMidtransOrderId(
  midtransOrderId: string
): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('midtrans_order_id', midtransOrderId)
    .single();

  if (error) return null;
  return data as Order;
}

// ─── Admin-facing queries ─────────────────────────────────────────────────────

/**
 * Lists all orders for admin, with optional status filter and pagination.
 */
export async function listAllOrders(params: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}): Promise<{ data: Order[]; total: number }> {
  const supabase = await createClient();

  const page = params.page ?? 1;
  const limit = Math.min(params.limit ?? 20, 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('orders')
    .select(ORDER_WITH_USER_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params.status) {
    query = query.eq('status', params.status);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[order.repository] listAllOrders error:', error.message);
    return { data: [], total: 0 };
  }
  return { data: (data ?? []) as Order[], total: count ?? 0 };
}

// ─── Write operations ─────────────────────────────────────────────────────────

/**
 * Creates a new order + items in a single transaction via RPC.
 */
export async function createOrderWithItems(params: {
  userId: string;
  totalAmount: number;
  midtransOrderId: string;
  notes?: string;
  items: Array<{
    plant_id: string;
    plant_name: string;
    price_at_purchase: number;
    quantity: number;
  }>;
}): Promise<Order | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('create_order_with_items', {
    p_user_id: params.userId,
    p_total_amount: params.totalAmount,
    p_midtrans_order_id: params.midtransOrderId,
    p_notes: params.notes ?? null,
    p_items: params.items,
  });

  if (error) {
    console.error('[order.repository] createOrderWithItems error:', error.message);
    return null;
  }

  // Fetch the created order
  return getOrderById(data as string);
}

/**
 * Saves the Midtrans Snap token to an order.
 */
export async function saveSnapToken(
  orderId: string,
  snapToken: string
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ snap_token: snapToken, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('[order.repository] saveSnapToken error:', error.message);
    return false;
  }
  return true;
}

/**
 * Updates order status after a Midtrans webhook notification.
 */
export async function updateOrderAfterPayment(params: {
  orderId: string;
  status: OrderStatus;
  midtransTransactionId?: string;
  paymentMethod?: string;
  paidAt?: string;
}): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({
      status: params.status,
      midtrans_transaction_id: params.midtransTransactionId ?? null,
      payment_method: params.paymentMethod ?? null,
      paid_at: params.paidAt ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.orderId);

  if (error) {
    console.error('[order.repository] updateOrderAfterPayment error:', error.message);
    return false;
  }
  return true;
}

/**
 * Updates order status manually (Admin action).
 * Only allows: processing, shipped, completed, canceled.
 */
export async function updateOrderStatusByAdmin(
  orderId: string,
  status: Extract<OrderStatus, 'processing' | 'shipped' | 'completed' | 'canceled'>
): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('[order.repository] updateOrderStatusByAdmin error:', error.message);
    return false;
  }
  return true;
}
