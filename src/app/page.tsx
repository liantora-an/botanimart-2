'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Leaf,
  Search,
  ShoppingBag,
  MapPin,
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
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
  const router = useRouter();

  // Stateful states for interactivity
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Real add-to-cart via API
  const addToCart = useCallback(async (productId: number, productName: string) => {
    setAddingToCart(productId);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_id: String(productId), quantity: 1 }),
      });
      if (res.status === 401) { router.push('/login?from=/'); return; }
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event('cart-updated'));
        alert(`${productName} berhasil ditambahkan ke keranjang!`);
      } else {
        alert(data.error || 'Gagal menambahkan ke keranjang.');
      }
    } catch { alert('Terjadi kesalahan jaringan.'); }
    finally { setAddingToCart(null); }
  }, [router]);

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
      <Navbar activePage="beranda" />

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

              <a
                href="https://wa.me/6281110631132"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 hover:opacity-85 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-[#25d366]/10 flex items-center justify-center text-[#25d366] shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.498 4.885 1.503 5.485.002 9.948-4.436 9.951-9.886.002-2.641-1.02-5.124-2.877-6.984C16.691 1.928 14.22 1.91 12.012 1.91 6.524 1.91 2.06 6.348 2.057 11.8.055 13.526.564 15.223 1.56 16.892l-.997 3.637 3.734-.969a9.7 9.7 0 001.35.59z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-[#1e3329] text-sm">Hubungi Kami (WhatsApp)</h4>
                  <p className="text-xs text-brand-sage font-medium mt-0.5">081110631132</p>
                </div>
              </a>
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
                      onClick={() => addToCart(product.id, product.name)}
                      disabled={addingToCart === product.id}
                      className="w-12 h-12 rounded-2xl border border-[#e2ede7] hover:bg-brand-cream text-brand-emerald flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      aria-label="Tambahkan ke Keranjang"
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                    <button
                      onClick={async () => {
                        setAddingToCart(product.id);
                        try {
                          const res = await fetch('/api/cart', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plant_id: String(product.id), quantity: 1 }),
                          });
                          if (res.status === 401) { router.push('/login?from=/'); return; }
                          const data = await res.json();
                          if (data.success) router.push('/checkout');
                          else alert(data.error || 'Gagal.');
                        } catch { alert('Terjadi kesalahan jaringan.'); }
                        finally { setAddingToCart(null); }
                      }}
                      disabled={addingToCart === product.id}
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
              Galeri offline kami beroperasi setiap hari dari pukul 08.00 s.d 17.00 WIB. Silakan kunjungi alamat kami langsung untuk melihat ratusa
              n bibit unggulan segar di Dramaga, Bogor.
            </p>
            <div className="pt-2">
              <a
                href="https://maps.app.goo.gl/A8s5sfKYDKjfmq3NA"
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
      <Footer />

    </div>
  );
}
