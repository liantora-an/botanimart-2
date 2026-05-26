'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ArrowLeft,
  Plus,
  Minus,
  Sparkles,
  Leaf,
  Calendar,
  Compass,
  ArrowRight,
  User,
  ShoppingBag as CartIcon,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import AuthButton from '@/components/layout/AuthButton';

// Complete Mock Products Database matching mockup
const PRODUCTS = [
  {
    id: 1,
    name: 'Bibit Mangga',
    category: 'Bibit Buah',
    price: 35000,
    unit: '',
    rating: 4.9,
    reviews: 54,
    stock: 20,
    tags: ['Terbaru', 'Best Seller'],
    description: 'Bibit Buah Mangga unggulan hasil okulasi dengan kualitas terbaik. Pohon kokoh, akar sehat, tinggi bibit 50-70cm. Sangat cocok ditanam di pekarangan rumah maupun tabulampot (tanaman buah dalam pot). Cepat berbuah dan tahan hama.',
    features: ['Dikirim (Tiba dalam 2-3 jam)', 'Ambil Langsung'],
    thumbnails: ['Thumbnail Daun', 'Thumbnail Pohon', 'Thumbnail Buah']
  },
  {
    id: 2,
    name: 'Bibit Alpukat',
    category: 'Bibit Buah',
    price: 45000,
    unit: '',
    rating: 4.7,
    reviews: 78,
    stock: 15,
    tags: ['Best Seller'],
    description: 'Bibit Alpukat Mentega super unggulan. Cepat berbuah dalam 2-3 tahun perawatan intensif. Dihasilkan dari indukan produktif hasil sambung pucuk. Tahan cuaca panas dan mudah perawatannya.',
    features: ['Dikirim (Tiba dalam 2-3 jam)', 'Ambil Langsung'],
    thumbnails: ['Thumbnail Daun', 'Thumbnail Pohon', 'Thumbnail Buah']
  },
  {
    id: 3,
    name: 'Bibit Jeruk',
    category: 'Bibit Buah',
    price: 25000,
    unit: '',
    rating: 4.9,
    reviews: 32,
    stock: 30,
    tags: ['Terbaru'],
    description: 'Bibit Jeruk Dekopon/Jeruk Santang madu manis segar. Hasil cangkok batang, sehingga lebih cepat berbuah. Cocok untuk daerah dataran rendah maupun tinggi.',
    features: ['Dikirim (Tiba dalam 2-3 jam)', 'Ambil Langsung'],
    thumbnails: ['Thumbnail Daun', 'Thumbnail Pohon', 'Thumbnail Buah']
  },
  {
    id: 4,
    name: 'Bibit Jambu Air',
    category: 'Bibit Buah',
    price: 30000,
    unit: '',
    rating: 4.9,
    reviews: 44,
    stock: 25,
    tags: ['Best Seller'],
    description: 'Bibit Jambu Air Madu Deli Hijau berbuah manis renyah tanpa biji. Tinggi bibit 60cm, berakar kuat, siap ditanam langsung di tanah maupun dalam pot besar.',
    features: ['Dikirim (Tiba dalam 2-3 jam)', 'Ambil Langsung'],
    thumbnails: ['Thumbnail Daun', 'Thumbnail Pohon', 'Thumbnail Buah']
  },
  {
    id: 5,
    name: 'Anggrek',
    category: 'Tanaman Hias',
    price: 130000,
    unit: '',
    rating: 4.9,
    reviews: 28,
    stock: 12,
    tags: ['Terbaru', 'Best Seller'],
    description: 'Tanaman hias Bunga Anggrek Bulan eksotis dengan warna memikat. Dikirim lengkap dengan pot gantung sabut kelapa dan media tanam khusus anggrek.',
    features: ['Dikirim (Tiba dalam 2-3 jam)', 'Ambil Langsung'],
    thumbnails: ['Thumbnail Daun', 'Thumbnail Pohon', 'Thumbnail Buah']
  },
  {
    id: 6,
    name: 'Kaktus Mini',
    category: 'Tanaman Hias',
    price: 20000,
    unit: '',
    rating: 4.7,
    reviews: 19,
    stock: 50,
    tags: ['Terbaru'],
    description: 'Kaktus Hias Mini sukulen cantik. Sangat mudah dirawat dan cocok diletakkan di meja kerja, rak tanaman, atau dekorasi meja tamu minimalis.',
    features: ['Dikirim (Tiba dalam 2-3 jam)', 'Ambil Langsung'],
    thumbnails: ['Thumbnail Daun', 'Thumbnail Pohon', 'Thumbnail Buah']
  },
  {
    id: 7,
    name: 'Bibit Rambutan',
    category: 'Bibit Buah',
    price: 35000,
    unit: '',
    rating: 4.9,
    reviews: 36,
    stock: 18,
    tags: [],
    description: 'Bibit Rambutan Binjai manis lekat berakar kuat. Hasil okulasi tinggi 50-60cm. Pohon rimbun, tangguh terhadap perubahan iklim ekstrem.',
    features: ['Dikirim (Tiba dalam 2-3 jam)', 'Ambil Langsung'],
    thumbnails: ['Thumbnail Daun', 'Thumbnail Pohon', 'Thumbnail Buah']
  },
  {
    id: 8,
    name: 'Bibit Durian',
    category: 'Bibit Buah',
    price: 45000,
    unit: '',
    rating: 4.9,
    reviews: 62,
    stock: 22,
    tags: ['Best Seller'],
    description: 'Bibit Durian Bawor/Bhinneka Bawor hasil sambung kaki tiga. Lebih cepat menyerap nutrisi tanah, pohon sangat kokoh, pertumbuhan cepat dan produktif.',
    features: ['Dikirim (Tiba dalam 2-3 jam)', 'Ambil Langsung'],
    thumbnails: ['Thumbnail Daun', 'Thumbnail Pohon', 'Thumbnail Buah']
  }
];

export default function TokoKatalogPage() {
  // Navigation & Cart States
  const [cartCount, setCartCount] = useState(2);
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});

  // Interactive View States
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Semua' | 'Terbaru' | 'Best Seller'>('Semua');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceSort, setPriceSort] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  // Detail View States
  const [quantity, setQuantity] = useState(3); // Default count matching detail mockup
  const [activeDetailTab, setActiveDetailTab] = useState<'deskripsi' | 'review'>('deskripsi');
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  // Pagination Active Index
  const [currentPage, setCurrentPage] = useState(1);

  // Wishlist toggle handler
  const toggleWishlist = (id: number) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // 1. Search Query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // 2. Navigation Tab (Terbaru / Best Seller)
      if (activeTab === 'Terbaru' && !product.tags.includes('Terbaru')) {
        return false;
      }
      if (activeTab === 'Best Seller' && !product.tags.includes('Best Seller')) {
        return false;
      }
      // 3. Category Dropdown
      if (categoryFilter && product.category !== categoryFilter) {
        return false;
      }
      // 4. Method Filter
      if (methodFilter) {
        const matchesMethod = product.features.some(f => f.toLowerCase().includes(methodFilter.toLowerCase()));
        if (!matchesMethod) return false;
      }
      return true;
    }).sort((a, b) => {
      // 5. Price Sort
      if (priceSort === 'cheap') {
        return a.price - b.price;
      }
      if (priceSort === 'expensive') {
        return b.price - a.price;
      }
      return 0;
    });
  }, [searchQuery, activeTab, categoryFilter, priceSort, methodFilter]);

  // Handle open product detail
  const openProductDetail = (product: typeof PRODUCTS[0]) => {
    setSelectedProduct(product);
    setQuantity(3); // Reset quantity counter to 3 as in mockup
    setActiveDetailTab('deskripsi');
    setSelectedThumbnail(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans antialiased text-[#274235]">

      {/* 1. Header/Navbar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-[#e2ede7] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo (Cropped Transparent logo_v4.png) */}
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
            <Link href="/toko" className="text-sm font-semibold text-brand-emerald border-b-2 border-brand-emerald pb-1 transition-all">
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
            {/* Wishlist Link Icon */}
            <button
              className="p-2.5 rounded-full hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all relative"
              aria-label="Wishlist"
              onClick={() => alert('Fitur Wishlist sedang dikembangkan!')}
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Shopping Cart */}
            <button
              className="p-2.5 rounded-full hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all relative"
              aria-label="Keranjang Belanja"
              onClick={() => alert('Fitur Keranjang Belanja sedang dikembangkan!')}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-emerald text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Button (Login or Profile) */}
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">

        {/* CONDITION 1: CATALOG VIEW (Daftar Produk) */}
        {!selectedProduct ? (
          <div className="space-y-8">

            {/* Toko/Shop Header Banner (Blank/Empty Background, solid soft green as Placeholder per instruction) */}
            <div className="relative rounded-3xl overflow-hidden py-16 px-8 sm:px-12 text-center bg-gradient-to-r from-brand-forest/95 via-brand-emerald/90 to-brand-forest/95 shadow-lg border border-brand-emerald/10 select-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,89,71,0.2),transparent)] z-0" />
              <div className="relative z-10 space-y-3">
                <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-lime uppercase">
                  Selamat berbelanja!
                </span>
                <h1 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight drop-shadow-sm">
                  Toko/Shop
                </h1>
              </div>
            </div>

            {/* Centered Pill Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="flex items-center bg-white border-2 border-[#e2ede7] focus-within:border-brand-emerald rounded-full py-4.5 px-7 shadow-lg shadow-brand-forest/5 transition-all duration-300 group">
                <input
                  type="text"
                  placeholder="Cari produk, tanaman, bibit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-base font-semibold focus:outline-none text-brand-forest placeholder-brand-sage/60"
                />
                <Search className="w-5.5 h-5.5 text-brand-sage group-focus-within:text-brand-emerald shrink-0" />
              </div>
            </div>

            {/* Navigation Tabs (Semua, Terbaru, Best Seller) */}
            <div className="flex justify-center items-center gap-8 sm:gap-12 border-b border-[#e2ede7] pb-1">
              {(['Semua', 'Terbaru', 'Best Seller'] as const).map(tab => (
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

            {/* Dropdown Filters row */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">

              {/* Category Dropdown */}
              <div className="flex flex-col text-left">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-white border border-[#e2ede7] rounded-2xl py-3.5 px-5 text-sm font-semibold text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-sm cursor-pointer"
                >
                  <option value="">Kategori</option>
                  <option value="Bibit Buah">Bibit Buah</option>
                  <option value="Tanaman Hias">Tanaman Hias</option>
                </select>
              </div>

              {/* Price Dropdown */}
              <div className="flex flex-col text-left">
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="w-full bg-white border border-[#e2ede7] rounded-2xl py-3.5 px-5 text-sm font-semibold text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-sm cursor-pointer"
                >
                  <option value="">Harga</option>
                  <option value="cheap">Termurah</option>
                  <option value="expensive">Termahal</option>
                </select>
              </div>

              {/* Delivery Option Dropdown */}
              <div className="flex flex-col text-left">
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full bg-white border border-[#e2ede7] rounded-2xl py-3.5 px-5 text-sm font-semibold text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-sm cursor-pointer"
                >
                  <option value="">Pengambilan</option>
                  <option value="dikirim">Dikirim</option>
                  <option value="ambil">Ambil Langsung</option>
                </select>
              </div>

            </div>

            {/* Products Grid (8 Items based on layout) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => openProductDetail(product)}
                  className="bg-white rounded-3xl border border-[#e2ede7] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative cursor-pointer"
                >
                  {/* Wishlist Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Simpan ke Wishlist"
                  >
                    <Heart
                      className={`w-4.5 h-4.5 transition-all ${wishlist[product.id] ? 'fill-red-500 text-red-500 scale-110' : 'text-zinc-400'}`}
                    />
                  </button>

                  {/* Empty Image Container / Placeholder (No Plant Images per instruction) */}
                  <div
                    className="h-56 w-full bg-brand-cream border-b border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage select-none"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-brand-sage shadow-inner mb-2 group-hover:scale-105 transition-transform duration-300">
                      <Leaf className="w-6 h-6 rotate-12 opacity-80" />
                    </div>
                    <span className="text-[10px] text-brand-sage/60 font-semibold tracking-wider">Gambar Tanaman</span>
                  </div>

                  {/* Card Info Section */}
                  <div className="p-5 flex-1 flex flex-col text-left space-y-2">
                    <span className="text-[10px] font-bold text-brand-sage tracking-wider uppercase">
                      {product.category}
                    </span>

                    <h3
                      className="font-heading font-extrabold text-base text-[#1e3329] group-hover:text-brand-emerald transition-colors"
                    >
                      {product.name}
                    </h3>

                    <div className="text-base font-bold text-brand-emerald">
                      Rp. {product.price.toLocaleString('id-ID')}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-brand-sage font-semibold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>

                    {/* Actions Double Button */}
                    <div className="pt-3 flex gap-2 border-t border-brand-cream mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCartCount(prev => prev + 1);
                          alert(`${product.name} telah ditambahkan ke keranjang!`);
                        }}
                        className="w-11 h-11 rounded-2xl border border-[#e2ede7] hover:bg-brand-cream text-brand-emerald flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                        aria-label="Masukkan Keranjang"
                      >
                        <ShoppingBag className="w-4.5 h-4.5" />
                      </button>
                      <button
                        className="flex-1 py-2.5 rounded-2xl bg-brand-forest hover:bg-brand-emerald text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer text-center"
                      >
                        Beli Sekarang
                      </button>
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
                aria-label="Halaman Sebelumnya"
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
                aria-label="Halaman Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        ) : (

          /* CONDITION 2: DETAIL VIEW (Detail Produk) */
          <div className="space-y-12 animate-fade-in-up">

            {/* Top Back Action Bar (Kembali) */}
            <div className="flex justify-between items-center border-b border-[#e2ede7] pb-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-emerald hover:text-brand-forest transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
                Kembali
              </button>

              {/* Centered Pill Search Bar in Detail View */}
              <div className="hidden md:flex items-center bg-white border border-[#e2ede7] rounded-full py-2 px-5 w-80 shadow-sm">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full bg-transparent text-xs font-semibold focus:outline-none text-brand-forest"
                  onClick={() => setSelectedProduct(null)} // Go back to search on click
                />
                <Search className="w-4 h-4 text-brand-sage" />
              </div>
            </div>

            {/* Main Detail Columns */}
            <div className="grid lg:grid-cols-12 gap-12">

              {/* Kolom Kiri: Visual Gambar Placeholder */}
              <div className="lg:col-span-5 space-y-4">

                {/* Large Main Placeholder Container */}
                <div className="aspect-square w-full rounded-3xl bg-brand-cream border border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-lime/10 to-brand-cream z-0" />
                  <Leaf className="w-16 h-16 rotate-12 opacity-40 mb-3 z-10 animate-pulse" />
                  <span className="text-sm text-brand-sage/60 font-semibold z-10">Gambar Tanaman Utama</span>
                </div>

                {/* Thumbnails Row (3 Thumbnails) */}
                <div className="grid grid-cols-3 gap-4">
                  {selectedProduct.thumbnails.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedThumbnail(idx)}
                      className={`aspect-square w-full rounded-2xl border flex flex-col items-center justify-center text-[10px] text-brand-sage/60 font-bold transition-all relative overflow-hidden cursor-pointer ${selectedThumbnail === idx
                        ? 'border-brand-emerald bg-brand-cream/80 ring-2 ring-brand-emerald/10'
                        : 'border-[#e2ede7] bg-brand-cream hover:bg-brand-cream/60'
                        }`}
                    >
                      <Leaf className="w-5 h-5 opacity-30 mb-1" />
                      <span>{thumb}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kolom Kanan: Detail & Pembelian */}
              <div className="lg:col-span-7 flex flex-col text-left space-y-6">
                <div className="space-y-2">
                  <span className="inline-flex px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-bold tracking-wider uppercase">
                    {selectedProduct.category}
                  </span>

                  <h1 className="font-heading font-black text-3xl sm:text-4xl text-brand-forest tracking-tight">
                    {selectedProduct.name}
                  </h1>

                  {/* Rating, Reviews & Popularity */}
                  <div className="flex items-center gap-3 text-sm text-brand-sage font-semibold pt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{selectedProduct.rating} ({selectedProduct.reviews})</span>
                    </div>
                    <span>•</span>
                    <span className="text-brand-emerald font-bold">10 Terjual</span>
                  </div>
                </div>

                {/* Price Label */}
                <div className="text-3xl font-heading font-black text-brand-emerald border-y border-[#e2ede7] py-4">
                  Rp. {selectedProduct.price.toLocaleString('id-ID')}/5 pack
                </div>

                {/* Pengambilan Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-brand-sage uppercase tracking-widest w-24">Pengambilan</span>

                    <div className="flex flex-wrap gap-2 text-xs font-bold">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-cream border border-[#e2ede7] text-brand-forest">
                        🚚 Dikirim (Tiba dalam 2-3 jam)
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-cream border border-[#e2ede7] text-brand-forest">
                        🏪 Ambil Langsung
                      </span>
                    </div>
                  </div>

                  {/* Stock info */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-brand-sage uppercase tracking-widest w-24">Tersisa</span>
                    <span className="text-sm font-bold text-brand-forest">{selectedProduct.stock} Buah</span>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs font-extrabold text-brand-sage uppercase tracking-widest w-24">Kuantitas</span>

                    <div className="flex items-center border border-[#e2ede7] rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
                      <button
                        onClick={() => quantity > 1 && setQuantity(prev => prev - 1)}
                        className="p-3 hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-colors cursor-pointer"
                        aria-label="Kurangi"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-12 text-center text-sm font-bold text-brand-forest">
                        {quantity}
                      </span>

                      <button
                        onClick={() => quantity < selectedProduct.stock && setQuantity(prev => prev + 1)}
                        className="p-3 hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-colors cursor-pointer"
                        aria-label="Tambah"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4 border-t border-brand-cream">
                  <button
                    onClick={() => {
                      setCartCount(prev => prev + quantity);
                      alert(`${quantity} ${selectedProduct.name} ditambahkan ke keranjang belanja!`);
                    }}
                    className="flex-1 py-4.5 rounded-2xl border-2 border-brand-emerald hover:bg-brand-cream text-brand-emerald font-heading font-bold text-sm tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Tambah ke Keranjang
                  </button>

                  <button
                    onClick={() => alert(`Membeli ${quantity} ${selectedProduct.name} langsung!`)}
                    className="flex-1 py-4.5 rounded-2xl bg-brand-forest hover:bg-brand-emerald text-white font-heading font-bold text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
                  >
                    Beli Sekarang
                  </button>
                </div>

              </div>

            </div>

            {/* Description & Review Tabs (Middle Section) */}
            <div className="border-t border-[#e2ede7] pt-8 space-y-6">

              {/* Tabs list */}
              <div className="flex gap-8 border-b border-[#e2ede7] pb-1">
                <button
                  onClick={() => setActiveDetailTab('deskripsi')}
                  className={`pb-3 text-lg font-heading font-bold transition-all border-b-3 px-1 cursor-pointer ${activeDetailTab === 'deskripsi'
                    ? 'text-brand-emerald border-brand-emerald'
                    : 'text-brand-sage border-transparent hover:text-brand-forest'
                    }`}
                >
                  Deskripsi
                </button>
                <button
                  onClick={() => setActiveDetailTab('review')}
                  className={`pb-3 text-lg font-heading font-bold transition-all border-b-3 px-1 cursor-pointer ${activeDetailTab === 'review'
                    ? 'text-brand-emerald border-brand-emerald'
                    : 'text-brand-sage border-transparent hover:text-brand-forest'
                    }`}
                >
                  Review
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="text-left leading-relaxed">
                {activeDetailTab === 'deskripsi' ? (
                  <div className="text-brand-sage text-base space-y-4 max-w-4xl">
                    <p>{selectedProduct.description}</p>
                    <p className="font-semibold text-brand-forest mt-2">
                      Spesifikasi & Kelebihan:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm font-medium">
                      <li>Tinggi Tanaman: ± 50cm s.d 70cm</li>
                      <li>Metode Perbanyakan: Okulasi vegetatif berkualitas</li>
                      <li>Kebutuhan Sinar Matahari: Sepanjang hari</li>
                      <li>Media Tanam Ideal: Campuran tanah, pupuk organik, sekam</li>
                      <li>Kondisi Pengiriman: Bebas penyakit, dikemas rapi, akar terlindungi</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-3xl">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#e2ede7] shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-brand-emerald" />
                      </div>
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[#1e3329] text-sm">Budi Hartono</h4>
                          <span className="text-[10px] text-zinc-300 font-normal">|</span>
                          <span className="text-[10px] text-brand-sage font-medium">Terverifikasi</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-brand-sage text-xs leading-relaxed font-medium">
                          "Bibit sampai dengan kondisi sangat segar, pekingan kayu luar biasa aman. Sangat direkomendasikan beli bibit buah disini!"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Recommendations Section (Rekomendasi Lain) */}
            <div className="border-t border-[#e2ede7] pt-12 space-y-8">

              {/* Header row */}
              <div className="flex items-end justify-between">
                <h3 className="font-heading font-black text-2xl text-brand-forest">
                  Rekomendasi Lain
                </h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="inline-flex items-center gap-1 text-sm font-bold text-brand-emerald hover:text-brand-forest transition-all"
                >
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of 4 Similar Products */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {PRODUCTS.filter(p => p.id !== selectedProduct.id).slice(0, 4).map(recommendation => (
                  <div
                    key={recommendation.id}
                    onClick={() => openProductDetail(recommendation)}
                    className="bg-white rounded-3xl border border-[#e2ede7] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative cursor-pointer"
                  >
                    {/* Wishlist Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(recommendation.id);
                      }}
                      className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Simpan ke Wishlist"
                    >
                      <Heart
                        className={`w-4.5 h-4.5 transition-all ${wishlist[recommendation.id] ? 'fill-red-500 text-red-500 scale-110' : 'text-zinc-400'}`}
                      />
                    </button>

                    {/* Empty image block placeholder */}
                    <div
                      className="h-44 w-full bg-brand-cream border-b border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage select-none"
                    >
                      <Leaf className="w-5 h-5 opacity-40 mb-1 rotate-12" />
                      <span className="text-[9px] text-brand-sage/60 font-semibold">Gambar Tanaman</span>
                    </div>

                    {/* Card Info Section */}
                    <div className="p-4 flex-1 flex flex-col text-left space-y-1.5">
                      <span className="text-[9px] font-bold text-brand-sage tracking-wider uppercase">
                        {recommendation.category}
                      </span>

                      <h4
                        className="font-heading font-extrabold text-sm text-[#1e3329] group-hover:text-brand-emerald transition-colors"
                      >
                        {recommendation.name}
                      </h4>

                      <div className="text-sm font-bold text-brand-emerald">
                        Rp. {recommendation.price.toLocaleString('id-ID')}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-brand-sage font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{recommendation.rating}</span>
                      </div>

                      {/* Actions Double Button */}
                      <div className="pt-2.5 flex gap-2 border-t border-brand-cream mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCartCount(prev => prev + 1);
                            alert(`${recommendation.name} telah ditambahkan ke keranjang!`);
                          }}
                          className="w-9 h-9 rounded-xl border border-[#e2ede7] hover:bg-brand-cream text-brand-emerald flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          aria-label="Masukkan Keranjang"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <button
                          className="flex-1 py-1.5 rounded-xl bg-brand-forest hover:bg-brand-emerald text-white text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer text-center"
                        >
                          Beli Sekarang
                        </button>
                      </div>
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

          {/* Footer Logo (using cropped transparent v4 logo) */}
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
