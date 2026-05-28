// @ts-ignore — midtrans-client has no @types package
import midtransClient from 'midtrans-client';
import { createHash } from 'crypto';
import { MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, IS_PRODUCTION } from '../config/midtrans';

/**
 * payment.service.ts
 * Business logic for Midtrans Snap payment integration.
 *
 * IMPORTANT: This file must only be imported in server-side modules (route handlers).
 * MIDTRANS_SERVER_KEY must never be exposed to the client bundle.
 */

// ─── Midtrans Instances ───────────────────────────────────────────────────────

export const snap = new midtransClient.Snap({
  isProduction: IS_PRODUCTION,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: IS_PRODUCTION,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

// ─── Snap Token Creation ──────────────────────────────────────────────────────

export interface SnapTokenResult {
  success: boolean;
  token?: string;
  redirectUrl?: string;
  error?: string;
}

export interface SnapTokenParams {
  orderId: string;         // midtrans_order_id (unique)
  grossAmount: number;     // total in IDR integer
  customerName: string;
  customerEmail: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

/**
 * Requests a Snap payment token from Midtrans.
 * The token is sent to the client to open the payment popup.
 */
export async function createSnapToken(
  params: SnapTokenParams
): Promise<SnapTokenResult> {
  try {
    const parameter = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.grossAmount,
      },
      customer_details: {
        first_name: params.customerName,
        email: params.customerEmail,
      },
      item_details: params.items.map((item) => ({
        id: item.id,
        name: item.name.substring(0, 50), // Midtrans max 50 chars
        price: item.price,
        quantity: item.quantity,
      })),
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/akun`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/keranjang`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/akun`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return {
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[payment.service] createSnapToken error:', msg);
    return { success: false, error: msg };
  }
}

// ─── Webhook Signature Validation ────────────────────────────────────────────

export interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  transaction_id: string;
  payment_type: string;
  transaction_time: string;
  fraud_status?: string;
}

/**
 * Verifies the Midtrans webhook signature key.
 * Formula: SHA512(orderId + statusCode + grossAmount + serverKey)
 *
 * MUST be called before processing any webhook notification.
 */
export function verifyWebhookSignature(
  notification: MidtransNotification
): boolean {
  const rawSignature =
    notification.order_id +
    notification.status_code +
    notification.gross_amount +
    MIDTRANS_SERVER_KEY;

  const expectedSignature = createHash('sha512')
    .update(rawSignature)
    .digest('hex');

  return expectedSignature === notification.signature_key;
}

// ─── Transaction Status Mapping ───────────────────────────────────────────────

import type { OrderStatus } from '@/backend/types';

/**
 * Maps Midtrans transaction_status to our internal OrderStatus enum.
 */
export function mapTransactionStatus(
  transactionStatus: string,
  fraudStatus?: string
): OrderStatus | null {
  switch (transactionStatus) {
    case 'capture':
      // For credit card — check fraud status
      if (fraudStatus === 'challenge') return null; // skip, wait for settlement
      return 'paid';

    case 'settlement':
      return 'paid';

    case 'pending':
      return 'pending';

    case 'deny':
    case 'cancel':
      return 'canceled';

    case 'expire':
      return 'expired';

    default:
      return null;
  }
}
