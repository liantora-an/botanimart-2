import {
  checkout,
  getUserOrders,
  getOrder,
  getAllOrders,
  adminUpdateOrderStatus,
} from '@/backend/services/order.service';
import type { OrderStatus } from '@/backend/types';

/**
 * order.controller.ts
 * Handles HTTP request/response for order endpoints.
 */

export async function handleCheckout(
  userId: string,
  userEmail: string,
  userName: string | null,
  body: { notes?: string }
): Promise<Response> {
  const result = await checkout({
    userId,
    userEmail,
    userName,
    notes: body.notes,
  });

  if (!result.success) {
    return Response.json(
      { success: false, error: result.error },
      { status: 400 }
    );
  }

  return Response.json({
    success: true,
    data: {
      orderId: result.orderId,
      snapToken: result.snapToken,
    },
  });
}

export async function handleGetUserOrders(userId: string): Promise<Response> {
  const orders = await getUserOrders(userId);
  return Response.json({ success: true, data: orders });
}

export async function handleGetOrderDetail(
  userId: string,
  orderId: string
): Promise<Response> {
  const result = await getOrder(orderId, userId);
  if (!result.success) {
    return Response.json(
      { success: false, error: result.error },
      { status: 404 }
    );
  }
  return Response.json({ success: true, data: result.order });
}

// ─── Admin Handlers ───────────────────────────────────────────────────────────

export async function handleAdminListOrders(searchParams: URLSearchParams): Promise<Response> {
  const result = await getAllOrders({
    status: (searchParams.get('status') as OrderStatus) ?? undefined,
    page: Number(searchParams.get('page') ?? 1),
    limit: Number(searchParams.get('limit') ?? 20),
  });
  return Response.json({ success: true, data: result });
}

export async function handleAdminUpdateOrderStatus(
  orderId: string,
  body: { status: string }
): Promise<Response> {
  const allowed = ['processing', 'shipped', 'completed', 'canceled'];
  if (!allowed.includes(body.status)) {
    return Response.json(
      {
        success: false,
        error: `Status tidak valid. Harus salah satu: ${allowed.join(', ')}.`,
      },
      { status: 400 }
    );
  }

  const result = await adminUpdateOrderStatus(
    orderId,
    body.status as 'processing' | 'shipped' | 'completed' | 'canceled'
  );
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: 400 });
  }
  return Response.json({ success: true, message: 'Status pesanan berhasil diperbarui.' });
}
