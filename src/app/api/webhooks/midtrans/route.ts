import type { NextRequest } from 'next/server';
import { handleMidtransWebhook } from '@/backend/controllers/payment.controller';
import type { MidtransNotification } from '@/backend/services/payment.service';

// POST /api/webhooks/midtrans — Midtrans payment notification
// No auth guard — verified by SHA-512 signature inside handler
export const runtime = 'nodejs'; // crypto module requires Node.js runtime

export async function POST(request: NextRequest): Promise<Response> {
  let notification: MidtransNotification;

  try {
    notification = await request.json();
  } catch {
    return Response.json(
      { success: false, error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }

  if (!notification.order_id || !notification.signature_key) {
    return Response.json(
      { success: false, error: 'Missing required fields.' },
      { status: 400 }
    );
  }

  return handleMidtransWebhook(notification);
}
