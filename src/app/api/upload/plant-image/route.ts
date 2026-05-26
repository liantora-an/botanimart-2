import type { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// POST /api/upload/plant-image — Admin only
// Accepts multipart/form-data with a 'file' field
export async function POST(request: NextRequest): Promise<Response> {
  const authResult = await requireAuth();
  if (authResult instanceof Response) return authResult;

  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { success: false, error: 'Gagal membaca form data.' },
      { status: 400 }
    );
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return Response.json(
      { success: false, error: 'File gambar wajib diunggah.' },
      { status: 400 }
    );
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return Response.json(
      { success: false, error: 'File harus berupa gambar (JPG, PNG, WebP).' },
      { status: 400 }
    );
  }

  // Validate file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return Response.json(
      { success: false, error: 'Ukuran file maksimal 5MB.' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Generate unique file path
  const ext = file.name.split('.').pop() ?? 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `plants/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from('plant-images')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error('[upload] Supabase Storage error:', uploadError.message);
    return Response.json(
      { success: false, error: 'Gagal mengunggah gambar. Coba lagi.' },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from('plant-images')
    .getPublicUrl(filePath);

  return Response.json({
    success: true,
    data: { publicUrl: urlData.publicUrl, path: filePath },
  });
}
