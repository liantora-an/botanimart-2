import type { NextRequest } from 'next/server';
import { handleRegister } from '@/backend/controllers/auth.controller';

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  return handleRegister(body);
}
