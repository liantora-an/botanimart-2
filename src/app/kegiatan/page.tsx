'use client';

import React, { useState, useMemo } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';

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
  const [cartCount, setCartCount] = useState(2);
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  
  // Interactive View States
  const [selectedActivity, setSelectedActivity] = useState<typeof ACTIVITIES[0] | null>(null);
  
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
    return ACTIVITIES.filter(activity => {
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
  }, [searchQuery, activeTab]);

  // Open detailed article view
  const openActivityDetail = (activity: typeof ACTIVITIES[0]) => {
    setSelectedActivity(activity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans antialiased text-[#274235]">
      
      {/* 1. Header/Navbar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-[#e2ede7] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo (logo_v4.png) */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-64 h-16 transition-all duration-300 group-hover:scale-102">
              <NextImage
                src="/images/logo_v4.png"
                alt="Botani Mart Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-brand-sage hover:text-brand-forest transition-colors">
              Beranda
            </Link>
            <Link href="/toko" className="text-sm font-semibold text-brand-sage hover:text-brand-forest transition-colors">
              Toko
            </Link>
            <Link href="/kegiatan" className="text-sm font-semibold text-brand-emerald border-b-2 border-brand-emerald pb-1 transition-all">
              Kegiatan
            </Link>
            <Link href="#informasi" className="text-sm font-semibold text-brand-sage hover:text-brand-forest transition-colors">
              Informasi
            </Link>
            <Link href="#kontak" className="text-sm font-semibold text-brand-sage hover:text-brand-forest transition-colors">
              Kontak
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist Icon */}
            <button 
              className="p-2.5 rounded-full hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all"
              onClick={() => alert('Fitur Wishlist sedang dikembangkan!')}
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Shopping Cart */}
            <button 
              className="p-2.5 rounded-full hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all relative"
              onClick={() => alert('Fitur Keranjang sedang dikembangkan!')}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-emerald text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login Button */}
            <Link 
              href="/login" 
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-emerald hover:bg-brand-forest text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Daftar/Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        
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
                  className={`pb-3 text-base sm:text-lg font-heading font-bold transition-all border-b-3 px-1 cursor-pointer ${
                    activeTab === tab 
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
                  className="bg-white rounded-3xl border border-[#e2ede7] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 p-6 text-left group relative cursor-pointer"
                >
                  {/* Share & Bookmark overlay icons */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
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

                  {/* Left Column: Image Placeholder (No plant images per instruction) */}
                  <div className="w-full sm:w-44 h-44 rounded-2xl bg-brand-cream border border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage shrink-0 select-none">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner mb-1 group-hover:scale-105 transition-transform duration-300">
                      <ImageIcon className="w-5 h-5 opacity-70" />
                    </div>
                    <span className="text-[9px] text-brand-sage/60 font-semibold tracking-wider">Gambar Kegiatan</span>
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
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all cursor-pointer ${
                    currentPage === page 
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
                className={`w-10 h-10 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  currentPage === 10 
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
        ) : (
          
          /* CONDITION 2: ACTIVITY DETAIL ARTICLE VIEW (Laman Detail Baca) */
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

              <div className="flex gap-3">
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
                <div className="absolute inset-0 bg-gradient-to-br from-brand-lime/10 to-brand-cream z-0" />
                <ImageIcon className="w-16 h-16 opacity-30 mb-2 z-10 animate-pulse" />
                <span className="text-sm text-brand-sage/60 font-semibold z-10">Gambar Banner Kegiatan</span>
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
                {ACTIVITIES.filter(a => a.id !== selectedActivity.id).slice(0, 2).map(related => (
                  <div
                    key={related.id}
                    onClick={() => openActivityDetail(related)}
                    className="bg-white rounded-3xl border border-[#e2ede7] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 p-6 text-left group relative cursor-pointer"
                  >
                    {/* Empty image block placeholder */}
                    <div className="w-full sm:w-36 h-36 rounded-2xl bg-brand-cream border border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage shrink-0 select-none">
                      <ImageIcon className="w-5 h-5 opacity-40 mb-1" />
                      <span className="text-[9px] text-brand-sage/60 font-semibold">Gambar Kegiatan</span>
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
      <footer className="bg-brand-cream border-t border-[#e2ede7] py-12 text-center mt-12" id="kontak">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-6">
          
          {/* Footer Logo */}
          <div className="relative w-56 h-14 select-none">
            <NextImage
              src="/images/logo_v4.png"
              alt="Botani Mart Logo"
              fill
              className="object-contain brightness-95"
            />
          </div>

          {/* Social Media Link Icons with Real Brand Colors */}
          <div className="flex gap-6 items-center justify-center">
            {/* TikTok */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-full bg-white hover:scale-110 active:scale-95 shadow-md flex items-center justify-center group transition-all duration-300"
              aria-label="Botani Mart di TikTok"
            >
              <svg className="w-5.5 h-5.5 text-zinc-900 group-hover:text-black transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.42-.42-.61-.65v7.17c.02 1.37-.3 2.77-.97 3.97-.93 1.66-2.52 2.91-4.37 3.42-2.14.61-4.52.41-6.5-.59-1.99-1.01-3.48-2.92-4.04-5.13-.64-2.52-.16-5.32 1.34-7.4 1.44-2.02 3.75-3.32 6.24-3.49v4.03c-1.31.09-2.6.64-3.47 1.62-.91 1.02-1.24 2.45-1.02 3.8.21 1.25.96 2.38 2.02 3.06 1.09.7 2.42.87 3.65.55 1.1-.28 2.05-1.04 2.58-2.05.41-.78.56-1.68.54-2.56V.02h.01z" />
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-full bg-white hover:scale-110 active:scale-95 shadow-md flex items-center justify-center group transition-all duration-300 relative overflow-hidden"
              aria-label="Botani Mart di Instagram"
            >
              <span className="absolute inset-0 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg className="w-5.5 h-5.5 text-zinc-900 group-hover:text-white transition-colors relative z-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 rounded-full bg-white hover:scale-110 active:scale-95 shadow-md flex items-center justify-center group transition-all duration-300 relative overflow-hidden"
              aria-label="Botani Mart di WhatsApp"
            >
              <span className="absolute inset-0 bg-[#25d366] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg className="w-5.5 h-5.5 text-zinc-900 group-hover:text-white transition-colors relative z-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.498 4.885 1.503 5.485.002 9.948-4.436 9.951-9.886.002-2.641-1.02-5.124-2.877-6.984C16.691 1.928 14.22 1.91 12.012 1.91 6.524 1.91 2.06 6.348 2.057 11.8.055 13.526.564 15.223 1.56 16.892l-.997 3.637 3.734-.969a9.7 9.7 0 001.35.59z" />
              </svg>
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-brand-sage font-semibold uppercase tracking-wider">
              &copy; {new Date().getFullYear()} Botani Mart Bogor. Hak Cipta Dilindungi.
            </p>
            <p className="text-[9px] text-[#50685c]/60 font-medium">
              Dirancang dengan penuh dedikasi untuk kebun rumah impian Anda.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
