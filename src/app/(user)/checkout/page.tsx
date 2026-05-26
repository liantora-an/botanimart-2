'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, ShoppingBag, Loader2, AlertCircle, CheckCircle2,
  CreditCard, Leaf, MapPin, FileText
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess?: (result: unknown) => void;
        onPending?: (result: unknown) => void;
        onError?: (result: unknown) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

interface CartPlant {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  image_url: string | null;
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

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
        if (data.data.items.length === 0) {
          router.push('/keranjang');
        }
      } else if (res.status === 401) {
        router.push('/login?from=/checkout');
      }
    } catch {
      setError('Gagal memuat data keranjang.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Load Midtrans Snap script
  useEffect(() => {
    const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    if (!midtransClientKey) return;

    const existingScript = document.getElementById('midtrans-snap');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'midtrans-snap';
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', midtransClientKey);
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handleCheckout = async () => {
    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal memproses checkout.');
        setProcessing(false);
        return;
      }

      const { snapToken } = data.data;

      // Open Midtrans Snap payment popup
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            setPaymentSuccess(true);
            setTimeout(() => router.push('/akun'), 2000);
          },
          onPending: () => {
            // Order created with pending status, redirect to account
            router.push('/akun');
          },
          onError: () => {
            setError('Pembayaran gagal. Silakan coba lagi.');
            setProcessing(false);
          },
          onClose: () => {
            // User closed the popup — order is still pending
            setProcessing(false);
          },
        });
      } else {
        setError('Midtrans belum dimuat. Silakan refresh halaman.');
        setProcessing(false);
      }
    } catch {
      setError('Terjadi kesalahan jaringan.');
      setProcessing(false);
    }
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
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

  // ─── Payment Success ────────────────────────────────────────────────────────
  if (paymentSuccess) {
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
        <div className="flex-1 flex items-center justify-center animate-fade-in-up">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold font-heading mb-3">Pembayaran Berhasil!</h1>
            <p className="text-brand-sage text-sm mb-6">
              Terima kasih telah berbelanja di Botani Mart. Pesanan Anda sedang diproses.
            </p>
            <Link
              href="/akun"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-forest text-white font-semibold shadow-md hover:bg-brand-emerald transition-all"
            >
              Lihat Pesanan Saya
            </Link>
          </div>
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
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">

        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-brand-cream transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">Checkout</h1>
            <p className="text-sm text-brand-sage mt-1">Periksa pesanan Anda sebelum pembayaran</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 animate-fade-in-up">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {cart && cart.items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items Review */}
            <div className="lg:col-span-2 space-y-6">

              {/* Order Items Card */}
              <div className="bg-white rounded-2xl border border-[#e2ede7] p-6 shadow-sm">
                <h3 className="text-base font-bold font-heading mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-emerald" />
                  Item Pesanan ({cart.totalItems})
                </h3>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-[#e2ede7] last:border-0 last:pb-0">
                      <div className="w-16 h-16 rounded-xl bg-brand-cream flex-shrink-0 overflow-hidden relative">
                        {item.plant.image_url ? (
                          <NextImage src={item.plant.image_url} alt={item.plant.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-brand-sage/40" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.plant.name}</p>
                        <p className="text-xs text-brand-sage mt-0.5">
                          {formatRupiah(item.plant.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatRupiah(item.plant.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-white rounded-2xl border border-[#e2ede7] p-6 shadow-sm">
                <h3 className="text-base font-bold font-heading mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-emerald" />
                  Catatan (Opsional)
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk pesanan Anda..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-zinc-800 bg-brand-cream/50 border border-[#e2ede7] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Pickup Info */}
              <div className="bg-white rounded-2xl border border-[#e2ede7] p-6 shadow-sm">
                <h3 className="text-base font-bold font-heading mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-emerald" />
                  Informasi Pengambilan
                </h3>
                <p className="text-sm text-brand-sage leading-relaxed">
                  Metode pengambilan akan dikonfirmasi setelah pembayaran. Anda dapat memilih antara
                  <strong className="text-brand-forest"> Dikirim</strong> (tiba dalam 2-3 jam) atau 
                  <strong className="text-brand-forest"> Ambil Langsung</strong> di lokasi Botani Mart.
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#e2ede7] p-6 shadow-sm sticky top-28">
                <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-emerald" />
                  Ringkasan Pembayaran
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-sage">Subtotal ({cart.totalItems} item)</span>
                    <span className="font-medium">{formatRupiah(cart.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-sage">Ongkir</span>
                    <span className="font-medium text-emerald-600">Gratis</span>
                  </div>
                  <div className="border-t border-[#e2ede7] pt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-brand-emerald">{formatRupiah(cart.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-full bg-brand-forest hover:bg-brand-emerald text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Bayar Sekarang
                    </>
                  )}
                </button>

                <p className="text-xs text-brand-sage text-center mt-3">
                  Pembayaran diproses melalui Midtrans. Aman & terenkripsi.
                </p>

                <Link
                  href="/keranjang"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-full border border-brand-sage/20 text-brand-sage hover:text-brand-forest font-medium text-sm transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Kembali ke Keranjang
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-brand-forest text-white/80 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2025 Botani Mart. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
