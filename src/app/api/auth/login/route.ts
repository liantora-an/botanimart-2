import type { NextRequest } from 'next/server';
import { handleLogin } from '@/backend/controllers/auth.controller';

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  return handleLogin(body);
}
