import { handleGetMe } from '@/backend/controllers/auth.controller';

export async function GET(): Promise<Response> {
  return handleGetMe();
}
