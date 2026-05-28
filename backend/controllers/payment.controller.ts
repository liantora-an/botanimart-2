import {
  verifyWebhookSignature,
  mapTransactionStatus,
  type MidtransNotification,
} from '@/backend/services/payment.service';
import {
  getOrderByMidtransOrderId,
  updateOrderAfterPayment,
} from '@/backend/repositories/order.repository';
import { handleSuccessfulPayment } from '@/backend/services/order.service';

/**
 * payment.controller.ts
 * Handles HTTP request/response for the Midtrans webhook.
 */

/**
 * Processes Midtrans payment notification.
 * Called by: POST /api/webhooks/midtrans
 *
 * Security:
 * - Verifies SHA-512 signature before any processing
 * - Idempotent: checks order.status before acting
 */
export async function handleMidtransWebhook(
  notification: MidtransNotification
): Promise<Response> {
  // 1. Verify signature
  const isValid = verifyWebhookSignature(notification);
  if (!isValid) {
    console.warn(
      '[payment.controller] Invalid Midtrans signature for order:',
      notification.order_id
    );
    return Response.json(
      { success: false, error: 'Invalid signature.' },
      { status: 400 }
    );
  }

  // 2. Find the order
  const order = await getOrderByMidtransOrderId(notification.order_id);
  if (!order) {
    console.warn(
      '[payment.controller] Order not found for Midtrans ID:',
      notification.order_id
    );
    // Return 200 to prevent Midtrans retries for non-existent orders
    return Response.json({ success: true, message: 'Order not found, ignored.' });
  }

  // 3. Idempotency check: skip if already in final state
  const finalStatuses = ['paid', 'completed', 'canceled', 'expired'];
  if (finalStatuses.includes(order.status)) {
    return Response.json({
      success: true,
      message: `Order already in final status: ${order.status}`,
    });
  }

  // 4. Map Midtrans status to our OrderStatus
  const newStatus = mapTransactionStatus(
    notification.transaction_status,
    notification.fraud_status
  );

  if (!newStatus) {
    // Status we don't handle (e.g. 'challenge' for CC) — acknowledge but don't update
    return Response.json({ success: true, message: 'Status acknowledged.' });
  }

  // 5. Update order in DB
  const paidAt = newStatus === 'paid' ? new Date().toISOString() : undefined;

  const updated = await updateOrderAfterPayment({
    orderId: order.id,
    status: newStatus,
    midtransTransactionId: notification.transaction_id,
    paymentMethod: notification.payment_type,
    paidAt,
  });

  if (!updated) {
    console.error('[payment.controller] Failed to update order:', order.id);
    return Response.json(
      { success: false, error: 'Failed to update order.' },
      { status: 500 }
    );
  }

  // 6. On successful payment: decrement stock
  if (newStatus === 'paid') {
    const fullOrder = await getOrderByMidtransOrderId(notification.order_id);
    if (fullOrder) {
      await handleSuccessfulPayment(fullOrder);
    }
  }

  return Response.json({ success: true, message: `Order status updated to ${newStatus}.` });
}
