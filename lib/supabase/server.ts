import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/backend/config/supabase';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error: any) {
            console.error('[supabase.server] createClient setAll error:', error.message || error);
          }
        },
      },
    }
  );
}

export async function createAdminClient() {
  const cookieStore = await cookies();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return createServerClient(
    SUPABASE_URL,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error: any) {
            console.error('[supabase.server] createAdminClient setAll error:', error.message || error);
          }
        },
      },
    }
  );
}
