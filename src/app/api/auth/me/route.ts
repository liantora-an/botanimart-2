import { handleGetMe, handleUpdateMe } from '@/backend/controllers/auth.controller';
import type { NextRequest } from 'next/server';

export async function GET(): Promise<Response> {
  return handleGetMe();
}

export async function PATCH(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    return handleUpdateMe(body);
  } catch (err: any) {
    return Response.json(
      { success: false, error: `Gagal membaca body request: ${err.message || err}` },
      { status: 400 }
    );
  }
}
