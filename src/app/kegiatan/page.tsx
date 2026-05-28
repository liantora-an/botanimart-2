'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  ArrowLeft,
  Calendar,
  User,
  Leaf,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Edit3,
  Save,
  Upload,
  X
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Mock Activities Database matching mockup structure
const ACTIVITIES = [
  {
    id: 1,
    title: 'Sambutan Rektor di Botani Mart',
    summary: 'Kemarin, Botani Mart baru saja meresmikan Botani Cafe yang diresmikan langsung oleh Rektor IPB University untuk mendukung ruang kreatif mahasiswa dan masyarakat.',
    date: '04/04/2026',
    author: 'Joko Suntoso',
    category: 'Edukasi & Informasi',
    tags: ['Terbaru', 'Terpopuler'],
    readingTime: '5 Menit',
    content: `Kemarin, Botani Mart baru saja meresmikan Botani Cafe yang diresmikan langsung oleh Rektor IPB University. Fasilitas baru ini diharapkan dapat menjadi ruang kreatif bagi mahasiswa, peneliti, dan masyarakat umum untuk saling berdiskusi sembari menikmati berbagai produk kuliner lokal organik unggulan.

Rektor IPB menyampaikan apresiasi mendalam atas dedikasi tiada henti dari tim pengelola Botani Mart yang sukses menjembatani hilirisasi hasil riset hortikultura kampus ke pasar umum. Botani Cafe sendiri merupakan wujud integrasi bisnis modern berbasis pertanian perkotaan (urban farming) yang ramah lingkungan.

Dalam sambutannya, Rektor menekankan pentingnya ruang publik yang asri untuk menumbuhkan minat generasi muda terhadap bidang sosiopreneurship dan agribisnis berkelanjutan. Acara ditutup dengan pemotongan tumpeng, peninjauan area Cafe, serta pencicipan kopi buah organik khas Dramaga.`
  },
  {
    id: 2,
    title: 'Kunjungan Mahasiswa IPB ke Botani Mart',
    summary: 'Mahasiswa IPB Sekolah Vokasi melakukan kunjungan lapangan terpadu ke Botani Mart yang berlokasi di Dramaga untuk mempelajari teknik perbanyakan buah tabulampot secara praktis.',
    date: '03/04/2026',
    author: 'Hari Yogya N.',
    category: 'Akademik & Riset',
    tags: ['Terpopuler'],
    readingTime: '6 Menit',
    content: `Ratusan mahasiswa IPB Sekolah Vokasi melakukan kunjungan lapangan terpadu ke galeri Botani Mart Dramaga. Kunjungan akademis ini difokuskan pada praktikum mandiri teknik budidaya tingkat lanjut tanaman buah dalam pot (tabulampot) serta penanganan bibit vegetatif bersertifikat.

Para mahasiswa dipandu langsung oleh tim agronomist ahli dari Botani Mart. Mereka diperkenalkan pada proses sterilisasi media tanam, pemangkasan cabang produktif, induksi hormon pembungaan, hingga manajemen nutrisi pupuk organik makro dan mikro.

Dosen pendamping lapangan mengemukakan bahwa kolaborasi praktis dengan mitra industri seperti Botani Mart merupakan akselerator penting bagi kompetensi lulusan dalam menguasai teknologi hortikultura modern di dunia kerja nyata.`
  },
  {
    id: 3,
    title: 'Peresmian Green House Baru',
    summary: 'Botani Mart resmi memperluas area pembibitan dengan meresmikan fasilitas Green House hidroponik modern untuk budidaya benih sayuran dan tanaman hias eksotis.',
    date: '28/03/2026',
    author: 'Joko Suntoso',
    category: 'Infrastruktur & Inovasi',
    tags: ['Terbaru'],
    readingTime: '4 Menit',
    content: `Botani Mart resmi memperluas cakupan produksinya dengan meresmikan fasilitas Green House hidroponik modern berskala menengah. Green House ini dirancang khusus untuk mengoptimalkan pembibitan tanaman hias eksotis serta aneka benih sayuran bernutrisi tinggi.

Dengan sistem kontrol suhu otomatis dan pengairan terkomputerisasi, fasilitas ini mampu menekan risiko kegagalan bibit hingga di bawah 3%. Hal ini menjamin pasokan tanaman berkualitas tinggi yang bebas hama bagi para pelanggan Botani Mart di Bogor dan sekitarnya.

Direktur operasional Botani Mart menegaskan inovasi fasilitas ini diharapkan dapat menjadi pusat edukasi mandiri bagi masyarakat perkotaan yang ingin mendalami metode pertanian modern di lahan terbatas.`
  },
  {
    id: 4,
    title: 'Pelatihan Hidroponik Perkotaan',
    summary: 'Komunitas urban farming Dramaga mengikuti pelatihan praktis penanaman tanaman hortikultura skala rumahan bersama tim agronomis profesional Botani Mart.',
    date: '22/03/2026',
    author: 'Ani Lestari',
    category: 'Edukasi & Informasi',
    tags: ['Terpopuler'],
    readingTime: '7 Menit',
    content: `Puluhan anggota komunitas tani perkotaan (urban farming) Dramaga berkumpul untuk mengikuti pelatihan intensif budidaya hidroponik praktis skala rumahan. Pelatihan ini dipandu secara interaktif oleh tim agronomis profesional Botani Mart.

Materi dimulai dari pengenalan sistem sumbu (wick system) yang ekonomis hingga instalasi deep water culture (DWC) untuk pekarangan sempit. Setiap peserta diberikan modul panduan praktis, kit instalasi mini, serta aneka bibit siap tanam gratis.

Pelatihan berkebun perkotaan ini merupakan komitmen jangka panjang Botani Mart dalam mendukung ketahanan pangan lokal yang mandiri dan mempromosikan gaya hidup ramah lingkungan di pemukiman padat penduduk.`
  },
  {
    id: 5,
    title: 'Festival Buah Nusantara 2026',
    summary: 'Botani Mart menyelenggarakan pameran keanekaragaman kultivar buah lokal unggul asli Indonesia yang dihadiri ratusan kolektor dan pencinta tanaman buah.',
    date: '15/03/2026',
    author: 'Joko Suntoso',
    category: 'Pameran & Komunitas',
    tags: ['Disimpan'],
    readingTime: '5 Menit',
    content: `Botani Mart berkolaborasi menyelenggarakan pameran tahunan bertajuk Festival Buah Nusantara 2026. Acara ini memamerkan puluhan kultivar buah lokal unggul asli Indonesia seperti Mangga Alpukat Pasuruan, Durian Bawor Banyumas, hingga Jambu Madu Deli.

Festival dimeriahkan dengan seminar teknik pembuahan kilat dalam pot, lelang bibit langka bersertifikat resmi, serta kontes buah termanis. Ratusan kolektor, penghobi, dan petani dari berbagai daerah Jawa Barat turut hadir meramaikan festival ini.

Melalui festival ini, Botani Mart berkomitmen menjaga kelestarian plasma nutfah buah lokal nusantara sekaligus menaikkan nilai ekonomi buah-buahan asli Indonesia di mata konsumen urban.`
  },
  {
    id: 6,
    title: 'Kunjungan Edukasi PAUD Melati',
    summary: 'Puluhan anak dari PAUD Melati Bogor melakukan wisata edukasi pertanian untuk pengenalan keanekaragaman hayati dan teknik menanam sederhana sejak dini.',
    date: '10/03/2026',
    author: 'Ani Lestari',
    category: 'Edukasi & Informasi',
    tags: ['Disimpan'],
    readingTime: '4 Menit',
    content: `Sebanyak 50 anak didik dari PAUD Melati Bogor melakukan wisata edukasi alam terbuka ke galeri Botani Mart Dramaga. Wisata terpadu ini ditujukan untuk mengenalkan keanekaragaman hayati nabati serta menanamkan rasa cinta lingkungan sejak usia dini.

Anak-anak diajak berkeliling melihat pembibitan buah, menyentuh aneka bentuk daun kaktus mini, dan mempraktikkan langsung cara menanam bunga hias dalam pot kecil yang dibawa pulang sebagai kenang-kenangan.

Melalui program kunjungan ramah anak ini, Botani Mart berusaha aktif berkontribusi mengenalkan wawasan ekologi dasar dan kegemaran bercocok tanam yang menyenangkan kepada generasi masa depan.`
  }
];

export default function KegiatanPage() {
  // Global states
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});

  // Local dynamically editable Activities list (Stateful CRUD!)
  const [activitiesList, setActivitiesList] = useState(
    ACTIVITIES.map(a => ({ ...a, image: '' }))
  );

  // Admin Mode & Inline Editor states
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    category: 'Edukasi & Informasi',
    author: '',
    date: '',
    readingTime: '5 Menit',
    summary: '',
    content: '',
    image: ''
  });

  // Interactive View States
  const [selectedActivity, setSelectedActivity] = useState<typeof activitiesList[0] | null>(null);

  // Search & Tab Filters States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Terbaru' | 'Terpopuler' | 'Disimpan'>('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  // Bookmark toggle
  const toggleBookmark = (id: number) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Activities computation
  const filteredActivities = useMemo(() => {
    return activitiesList.filter(activity => {
      // 1. Search Query
      if (searchQuery && !activity.title.toLowerCase().includes(searchQuery.toLowerCase()) && !activity.summary.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // 2. Tabs
      if (activeTab === 'Terbaru' && !activity.tags.includes('Terbaru')) {
        return false;
      }
      if (activeTab === 'Terpopuler' && !activity.tags.includes('Terpopuler')) {
        return false;
      }
      if (activeTab === 'Disimpan' && !activity.tags.includes('Disimpan')) {
        return false;
      }
      return true;
    });
  }, [activitiesList, searchQuery, activeTab]);

  // Open detailed article view
  const openActivityDetail = (activity: typeof activitiesList[0]) => {
    setSelectedActivity(activity);
    setIsEditing(false); // Default to view mode on entry
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger editing form activation
  const startEditing = (activity: typeof activitiesList[0]) => {
    setEditForm({
      title: activity.title,
      category: activity.category,
      author: activity.author,
      date: activity.date,
      readingTime: activity.readingTime || '5 Menit',
      summary: activity.summary,
      content: activity.content,
      image: activity.image || ''
    });
    setIsEditing(true);
  };

  // Handle image upload for article banner
  const handleArticleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save edited article to state
  const handleSaveArticle = () => {
    if (!editForm.title || !editForm.author || !editForm.content) {
      alert('Judul, Penulis, dan Isi Artikel wajib diisi!');
      return;
    }
    setActivitiesList(prev => prev.map(a => a.id === selectedActivity!.id ? {
      ...a,
      title: editForm.title,
      category: editForm.category,
      author: editForm.author,
      date: editForm.date,
      readingTime: editForm.readingTime,
      summary: editForm.summary,
      content: editForm.content,
      image: editForm.image
    } : a));

    // Instantly update active view container
    setSelectedActivity({
      id: selectedActivity!.id,
      title: editForm.title,
      category: editForm.category,
      author: editForm.author,
      date: editForm.date,
      readingTime: editForm.readingTime,
      summary: editForm.summary,
      content: editForm.content,
      image: editForm.image,
      tags: selectedActivity!.tags
    });

    setIsEditing(false);
    alert('Artikel berhasil diperbarui!');
  };

  // Load and open edit mode dynamically if routed from Admin Dashboard with query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const editParam = params.get('edit');
    if (idParam) {
      const activityId = Number(idParam);
      const targetActivity = activitiesList.find(a => a.id === activityId);
      if (targetActivity) {
        setSelectedActivity(targetActivity);
        if (editParam === 'true') {
          setIsAdminMode(true);
          setEditForm({
            title: targetActivity.title,
            category: targetActivity.category,
            author: targetActivity.author,
            date: targetActivity.date,
            readingTime: targetActivity.readingTime || '5 Menit',
            summary: targetActivity.summary,
            content: targetActivity.content,
            image: targetActivity.image || ''
          });
          setIsEditing(true);
        }
      }
    }
  }, [activitiesList]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans antialiased text-[#274235]">

      {/* 1. Header/Navbar */}
      <Navbar activePage="kegiatan" />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">

        {/* Floating Admin Mode Control Panel */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-amber-50/60 border border-amber-200/50 rounded-3xl p-5 shadow-sm select-none">
          <div className="flex items-center gap-3.5">
            <span className="relative flex h-3.5 w-3.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAdminMode ? 'bg-amber-400' : 'bg-brand-emerald/40'}`}></span>
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isAdminMode ? 'bg-amber-500' : 'bg-brand-emerald'}`}></span>
            </span>
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-heading font-black text-brand-forest uppercase tracking-wider">
                {isAdminMode ? 'Mode Admin (Aktif)' : 'Mode Pengunjung'}
              </h4>
              <p className="text-[11px] text-brand-sage font-semibold leading-relaxed">
                {isAdminMode ? 'Anda dapat menyunting artikel secara visual di laman ini.' : 'Aktifkan mode admin untuk mengedit artikel langsung.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              if (isAdminMode) {
                setIsEditing(false); // Cancel active editing if toggled off
              }
            }}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold shadow-md cursor-pointer transition-all duration-300 ${
              isAdminMode
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 border border-brand-emerald/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAdminMode ? 'Kembali ke Pengunjung' : 'Aktifkan Mode Admin'}</span>
          </button>
        </div>

        {/* CONDITION 1: ACTIVITIES LIST VIEW (Daftar Kegiatan) */}
        {!selectedActivity ? (
          <div className="space-y-8">

            {/* Header Banner (Blank/Empty Background, soft green as Placeholder per instruction) */}
            <div className="relative rounded-3xl overflow-hidden py-16 px-8 sm:px-12 text-center bg-gradient-to-r from-brand-forest/95 via-brand-emerald/90 to-brand-forest/95 shadow-lg border border-brand-emerald/10 select-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,89,71,0.2),transparent)] z-0" />
              <div className="relative z-10 space-y-3">
                <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-lime uppercase">
                  Pantau aktivitas & Informasi terbaru!
                </span>
                <h1 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight drop-shadow-sm">
                  Kegiatan/Activity
                </h1>
              </div>
            </div>

            {/* Pill Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="flex items-center bg-white border-2 border-[#e2ede7] focus-within:border-brand-emerald rounded-full py-4.5 px-7 shadow-lg shadow-brand-forest/5 transition-all duration-300 group">
                <input
                  type="text"
                  placeholder="Cari kegiatan, artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-base font-semibold focus:outline-none text-brand-forest placeholder-brand-sage/60"
                />
                <Search className="w-5.5 h-5.5 text-brand-sage group-focus-within:text-brand-emerald shrink-0" />
              </div>
            </div>

            {/* Navigation Tabs (Semua, Terbaru, Terpopuler, Disimpan) */}
            <div className="flex justify-center items-center gap-8 sm:gap-12 border-b border-[#e2ede7] pb-1">
              {(['Semua', 'Terbaru', 'Terpopuler', 'Disimpan'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-base sm:text-lg font-heading font-bold transition-all border-b-3 px-1 cursor-pointer ${activeTab === tab
                    ? 'text-brand-emerald border-brand-emerald scale-102'
                    : 'text-brand-sage border-transparent hover:text-brand-forest'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Activities Horizontal Cards Grid (2 Columns, Clickable Card) */}
            <div className="grid md:grid-cols-2 gap-8">
              {filteredActivities.map(activity => (
                <div
                  key={activity.id}
                  onClick={() => openActivityDetail(activity)}
                  className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 p-6 text-left group relative cursor-pointer border ${
                    isAdminMode
                      ? 'border-amber-400/60 bg-amber-50/5 shadow-amber-500/2'
                      : 'border-[#e2ede7]'
                  }`}
                >
                  {/* Share & Bookmark overlay icons */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    {isAdminMode && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm animate-pulse">
                        <Edit3 className="w-2.5 h-2.5" />
                        Sunting
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(activity.id);
                        alert(wishlist[activity.id] ? 'Dihapus dari simpanan!' : 'Berhasil disimpan!');
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-zinc-400 hover:text-brand-emerald transition-colors cursor-pointer"
                      aria-label="Simpan Artikel"
                    >
                      <Bookmark className={`w-4 h-4 ${wishlist[activity.id] ? 'fill-brand-emerald text-brand-emerald' : 'text-zinc-400'}`} />
                    </button>
                  </div>

                  {/* Left Column: Image Thumbnail (Support dynamic uploaded photos!) */}
                  <div className="w-full sm:w-44 h-44 rounded-2xl bg-brand-cream border border-[#e2ede7] overflow-hidden flex flex-col items-center justify-center text-brand-sage shrink-0 relative select-none">
                    {activity.image ? (
                      <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner mb-1 group-hover:scale-105 transition-transform duration-300">
                          <ImageIcon className="w-5 h-5 opacity-70" />
                        </div>
                        <span className="text-[9px] text-brand-sage/60 font-semibold tracking-wider">Gambar Kegiatan</span>
                      </>
                    )}
                  </div>

                  {/* Right Column: Content Details */}
                  <div className="flex-1 flex flex-col space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-brand-emerald font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{activity.date}</span>
                        <span>•</span>
                        <User className="w-3.5 h-3.5" />
                        <span>{activity.author}</span>
                      </div>

                      <h3 className="font-heading font-extrabold text-lg text-[#1e3329] group-hover:text-brand-emerald transition-colors leading-tight">
                        {activity.title}
                      </h3>
                    </div>

                    <p className="text-xs text-brand-sage leading-relaxed font-medium line-clamp-3">
                      {activity.summary}
                    </p>

                    <div className="pt-2 mt-auto">
                      <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-brand-forest hover:bg-brand-emerald text-white text-xs font-bold transition-all">
                        Lihat lebih lanjut <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination dinamis matching mockup (<- 1 2 3 ... 10 ->) */}
            <div className="flex justify-center items-center gap-2 pt-8 select-none">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                className="w-10 h-10 rounded-full border border-[#e2ede7] hover:bg-brand-cream flex items-center justify-center text-brand-sage transition-colors cursor-pointer"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all cursor-pointer ${currentPage === page
                    ? 'bg-brand-forest text-white shadow-md'
                    : 'border border-[#e2ede7] hover:bg-brand-cream text-brand-sage'
                    }`}
                >
                  {page}
                </button>
              ))}

              <span className="text-brand-sage text-sm font-bold px-1">...</span>

              <button
                onClick={() => setCurrentPage(10)}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-all cursor-pointer ${currentPage === 10
                  ? 'bg-brand-forest text-white shadow-md'
                  : 'border border-[#e2ede7] hover:bg-brand-cream text-brand-sage'
                  }`}
              >
                10
              </button>

              <button
                onClick={() => currentPage < 10 && setCurrentPage(prev => prev + 1)}
                className="w-10 h-10 rounded-full border border-[#e2ede7] hover:bg-brand-cream flex items-center justify-center text-brand-sage transition-colors cursor-pointer"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        ) : isEditing ? (
          
          /* CONDITION 2: ACTIVITY DETAIL ARTICLE VIEW IN EDIT MODE (Sunting Artikel) */
          <div className="space-y-10 animate-fade-in-up">
            
            {/* Editor Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-amber-200 pb-5">
              <div className="flex items-center gap-2.5 text-amber-600 text-left">
                <Edit3 className="w-5 h-5" />
                <div>
                  <span className="font-heading font-black text-lg uppercase tracking-wider block">Sunting Artikel Kegiatan</span>
                  <p className="text-[11px] text-brand-sage font-semibold leading-none">Ubah konten artikel secara langsung di bawah ini:</p>
                </div>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-50 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveArticle}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-brand-emerald hover:bg-brand-forest text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan Perubahan
                </button>
              </div>
            </div>

            {/* Editor Workspace Fields */}
            <div className="max-w-4xl mx-auto space-y-6 text-left">
              
              {/* Category & Reading Time fields */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#1e3329] uppercase tracking-wide mb-1">Kategori Kegiatan</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald cursor-pointer"
                  >
                    <option value="Edukasi & Informasi">Edukasi & Informasi</option>
                    <option value="Akademik & Riset">Akademik & Riset</option>
                    <option value="Infrastruktur & Inovasi">Infrastruktur & Inovasi</option>
                    <option value="Pameran & Komunitas">Pameran & Komunitas</option>
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#1e3329] uppercase tracking-wide mb-1">Estimasi Waktu Baca</label>
                  <input
                    type="text"
                    placeholder="Misal: 5 Menit"
                    value={editForm.readingTime}
                    onChange={(e) => setEditForm(prev => ({ ...prev, readingTime: e.target.value }))}
                    className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                  />
                </div>
              </div>

              {/* Title input (Styled transparently to look like heading!) */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#1e3329] uppercase tracking-wide mb-1">Judul Artikel <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Masukkan judul artikel..."
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-5 py-3 font-heading font-black text-2xl sm:text-3xl text-brand-forest bg-amber-50/10 border border-dashed border-amber-300 rounded-2xl focus:outline-none focus:border-brand-emerald focus:ring-2 focus:ring-brand-emerald/10 shadow-inner"
                  required
                />
              </div>

              {/* Author & Date fields */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#1e3329] uppercase tracking-wide mb-1">Penulis/Author <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Nama Penulis..."
                    value={editForm.author}
                    onChange={(e) => setEditForm(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                    required
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#1e3329] uppercase tracking-wide mb-1">Tanggal Rilis <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Misal: 04/04/2026"
                    value={editForm.date}
                    onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                    required
                  />
                </div>
              </div>

              {/* Banner Image Upload Block */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#1e3329] uppercase tracking-wide mb-1.5">Gambar Banner Artikel</label>
                <div className="w-full h-80 sm:h-96 md:h-[380px] rounded-3xl bg-brand-cream border-2 border-dashed border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage relative overflow-hidden shadow-inner">
                  {editForm.image ? (
                    <>
                      <img src={editForm.image} alt="Preview" className="w-full h-full object-cover animate-fade-in-up" />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-brand-forest text-xs font-bold shadow-md hover:scale-105 transition-all">
                          <Upload className="w-4 h-4" />
                          <span>Ganti Banner</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleArticleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, image: '' }))}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                        >
                          Hapus Banner
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 space-y-3">
                      <ImageIcon className="w-12 h-12 text-brand-sage opacity-55" />
                      <span className="text-xs font-bold uppercase tracking-wider">Belum Ada Banner Foto</span>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-emerald hover:bg-brand-forest text-white text-xs font-bold shadow-md transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih Foto Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleArticleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Input */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#1e3329] uppercase tracking-wide mb-1">Ringkasan Singkat Kartu (Summary)</label>
                <textarea
                  placeholder="Masukkan ringkasan singkat kegiatan..."
                  rows={2}
                  value={editForm.summary}
                  onChange={(e) => setEditForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full px-5 py-3.5 text-sm border border-zinc-200 rounded-2xl bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
                />
              </div>

              {/* Content WYSIWYG-style Textarea */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-[#1e3329] uppercase tracking-wide mb-1">Isi Narasi Artikel Lengkap <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="Tulis narasi lengkap artikel di sini..."
                  rows={12}
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-5 py-4 text-base border border-zinc-200 rounded-3xl bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner leading-relaxed"
                  required
                />
              </div>

            </div>

          </div>
        ) : (

          /* CONDITION 3: ACTIVITY DETAIL ARTICLE VIEW (Laman Detail Baca) */
          <div className="space-y-12 animate-fade-in-up">

            {/* Action Bar (Kembali) */}
            <div className="flex justify-between items-center border-b border-[#e2ede7] pb-4">
              <button
                onClick={() => setSelectedActivity(null)}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-emerald hover:text-brand-forest transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
                Kembali ke Kegiatan
              </button>

              <div className="flex items-center gap-3">
                {isAdminMode && (
                  <button
                    onClick={() => startEditing(selectedActivity)}
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Sunting Artikel
                  </button>
                )}
                <button
                  onClick={() => {
                    toggleBookmark(selectedActivity.id);
                    alert(wishlist[selectedActivity.id] ? 'Dihapus dari simpanan!' : 'Berhasil disimpan!');
                  }}
                  className="p-2.5 rounded-full border border-[#e2ede7] hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all cursor-pointer"
                  aria-label="Simpan"
                >
                  <Bookmark className={`w-4.5 h-4.5 ${wishlist[selectedActivity.id] ? 'fill-brand-emerald text-brand-emerald' : ''}`} />
                </button>
                <button
                  onClick={() => alert('Fitur bagikan sedang disiapkan!')}
                  className="p-2.5 rounded-full border border-[#e2ede7] hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all cursor-pointer"
                  aria-label="Bagikan"
                >
                  <Share2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Article Content Layout */}
            <div className="max-w-4xl mx-auto space-y-6 text-left">

              {/* Category, Date & Meta info */}
              <div className="space-y-4">
                <span className="inline-flex px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider">
                  {selectedActivity.category}
                </span>

                <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-brand-forest leading-tight tracking-tight">
                  {selectedActivity.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-xs font-bold text-brand-sage">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {selectedActivity.date}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    Oleh {selectedActivity.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Waktu Baca {selectedActivity.readingTime}
                  </span>
                </div>
              </div>

              {/* Empty Big Image Container / Banner Placeholder */}
              <div className="w-full h-80 sm:h-96 md:h-[420px] rounded-3xl bg-brand-cream border border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage select-none relative overflow-hidden shadow-inner">
                {selectedActivity.image ? (
                  <img src={selectedActivity.image} alt={selectedActivity.title} className="w-full h-full object-cover animate-fade-in-up" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-lime/10 to-brand-cream z-0" />
                    <ImageIcon className="w-16 h-16 opacity-30 mb-2 z-10 animate-pulse" />
                    <span className="text-sm text-brand-sage/60 font-semibold z-10">Gambar Banner Kegiatan</span>
                  </>
                )}
              </div>

              {/* Detailed Narrative Text */}
              <div className="pt-6 border-t border-[#e2ede7]">
                <div className="text-brand-sage text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-6 font-medium max-w-3xl">
                  {selectedActivity.content}
                </div>
              </div>

            </div>

            {/* Related Activities Section at the bottom */}
            <div className="border-t border-[#e2ede7] pt-12 space-y-8">

              {/* Header row */}
              <div className="flex items-end justify-between">
                <h3 className="font-heading font-black text-2xl text-brand-forest">
                  Rekomendasi Kegiatan Lain
                </h3>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="inline-flex items-center gap-1 text-sm font-bold text-brand-emerald hover:text-brand-forest transition-all"
                >
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 2 Similar clickable cards */}
              <div className="grid md:grid-cols-2 gap-8">
                {activitiesList.filter(a => a.id !== selectedActivity.id).slice(0, 2).map(related => (
                  <div
                    key={related.id}
                    onClick={() => openActivityDetail(related)}
                    className="bg-white rounded-3xl border border-[#e2ede7] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 p-6 text-left group relative cursor-pointer"
                  >
                    {/* Empty image block placeholder */}
                    <div className="w-full sm:w-36 h-36 rounded-2xl bg-brand-cream border border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage shrink-0 relative select-none">
                      {related.image ? (
                        <img src={related.image} alt={related.title} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5 opacity-40 mb-1" />
                          <span className="text-[9px] text-brand-sage/60 font-semibold">Gambar Kegiatan</span>
                        </>
                      )}
                    </div>

                    {/* Content details */}
                    <div className="flex-1 flex flex-col space-y-2">
                      <div className="flex items-center gap-1 text-[10px] text-brand-emerald font-bold">
                        <Calendar className="w-3 h-3" />
                        <span>{related.date}</span>
                      </div>

                      <h4 className="font-heading font-extrabold text-base text-[#1e3329] group-hover:text-brand-emerald transition-colors leading-tight">
                        {related.title}
                      </h4>

                      <p className="text-[11px] text-brand-sage leading-relaxed font-medium line-clamp-2">
                        {related.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
