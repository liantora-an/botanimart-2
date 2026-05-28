'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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

function TokoKatalogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // API Database States
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Navigation & Cart States
  const [wishlist, setWishlist] = useState<Record<string | number, boolean>>({});
  const [addingToCart, setAddingToCart] = useState<string | number | null>(null);

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const searchParamVal = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState<'Semua' | 'Terbaru' | 'Best Seller'>('Semua');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceSort, setPriceSort] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  // Detail View States
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1); // Default count matching detail mockup
  const [activeDetailTab, setActiveDetailTab] = useState<'deskripsi' | 'review'>('deskripsi');
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  // Review & Rating States
  const [reviews, setReviews] = useState<any[]>([]);
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const [eligibleOrderId, setEligibleOrderId] = useState<string | null>(null);
  const [fetchingReviews, setFetchingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Pagination Active Index
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL search query to local state
  React.useEffect(() => {
    setSearchQuery(searchParamVal);
    setCurrentPage(1); // Reset page on new search
  }, [searchParamVal]);

  // Fetch Categories once on mount
  React.useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCategories(data.data || []);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products based on filter parameters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', '8'); // 8 items displayed per design mockup

      if (searchQuery) {
        params.set('search', searchQuery);
      }
      if (categoryFilter) {
        params.set('category', categoryFilter);
      }

      // Price Sorting mapping
      if (priceSort === 'cheap') {
        params.set('sort', 'price_asc');
      } else if (priceSort === 'expensive') {
        params.set('sort', 'price_desc');
      } else if (activeTab === 'Best Seller') {
        params.set('sort', 'popular');
      } else {
        params.set('sort', 'newest');
      }

      // Tag mapping
      if (activeTab === 'Terbaru') {
        params.set('tags', 'Terbaru');
      } else if (activeTab === 'Best Seller') {
        params.set('tags', 'Best Seller');
      }

      const res = await fetch(`/api/catalog?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          let items = data.data.data || [];

          // Apply client-side delivery method filter (since pickup_methods is an array)
          if (methodFilter) {
            items = items.filter((p: any) =>
              p.pickup_methods?.some((m: string) => m.toLowerCase().includes(methodFilter.toLowerCase()))
            );
          }

          // Map items from backend schemas to match expected UI layout structures perfectly
          const mappedItems = items.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category?.name || 'Tanaman',
            price: p.price,
            unit: p.unit || 'buah',
            rating: p.rating_avg ? Number(p.rating_avg) : 0,
            reviews: p.rating_count || 0,
            sold_count: p.sold_count || 0,
            stock: p.stock,
            tags: p.tags || [],
            description: p.description || 'Tanaman berkualitas unggulan hasil perawatan organik khusus.',
            features: p.pickup_methods || ['Dikirim (Tiba dalam 2-3 jam)', 'Ambil Langsung'],
            thumbnails: ['Thumbnail Daun', 'Thumbnail Pohon', 'Thumbnail Bunga'],
            image_url: p.image_url
          }));

          setProducts(mappedItems);
          setTotal(data.data.total || 0);
          setTotalPages(data.data.totalPages || 1);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, priceSort, activeTab, methodFilter]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Real add-to-cart via API
  const addToCart = useCallback(async (productId: string | number, productName: string, qty: number = 1) => {
    setAddingToCart(productId);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_id: String(productId), quantity: qty }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push(`/login?from=/toko`);
        return;
      }
      if (data.success) {
        window.dispatchEvent(new Event('cart-updated'));
        alert(`${productName} berhasil ditambahkan ke keranjang!`);
      } else {
        alert(data.error || 'Gagal menambahkan ke keranjang.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setAddingToCart(null);
    }
  }, [router]);

  // Wishlist toggle handler
  const toggleWishlist = (id: string | number) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Alias filteredProducts to our dynamically fetched and mapped products state
  const filteredProducts = products;

  // Fetch dynamic reviews and user review eligibility
  const fetchReviews = useCallback(async (productId: string) => {
    setFetchingReviews(true);
    try {
      const res = await fetch(`/api/catalog/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews(data.data.reviews);
          setIsEligibleToReview(data.data.isEligible);
          setEligibleOrderId(data.data.eligibleOrderId || null);
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setFetchingReviews(false);
    }
  }, []);

  // Submit review handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (newRating < 1 || newRating > 5) {
      alert('Rating harus antara 1 dan 5.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/catalog/${selectedProduct.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push(`/login?from=/toko`);
        return;
      }
      if (data.success) {
        alert('Ulasan Anda berhasil dikirim! Terima kasih.');
        setNewComment('');
        setNewRating(5);
        
        // Fetch updated reviews & eligibility instantly
        await fetchReviews(selectedProduct.id);

        // Update the average rating & count in the selected product details dynamically
        const allReviews = [...reviews, data.data];
        const newCount = allReviews.length;
        const newAvg = Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / newCount).toFixed(2));

        setSelectedProduct((prev: any) => {
          if (!prev) return null;
          return {
            ...prev,
            rating: newAvg,
            reviews: newCount
          };
        });

        // Update in the products list as well
        setProducts((prevProds) =>
          prevProds.map((p) => {
            if (p.id === selectedProduct.id) {
              return {
                ...p,
                rating: newAvg,
                reviews: newCount
              };
            }
            return p;
          })
        );
      } else {
        alert(data.error || 'Gagal mengirimkan ulasan.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Fetch reviews automatically when product selected
  React.useEffect(() => {
    if (selectedProduct) {
      fetchReviews(selectedProduct.id);
    }
  }, [selectedProduct, fetchReviews]);

  // Handle open product detail
  const openProductDetail = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity counter to 1 as in mockup
    setActiveDetailTab('deskripsi');
    setSelectedThumbnail(0);
    setNewRating(5);
    setNewComment('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans antialiased text-[#274235]">

      {/* 1. Header/Navbar */}
      <Navbar activePage="toko" />

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
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-[#e2ede7] rounded-2xl py-3.5 px-5 text-sm font-semibold text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-sm cursor-pointer"
                >
                  <option value="">Kategori</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Dropdown */}
              <div className="flex flex-col text-left">
                <select
                  value={priceSort}
                  onChange={(e) => {
                    setPriceSort(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  onChange={(e) => {
                    setMethodFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-[#e2ede7] rounded-2xl py-3.5 px-5 text-sm font-semibold text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-sm cursor-pointer"
                >
                  <option value="">Pengambilan</option>
                  <option value="dikirim">Dikirim</option>
                  <option value="ambil">Ambil Langsung</option>
                </select>
              </div>

            </div>

            {/* Loading / Catalog Products Grid (8 Items based on layout) */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-4">
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-[#e2ede7] overflow-hidden shadow-sm h-96 flex flex-col p-5 space-y-4 animate-pulse">
                    <div className="h-44 w-full bg-brand-cream rounded-2xl" />
                    <div className="h-4 w-1/3 bg-brand-cream rounded-full" />
                    <div className="h-6 w-3/4 bg-brand-cream rounded-full" />
                    <div className="h-5 w-1/2 bg-brand-cream rounded-full" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#e2ede7] max-w-lg mx-auto space-y-4 shadow-sm animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-sage mx-auto shadow-inner">
                  <Leaf className="w-8 h-8 opacity-65" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-[#1e3329]">
                  Tidak Ada Tanaman
                </h3>
                <p className="text-brand-sage text-sm leading-relaxed max-w-sm mx-auto font-medium">
                  Kami tidak dapat menemukan tanaman yang sesuai dengan pencarian atau filter Anda saat ini.
                </p>
              </div>
            ) : (
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

                    {/* Plant Image or Empty Placeholder */}
                    {product.image_url ? (
                      <div className="h-56 w-full relative overflow-hidden bg-brand-cream border-b border-[#e2ede7]">
                        <NextImage
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div
                        className="h-56 w-full bg-brand-cream border-b border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage select-none"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-brand-sage shadow-inner mb-2 group-hover:scale-105 transition-transform duration-300">
                          <Leaf className="w-6 h-6 rotate-12 opacity-80" />
                        </div>
                        <span className="text-[10px] text-brand-sage/60 font-semibold tracking-wider">Gambar Tanaman</span>
                      </div>
                    )}

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
                        <Star className={`w-4 h-4 ${product.reviews > 0 ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                        <span>
                          {product.reviews > 0 
                            ? `${product.rating} (${product.reviews})`
                            : 'Belum ada ulasan'
                          }
                        </span>
                      </div>

                      {/* Actions Double Button */}
                      <div className="pt-3 flex gap-2 border-t border-brand-cream mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id, product.name);
                          }}
                          disabled={addingToCart === product.id}
                          className="w-11 h-11 rounded-2xl border border-[#e2ede7] hover:bg-brand-cream text-brand-emerald flex items-center justify-center transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                          aria-label="Masukkan Keranjang"
                        >
                          <ShoppingBag className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductDetail(product);
                          }}
                          className="flex-1 py-2.5 rounded-2xl bg-brand-forest hover:bg-brand-emerald text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer text-center"
                        >
                          Beli Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dynamic Pagination matching mockup */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-8 select-none">
                <button
                  onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-[#e2ede7] hover:bg-brand-cream flex items-center justify-center text-brand-sage disabled:opacity-40 transition-colors cursor-pointer"
                  aria-label="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  return (
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
                  );
                })}

                <button
                  onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-[#e2ede7] hover:bg-brand-cream flex items-center justify-center text-brand-sage disabled:opacity-40 transition-colors cursor-pointer"
                  aria-label="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

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

              {/* Kolom Kiri: Visual Gambar Tanaman / Placeholder */}
              <div className="lg:col-span-5 space-y-4">

                {/* Main Large Image Container */}
                {selectedProduct.image_url ? (
                  <div className="aspect-square w-full rounded-3xl relative overflow-hidden bg-brand-cream border border-[#e2ede7] shadow-sm flex items-center justify-center">
                    <NextImage
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-square w-full rounded-3xl bg-brand-cream border border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-lime/10 to-brand-cream z-0" />
                    <Leaf className="w-16 h-16 rotate-12 opacity-40 mb-3 z-10 animate-pulse" />
                    <span className="text-sm text-brand-sage/60 font-semibold z-10">Gambar Tanaman Utama</span>
                  </div>
                )}

                {/* Thumbnails Row (3 Thumbnails) */}
                <div className="grid grid-cols-3 gap-4">
                  {selectedProduct.image_url ? (
                    <>
                      {/* Thumbnail 1 - Real Plant Image */}
                      <button
                        onClick={() => setSelectedThumbnail(0)}
                        className={`aspect-square w-full rounded-2xl border relative overflow-hidden cursor-pointer ${selectedThumbnail === 0
                          ? 'border-brand-emerald ring-3 ring-brand-emerald/10'
                          : 'border-[#e2ede7]'
                          }`}
                      >
                        <NextImage
                          src={selectedProduct.image_url}
                          alt="Thumbnail Utama"
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </button>

                      {/* Thumbnail 2 - Detail Daun placeholder */}
                      <button
                        onClick={() => setSelectedThumbnail(1)}
                        className={`aspect-square w-full rounded-2xl border flex flex-col items-center justify-center text-[10px] text-brand-sage/60 font-bold transition-all relative overflow-hidden cursor-pointer ${selectedThumbnail === 1
                          ? 'border-brand-emerald bg-brand-cream/80 ring-3 ring-brand-emerald/10'
                          : 'border-[#e2ede7] bg-brand-cream hover:bg-brand-cream/60'
                          }`}
                      >
                        <Leaf className="w-5 h-5 opacity-30 mb-1" />
                        <span>Detail Daun</span>
                      </button>

                      {/* Thumbnail 3 - Detail Akar placeholder */}
                      <button
                        onClick={() => setSelectedThumbnail(2)}
                        className={`aspect-square w-full rounded-2xl border flex flex-col items-center justify-center text-[10px] text-brand-sage/60 font-bold transition-all relative overflow-hidden cursor-pointer ${selectedThumbnail === 2
                          ? 'border-brand-emerald bg-brand-cream/80 ring-3 ring-brand-emerald/10'
                          : 'border-[#e2ede7] bg-brand-cream hover:bg-brand-cream/60'
                          }`}
                      >
                        <Compass className="w-5 h-5 opacity-30 mb-1" />
                        <span>Media Tanam</span>
                      </button>
                    </>
                  ) : (
                    selectedProduct.thumbnails.map((thumb: string, idx: number) => (
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
                    ))
                  )}
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
                      <Star className={`w-4 h-4 ${selectedProduct.reviews > 0 ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                      <span>
                        {selectedProduct.reviews > 0 
                          ? `${selectedProduct.rating} (${selectedProduct.reviews} Ulasan)`
                          : 'Belum ada ulasan'
                        }
                      </span>
                    </div>
                    <span>•</span>
                    <span className="text-brand-emerald font-bold">{selectedProduct.sold_count || 0} Terjual</span>
                  </div>
                </div>

                {/* Price Label */}
                <div className="text-3xl font-heading font-black text-brand-emerald border-y border-[#e2ede7] py-4">
                  Rp. {selectedProduct.price.toLocaleString('id-ID')}
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
                    onClick={() => addToCart(selectedProduct.id, selectedProduct.name, quantity)}
                    disabled={addingToCart === selectedProduct.id}
                    className="flex-1 py-4.5 rounded-2xl border-2 border-brand-emerald hover:bg-brand-cream text-brand-emerald font-heading font-bold text-sm tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Tambah ke Keranjang
                  </button>

                  <button
                    onClick={async () => {
                      setAddingToCart(selectedProduct.id);
                      try {
                        const res = await fetch('/api/cart', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ plant_id: String(selectedProduct.id), quantity }),
                        });
                        if (res.status === 401) {
                          router.push('/login?from=/toko');
                          return;
                        }
                        const data = await res.json();
                        if (data.success) {
                          router.push('/checkout');
                        } else {
                          alert(data.error || 'Gagal menambahkan ke keranjang.');
                        }
                      } catch {
                        alert('Terjadi kesalahan jaringan.');
                      } finally {
                        setAddingToCart(null);
                      }
                    }}
                    disabled={addingToCart === selectedProduct.id}
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
                  <div className="space-y-8 max-w-3xl text-left">
                    
                    {/* Submit Review Form (Render only if user is eligible to write a review) */}
                    {isEligibleToReview && (
                      <form onSubmit={handleReviewSubmit} className="p-6 rounded-3xl bg-brand-cream/40 border border-brand-emerald/10 space-y-4 animate-fade-in-up">
                        <div className="space-y-1">
                          <h3 className="font-heading font-black text-brand-forest text-lg">Tulis Ulasan Produk</h3>
                          <p className="text-brand-sage text-xs">Bagikan pengalaman Anda tentang produk tanaman ini kepada pembeli lain.</p>
                        </div>

                        {/* Star Rating selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-brand-sage uppercase tracking-wider">Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                aria-label={`${star} Bintang`}
                              >
                                <Star
                                  className={`w-6 h-6 transition-colors ${
                                    star <= newRating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-zinc-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment text area */}
                        <div className="flex flex-col">
                          <label htmlFor="review-comment" className="text-xs font-semibold text-brand-sage uppercase tracking-wider mb-1.5">Ulasan Anda</label>
                          <textarea
                            id="review-comment"
                            rows={3}
                            placeholder="Tulis ulasan Anda secara detail di sini..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-2xl bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-6 py-2.5 rounded-full bg-brand-emerald hover:bg-brand-forest text-white text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                        >
                          {submittingReview ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Mengirim...</span>
                            </>
                          ) : (
                            <span>Kirim Ulasan</span>
                          )}
                        </button>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {fetchingReviews ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="w-6 h-6 animate-spin text-brand-emerald" />
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-[#e2ede7] rounded-3xl bg-white">
                          <p className="text-brand-sage text-sm font-medium">Belum ada ulasan untuk produk ini.</p>
                          {!isEligibleToReview && (
                            <p className="text-brand-sage/60 text-xs mt-1">Beli produk ini untuk menjadi yang pertama memberikan ulasan!</p>
                          )}
                        </div>
                      ) : (
                        reviews.map((r: any) => (
                          <div key={r.id} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#e2ede7] shadow-sm animate-fade-in-up">
                            <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center shrink-0 border border-brand-emerald/10">
                              <User className="w-5 h-5 text-brand-emerald" />
                            </div>
                            <div className="space-y-2 text-left flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-[#1e3329] text-sm truncate max-w-xs">{r.user?.full_name || 'Pembeli Anonim'}</h4>
                                <span className="text-[10px] text-zinc-300 font-normal">|</span>
                                <span className="text-[10px] text-brand-emerald font-bold uppercase tracking-wider font-sans">Terverifikasi</span>
                                <span className="text-[10px] text-zinc-300 font-normal ml-auto font-sans">{new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < r.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-zinc-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              {r.comment && (
                                <p className="text-brand-sage text-xs leading-relaxed font-medium mt-1">
                                  "{r.comment}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
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
                {products.filter(p => p.id !== selectedProduct.id).slice(0, 4).map(recommendation => (
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

                    {/* Plant image or placeholder */}
                    {recommendation.image_url ? (
                      <div className="h-44 w-full relative overflow-hidden bg-brand-cream border-b border-[#e2ede7]">
                        <NextImage
                          src={recommendation.image_url}
                          alt={recommendation.name}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div
                        className="h-44 w-full bg-brand-cream border-b border-[#e2ede7] flex flex-col items-center justify-center text-brand-sage select-none"
                      >
                        <Leaf className="w-5 h-5 opacity-40 mb-1 rotate-12" />
                        <span className="text-[9px] text-brand-sage/60 font-semibold">Gambar Tanaman</span>
                      </div>
                    )}

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
                        <Star className={`w-3.5 h-3.5 ${recommendation.reviews > 0 ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                        <span>
                          {recommendation.reviews > 0 
                            ? `${recommendation.rating} (${recommendation.reviews})`
                            : 'Belum ada ulasan'
                          }
                        </span>
                      </div>

                      {/* Actions Double Button */}
                      <div className="pt-2.5 flex gap-2 border-t border-brand-cream mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(recommendation.id, recommendation.name);
                          }}
                          disabled={addingToCart === recommendation.id}
                          className="w-9 h-9 rounded-xl border border-[#e2ede7] hover:bg-brand-cream text-brand-emerald flex items-center justify-center transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                          aria-label="Masukkan Keranjang"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductDetail(recommendation);
                          }}
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
      <Footer />

    </div>
  );
}

export default function TokoKatalogPage() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#fcfdfc]"><div className="w-8 h-8 border-2 border-brand-emerald/30 border-t-brand-emerald rounded-full animate-spin" /></div>}>
      <TokoKatalogPageContent />
    </React.Suspense>
  );
}
