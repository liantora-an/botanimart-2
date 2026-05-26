'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  User, Package, LogOut, Loader2, AlertCircle, Clock, CheckCircle2,
  Truck, XCircle, CreditCard, ChevronDown, ChevronUp, Leaf,
  ArrowLeft, ShoppingBag, MapPin, Mail, Phone as PhoneIcon
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: string;
}

interface OrderItem {
  id: string;
  plant_id: string;
  plant_name: string;
  price_at_purchase: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  midtrans_order_id: string;
  payment_method: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:     { label: 'Menunggu Pembayaran', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',     icon: Clock },
  paid:        { label: 'Dibayar',             color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',       icon: CreditCard },
  processing:  { label: 'Diproses',            color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200',   icon: Package },
  shipped:     { label: 'Dikirim',             color: 'text-cyan-700',    bg: 'bg-cyan-50 border-cyan-200',       icon: Truck },
  completed:   { label: 'Selesai',             color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  canceled:    { label: 'Dibatalkan',          color: 'text-red-700',     bg: 'bg-red-50 border-red-200',         icon: XCircle },
  expired:     { label: 'Kedaluwarsa',         color: 'text-zinc-600',    bg: 'bg-zinc-50 border-zinc-200',       icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

export default function AkunPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  const fetchData = useCallback(async () => {
    try {
      const [userRes, ordersRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/orders'),
      ]);

      if (userRes.status === 401) {
        router.push('/login?from=/akun');
        return;
      }

      const userData = await userRes.json();
      const ordersData = await ordersRes.json();

      if (userData.success) setUser(userData.data);
      if (ordersData.success) setOrders(ordersData.data);
    } catch {
      setError('Gagal memuat data akun.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch {
      setError('Gagal logout.');
      setLoggingOut(false);
    }
  };

  // ─── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans text-brand-forest">
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-[#e2ede7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-64 h-16">
                <NextImage src="/images/logo_v4.png" alt="Botani Mart" fill className="object-contain" />
              </div>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans antialiased text-brand-forest">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-[#e2ede7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="relative w-64 h-16 transition-all group-hover:scale-102">
              <NextImage src="/images/logo_v4.png" alt="Botani Mart" fill priority className="object-contain" />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-brand-sage hover:text-brand-forest transition-colors">Beranda</Link>
            <Link href="/toko" className="text-sm font-semibold text-brand-sage hover:text-brand-forest transition-colors">Toko</Link>
            <Link href="/kegiatan" className="text-sm font-semibold text-brand-sage hover:text-brand-forest transition-colors">Kegiatan</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/keranjang" className="p-2.5 rounded-full hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all">
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
            >
              {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">

        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-brand-cream transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">Akun Saya</h1>
            <p className="text-sm text-brand-sage mt-1">
              Selamat datang, <span className="font-semibold text-brand-forest">{user?.full_name || user?.email}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 animate-fade-in-up">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-brand-cream/60 rounded-2xl p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-brand-forest shadow-sm'
                : 'text-brand-sage hover:text-brand-forest'
            }`}
          >
            <Package className="w-4 h-4" />
            Pesanan
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-brand-forest shadow-sm'
                : 'text-brand-sage hover:text-brand-forest'
            }`}
          >
            <User className="w-4 h-4" />
            Profil
          </button>
        </div>

        {/* ─── Orders Tab ─────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center mb-5">
                  <Package className="w-9 h-9 text-brand-sage" />
                </div>
                <h2 className="text-lg font-bold font-heading mb-2">Belum Ada Pesanan</h2>
                <p className="text-brand-sage text-sm mb-6 max-w-sm">
                  Anda belum memiliki riwayat pesanan. Mulai belanja sekarang!
                </p>
                <Link
                  href="/toko"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-brand-forest hover:bg-brand-emerald text-white font-semibold shadow-md transition-all"
                >
                  <Leaf className="w-4 h-4" />
                  Jelajahi Toko
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-[#e2ede7] shadow-sm hover:shadow-md transition-all overflow-hidden"
                  >
                    {/* Order Header */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-mono text-brand-sage bg-brand-cream px-2.5 py-1 rounded-lg">
                            {order.midtrans_order_id}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-brand-sage">{formatDate(order.created_at)}</span>
                          <span className="font-bold text-brand-emerald">{formatRupiah(order.total_amount)}</span>
                        </div>
                      </div>
                      <div className="ml-3 text-brand-sage">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {/* Expanded Items */}
                    {isExpanded && order.order_items && (
                      <div className="border-t border-[#e2ede7] px-5 pb-5 animate-fade-in-up">
                        <div className="pt-4 space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-[#e2ede7]/50 last:border-0">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-brand-cream flex items-center justify-center flex-shrink-0">
                                  <Leaf className="w-4 h-4 text-brand-sage/40" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium truncate">{item.plant_name}</p>
                                  <p className="text-xs text-brand-sage">
                                    {formatRupiah(item.price_at_purchase)} × {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <span className="font-semibold ml-3">{formatRupiah(item.subtotal)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Meta */}
                        <div className="mt-4 pt-3 border-t border-[#e2ede7] text-xs text-brand-sage space-y-1">
                          {order.payment_method && (
                            <p>Metode: <span className="font-medium text-brand-forest">{order.payment_method}</span></p>
                          )}
                          {order.paid_at && (
                            <p>Dibayar: <span className="font-medium text-brand-forest">{formatDate(order.paid_at)}</span></p>
                          )}
                          {order.notes && (
                            <p>Catatan: <span className="font-medium text-brand-forest">{order.notes}</span></p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── Profile Tab ────────────────────────────────────────────── */}
        {activeTab === 'profile' && user && (
          <div className="max-w-lg space-y-6">
            <div className="bg-white rounded-2xl border border-[#e2ede7] p-6 shadow-sm">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-emerald to-brand-forest flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {(user.full_name || user.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading">{user.full_name || 'Pengguna'}</h3>
                  <p className="text-sm text-brand-sage">{user.role === 'Admin' ? '🛡️ Administrator' : '🌿 Member'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-brand-cream/50 rounded-xl">
                  <Mail className="w-4 h-4 text-brand-sage" />
                  <div>
                    <p className="text-xs text-brand-sage">Email</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-brand-cream/50 rounded-xl">
                  <PhoneIcon className="w-4 h-4 text-brand-sage" />
                  <div>
                    <p className="text-xs text-brand-sage">Telepon</p>
                    <p className="text-sm font-medium">{user.phone || 'Belum diisi'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-brand-cream/50 rounded-xl">
                  <MapPin className="w-4 h-4 text-brand-sage" />
                  <div>
                    <p className="text-xs text-brand-sage">Alamat</p>
                    <p className="text-sm font-medium">{user.address || 'Belum diisi'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout (mobile) */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="sm:hidden w-full flex items-center justify-center gap-2 py-3.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-semibold transition-all"
            >
              {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              Keluar dari Akun
            </button>
          </div>
        )}
      </main>

      <footer className="bg-brand-forest text-white/80 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2025 Botani Mart. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
