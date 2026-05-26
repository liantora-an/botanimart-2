'use client';

import React, { useState } from 'react';
import {
  Leaf,
  Search,
  ShoppingBag,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ArrowRight,
  ExternalLink,
  Calendar,
  Plus,
  User,
  Image as ImageIcon,
  Sparkles,
  Sprout,
  Compass,
  Layers,
  Wrench,
  Flower2,
  Droplet
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import AuthButton from '@/components/layout/AuthButton';

// Mock Categories
const CATEGORIES = [
  { id: 1, name: 'Bibit Buah', icon: Sprout, gradient: 'from-[#e8f5e9] to-[#c8e6c9]' },
  { id: 2, name: 'Pupuk & Pestisida', icon: Droplet, gradient: 'from-[#e1f5fe] to-[#b3e5fc]' },
  { id: 3, name: 'Pot & Alat Berkebun', icon: Wrench, gradient: 'from-[#efebe9] to-[#d7ccc8]' },
  { id: 4, name: 'Media Tanam', icon: Layers, gradient: 'from-[#f1f8e9] to-[#dcedc8]' },
  { id: 5, name: 'Tanaman Hias', icon: Flower2, gradient: 'from-[#fce4ec] to-[#f8bbd0]' },
  { id: 6, name: 'Tabulampot', icon: Compass, gradient: 'from-[#fff8e1] to-[#ffecb3]' },
  { id: 7, name: 'Benih Hortikultura', icon: Sparkles, gradient: 'from-[#efebe9] to-[#d7ccc8]' },
];

// Mock Products
const BEST_SELLERS = [
  {
    id: 101,
    name: 'Bibit Buah Mangga',
    category: 'Bibit Buah',
    price: 'Rp. 25.000/3 pack',
    rating: 4.8,
    reviews: 54,
    gradient: 'from-[#e2ede7] to-[#b8d5c5]'
  },
  {
    id: 102,
    name: 'Bunga Matahari',
    category: 'Tanaman Hias',
    price: 'Rp. 56.000',
    rating: 4.5,
    reviews: 42,
    gradient: 'from-[#fffde7] to-[#fff59d]'
  },
  {
    id: 103,
    name: 'Bibit Alpukat',
    category: 'Bibit Buah',
    price: 'Rp. 23.000/3 pack',
    rating: 4.9,
    reviews: 78,
    gradient: 'from-[#e8f5e9] to-[#c8e6c9]'
  }
];

// Mock Activities
const LATEST_ACTIVITIES = [
  {
    id: 201,
    title: 'Sambutan Rektor di Botani Mart',
    date: '04/05/2026',
    location: 'Bogor, Dramaga',
    summary: 'Rektor IPB menyampaikan apresiasi mendalam atas dedikasi Botani Mart dalam mendukung pertanian perkotaan dan penyediaan bibit bersertifikat.'
  },
  {
    id: 202,
    title: 'Kunjungan Mahasiswa IPB ke Botani Mart',
    date: '12/04/2026',
    location: 'Bogor, Dramaga',
    summary: 'Ratusan mahasiswa melakukan observasi lapangan mengenai pengelolaan tanaman buah tabulampot serta proses pembibitan modern.'
  }
];

export default function HomePage() {
  // Stateful states for interactivity
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const [cartCount, setCartCount] = useState(2); // Mock 2 items in cart
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Gallery slider titles
  const galleryItems = [
    { title: 'Nursery Utama Botani Mart', desc: 'Ratusan varietas bibit buah siap tanam dipelihara oleh tenaga ahli.' },
    { title: 'Proses Pembibitan Modern', desc: 'Pengembangan teknologi vegetatif untuk menghasilkan pohon buah unggulan.' },
    { title: 'Layanan Konsultasi Berkebun', desc: 'Tim kami siap membantu merekomendasikan pupuk dan media yang tepat.' }
  ];

  const handleNextGallery = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const handlePrevGallery = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans antialiased text-[#274235]">

      {/* 1. Header/Navbar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-[#e2ede7] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
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
            <Link href="/" className="text-sm font-semibold text-brand-emerald border-b-2 border-brand-emerald pb-1 transition-all">
              Beranda
            </Link>
            <Link href="/toko" className="text-sm font-semibold text-brand-sage hover:text-brand-forest transition-colors">
              Toko
            </Link>
            <Link href="/kegiatan" className="text-sm font-semibold text-brand-sage hover:text-brand-forest transition-colors">
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

            {/* Search Bar Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-brand-cream border border-[#e2ede7] rounded-full py-1.5 px-3.5 shadow-sm animate-fade-in-up">
                  <input
                    type="text"
                    placeholder="Cari tanaman..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 bg-transparent text-sm font-medium focus:outline-none text-brand-forest"
                    autoFocus
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="text-brand-sage hover:text-brand-forest ml-2 text-xs font-bold">
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-full hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all"
                  aria-label="Cari Produk"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Shopping Cart */}
            <Link
              href="/keranjang"
              className="p-2.5 rounded-full hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all relative"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-emerald text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Button (Login or Profile) */}
            <AuthButton />
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-36 bg-gradient-to-br from-[#f4f6f4] via-[#e8f1ec] to-[#f4f6f4]">

        {/* Abstract Floating Premium SVG Leaf Decorations */}
        <div className="absolute top-20 left-10 w-44 h-44 rounded-full bg-brand-lime/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-[#d0ecd7]/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-extrabold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 fill-brand-emerald/10" /> Selamat datang di Website Botani Mart
              </span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-[#1e3329] leading-[1.15] tracking-tight">
              Temukan berbagai macam tanaman segar yang siap kamu tanam di <span className="text-brand-emerald">Rumah.</span>
            </h1>

            <p className="text-brand-sage text-base sm:text-lg max-w-2xl font-medium leading-relaxed">
              Menyediakan berbagai pilihan tanaman berkualitas, pupuk, media tanam, dan alat perkebunan lengkap langsung dari pembibitan terpercaya.
            </p>

            <div className="pt-2">
              <Link
                href="/toko"
                className="inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-full bg-brand-emerald hover:bg-brand-forest text-white text-base font-bold shadow-xl shadow-brand-emerald/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Belanja Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Hero Right Visual Column (Premium CSS Placeholder) */}
          <div className="lg:col-span-5 relative w-full h-80 sm:h-96 lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-white/40 group">

            {/* Visual Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-forest/90 via-brand-emerald/70 to-transparent z-10" />

            {/* Elegant SVG Graphic to replace actual image */}
            <div className="absolute inset-0 bg-[#345947] flex flex-col items-center justify-center text-white/90 p-8 text-center select-none overflow-hidden">
              <div className="absolute w-[180%] h-[180%] border border-white/5 rounded-full animate-[spin_100s_linear_infinite]" />
              <div className="absolute w-[120%] h-[120%] border border-white/10 rounded-full animate-[spin_60s_linear_infinite]" />

              <div className="z-20 flex flex-col items-center max-w-sm space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 animate-pulse">
                  <ImageIcon className="w-9 h-9 text-brand-lime" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl tracking-wide">
                  Tampilan Gambar Menyusul
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-medium">
                  Bagian latar belakang ini akan digantikan oleh foto nursery asri Botani Mart setelah berkas diunggah.
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-brand-lime/20 text-brand-lime px-3 py-1 rounded-full border border-brand-lime/10">100% Organik</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-brand-lime/20 text-brand-lime px-3 py-1 rounded-full border border-brand-lime/10">Bogor</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Statistik Konter (Overlapping Cards) */}
      <section className="relative z-20 -mt-12 lg:-mt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-2xl shadow-brand-forest/5 border border-[#e2ede7]">

            {/* Stat Item 1 */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-brand-cream/50 transition-colors group">
              <span className="text-xs font-bold text-brand-sage uppercase tracking-widest">Sejak Tahun</span>
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-forest mt-1.5 mb-1 group-hover:scale-105 transition-transform duration-300">
                2018
              </span>
              <span className="text-xs font-semibold text-brand-emerald">Hingga kini</span>
            </div>

            {/* Stat Item 2 */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-brand-cream/50 transition-colors group">
              <span className="text-xs font-bold text-brand-sage uppercase tracking-widest">Sudah Mencapai</span>
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-forest mt-1.5 mb-1 group-hover:scale-105 transition-transform duration-300">
                100+
              </span>
              <span className="text-xs font-semibold text-brand-emerald">Pelanggan</span>
            </div>

            {/* Stat Item 3 */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-brand-cream/50 transition-colors group">
              <span className="text-xs font-bold text-brand-sage uppercase tracking-widest">Memiliki</span>
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-forest mt-1.5 mb-1 group-hover:scale-105 transition-transform duration-300">
                50+
              </span>
              <span className="text-xs font-semibold text-brand-emerald">Jenis tanaman</span>
            </div>

            {/* Stat Item 4 */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-brand-cream/50 transition-colors group">
              <span className="text-xs font-bold text-brand-sage uppercase tracking-widest">Dengan Rating</span>
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-forest mt-1.5 mb-1 flex items-center justify-center gap-1 group-hover:scale-105 transition-transform duration-300">
                4.6 <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </span>
              <span className="text-xs font-semibold text-brand-emerald">Di berbagai media</span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Tentang Botani Mart */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="informasi">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Column - Teks */}
          <div className="flex flex-col text-left space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-brand-emerald rounded" />
              <span className="text-sm font-bold text-brand-emerald tracking-widest uppercase">Tentang Botani Mart</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-forest leading-tight">
              Pusat Penjualan Tanaman & Produk Perkebunan Bogor
            </h2>

            <p className="text-brand-sage text-base leading-relaxed">
              Kami merupakan pusat penjualan tanaman dan produk perkebunan yang dikelola secara profesional oleh Institut Pertanian Bogor. Kami menyediakan berbagai macam kebutuhan hortikultura Anda, mulai dari bibit buah unggulan, tanaman hias menawan, aneka sayuran segar, hingga pupuk premium, media tanam bernutrisi tinggi, dan aneka peralatan berkebun lengkap.
            </p>

            <p className="text-brand-sage text-base leading-relaxed">
              Temukan solusi berkebun yang mudah, praktis, dan tepercaya untuk menyulap pekarangan rumah Anda menjadi kebun asri yang sejuk dan produktif.
            </p>

            {/* Address & Contact Info Box */}
            <div className="pt-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-emerald shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1e3329] text-sm">Alamat Galeri</h4>
                  <p className="text-xs text-brand-sage font-medium mt-0.5">Jalan Raya Dramaga No. 200, Dramaga, Bogor, Jawa Barat 16680</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-emerald shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1e3329] text-sm">Hubungi Kami</h4>
                  <p className="text-xs text-brand-sage font-medium mt-0.5">+62 251-862-2000 (Toko Resmi)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Galeri/Carousel Placeholder */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#e2ede7] h-80 sm:h-96 flex flex-col bg-brand-cream">

            {/* Carousel Item Display */}
            <div className="flex-1 relative flex items-center justify-center p-8 text-center text-brand-forest">

              {/* Graphic background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#c8e6c9]/40 to-[#b3e5fc]/30 z-0" />

              {/* Overlay Content */}
              <div className="z-10 flex flex-col items-center space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-emerald shadow-md">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-heading font-extrabold text-lg text-brand-forest">
                    {galleryItems[currentGalleryIndex].title}
                  </h4>
                  <p className="text-xs text-brand-sage leading-relaxed font-medium">
                    {galleryItems[currentGalleryIndex].desc}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-emerald/75 bg-brand-emerald/10 px-3 py-1 rounded-full border border-brand-emerald/10">
                  Slide {currentGalleryIndex + 1} dari {galleryItems.length}
                </span>
              </div>
            </div>

            {/* Slider Navigation Bar */}
            <div className="h-16 bg-white border-t border-[#e2ede7] px-6 flex items-center justify-between z-10">
              <span className="text-[11px] font-bold text-brand-sage uppercase tracking-wider">Foto Galeri Kegiatan</span>

              <div className="flex gap-2">
                <button
                  onClick={handlePrevGallery}
                  className="w-10 h-10 rounded-full border border-[#e2ede7] hover:bg-brand-cream flex items-center justify-center text-brand-sage hover:text-brand-forest transition-colors"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextGallery}
                  className="w-10 h-10 rounded-full border border-[#e2ede7] hover:bg-brand-cream flex items-center justify-center text-brand-sage hover:text-brand-forest transition-colors"
                  aria-label="Foto Selanjutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Testimoni Pelanggan */}
      <section className="py-20 lg:py-24 bg-brand-forest text-white relative overflow-hidden">

        {/* Background botanical graphics */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,89,71,0.4),transparent)] z-0" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#b8d5c5]/25 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <span className="text-xs font-bold text-brand-lime tracking-widest uppercase bg-brand-emerald/50 px-4 py-1.5 rounded-full border border-brand-emerald">
              Testimoni Pelanggan
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight max-w-lg leading-tight">
              Dipercaya oleh Ratusan Pecinta Tanaman
            </h2>
          </div>

          {/* Testimonial Cards (2 columns) */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Card 1 */}
            <div className="glass-panel rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-start text-left hover:scale-[1.01] transition-transform duration-300">

              {/* Elegant Line-Art Avatar Placeholder */}
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0 select-none">
                <User className="w-7 h-7 text-brand-lime" />
              </div>

              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-brand-lime text-brand-lime" />
                  ))}
                </div>
                <p className="text-white/85 text-sm leading-relaxed italic font-medium">
                  &ldquo;Bibit buah mangga harum manis yang saya beli di sini tumbuh dengan sangat subur. Sekarang daunnya sudah lebat sekali dan segar. Pelayanan dari admin toko juga sangat responsif saat saya bertanya via WA. Top markotop!&rdquo;
                </p>
                <div>
                  <h4 className="font-bold text-brand-lime text-base">Ananda Senja</h4>
                  <span className="text-xs text-white/50 font-medium">Mahasiswa</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-panel rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-start text-left hover:scale-[1.01] transition-transform duration-300">

              {/* Elegant Line-Art Avatar Placeholder */}
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0 select-none">
                <User className="w-7 h-7 text-brand-lime" />
              </div>

              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-brand-lime text-brand-lime" />
                  ))}
                </div>
                <p className="text-white/85 text-sm leading-relaxed italic font-medium">
                  &ldquo;Media tanamnya gembur dan subur sekali! Tanaman hias saya langsung mengeluarkan bunga baru yang lebat setelah saya ganti medianya dengan produk dari Botani Mart. Benar-benar kualitas jempolan, recommended seller!&rdquo;
                </p>
                <div>
                  <h4 className="font-bold text-brand-lime text-base">Kiki Rian</h4>
                  <span className="text-xs text-white/50 font-medium">Wiraswasta</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Kategori Produk */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Section Title */}
        <div className="flex flex-col items-center space-y-4 mb-16">
          <span className="text-xs font-bold text-brand-emerald tracking-widest uppercase bg-brand-emerald/10 px-4 py-1.5 rounded-full">
            Kategori Produk
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-forest">
            Berdasarkan Kebutuhan Berkebunmu
          </h2>
          <p className="text-brand-sage text-sm sm:text-base font-semibold max-w-md">
            Berikut adalah jenis produk yang tersedia lengkap di galeri kami
          </p>
        </div>

        {/* Categories Grid (7 Items) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 justify-center">
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="flex flex-col rounded-3xl border border-[#e2ede7] bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >

                {/* Visual Placeholder Graphic for each category */}
                <div className={`h-28 bg-gradient-to-tr ${category.gradient} flex items-center justify-center relative overflow-hidden text-brand-emerald`}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <IconComponent className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Dark Green bottom button label */}
                <div className="py-3 px-2 bg-brand-forest group-hover:bg-brand-emerald text-white text-xs font-bold transition-colors">
                  {category.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Large "Belanja Sekarang" Button */}
        <div className="mt-12">
          <Link
            href="/toko"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-brand-emerald text-brand-emerald hover:bg-brand-emerald hover:text-white font-bold text-sm transition-all duration-300"
          >
            Mulai Belanja Sekarang
          </Link>
        </div>

      </section>

      {/* 7. Best Seller */}
      <section className="py-20 lg:py-24 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header row */}
          <div className="flex items-end justify-between mb-12">
            <div className="flex flex-col text-left space-y-3">
              <span className="text-xs font-bold text-brand-emerald tracking-widest uppercase bg-[#e2ede7] px-4 py-1.5 rounded-full w-max">
                Terpopuler
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-forest">
                Best Seller
              </h2>
              <p className="text-brand-sage text-sm font-semibold">
                Produk tanaman dan perlengkapan perkebunan terlaris
              </p>
            </div>

            <Link
              href="/toko"
              className="inline-flex items-center gap-1 text-sm font-bold text-brand-emerald hover:text-brand-forest hover:translate-x-0.5 transition-all"
            >
              Lihat Semua <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>

          {/* Grid of 3 Product Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {BEST_SELLERS.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#e2ede7] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group relative"
              >

                {/* Wishlist Icon */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
                  aria-label="Tambah ke Favorit"
                >
                  <Heart
                    className={`w-4.5 h-4.5 transition-all ${wishlist[product.id] ? 'fill-red-500 text-red-500 scale-110' : 'text-zinc-400'}`}
                  />
                </button>

                {/* Product Image Placeholder Grid */}
                <div className={`h-64 bg-gradient-to-br ${product.gradient} flex items-center justify-center relative select-none overflow-hidden border-b border-brand-cream`}>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex flex-col items-center space-y-2 z-10 text-brand-forest/70">
                    <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center shadow-inner">
                      <Leaf className="w-6 h-6 text-brand-emerald" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-brand-emerald/10 text-brand-emerald px-2 py-0.5 rounded border border-brand-emerald/5">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col text-left space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-sage tracking-wider uppercase">
                      {product.category}
                    </span>
                    <h3 className="font-heading font-extrabold text-lg text-brand-forest group-hover:text-brand-emerald transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="text-base font-bold text-brand-emerald">
                    {product.price}
                  </div>

                  {/* Rating block */}
                  <div className="flex items-center gap-1.5 text-xs text-brand-sage font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-zinc-300 font-normal">|</span>
                    <span>({product.reviews} ulasan)</span>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 flex gap-2 border-t border-brand-cream mt-auto">
                    <button
                      onClick={() => {
                        setCartCount(prev => prev + 1);
                        alert(`${product.name} berhasil ditambahkan ke keranjang belanja!`);
                      }}
                      className="w-12 h-12 rounded-2xl border border-[#e2ede7] hover:bg-brand-cream text-brand-emerald flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      aria-label="Tambahkan ke Keranjang"
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => alert(`Membeli ${product.name} langsung!`)}
                      className="flex-1 py-3 rounded-2xl bg-brand-forest hover:bg-brand-emerald text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer text-center"
                    >
                      Beli Sekarang
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Kegiatan Terbaru (Dark Green Block) */}
      <section className="py-20 lg:py-24 bg-brand-forest text-white" id="kegiatan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header row */}
          <div className="flex items-end justify-between mb-12">
            <div className="flex flex-col text-left space-y-3">
              <span className="text-xs font-bold text-brand-lime tracking-widest uppercase bg-brand-emerald/50 px-4 py-1.5 rounded-full border border-brand-emerald w-max">
                Kabar Terbaru
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
                Kegiatan Terbaru
              </h2>
              <p className="text-white/60 text-sm font-semibold">
                Aktivitas sosial dan artikel informasi terbaru dari Botani Mart
              </p>
            </div>

            <Link
              href="/kegiatan"
              className="inline-flex items-center gap-1 text-sm font-bold text-brand-lime hover:text-white transition-all"
            >
              Lihat Semua <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>

          {/* 2 News Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {LATEST_ACTIVITIES.map((activity) => (
              <div
                key={activity.id}
                className="bg-white/5 rounded-3xl border border-white/10 hover:border-white/20 p-6 sm:p-8 text-left hover:bg-white/[0.08] transition-all duration-300 flex flex-col sm:flex-row gap-6"
              >

                {/* News Image/Banner Graphic Placeholder */}
                <div className="w-full sm:w-32 h-32 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative select-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-lime/20 to-transparent" />
                  <Leaf className="w-7 h-7 text-brand-lime opacity-75" />
                </div>

                {/* Content info */}
                <div className="flex-1 flex flex-col space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-brand-lime font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{activity.date}</span>
                      <span>•</span>
                      <span>{activity.location}</span>
                    </div>

                    <h3 className="font-heading font-extrabold text-lg text-white">
                      {activity.title}
                    </h3>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed font-medium">
                    {activity.summary}
                  </p>

                  <button
                    onClick={() => alert(`Membuka artikel: ${activity.title}`)}
                    className="pt-2 text-xs font-bold text-brand-lime hover:text-white flex items-center gap-1 mt-auto hover:underline text-left cursor-pointer"
                  >
                    Baca selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. Kunjungi Toko Kami! (Call To Action Block) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#c8e6c9]/35 via-[#b8d5c5]/40 to-[#e8f5e9]/30 border border-[#e2ede7] p-8 sm:p-12 md:p-16 text-center shadow-lg relative overflow-hidden">

          <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-brand-lime/10 blur-xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-36 h-36 rounded-full bg-[#dcedc8]/20 blur-xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-brand-forest">
              Kunjungi Toko Kami!
            </h2>
            <p className="text-brand-sage text-sm sm:text-base leading-relaxed font-semibold">
              Galeri offline kami beroperasi setiap hari dari pukul 08.00 s.d 17.00 WIB. Silakan kunjungi alamat kami langsung untuk melihat ratusan bibit unggulan segar di Dramaga, Bogor.
            </p>
            <div className="pt-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-brand-cream text-brand-forest text-sm font-extrabold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Klik Link
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-brand-cream border-t border-[#e2ede7] py-12 text-center" id="kontak">
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

            {/* TikTok - Original Neon Brand Accent */}
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

            {/* Instagram - Vibrant Sunset Gradient Logo */}
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

            {/* WhatsApp - Glowing Green Logo */}
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
