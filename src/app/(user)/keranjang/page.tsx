'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight,
  Leaf, AlertCircle, Loader2, ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';

interface CartPlant {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  unit: string;
  image_url: string | null;
  pickup_methods: string[];
}

interface CartItem {
  id: string;
  plant_id: string;
  quantity: number;
  plant: CartPlant;
}

interface CartData {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function KeranjangPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null); // cart item id being updated
  const [error, setError] = useState('');

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
      } else if (res.status === 401) {
        router.push('/login?from=/keranjang');
      }
    } catch {
      setError('Gagal memuat keranjang.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (cartId: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdating(cartId);
    try {
      const res = await fetch(`/api/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      const data = await res.json();
      if (data.success) await fetchCart();
      else setError(data.error || 'Gagal memperbarui.');
    } catch {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartId: string) => {
    setUpdating(cartId);
    try {
      const res = await fetch(`/api/cart/${cartId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchCart();
      else setError(data.error || 'Gagal menghapus.');
    } catch {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setUpdating(null);
    }
  };

  const clearAll = async () => {
    try {
      const res = await fetch('/api/cart', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchCart();
    } catch {
      setError('Terjadi kesalahan jaringan.');
    }
  };

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans text-brand-forest">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans antialiased text-brand-forest">

      {/* Header */}
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">

        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-brand-cream transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">Keranjang Belanja</h1>
            {!isEmpty && (
              <p className="text-sm text-brand-sage mt-1">{cart.totalItems} item di keranjang</p>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 animate-fade-in-up">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {/* ─── Empty Cart ─────────────────────────────────────────────────── */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-brand-cream flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-brand-sage" />
            </div>
            <h2 className="text-xl font-bold font-heading mb-2">Keranjang Anda Kosong</h2>
            <p className="text-brand-sage text-sm mb-8 max-w-sm">
              Mulai belanja dan temukan berbagai tanaman berkualitas untuk melengkapi ruang hijau Anda.
            </p>
            <Link
              href="/toko"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-forest hover:bg-brand-emerald text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Leaf className="w-4 h-4" />
              Jelajahi Toko
            </Link>
          </div>
        ) : (
          /* ─── Cart Content ──────────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Clear All */}
              <div className="flex justify-end">
                <button
                  onClick={clearAll}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Hapus Semua
                </button>
              </div>

              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border border-[#e2ede7] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 ${updating === item.id ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  <div className="flex gap-4">
                    {/* Plant Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-brand-cream flex-shrink-0 overflow-hidden relative">
                      {item.plant.image_url ? (
                        <NextImage
                          src={item.plant.image_url}
                          alt={item.plant.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="w-8 h-8 text-brand-sage/40" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{item.plant.name}</h3>
                      <p className="text-brand-emerald font-bold text-sm mt-0.5">
                        {formatRupiah(item.plant.price)}
                        <span className="text-brand-sage font-normal text-xs">/{item.plant.unit}</span>
                      </p>
                      <p className="text-xs text-brand-sage mt-1">Stok: {item.plant.stock}</p>

                      {/* Quantity + Delete */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 bg-brand-cream rounded-full">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-lime/50 transition-colors disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.plant.stock}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-lime/50 transition-colors disabled:opacity-30"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm">{formatRupiah(item.plant.price * item.quantity)}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#e2ede7] p-6 shadow-sm sticky top-28">
                <h3 className="text-lg font-bold font-heading mb-4">Ringkasan Belanja</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-sage">Total Item</span>
                    <span className="font-medium">{cart.totalItems} item</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-sage">Subtotal</span>
                    <span className="font-medium">{formatRupiah(cart.totalPrice)}</span>
                  </div>
                  <div className="border-t border-[#e2ede7] pt-3">
                    <div className="flex justify-between text-base">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-brand-emerald">{formatRupiah(cart.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-brand-forest hover:bg-brand-emerald text-white font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/toko"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-full border border-brand-sage/20 text-brand-sage hover:text-brand-forest hover:border-brand-forest/30 font-medium text-sm transition-all"
                >
                  Lanjut Belanja
                </Link>
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
