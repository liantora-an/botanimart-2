import type { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/middlewares/auth.middleware';
import { requireAdmin } from '@/backend/middlewares/role.middleware';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/backend/config/supabase';

export const runtime = 'nodejs';

// POST /api/upload/plant-image — Admin only
// Accepts multipart/form-data with a 'file' field
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // 1. Authenticate user and verify admin role
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const adminError = requireAdmin(authResult);
    if (adminError) return adminError;

    // 2. Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (err: any) {
      return Response.json(
        { success: false, error: `Gagal membaca form data: ${err.message || err}` },
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

    // 3. Initialize direct standalone Supabase client using Service Role Key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!serviceRoleKey) {
      return Response.json(
        { success: false, error: 'Variabel lingkungan SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server.' },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    // 4. Ensure bucket exists dynamically and is public
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (!listError && buckets) {
        const exists = buckets.some((b) => b.id === 'plant-images');
        if (!exists) {
          const { error: createError } = await supabase.storage.createBucket('plant-images', {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
          });
          if (createError) {
            console.warn('[upload] Auto-creating bucket failed:', createError.message);
          }
        }
      } else if (listError) {
        console.warn('[upload] List buckets error:', listError.message);
      }
    } catch (bucketErr: any) {
      console.warn('[upload] Bucket check failed:', bucketErr.message);
    }

    // 5. Upload file to Supabase Storage
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
      console.error('[upload] Supabase Storage upload error:', uploadError.message);
      return Response.json(
        { success: false, error: `Gagal mengunggah ke Supabase Storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 6. Get public URL of the uploaded image
    const { data: urlData } = supabase.storage
      .from('plant-images')
      .getPublicUrl(filePath);

    return Response.json({
      success: true,
      data: { publicUrl: urlData.publicUrl, path: filePath },
    });
  } catch (error: any) {
    console.error('[upload] Global exception caught:', error);
    return Response.json(
      { success: false, error: `Internal Server Error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
