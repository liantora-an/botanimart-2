import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { Activity } from '@/backend/types';
import type { CreateActivityRequest, UpdateActivityRequest } from '@/backend/types/api';

/**
 * activity.repository.ts
 * Data access layer for the public.activities table.
 */

const SEED_ACTIVITIES = [
  {
    title: 'Sambutan Rektor di Botani Mart',
    summary: 'Kemarin, Botani Mart baru saja meresmikan Botani Cafe yang diresmikan langsung oleh Rektor IPB University untuk mendukung ruang kreatif mahasiswa dan masyarakat.',
    author: 'Joko Suntoso',
    category: 'Edukasi & Informasi',
    content: `Kemarin, Botani Mart baru saja meresmikan Botani Cafe yang diresmikan langsung oleh Rektor IPB University. Fasilitas baru ini diharapkan dapat menjadi ruang kreatif bagi mahasiswa, peneliti, dan masyarakat umum untuk saling berdiskusi sembari menikmati berbagai produk kuliner lokal organik unggulan.

Rektor IPB menyampaikan apresiasi mendalam atas dedikasi tiada henti dari tim pengelola Botani Mart yang sukses menjembatani hilirisasi hasil riset hortikultura kampus ke pasar umum. Botani Cafe sendiri merupakan wujud integrasi bisnis modern berbasis pertanian perkotaan (urban farming) yang ramah lingkungan.

Dalam sambutannya, Rektor menekankan pentingnya ruang publik yang asri untuk menumbuhkan minat generasi muda terhadap bidang sosiopreneurship dan agribisnis berkelanjutan. Acara ditutup dengan pemotongan tumpeng, peninjauan area Cafe, serta pencicipan kopi buah organik khas Dramaga.`
  },
  {
    title: 'Kunjungan Mahasiswa IPB ke Botani Mart',
    summary: 'Mahasiswa IPB Sekolah Vokasi melakukan kunjungan lapangan terpadu ke Botani Mart yang berlokasi di Dramaga untuk mempelajari teknik perbanyakan buah tabulampot secara praktis.',
    author: 'Hari Yogya N.',
    category: 'Akademik & Riset',
    content: `Ratusan mahasiswa IPB Sekolah Vokasi melakukan kunjungan lapangan terpadu ke galeri Botani Mart Dramaga. Kunjungan akademis ini difokuskan pada praktikum mandiri teknik budidaya tingkat lanjut tanaman buah dalam pot (tabulampot) serta penanganan bibit vegetatif bersertifikat.

Para mahasiswa dipandu langsung oleh tim agronomist ahli dari Botani Mart. Mereka diperkenalkan pada proses sterilisasi media tanam, pemangkasan cabang produktif, induksi hormon pembungaan, hingga manajemen nutrisi pupuk organik makro dan mikro.

Dosen pendamping lapangan mengemukakan bahwa kolaborasi praktis dengan mitra industri seperti Botani Mart merupakan akselerator penting bagi kompetensi lulusan dalam menguasai teknologi hortikultura modern di dunia kerja nyata.`
  },
  {
    title: 'Peresmian Green House Baru',
    summary: 'Botani Mart resmi memperluas area pembibitan dengan meresmikan fasilitas Green House hidroponik modern untuk budidaya benih sayuran dan tanaman hias eksotis.',
    author: 'Joko Suntoso',
    category: 'Infrastruktur & Inovasi',
    content: `Botani Mart resmi memperluas cakupan produksinya dengan meresmikan fasilitas Green House hidroponik modern berskala menengah. Green House ini dirancang khusus untuk mengoptimalkan pembibitan tanaman hias eksotis serta aneka benih sayuran bernutrisi tinggi.

Dengan sistem kontrol suhu otomatis dan pengairan terkomputerisasi, fasilitas ini mampu menekan risiko kegagalan bibit hingga di bawah 3%. Hal ini menjamin pasokan tanaman berkualitas tinggi yang bebas hama bagi para pelanggan Botani Mart di Bogor dan sekitarnya.

Terlepas dari itu, inovasi fasilitas ini diharapkan dapat menjadi pusat edukasi mandiri bagi masyarakat perkotaan yang ingin mendalami metode pertanian modern di lahan terbatas.`
  },
  {
    title: 'Pelatihan Hidroponik Perkotaan',
    summary: 'Komunitas urban farming Dramaga mengikuti pelatihan praktis penanaman tanaman hortikultura skala rumahan bersama tim agronomis profesional Botani Mart.',
    author: 'Ani Lestari',
    category: 'Edukasi & Informasi',
    content: `Puluhan anggota komunitas tani perkotaan (urban farming) Dramaga berkumpul untuk mengikuti pelatihan intensif budidaya hidroponik praktis skala rumahan. Pelatihan ini dipandu secara interaktif oleh tim agronomis profesional Botani Mart.

Materi dimulai dari pengenalan sistem sumbu (wick system) yang ekonomis hingga instalasi deep water culture (DWC) untuk pekarangan sempit. Setiap peserta diberikan modul panduan praktis, kit instalasi mini, serta aneka bibit siap tanam gratis.

Pelatihan berkebun perkotaan ini merupakan komitmen jangka panjang Botani Mart dalam mendukung ketahanan pangan lokal yang mandiri dan mempromosikan gaya hidup ramah lingkungan di pemukiman padat penduduk.`
  },
  {
    title: 'Festival Buah Nusantara 2026',
    summary: 'Botani Mart menyelenggarakan pameran keanekaragaman kultivar buah lokal unggul asli Indonesia yang dihadiri ratusan kolektor dan pencinta tanaman buah.',
    author: 'Joko Suntoso',
    category: 'Pameran & Komunitas',
    content: `Botani Mart berkolaborasi menyelenggarakan pameran tahunan bertajuk Festival Buah Nusantara 2026. Acara ini memamerkan puluhan kultivar buah lokal unggul asli Indonesia seperti Mangga Alpukat Pasuruan, Durian Bawor Banyumas, hingga Jambu Madu Deli.

Festival dimeriahkan dengan seminar teknik pembuahan kilat dalam pot, lelang bibit langka bersertifikat resmi, serta kontes buah termanis. Ratusan kolektor, penghobi, dan petani dari berbagai daerah Jawa Barat turut hadir meramaikan festival ini.

Melalui festival ini, Botani Mart berkomitmen menjaga kelestarian plasma nutfah buah lokal nusantara sekaligus menaikkan nilai ekonomi buah-buahan asli Indonesia di mata konsumen urban.`
  },
  {
    title: 'Kunjungan Edukasi PAUD Melati',
    summary: 'Puluhan anak dari PAUD Melati Bogor melakukan wisata edukasi pertanian untuk pengenalan keanekaragaman hayati dan teknik menanam sederhana sejak dini.',
    author: 'Ani Lestari',
    category: 'Edukasi & Informasi',
    content: `Sebanyak 50 anak didik dari PAUD Melati Bogor melakukan wisata edukasi alam terbuka ke galeri Botani Mart Dramaga. Wisata terpadu ini ditujukan untuk mengenalkan keanekaragaman hayati nabati serta menanamkan rasa cinta lingkungan sejak usia dini.

Anak-anak diajak berkeliling melihat pembibitan buah, menyentuh aneka bentuk daun kaktus mini, dan mempraktikkan langsung cara menanam bunga hias dalam pot kecil yang dibawa pulang sebagai kenang-kenangan.

Melalui program kunjungan ramah anak ini, Botani Mart berusaha aktif berkontribusi mengenalkan wawasan ekologi dasar dan kegemaran bercocok tanam yang menyenangkan kepada generasi masa depan.`
  }
];

/**
 * Lists published activities, newest first. Paginated.
 */
export async function listActivities(params: {
  page?: number;
  limit?: number;
  published?: boolean;
}): Promise<{ data: Activity[]; total: number }> {
  const supabase = await createClient();

  // Check if activities count is 0. If so, seed database first using admin client to bypass RLS
  try {
    const supabaseAdmin = await createAdminClient();
    const { count, error: countErr } = await supabaseAdmin
      .from('activities')
      .select('id', { count: 'exact', head: true });
    
    if (!countErr && count === 0) {
      console.log('[activity.repository] Table is empty, seeding mock activities...');
      const payload = SEED_ACTIVITIES.map((a, idx) => ({
        ...a,
        slug: a.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-') + '-' + (Date.now() + idx).toString(36),
        published: true
      }));
      const { error: insertErr } = await supabaseAdmin.from('activities').insert(payload);
      if (insertErr) {
        console.error('[activity.repository] Auto-seeding insert failed:', insertErr.message);
      } else {
        console.log('[activity.repository] Auto-seeding successful!');
      }
    }
  } catch (err) {
    console.error('[activity.repository] Auto-seeding check failed:', err);
  }

  const page = params.page ?? 1;
  const limit = Math.min(params.limit ?? 10, 50);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('activities')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (params.published !== undefined) {
    query = query.eq('published', params.published);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[activity.repository] listActivities error:', error.message);
    return { data: [], total: 0 };
  }
  return { data: (data ?? []) as Activity[], total: count ?? 0 };
}

/**
 * Fetches a single activity by ID.
 */
export async function getActivityById(id: string): Promise<Activity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Activity;
}

/**
 * Fetches a single activity by slug.
 */
export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) return null;
  return data as Activity;
}

/**
 * Creates a new activity.
 */
export async function createActivity(
  input: CreateActivityRequest
): Promise<Activity | null> {
  const supabase = await createClient();
  const slug = generateSlug(input.title);

  const { data, error } = await supabase
    .from('activities')
    .insert({
      ...input,
      slug,
      published: input.published ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error('[activity.repository] createActivity error:', error.message);
    return null;
  }
  return data as Activity;
}

/**
 * Updates an activity by ID.
 */
export async function updateActivity(
  id: string,
  updates: UpdateActivityRequest
): Promise<Activity | null> {
  const supabase = await createClient();

  const payload: Record<string, unknown> = {
    ...updates,
    updated_at: new Date().toISOString(),
  };
  if (updates.title) {
    payload.slug = generateSlug(updates.title);
  }

  const { data, error } = await supabase
    .from('activities')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[activity.repository] updateActivity error:', error.message);
    return null;
  }
  return data as Activity;
}

/**
 * Deletes an activity by ID.
 */
export async function deleteActivity(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) {
    console.error('[activity.repository] deleteActivity error:', error.message);
    return false;
  }
  return true;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    + '-' + Date.now().toString(36);
}
