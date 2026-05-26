import { handleLogout } from '@/backend/controllers/auth.controller';

export async function POST(): Promise<Response> {
  return handleLogout();
}
