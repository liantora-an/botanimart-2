'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Image as ImageIcon,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import AuthButton from '@/components/layout/AuthButton';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation Menu state
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'produk' | 'kegiatan'>('dashboard');

  // Auth & Protection States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Data lists states (filled from API!)
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Search states
  const [productSearch, setProductSearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');

  // Uploading image state indicator
  const [uploadingImage, setUploadingImage] = useState(false);

  // CRUD Modal Form States - Products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    pickupMethods: ['Kirim', 'Ambil Sendiri'] as string[]
  });

  // Product Sorting state
  const [productSort, setProductSort] = useState<{ key: 'name' | 'categoryName' | 'price' | 'stock' | 'rating' | null; order: 'asc' | 'desc' }>({
    key: null,
    order: 'asc'
  });

  // CRUD Modal Form States - Activities
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Edukasi & Informasi',
    summary: '',
    content: '',
    published: true
  });

  // Fetch all backend tables
  const fetchAllData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [productsRes, categoriesRes, activitiesRes, ordersRes] = await Promise.all([
        fetch('/api/catalog?limit=100'),
        fetch('/api/admin/categories'),
        fetch('/api/activities?limit=100&admin=true'),
        fetch('/api/admin/orders?limit=100')
      ]);

      if (categoriesRes.ok) {
        const catData = await categoriesRes.json();
        if (catData.success) {
          setCategories(catData.data);
        }
      }

      if (productsRes.ok) {
        const prodData = await productsRes.json();
        if (prodData.success) {
          const mappedProds = prodData.data.data.map((p: any) => ({
            ...p,
            categoryName: p.category?.name || 'Tanpa Kategori',
            image: p.image_url || '',
            pickupMethods: p.pickup_methods || ['Kirim', 'Ambil Sendiri'],
            rating: p.rating_avg || 4.8
          }));
          setProducts(mappedProds);
        }
      }

      if (activitiesRes.ok) {
        const actData = await activitiesRes.json();
        if (actData.success) {
          setActivities(actData.data.data);
        }
      }

      if (ordersRes.ok) {
        const ordData = await ordersRes.json();
        if (ordData.success) {
          setOrders(ordData.data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Gagal memuat data dari database.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Auth check and role verification
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`/api/auth/me?t=${Date.now()}`);
        if (res.status === 401) {
          router.push('/login?from=/admin');
          return;
        }
        const data = await res.json();
        if (data.success && data.data.role === 'Admin') {
          setCurrentUser(data.data);
          setIsAdmin(true);
          setLoadingAuth(false);
          fetchAllData();
        } else {
          setIsAdmin(false);
          setLoadingAuth(false);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setIsAdmin(false);
        setLoadingAuth(false);
      }
    };
    checkAuth();
  }, [router, fetchAllData]);

  // Product Sort Handler
  const handleProductSort = (key: 'name' | 'categoryName' | 'price' | 'stock' | 'rating') => {
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
      p.categoryName.toLowerCase().includes(productSearch.toLowerCase())
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

  // Handle Dynamic Upload for Product Images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload/plant-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProductForm(prev => ({ ...prev, image: data.data.publicUrl }));
        alert('Gambar tanaman berhasil diunggah!');
      } else {
        alert(data.error || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Product Form CRUD Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock || !productForm.category_id) {
      alert('Mohon isi semua field wajib!');
      return;
    }
    if (productForm.pickupMethods.length === 0) {
      alert('Mohon pilih minimal satu metode pengambilan!');
      return;
    }

    const payload = {
      name: productForm.name,
      category_id: productForm.category_id,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      description: productForm.description,
      image_url: productForm.image || null,
      pickup_methods: productForm.pickupMethods,
      unit: 'buah'
    };

    try {
      let res;
      if (editingProduct) {
        // Edit mode
        res = await fetch(`/api/catalog/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Add mode
        res = await fetch('/api/catalog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (res.ok && data.success) {
        alert(editingProduct ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!');
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProductForm({
          name: '',
          category_id: '',
          price: '',
          stock: '',
          description: '',
          image: '',
          pickupMethods: ['Kirim', 'Ambil Sendiri']
        });
        fetchAllData();
      } else {
        alert(data.error || 'Gagal menyimpan produk.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan produk.');
    }
  };

  // Open Edit Product Modal
  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category_id: product.category_id || '',
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || '',
      image: product.image_url || '',
      pickupMethods: product.pickup_methods || ['Kirim', 'Ambil Sendiri']
    });
    setIsProductModalOpen(true);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const res = await fetch(`/api/catalog/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('Produk berhasil dihapus!');
          fetchAllData();
        } else {
          alert(data.error || 'Gagal menghapus produk.');
        }
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus produk.');
      }
    }
  };

  // Activity Form CRUD Submit
  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title || !activityForm.author || !activityForm.summary) {
      alert('Mohon isi semua field wajib!');
      return;
    }

    const payload = {
      title: activityForm.title,
      author: activityForm.author,
      category: activityForm.category,
      summary: activityForm.summary,
      content: activityForm.content || '',
      published: activityForm.published
    };

    try {
      let res;
      if (editingActivity) {
        // Edit Mode
        res = await fetch(`/api/activities/${editingActivity.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Add Mode
        res = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (res.ok && data.success) {
        alert(editingActivity ? 'Kegiatan berhasil diperbarui!' : 'Kegiatan baru berhasil ditambahkan!');
        setIsActivityModalOpen(false);
        setEditingActivity(null);
        setActivityForm({ title: '', author: '', date: new Date().toISOString().split('T')[0], category: 'Edukasi & Informasi', summary: '', content: '', published: true });
        fetchAllData();
      } else {
        alert(data.error || 'Gagal menyimpan kegiatan.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan kegiatan.');
    }
  };

  // Open Edit Activity Modal
  const openEditActivity = (activity: any) => {
    setEditingActivity(activity);
    setActivityForm({
      title: activity.title,
      author: activity.author,
      date: activity.created_at ? activity.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      category: activity.category,
      summary: activity.summary,
      content: activity.content || '',
      published: activity.published ?? true
    });
    setIsActivityModalOpen(true);
  };

  // Delete Activity
  const handleDeleteActivity = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      try {
        const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('Kegiatan berhasil dihapus!');
          fetchAllData();
        } else {
          alert(data.error || 'Gagal menghapus kegiatan.');
        }
      } catch (err) {
        console.error(err);
        alert('Gagal menghapus kegiatan.');
      }
    }
  };

  // Manual update of order status by Admin
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Status pesanan berhasil diperbarui!');
        fetchAllData();
      } else {
        alert(data.error || 'Gagal memperbarui status pesanan.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui status pesanan.');
    }
  };

  // Dynamic statistics from live order database
  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const revenue = orders.reduce((sum, o) => {
      if (['paid', 'processing', 'shipped', 'completed'].includes(o.status)) {
        return sum + o.total_amount;
      }
      return sum;
    }, 0);

    const onProgress = orders.filter(o =>
      ['pending', 'paid', 'processing', 'shipped'].includes(o.status)
    ).length;

    const uniqueCustomers = new Set(orders.map(o => o.user_id)).size;

    return {
      totalOrders,
      revenue,
      onProgress,
      uniqueCustomers
    };
  }, [orders]);

  // Aggregated dynamic monthly revenues for Sales SVG Chart
  const graphData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentYear = new Date().getFullYear();
    const monthlySum = Array(12).fill(0);

    orders.forEach(o => {
      if (['paid', 'processing', 'shipped', 'completed'].includes(o.status)) {
        const date = new Date(o.created_at);
        if (date.getFullYear() === currentYear) {
          monthlySum[date.getMonth()] += o.total_amount;
        }
      }
    });

    return [
      { month: 'Jan', sales: monthlySum[0] },
      { month: 'Feb', sales: monthlySum[1] },
      { month: 'Mar', sales: monthlySum[2] },
      { month: 'Apr', sales: monthlySum[3] },
      { month: 'Mei', sales: monthlySum[4] },
      { month: 'Jun', sales: monthlySum[5] }
    ];
  }, [orders]);

  // SVG Scaled points based on maximum sales revenue
  const scaledPoints = useMemo(() => {
    const maxVal = Math.max(...graphData.map(d => d.sales), 1000000); // minimum scale helper
    const xCoords = [60, 150, 240, 330, 420, 540];

    return graphData.map((d, i) => {
      // Map value between 190 (zero) and 40 (maxVal)
      const y = 190 - (d.sales / maxVal) * 150;
      return {
        x: xCoords[i],
        y,
        val: d.sales
      };
    });
  }, [graphData]);

  // Dynamic SVG drawing paths
  const svgPath = useMemo(() => {
    if (scaledPoints.length === 0) return '';
    return scaledPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  }, [scaledPoints]);

  const svgAreaPath = useMemo(() => {
    if (scaledPoints.length === 0) return '';
    return `${svgPath} L 540,200 L 60,200 Z`;
  }, [scaledPoints, svgPath]);

  // Aggregated Best Selling Products from database orders
  const topProducts = useMemo(() => {
    const salesMap: Record<string, { name: string; quantity: number }> = {};
    orders.forEach(o => {
      if (['paid', 'processing', 'shipped', 'completed'].includes(o.status) && o.order_items) {
        o.order_items.forEach((item: any) => {
          if (!salesMap[item.plant_id]) {
            salesMap[item.plant_id] = { name: item.plant_name, quantity: 0 };
          }
          salesMap[item.plant_id].quantity += item.quantity;
        });
      }
    });

    const list = Object.values(salesMap).sort((a, b) => b.quantity - a.quantity);
    const maxQty = list.length > 0 ? list[0].quantity : 1;

    return list.slice(0, 4).map(item => ({
      ...item,
      percentage: Math.round((item.quantity / maxQty) * 100)
    }));
  }, [orders]);

  // ─── Loading Auth Check ────────────────────────────────────────────────
  if (loadingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f9f7] text-[#274235] font-sans">
        <div className="flex flex-col items-center gap-4 p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-[#e2ede7] shadow-xl">
          <Loader2 className="w-10 h-10 animate-spin text-brand-emerald" />
          <p className="text-sm font-semibold tracking-wide text-brand-sage animate-pulse">Memverifikasi Hak Akses...</p>
        </div>
      </div>
    );
  }

  // ─── Access Denied View ───────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f9f7] text-[#274235] font-sans p-4">
        <div className="max-w-md w-full flex flex-col items-center text-center p-8 sm:p-10 bg-white rounded-3xl border border-[#e2ede7] shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-6 border border-rose-100">
            <ShieldAlert className="w-10 h-10 text-rose-600 animate-bounce" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-brand-forest mb-3">Akses Ditolak</h1>
          <p className="text-brand-sage text-sm leading-relaxed mb-8">
            Halaman ini hanya dapat diakses oleh Administrator BotaniMart. Silakan kembali ke beranda atau masuk menggunakan akun admin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/"
              className="flex-1 py-3 px-6 rounded-full bg-brand-emerald hover:bg-brand-forest text-white text-xs font-bold uppercase tracking-wider text-center shadow-md transition-all cursor-pointer"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/login?from=/admin"
              className="flex-1 py-3 px-6 rounded-full border border-[#e2ede7] hover:bg-brand-cream text-brand-forest text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer"
            >
              Masuk Akun Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <AuthButton />
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
                  <div className="space-y-1 w-full text-left">
                    <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider block">Total Pesanan</span>
                    {loadingData ? (
                      <Loader2 className="w-6 h-6 animate-spin text-brand-emerald" />
                    ) : (
                      <span className="text-3xl font-heading font-black text-brand-forest block">{stats.totalOrders}</span>
                    )}
                    <span className="text-[9px] text-[#50685c]/60 font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Live updated
                    </span>
                  </div>
                </div>

                {/* Stat 2: Month Revenue */}
                <div className="bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/10 text-amber-500 flex items-center justify-center shrink-0">
                    <DollarSign className="w-6.5 h-6.5" />
                  </div>
                  <div className="space-y-1 w-full text-left">
                    <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider block">Pendapatan Terverifikasi</span>
                    {loadingData ? (
                      <Loader2 className="w-6 h-6 animate-spin text-brand-emerald" />
                    ) : (
                      <span className="text-xl sm:text-2xl font-heading font-black text-brand-forest block">
                        Rp {stats.revenue.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="text-[9px] text-[#50685c]/60 font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Dari pesanan lunas
                    </span>
                  </div>
                </div>

                {/* Stat 3: On-Progress Orders */}
                <div className="bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-red-400/10 text-red-500 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6.5 h-6.5" />
                  </div>
                  <div className="space-y-1 w-full text-left">
                    <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider block">Pesanan Aktif</span>
                    {loadingData ? (
                      <Loader2 className="w-6 h-6 animate-spin text-brand-emerald" />
                    ) : (
                      <span className="text-3xl font-heading font-black text-brand-forest block">{stats.onProgress}</span>
                    )}
                    <span className="text-[9px] text-[#50685c]/60 font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Menunggu penyelesaian
                    </span>
                  </div>
                </div>

                {/* Stat 4: Jumlah Customer */}
                <div className="bg-white rounded-3xl p-6 border border-[#e2ede7] shadow-sm flex items-center gap-5 hover:scale-[1.01] transition-transform duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center shrink-0">
                    <Users className="w-6.5 h-6.5" />
                  </div>
                  <div className="space-y-1 w-full text-left">
                    <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider block">Total Customer</span>
                    {loadingData ? (
                      <Loader2 className="w-6 h-6 animate-spin text-brand-emerald" />
                    ) : (
                      <span className="text-3xl font-heading font-black text-brand-forest block">{stats.uniqueCustomers}</span>
                    )}
                    <span className="text-[9px] text-[#50685c]/60 font-semibold block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Transaksi unik
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
                      {svgPath && (
                        <path
                          d={svgPath}
                          stroke="#345947"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          fill="none"
                        />
                      )}

                      {/* Soft Green Area Gradient under Sales Path */}
                      {svgAreaPath && (
                        <path
                          d={svgAreaPath}
                          fill="url(#gradient-fill)"
                          opacity="0.12"
                        />
                      )}

                      {/* Gradient Definitions */}
                      <defs>
                        <linearGradient id="gradient-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#345947" />
                          <stop offset="100%" stopColor="#b8d5c5" />
                        </linearGradient>
                      </defs>

                      {/* Interactive Circles / Data points */}
                      {scaledPoints.map((p, idx) => (
                        <circle key={idx} cx={p.x} cy={p.y} r="5" fill="#345947" stroke="#ffffff" strokeWidth="2" />
                      ))}

                      {/* Value labels overlay */}
                      {scaledPoints.map((p, idx) => {
                        let text = 'Rp0';
                        if (p.val >= 1000000) {
                          text = `Rp${(p.val / 1000000).toFixed(1)}jt`;
                        } else if (p.val >= 1000) {
                          text = `Rp${(p.val / 1000).toFixed(0)}rb`;
                        } else if (p.val > 0) {
                          text = `Rp${p.val}`;
                        }
                        return (
                          <text key={idx} x={p.x} y={p.y - 12} fontSize="9" fill="#274235" fontWeight="bold" textAnchor="middle">
                            {text}
                          </text>
                        );
                      })}

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

                    {topProducts.length === 0 ? (
                      <div className="text-center py-6 text-xs font-semibold text-brand-sage">
                        Belum ada data penjualan.
                      </div>
                    ) : (
                      topProducts.map((item, idx) => (
                        <div key={idx} className="space-y-1 text-left">
                          <div className="flex justify-between text-xs font-bold text-brand-forest">
                            <span className="truncate max-w-[150px]">{item.name}</span>
                            <span>{item.quantity} Terjual</span>
                          </div>
                          <div className="w-full bg-[#f0f4f1] h-2 rounded-full overflow-hidden">
                            <div className="bg-brand-emerald h-full rounded-full" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                        </div>
                      ))
                    )}

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
                      {orders.map(order => {
                        const customerName = order.user?.full_name || order.user?.email || 'Guest';
                        const itemsStr = order.order_items
                          ? order.order_items.map((i: any) => `${i.plant_name} (${i.quantity})`).join(', ')
                          : 'Tanpa Item';

                        return (
                          <tr key={order.id} className="hover:bg-brand-cream/20 transition-colors">
                            <td className="py-4.5 pl-4 font-heading font-bold text-brand-emerald text-xs truncate max-w-[120px]" title={order.id}>
                              {order.midtrans_order_id || order.id.slice(0, 8)}
                            </td>
                            <td className="py-4.5 text-xs truncate max-w-[120px]" title={customerName}>{customerName}</td>
                            <td className="py-4.5 text-xs text-brand-sage truncate max-w-[180px]" title={itemsStr}>{itemsStr}</td>
                            <td className="py-4.5 text-xs font-bold">Rp {order.total_amount.toLocaleString('id-ID')}</td>
                            <td className="py-4.5 text-center">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`text-[10px] font-bold border rounded-full px-2.5 py-1 focus:outline-none cursor-pointer ${
                                  order.status === 'completed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : order.status === 'canceled' || order.status === 'expired'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                                <option value="expired">Expired</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-xs font-semibold text-brand-sage">
                            Belum ada transaksi.
                          </td>
                        </tr>
                      )}
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
                      category_id: '',
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
                          onClick={() => handleProductSort('categoryName')}
                          className="py-4.5 cursor-pointer hover:bg-brand-cream/20 transition-colors"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Kategori</span>
                            <ArrowUpDown className={`w-3 h-3 transition-colors ${productSort.key === 'categoryName' ? 'text-brand-emerald' : 'text-zinc-400'}`} />
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

                          <td className="py-4.5 text-xs font-bold text-brand-emerald uppercase tracking-wider">{product.categoryName}</td>
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
                              {(product.pickupMethods || ['Kirim', 'Ambil Sendiri']).map((method: string, idx: number) => (
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
                    setActivityForm({ title: '', author: '', date: new Date().toISOString().split('T')[0], category: 'Edukasi & Informasi', summary: '', content: '', published: true });
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
                  <label className={`cursor-pointer inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-full border border-brand-emerald text-brand-emerald hover:bg-brand-cream text-xs font-bold transition-all ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingImage ? 'Mengunggah...' : 'Upload Foto'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
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
                  value={productForm.category_id}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-full bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald cursor-pointer"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
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
                  rows={2}
                  value={activityForm.summary}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-3xl bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
                  required
                />
              </div>

              {/* Content Detail text */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-[#1e3329] mb-1">Detail Narasi</label>
                <textarea
                  placeholder="Masukkan isi lengkap kegiatan/berita di sini..."
                  rows={3}
                  value={activityForm.content}
                  onChange={(e) => setActivityForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-5 py-3 text-sm border border-zinc-200 rounded-3xl bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-emerald shadow-inner"
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
