'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Sprout,
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Search,
  TrendingUp,
  Users,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  FileText,
  User,
  DollarSign,
  Star,
  Upload,
  ArrowUpDown,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';

// Initial Mock Products Database (Same as catalog for sync feel)
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Bibit Mangga', category: 'Bibit Buah', price: 35000, stock: 20, rating: 4.9, description: 'Bibit Buah Mangga unggulan hasil okulasi dengan kualitas terbaik.', image: '', pickupMethods: ['Kirim', 'Ambil Sendiri'] },
  { id: 2, name: 'Bibit Alpukat', category: 'Bibit Buah', price: 45000, stock: 15, rating: 4.7, description: 'Bibit Alpukat Mentega super unggulan. Cepat berbuah dalam 2-3 tahun.', image: '', pickupMethods: ['Ambil Sendiri'] },
  { id: 3, name: 'Bibit Jeruk', category: 'Bibit Buah', price: 25000, stock: 30, rating: 4.9, description: 'Bibit Jeruk Dekopon/Jeruk Santang madu manis segar.', image: '', pickupMethods: ['Kirim'] },
  { id: 4, name: 'Bibit Jambu Air', category: 'Bibit Buah', price: 30000, stock: 25, rating: 4.9, description: 'Bibit Jambu Air Madu Deli Hijau berbuah manis renyah tanpa biji.', image: '', pickupMethods: ['Kirim', 'Ambil Sendiri'] },
  { id: 5, name: 'Anggrek', category: 'Tanaman Hias', price: 130000, stock: 12, rating: 4.9, description: 'Tanaman hias Bunga Anggrek Bulan eksotis dengan warna memikat.', image: '', pickupMethods: ['Ambil Sendiri'] },
  { id: 6, name: 'Kaktus Mini', category: 'Tanaman Hias', price: 20000, stock: 50, rating: 4.7, description: 'Kaktus Hias Mini sukulen cantik. Sangat mudah dirawat.', image: '', pickupMethods: ['Kirim'] },
  { id: 7, name: 'Bibit Rambutan', category: 'Bibit Buah', price: 35000, stock: 18, rating: 4.9, description: 'Bibit Rambutan Binjai manis lekat berakar kuat.', image: '', pickupMethods: ['Kirim', 'Ambil Sendiri'] },
  { id: 8, name: 'Bibit Durian', category: 'Bibit Buah', price: 45000, stock: 22, rating: 4.9, description: 'Bibit Durian Bawor/Bhinneka Bawor hasil sambung kaki tiga.', image: '', pickupMethods: ['Kirim', 'Ambil Sendiri'] }
];

// Initial Mock Activities Database (Same as activities page)
const INITIAL_ACTIVITIES = [
  { id: 1, title: 'Sambutan Rektor di Botani Mart', author: 'Joko Suntoso', date: '2026-04-04', category: 'Edukasi & Informasi', summary: 'Kemarin, Botani Mart baru saja meresmikan Botani Cafe yang diresmikan langsung oleh Rektor IPB University.' },
  { id: 2, title: 'Kunjungan Mahasiswa IPB ke Botani Mart', author: 'Hari Yogya N.', date: '2026-04-03', category: 'Akademik & Riset', summary: 'Mahasiswa IPB Sekolah Vokasi melakukan kunjungan lapangan terpadu ke Botani Mart yang berlokasi di Dramaga.' },
  { id: 3, title: 'Peresmian Green House Baru', author: 'Joko Suntoso', date: '2026-03-28', category: 'Infrastruktur & Inovasi', summary: 'Botani Mart resmi memperluas area pembibitan dengan meresmikan fasilitas Green House hidroponik modern.' },
  { id: 4, title: 'Pelatihan Hidroponik Perkotaan', author: 'Ani Lestari', date: '2026-03-22', category: 'Edukasi & Informasi', summary: 'Komunitas urban farming Dramaga mengikuti pelatihan praktis penanaman tanaman hortikultura skala rumahan.' },
  { id: 5, title: 'Festival Buah Nusantara 2026', author: 'Joko Suntoso', date: '2026-03-15', category: 'Pameran & Komunitas', summary: 'Botani Mart menyelenggarakan pameran keanekaragaman kultivar buah lokal unggul asli Indonesia.' },
  { id: 6, title: 'Kunjungan Edukasi PAUD Melati', author: 'Ani Lestari', date: '2026-03-10', category: 'Edukasi & Informasi', summary: 'Puluhan anak dari PAUD Melati Bogor melakukan wisata edukasi pertanian untuk pengenalan keanekaragaman hayati.' }
];

// Mock Recent Orders Database
const RECENT_ORDERS = [
  { id: 'BM-2026-001', customer: 'Ananda Senja', product: 'Bibit Mangga (3)', total: 105000, date: '12/03/2026 07:45', status: 'Settlement' },
  { id: 'BM-2026-002', customer: 'Kiki Rian', product: 'Media Tanam Premium (5)', total: 75000, date: '12/03/2026 08:15', status: 'Settlement' },
  { id: 'BM-2026-003', customer: 'Siti Sarah', product: 'Bunga Anggrek (1)', total: 130000, date: '12/03/2026 08:30', status: 'Pending' },
  { id: 'BM-2026-004', customer: 'Bambang Pamungkas', product: 'Kaktus Mini (10)', total: 200000, date: '12/03/2026 09:00', status: 'Settlement' },
  { id: 'BM-2026-005', customer: 'Dewi Lestari', product: 'Bibit Durian Kaki Tiga (2)', total: 90000, date: '12/03/2026 09:12', status: 'Pending' }
];

// Sales Analytics Line Graph Coordinates (6 Months: Jan, Feb, Mar, Apr, Mei, Jun)
const GRAPH_DATA = [
  { month: 'Jan', sales: 45 },
  { month: 'Feb', sales: 62 },
  { month: 'Mar', sales: 85 },
  { month: 'Apr', sales: 110 },
  { month: 'Mei', sales: 98 },
  { month: 'Jun', sales: 128 }
];

export default function AdminDashboardPage() {
  // Navigation Menu state
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'produk' | 'kegiatan'>('dashboard');

  // Data lists states (for stateful CRUD!)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [orders, setOrders] = useState(RECENT_ORDERS);

  // Search states
  const [productSearch, setProductSearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');

  // CRUD Modal Form States - Products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof INITIAL_PRODUCTS[0] | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Bibit Buah',
    price: '',
    stock: '',
    description: '',
    image: '',
    pickupMethods: ['Kirim', 'Ambil Sendiri'] as string[]
  });

  // Product Sorting state
  const [productSort, setProductSort] = useState<{ key: 'name' | 'category' | 'price' | 'stock' | 'rating' | null; order: 'asc' | 'desc' }>({
    key: null,
    order: 'asc'
  });

  // CRUD Modal Form States - Activities
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<typeof INITIAL_ACTIVITIES[0] | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Edukasi & Informasi',
    summary: ''
  });

  // Product Sort Handler
  const handleProductSort = (key: 'name' | 'category' | 'price' | 'stock' | 'rating') => {
    setProductSort(prev => {
      if (prev.key === key) {
        return { key, order: prev.order === 'asc' ? 'desc' : 'asc' };
      }
      return { key, order: 'asc' };
    });
  };

  // Product Search Filter & Sorting
  const sortedAndFilteredProducts = useMemo(() => {
    let result = products.filter(p =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );

    if (productSort.key) {
      result = [...result].sort((a, b) => {
        const aVal = a[productSort.key!];
        const bVal = b[productSort.key!];

        if (typeof aVal === 'string') {
          return productSort.order === 'asc'
            ? aVal.localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal);
        } else {
          return productSort.order === 'asc'
            ? (aVal as number) - (bVal as number)
            : (bVal as number) - (aVal as number);
        }
      });
    }

    return result;
  }, [products, productSearch, productSort]);

  // Activity Search Filter
  const filteredActivities = useMemo(() => {
    return activities.filter(a =>
      a.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
      a.author.toLowerCase().includes(activitySearch.toLowerCase()) ||
      a.category.toLowerCase().includes(activitySearch.toLowerCase())
    );
  }, [activities, activitySearch]);

  // Handle Product Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Product Form CRUD Submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) {
      alert('Mohon isi semua field wajib!');
      return;
    }
    if (productForm.pickupMethods.length === 0) {
      alert('Mohon pilih minimal satu metode pengambilan!');
      return;
    }

    if (editingProduct) {
      // Edit mode
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        description: productForm.description,
        image: productForm.image,
        pickupMethods: productForm.pickupMethods
      } : p));
      alert('Produk berhasil diperbarui!');
    } else {
      // Add mode
      const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        rating: 4.8, // Default rating for new products
        description: productForm.description,
        image: productForm.image,
        pickupMethods: productForm.pickupMethods
      };
      setProducts(prev => [...prev, newProduct]);
      alert('Produk baru berhasil ditambahkan!');
    }

    // Reset and Close
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Bibit Buah',
      price: '',
      stock: '',
      description: '',
      image: '',
      pickupMethods: ['Kirim', 'Ambil Sendiri']
    });
  };

  // Open Edit Product Modal
  const openEditProduct = (product: typeof INITIAL_PRODUCTS[0]) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || '',
      image: product.image || '',
      pickupMethods: product.pickupMethods || ['Kirim', 'Ambil Sendiri']
    });
    setIsProductModalOpen(true);
  };

  // Delete Product
  const handleDeleteProduct = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Produk berhasil dihapus!');
    }
  };

  // Activity Form CRUD Submit
  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title || !activityForm.author || !activityForm.summary) {
      alert('Mohon isi semua field wajib!');
      return;
    }

    if (editingActivity) {
      // Edit Mode
      setActivities(prev => prev.map(a => a.id === editingActivity.id ? {
        ...a,
        title: activityForm.title,
        author: activityForm.author,
        date: activityForm.date,
        category: activityForm.category,
        summary: activityForm.summary
      } : a));
      alert('Kegiatan berhasil diperbarui!');
    } else {
      // Add Mode
      const newActivity = {
        id: activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1,
        title: activityForm.title,
        author: activityForm.author,
        date: activityForm.date,
        category: activityForm.category,
        summary: activityForm.summary
      };
      setActivities(prev => [...prev, newActivity]);
      alert('Kegiatan baru berhasil ditambahkan!');
    }

    // Reset and Close
    setIsActivityModalOpen(false);
    setEditingActivity(null);
    setActivityForm({ title: '', author: '', date: new Date().toISOString().split('T')[0], category: 'Edukasi & Informasi', summary: '' });
  };

  // Open Edit Activity Modal
  const openEditActivity = (activity: typeof INITIAL_ACTIVITIES[0]) => {
    setEditingActivity(activity);
    setActivityForm({
      title: activity.title,
      author: activity.author,
      date: activity.date,
      category: activity.category,
      summary: activity.summary
    });
    setIsActivityModalOpen(true);
  };

  // Delete Activity
  const handleDeleteActivity = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      setActivities(prev => prev.filter(a => a.id !== id));
      alert('Kegiatan berhasil dihapus!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f9f7] font-sans antialiased text-[#274235]">

      {/* 1. Header Area */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#e2ede7] h-20 px-6 sm:px-8 flex items-center justify-between shadow-sm">

        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-56 h-14 transition-all duration-300 group-hover:scale-102">
            <NextImage
              src="/images/logo_v4.png"
              alt="Botani Mart Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>

        {/* Right Section User Info */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/10 px-3 py-1 rounded-full">
            Admin Panel
          </span>
          <div className="w-10 h-10 rounded-full bg-brand-forest flex items-center justify-center text-white font-extrabold shadow-md border border-[#e2ede7] cursor-pointer" title="Admin Account">
            A
          </div>
        </div>
      </header>

      {/* 2. Main Page Layout (Sidebar + Content Panels) */}
      <div className="flex-1 flex flex-col md:flex-row">

        {/* Sidebar Navigation Panel (Solid Forest Green) */}
        <aside className="w-full md:w-64 bg-brand-forest text-white shrink-0 flex flex-row md:flex-col border-r border-brand-forest/20 shadow-lg md:pt-6">
          <div className="flex-1 flex flex-row md:flex-col justify-around md:justify-start md:space-y-1.5 px-3 py-3 md:py-0 w-full overflow-x-auto md:overflow-x-visible">

            {/* Dashboard Sidebar Button */}
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-sm font-heading font-extrabold tracking-wide uppercase transition-all duration-300 shrink-0 cursor-pointer ${activeMenu === 'dashboard'
                  ? 'bg-[#345947] text-brand-lime shadow-inner'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span>Dashboard</span>
            </button>

            {/* Kelola Produk Sidebar Button */}
            <button
              onClick={() => setActiveMenu('produk')}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-sm font-heading font-extrabold tracking-wide uppercase transition-all duration-300 shrink-0 cursor-pointer ${activeMenu === 'produk'
                  ? 'bg-[#345947] text-brand-lime shadow-inner'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <Sprout className="w-5 h-5 shrink-0" />
              <span>Kelola Produk</span>
            </button>

            {/* Kelola Kegiatan Sidebar Button */}
            <button
              onClick={() => setActiveMenu('kegiatan')}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-sm font-heading font-extrabold tracking-wide uppercase transition-all duration-300 shrink-0 cursor-pointer ${activeMenu === 'kegiatan'
                  ? 'bg-[#345947] text-brand-lime shadow-inner'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <CalendarIcon className="w-5 h-5 shrink-0" />
              <span>Kelola Kegiatan</span>
            </button>

          </div>
        </aside>

        {/* 3. Main Content Display Panel */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full animate-fade-in-up">

          {/* MENU 1: OVERVIEW DASHBOARD */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-8 text-left">

              {/* Title Section */}
              <div className="space-y-1">
                <h1 className="font-heading font-black text-3xl text-brand-forest">
                  Dashboard
                </h1>
                <p className="text-brand-sage text-sm font-semibold">
                  Berikut adalah ringkasan aktivitas toko:
                </p>
              </div>

              {/* Four Stat Cards row */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Stat 1: Total Orders */}
                <div className="bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-brand-sage/10 text-brand-sage flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6.5 h-6.5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider block">Total Pesanan</span>
                    <span className="text-3xl font-heading font-black text-brand-forest block">128</span>
                    <span className="text-[9px] text-[#50685c]/60 font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Lat. update: 12/03/2026 08:00
                    </span>
                  </div>
                </div>

                {/* Stat 2: Month Revenue */}
                <div className="bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/10 text-amber-500 flex items-center justify-center shrink-0">
                    <DollarSign className="w-6.5 h-6.5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider block">Pendapatan bulan ini</span>
                    <span className="text-3xl font-heading font-black text-brand-forest block">Rp1,9 juta</span>
                    <span className="text-[9px] text-[#50685c]/60 font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Lat. update: 12/03/2026 08:30
                    </span>
                  </div>
                </div>

                {/* Stat 3: On-Progress Orders */}
                <div className="bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-red-400/10 text-red-500 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6.5 h-6.5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider block">Pesanan On-Progress</span>
                    <span className="text-3xl font-heading font-black text-brand-forest block">5</span>
                    <span className="text-[9px] text-[#50685c]/60 font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Lat. update: 12/03/2026 08:00
                    </span>
                  </div>
                </div>

                {/* Stat 4: Jumlah Customer */}
                <div className="bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center shrink-0">
                    <Users className="w-6.5 h-6.5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider block">Jumlah Customer</span>
                    <span className="text-3xl font-heading font-black text-brand-forest block">254</span>
                    <span className="text-[9px] text-[#50685c]/60 font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Lat. update: 12/03/2026 08:30
                    </span>
                  </div>
                </div>

              </div>

              {/* Graphics Section Grid */}
              <div className="grid lg:grid-cols-12 gap-8">

                {/* Left Large Column: Custom SVG Sales Graph */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-[#e2ede7] pb-4">
                    <h3 className="font-heading font-extrabold text-lg text-brand-forest">
                      Penjualan Bulanan
                    </h3>
                    <span className="text-xs font-bold text-brand-emerald bg-brand-emerald/10 px-3 py-1 rounded-full">
                      Tahun 2026
                    </span>
                  </div>

                  {/* SVG Chart Container */}
                  <div className="relative w-full h-64 sm:h-72 select-none">
                    <svg className="w-full h-full" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg">

                      {/* Grid Horizontal Guidelines */}
                      <line x1="40" y1="40" x2="560" y2="40" stroke="#f4f6f4" strokeWidth="1.5" />
                      <line x1="40" y1="90" x2="560" y2="90" stroke="#f4f6f4" strokeWidth="1.5" />
                      <line x1="40" y1="140" x2="560" y2="140" stroke="#f4f6f4" strokeWidth="1.5" strokeDasharray="4 4" />
                      <line x1="40" y1="190" x2="560" y2="190" stroke="#f4f6f4" strokeWidth="1.5" />

                      {/* Vertical axes */}
                      <line x1="40" y1="20" x2="40" y2="200" stroke="#e2ede7" strokeWidth="1" />
                      <line x1="560" y1="20" x2="560" y2="200" stroke="#e2ede7" strokeWidth="1" />

                      {/* SVG Line path with smooth interpolation */}
                      <path
                        d="M 60,160 Q 150,130 240,95 T 420,70 T 540,40"
                        stroke="#345947"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* Soft Green Area Gradient under Sales Path */}
                      <path
                        d="M 60,160 Q 150,130 240,95 T 420,70 T 540,40 L 540,200 L 60,200 Z"
                        fill="url(#gradient-fill)"
                        opacity="0.12"
                      />

                      {/* Gradient Definitions */}
                      <defs>
                        <linearGradient id="gradient-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#345947" />
                          <stop offset="100%" stopColor="#b8d5c5" />
                        </linearGradient>
                      </defs>

                      {/* Interactive Circles / Data points */}
                      <circle cx="60" cy="160" r="5" fill="#345947" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="150" cy="130" r="5" fill="#345947" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="240" cy="95" r="5" fill="#345947" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="330" cy="85" r="5" fill="#345947" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="420" cy="70" r="5" fill="#345947" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="540" cy="40" r="5" fill="#345947" stroke="#ffffff" strokeWidth="2" />

                      {/* Value labels overlay */}
                      <text x="60" y="145" fontSize="10" fill="#274235" fontWeight="bold" textAnchor="middle">Rp45jt</text>
                      <text x="150" y="115" fontSize="10" fill="#274235" fontWeight="bold" textAnchor="middle">Rp62jt</text>
                      <text x="240" y="80" fontSize="10" fill="#274235" fontWeight="bold" textAnchor="middle">Rp85jt</text>
                      <text x="330" y="70" fontSize="10" fill="#274235" fontWeight="bold" textAnchor="middle">Rp110jt</text>
                      <text x="420" y="55" fontSize="10" fill="#274235" fontWeight="bold" textAnchor="middle">Rp98jt</text>
                      <text x="540" y="25" fontSize="10" fill="#274235" fontWeight="bold" textAnchor="middle">Rp128jt</text>

                      {/* Month names Y labels */}
                      <text x="60" y="218" fontSize="11" fill="#50685c" fontWeight="bold" textAnchor="middle">Jan</text>
                      <text x="150" y="218" fontSize="11" fill="#50685c" fontWeight="bold" textAnchor="middle">Feb</text>
                      <text x="240" y="218" fontSize="11" fill="#50685c" fontWeight="bold" textAnchor="middle">Mar</text>
                      <text x="330" y="218" fontSize="11" fill="#50685c" fontWeight="bold" textAnchor="middle">Apr</text>
                      <text x="420" y="218" fontSize="11" fill="#50685c" fontWeight="bold" textAnchor="middle">Mei</text>
                      <text x="540" y="218" fontSize="11" fill="#50685c" fontWeight="bold" textAnchor="middle">Jun</text>

                    </svg>
                  </div>

                </div>

                {/* Right Column: Analisis Produk Terlaris */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm flex flex-col justify-between">
                  <div className="border-b border-[#e2ede7] pb-4 mb-4">
                    <h3 className="font-heading font-extrabold text-lg text-brand-forest">
                      Produk Terlaris
                    </h3>
                  </div>

                  {/* List of best-selling products with progress bars */}
                  <div className="space-y-4 flex-1 flex flex-col justify-center">

                    {/* Item 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-brand-forest">
                        <span>Bibit Alpukat</span>
                        <span>42 Terjual</span>
                      </div>
                      <div className="w-full bg-[#f0f4f1] h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-emerald h-full rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-brand-forest">
                        <span>Bibit Durian</span>
                        <span>38 Terjual</span>
                      </div>
                      <div className="w-full bg-[#f0f4f1] h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-emerald h-full rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-brand-forest">
                        <span>Anggrek Bulan</span>
                        <span>29 Terjual</span>
                      </div>
                      <div className="w-full bg-[#f0f4f1] h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-emerald h-full rounded-full" style={{ width: '58%' }}></div>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-brand-forest">
                        <span>Kaktus Mini</span>
                        <span>25 Terjual</span>
                      </div>
                      <div className="w-full bg-[#f0f4f1] h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-emerald h-full rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Bottom Large Table: Recent Orders */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm">
                <div className="flex items-center justify-between border-b border-[#e2ede7] pb-4 mb-6">
                  <h3 className="font-heading font-extrabold text-lg text-brand-forest">
                    Pesanan Terbaru
                  </h3>
                  <button className="text-xs font-bold text-brand-emerald hover:text-brand-forest hover:underline">
                    Lihat Semua Pesanan
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-brand-cream text-left text-xs font-bold text-brand-sage uppercase tracking-wider">
                        <th className="pb-3.5 pl-4">No. Order</th>
                        <th className="pb-3.5">Kustomer</th>
                        <th className="pb-3.5">Tanaman & Qty</th>
                        <th className="pb-3.5">Total Harga</th>
                        <th className="pb-3.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-cream/50 text-sm font-semibold text-brand-forest">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-brand-cream/20 transition-colors">
                          <td className="py-4.5 pl-4 font-heading font-bold text-brand-emerald">{order.id}</td>
                          <td className="py-4.5">{order.customer}</td>
                          <td className="py-4.5 text-brand-sage">{order.product}</td>
                          <td className="py-4.5">Rp {order.total.toLocaleString('id-ID')}</td>
                          <td className="py-4.5 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold ${order.status === 'Settlement'
                                ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-100'
                                : 'bg-amber-50/80 text-amber-600 border border-amber-100'
                              }`}>
                              {order.status === 'Settlement' ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5" />
                              )}
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* MENU 2: KELOLA PRODUK (CRUD) */}
          {activeMenu === 'produk' && (
            <div className="space-y-8 text-left">

              {/* Header Title Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e2ede7] pb-6">
                <div className="space-y-1">
                  <h1 className="font-heading font-black text-3xl text-brand-forest">
                    Kelola Produk
                  </h1>
                  <p className="text-brand-sage text-sm font-semibold">
                    Manajemen stok tanaman dan aneka pupuk berkebun
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      name: '',
                      category: 'Bibit Buah',
                      price: '',
                      stock: '',
                      description: '',
                      image: '',
                      pickupMethods: ['Kirim', 'Ambil Sendiri']
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full bg-brand-emerald hover:bg-brand-forest text-white text-xs font-extrabold tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Produk Baru
                </button>
              </div>

              {/* Table search filter bar */}
              <div className="max-w-md">
                <div className="flex items-center bg-white border border-[#e2ede7] rounded-full py-3 px-5 shadow-sm focus-within:border-brand-emerald transition-colors group">
                  <input
                    type="text"
                    placeholder="Cari produk di tabel..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold focus:outline-none text-brand-forest placeholder-brand-sage/60"
                  />
                  <Search className="w-4.5 h-4.5 text-brand-sage group-focus-within:text-brand-emerald shrink-0" />
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-3xl border border-[#e2ede7] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-brand-cream bg-brand-cream/10 text-left text-xs font-bold text-brand-sage uppercase tracking-wider select-none">
                        <th className="py-4.5 pl-6 w-16">ID</th>
                        <th
                          onClick={() => handleProductSort('name')}
                          className="py-4.5 cursor-pointer hover:bg-brand-cream/20 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Nama Produk</span>
                            <ArrowUpDown className={`w-3 h-3 transition-colors ${productSort.key === 'name' ? 'text-brand-emerald' : 'text-zinc-400'}`} />
                          </div>
                        </th>
                        <th
                          onClick={() => handleProductSort('category')}
                          className="py-4.5 cursor-pointer hover:bg-brand-cream/20 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Kategori</span>
                            <ArrowUpDown className={`w-3 h-3 transition-colors ${productSort.key === 'category' ? 'text-brand-emerald' : 'text-zinc-400'}`} />
                          </div>
                        </th>
                        <th
                          onClick={() => handleProductSort('price')}
                          className="py-4.5 cursor-pointer hover:bg-brand-cream/20 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Harga</span>
                            <ArrowUpDown className={`w-3 h-3 transition-colors ${productSort.key === 'price' ? 'text-brand-emerald' : 'text-zinc-400'}`} />
                          </div>
                        </th>
                        <th
                          onClick={() => handleProductSort('stock')}
                          className="py-4.5 cursor-pointer hover:bg-brand-cream/20 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Stok</span>
                            <ArrowUpDown className={`w-3 h-3 transition-colors ${productSort.key === 'stock' ? 'text-brand-emerald' : 'text-zinc-400'}`} />
                          </div>
                        </th>
                        <th className="py-4.5">Metode Pengambilan</th>
                        <th
                          onClick={() => handleProductSort('rating')}
                          className="py-4.5 cursor-pointer hover:bg-brand-cream/20 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Rating</span>
                            <ArrowUpDown className={`w-3 h-3 transition-colors ${productSort.key === 'rating' ? 'text-brand-emerald' : 'text-zinc-400'}`} />
                          </div>
                        </th>
                        <th className="py-4.5 text-center pr-6 w-32">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-cream/50 text-sm font-semibold text-brand-forest">
                      {sortedAndFilteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-brand-cream/10 transition-colors">
                          <td className="py-4.5 pl-6 text-brand-sage">#{product.id}</td>

                          {/* Nama Produk with Image Thumbnail */}
                          <td className="py-4.5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-xl bg-brand-cream/80 border border-[#e2ede7] overflow-hidden flex items-center justify-center shrink-0 relative">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-brand-sage" />
                                )}
                              </div>
                              <span className="font-bold text-[#1e3329] text-sm">{product.name}</span>
                            </div>
                          </td>

                          <td className="py-4.5 text-xs font-bold text-brand-emerald uppercase tracking-wider">{product.category}</td>
                          <td className="py-4.5 font-bold">Rp {product.price.toLocaleString('id-ID')}</td>

                          {/* Stock Status Capsule */}
                          <td className="py-4.5">
                            <div className="flex flex-col gap-1 text-left">
                              <span className={`inline-flex items-center justify-center w-24 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase border ${product.stock > 0
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border-rose-100'
                                }`}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                              </span>
                              <span className="text-[11px] text-brand-sage pl-1">{product.stock} pcs</span>
                            </div>
                          </td>

                          {/* Pickup Methods Column */}
                          <td className="py-4.5">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {(product.pickupMethods || ['Kirim', 'Ambil Sendiri']).map((method, idx) => (
                                <span key={idx} className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#223e30] bg-[#eaf4ee] px-2 py-0.5 rounded border border-[#daebd3]">
                                  {method}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-4.5">
                            <div className="flex items-center gap-1 text-xs text-brand-sage font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{product.rating}</span>
                            </div>
                          </td>

                          <td className="py-4.5 text-center pr-6">
                            <div className="flex items-center justify-center gap-2">
                              {/* Edit Action Button */}
                              <button
                                onClick={() => openEditProduct(product)}
                                className="p-2.5 rounded-xl border border-zinc-200 hover:bg-brand-cream text-brand-sage hover:text-brand-emerald transition-all cursor-pointer"
                                title="Edit Produk"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {/* Delete Action Button */}
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2.5 rounded-xl border border-zinc-200 hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-all cursor-pointer"
                                title="Hapus Produk"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {sortedAndFilteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-brand-sage font-medium">
                            Tidak ada produk ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* MENU 3: KELOLA KEGIATAN (CRUD) */}
          {activeMenu === 'kegiatan' && (
            <div className="space-y-8 text-left">

              {/* Header Title Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e2ede7] pb-6">
                <div className="space-y-1">
                  <h1 className="font-heading font-black text-3xl text-brand-forest">
                    Kelola Kegiatan
                  </h1>
                  <p className="text-brand-sage text-sm font-semibold">
                    Manajemen pengumuman berita dan galeri edukasi
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingActivity(null);
                    setActivityForm({ title: '', author: '', date: new Date().toISOString().split('T')[0], category: 'Edukasi & Informasi', summary: '' });
                    setIsActivityModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-full bg-brand-emerald hover:bg-brand-forest text-white text-xs font-extrabold tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Kegiatan Baru
                </button>
              </div>

              {/* Table search filter bar */}
              <div className="max-w-md">
                <div className="flex items-center bg-white border border-[#e2ede7] rounded-full py-3 px-5 shadow-sm focus-within:border-brand-emerald transition-colors group">
                  <input
                    type="text"
                    placeholder="Cari kegiatan di tabel..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold focus:outline-none text-brand-forest placeholder-brand-sage/60"
                  />
                  <Search className="w-4.5 h-4.5 text-brand-sage group-focus-within:text-brand-emerald shrink-0" />
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-3xl border border-[#e2ede7] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-brand-cream bg-brand-cream/10 text-left text-xs font-bold text-brand-sage uppercase tracking-wider">
                        <th className="py-4 pl-6">ID</th>
                        <th className="py-4">Judul Kegiatan</th>
                        <th className="py-4">Penulis</th>
                        <th className="py-4">Tanggal Rilis</th>
                        <th className="py-4">Kategori</th>
                        <th className="py-4 text-center pr-6">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-cream/50 text-sm font-semibold text-brand-forest">
                      {filteredActivities.map(activity => (
                        <tr key={activity.id} className="hover:bg-brand-cream/10 transition-colors">
                          <td className="py-4 pl-6 text-brand-sage">#{activity.id}</td>
                          <td className="py-4 font-bold text-[#1e3329] max-w-xs truncate">{activity.title}</td>
                          <td className="py-4">{activity.author}</td>
                          <td className="py-4 text-brand-sage">{activity.date}</td>
                          <td className="py-4 text-xs font-bold text-brand-emerald uppercase tracking-wider">{activity.category}</td>
                          <td className="py-4 text-center pr-6">
                            <div className="flex items-center justify-center gap-2">
                              {/* Edit Action Button */}
                              <button
                                onClick={() => openEditActivity(activity)}
                                className="p-2.5 rounded-xl border border-zinc-200 hover:bg-brand-cream text-brand-sage hover:text-brand-emerald transition-all cursor-pointer"
                                title="Edit Kegiatan"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {/* Delete Action Button */}
                              <button
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="p-2.5 rounded-xl border border-zinc-200 hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-all cursor-pointer"
                                title="Hapus Kegiatan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredActivities.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-brand-sage font-medium">
                            Tidak ada kegiatan ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* MODAL WINDOW 1: PRODUCT CRUD STATEFUL FORM (FROSTED GLASSMORPHISM) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-fade-in-up">
          <div className="bg-white/95 rounded-[36px] border border-white/20 shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in-up relative">

            {/* Modal Title header */}
            <div className="bg-brand-cream border-b border-[#e2ede7] px-8 py-5 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-lg text-[#1e3329]">
                {editingProduct ? 'Edit Tanaman/Produk' : 'Tambah Tanaman/Produk Baru'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-lime/20 text-brand-sage hover:text-brand-forest transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form fields */}
            <form onSubmit={handleProductSubmit} className="p-8 space-y-4 text-left">

              {/* Product photo upload block */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[#1e3329] mb-1.5">Foto Produk</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-cream border border-[#e2ede7] flex items-center justify-center overflow-hidden shrink-0 relative">
                    {productForm.image ? (
                      <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-brand-sage" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-full border border-brand-emerald text-brand-emerald hover:bg-brand-cream text-xs font-bold transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {productForm.image && (
                    <button
                      type="button"
                      onClick={() => setProductForm(prev => ({ ...prev, image: '' }))}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
              </div>

              {/* Product name */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[#1e3329] mb-1">Nama Produk <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Misal: Bibit Mangga Harum Manis..."
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
                  required
                />
              </div>

              {/* Product Category dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[#1e3329] mb-1">Kategori <span className="text-red-500">*</span></label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald cursor-pointer"
                  required
                >
                  <option value="Bibit Buah">Bibit Buah</option>
                  <option value="Tanaman Hias">Tanaman Hias</option>
                  <option value="Media Tanam">Media Tanam</option>
                  <option value="Alat Perkebunan">Alat Perkebunan</option>
                </select>
              </div>

              {/* Price & Stock Grid fields */}
              <div className="grid sm:grid-cols-2 gap-4">

                {/* Price */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[#1e3329] mb-1">Harga (Rupiah) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="Misal: 35000"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
                    required
                  />
                </div>

                {/* Stock */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[#1e3329] mb-1">Stok Tanaman <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="Misal: 25"
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
                    required
                  />
                </div>

              </div>

              {/* Pickup Methods (Metode Pengambilan) */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[#1e3329] mb-1.5">Metode Pengambilan <span className="text-red-500">*</span></label>
                <div className="flex gap-6 mt-1">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-brand-forest cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.pickupMethods.includes('Kirim')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProductForm(prev => ({ ...prev, pickupMethods: [...prev.pickupMethods, 'Kirim'] }));
                        } else {
                          setProductForm(prev => ({ ...prev, pickupMethods: prev.pickupMethods.filter(m => m !== 'Kirim') }));
                        }
                      }}
                      className="rounded border-zinc-300 text-brand-emerald focus:ring-brand-emerald w-4 h-4 cursor-pointer"
                    />
                    <span>Kirim / Delivery</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-brand-forest cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.pickupMethods.includes('Ambil Sendiri')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProductForm(prev => ({ ...prev, pickupMethods: [...prev.pickupMethods, 'Ambil Sendiri'] }));
                        } else {
                          setProductForm(prev => ({ ...prev, pickupMethods: prev.pickupMethods.filter(m => m !== 'Ambil Sendiri') }));
                        }
                      }}
                      className="rounded border-zinc-300 text-brand-emerald focus:ring-brand-emerald w-4 h-4 cursor-pointer"
                    />
                    <span>Ambil Sendiri di Toko</span>
                  </label>
                </div>
              </div>

              {/* Description long text */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[#1e3329] mb-1">Keterangan/Deskripsi</label>
                <textarea
                  placeholder="Masukkan deksripsi lengkap produk di sini..."
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-3xl bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
                />
              </div>

              {/* Actions Footer row */}
              <div className="pt-4 border-t border-brand-cream flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-6 py-3 rounded-full border border-zinc-200 text-xs font-bold uppercase tracking-wider text-brand-sage hover:bg-brand-cream transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-[#223e30] hover:bg-[#182e23] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md"
                >
                  Simpan Produk
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL WINDOW 2: ACTIVITY CRUD STATEFUL FORM (FROSTED GLASSMORPHISM) */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-fade-in-up">
          <div className="bg-white/95 rounded-[36px] border border-white/20 shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in-up relative">

            {/* Modal Title header */}
            <div className="bg-brand-cream border-b border-[#e2ede7] px-8 py-5 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-lg text-[#1e3329]">
                {editingActivity ? 'Edit Artikel Kegiatan' : 'Tambah Kegiatan Baru'}
              </h3>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-lime/20 text-brand-sage hover:text-brand-forest transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form fields */}
            <form onSubmit={handleActivitySubmit} className="p-8 space-y-4 text-left">

              {/* Activity title */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[#1e3329] mb-1">Judul Kegiatan <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Misal: Sambutan Rektor di Pembukaan..."
                  value={activityForm.title}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
                  required
                />
              </div>

              {/* Author & Date Grid fields */}
              <div className="grid sm:grid-cols-2 gap-4">

                {/* Author */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[#1e3329] mb-1">Penulis/Author <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Misal: Joko Suntoso"
                    value={activityForm.author}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
                    required
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-[#1e3329] mb-1">Tanggal Rilis <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={activityForm.date}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald cursor-pointer"
                    required
                  />
                </div>

              </div>

              {/* Category dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[#1e3329] mb-1">Kategori Kegiatan <span className="text-red-500">*</span></label>
                <select
                  value={activityForm.category}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald cursor-pointer"
                  required
                >
                  <option value="Edukasi & Informasi">Edukasi & Informasi</option>
                  <option value="Akademik & Riset">Akademik & Riset</option>
                  <option value="Infrastruktur & Inovasi">Infrastruktur & Inovasi</option>
                  <option value="Pameran & Komunitas">Pameran & Komunitas</option>
                </select>
              </div>

              {/* Summary text */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[#1e3329] mb-1">Ringkasan Narasi <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="Masukkan ringkasan singkat kegiatan untuk deskripsi kartu..."
                  rows={3}
                  value={activityForm.summary}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-3xl bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
                  required
                />
              </div>

              {/* Actions Footer row */}
              <div className="pt-4 border-t border-brand-cream flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-6 py-3 rounded-full border border-zinc-200 text-xs font-bold uppercase tracking-wider text-brand-sage hover:bg-brand-cream transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-[#223e30] hover:bg-[#182e23] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md"
                >
                  Simpan Kegiatan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
