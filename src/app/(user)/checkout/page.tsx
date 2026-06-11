'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, ShoppingBag, Loader2, AlertCircle, CheckCircle2,
  CreditCard, Leaf, MapPin, FileText, X, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  discount_price?: number | null;
  stock: number;
  unit: string;
  image_url: string | null;
  pickup_methods?: string[];
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
  const [pickupMethod, setPickupMethod] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [userProfile, setUserProfile] = useState<{ email: string; full_name: string | null; address: string | null; phone: string | null } | null>(null);
  const [addressAutofilled, setAddressAutofilled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const isDemo = !process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 
    process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY === 'your_midtrans_client_key';

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

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.data) {
        setUserProfile(data.data);
        if (data.data.address && data.data.address.trim() !== '') {
          setAddress(data.data.address);
          setAddressAutofilled(true);
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    fetchProfile();
  }, [fetchCart, fetchProfile]);

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

  // Determine available pickup methods (intersection of all cart items' methods)
  const availablePickupMethods = React.useMemo(() => {
    if (!cart || !cart.items || cart.items.length === 0) return [];
    
    // Start with the first item's methods or default to standard methods if not defined
    let intersection = cart.items[0].plant.pickup_methods || ['Kirim', 'Ambil Langsung'];
    
    // Intersect with the rest of the items
    for (let i = 1; i < cart.items.length; i++) {
      const currentMethods = cart.items[i].plant.pickup_methods || ['Kirim', 'Ambil Langsung'];
      intersection = intersection.filter(method => 
        currentMethods.some(cm => cm.toLowerCase() === method.toLowerCase())
      );
    }

    // Map to normalized terms: 'Kirim' and 'Ambil Langsung'
    const normalized = intersection.map(method => {
      const lower = method.toLowerCase();
      if (lower.includes('kirim')) return 'Kirim';
      if (lower.includes('ambil') || lower.includes('langsung') || lower.includes('sendiri')) return 'Ambil Langsung';
      return method;
    });

    // Remove duplicates
    const unique = Array.from(new Set(normalized));
    return unique.length > 0 ? unique : ['Kirim', 'Ambil Langsung'];
  }, [cart]);

  const handleCheckout = async () => {
    if (!pickupMethod) {
      setError('Silakan pilih metode pengambilan terlebih dahulu.');
      return;
    }
    if (pickupMethod === 'Kirim' && !address.trim()) {
      setError('Alamat pengiriman wajib diisi untuk metode Kirim.');
      return;
    }

    if (isDemo) {
      setShowDemoModal(true);
      return;
    }

    setProcessing(true);
    setError('');

    // Format fullNotes
    const fullNotes = `[Metode: ${pickupMethod}]${pickupMethod === 'Kirim' ? `\n[Alamat: ${address}]` : ''}${notes ? `\n\nCatatan Tambahan:\n${notes}` : ''}`;

    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: fullNotes }),
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

  const handleDemoPayment = async () => {
    if (!pickupMethod) {
      setError('Silakan pilih metode pengambilan terlebih dahulu.');
      return;
    }
    if (pickupMethod === 'Kirim' && !address.trim()) {
      setError('Alamat pengiriman wajib diisi untuk metode Kirim.');
      return;
    }

    setProcessing(true);
    setError('');
    setShowDemoModal(false);

    // Format fullNotes
    const fullNotes = `[Metode: ${pickupMethod}]${pickupMethod === 'Kirim' ? `\n[Alamat: ${address}]` : ''}${notes ? `\n\nCatatan Tambahan:\n${notes}` : ''}`;

    try {
      const res = await fetch('/api/orders/checkout-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: fullNotes }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal memproses demo checkout.');
        setProcessing(false);
        return;
      }

      setPaymentSuccess(true);
      setTimeout(() => router.push('/akun'), 2000);
    } catch {
      setError('Terjadi kesalahan jaringan.');
      setProcessing(false);
    }
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
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

  // ─── Payment Success ────────────────────────────────────────────────────────
  if (paymentSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fcfdfc] font-sans text-brand-forest">
        <Navbar />
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
      <Navbar />

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
                          {item.plant.discount_price ? (
                            <span className="flex items-center gap-1">
                              <span className="line-through">{formatRupiah(item.plant.price)}</span>
                              <span className="text-brand-emerald font-semibold">{formatRupiah(item.plant.discount_price)}</span>
                            </span>
                          ) : (
                            formatRupiah(item.plant.price)
                          )} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          {formatRupiah((item.plant.discount_price ?? item.plant.price) * item.quantity)}
                        </p>
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
              <div className="bg-white rounded-2xl border border-[#e2ede7] p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold font-heading mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-emerald" />
                  Pilih Metode Pengambilan
                </h3>
                
                <p className="text-xs text-brand-sage leading-relaxed pl-6 -mt-3">
                  Silakan pilih metode pengambilan yang tersedia untuk tanaman di keranjang Anda.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6">
                  {availablePickupMethods.map((method) => {
                    const isSelected = pickupMethod === method;
                    const isDelivery = method === 'Kirim';
                    
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          setPickupMethod(method);
                          // Reset address if they change to Ambil Langsung
                          if (method !== 'Kirim') {
                            setAddress('');
                            setAddressAutofilled(false);
                          } else if (userProfile?.address) {
                            setAddress(userProfile.address);
                            setAddressAutofilled(true);
                          }
                        }}
                        className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-brand-emerald bg-brand-cream/30 ring-2 ring-brand-emerald/10 shadow-sm scale-[1.01]'
                            : 'border-[#e2ede7] hover:border-brand-emerald/40 hover:bg-brand-cream/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-brand-emerald text-brand-emerald' : 'border-zinc-300'
                          }`}>
                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald" />}
                          </span>
                          <span className="font-bold text-sm text-brand-forest">
                            {isDelivery ? 'Kirim (Delivery)' : 'Ambil Langsung'}
                          </span>
                        </div>
                        <span className="text-[10px] text-brand-sage leading-relaxed pl-6">
                          {isDelivery
                            ? 'Pesanan dikemas rapi dan dikirim langsung ke alamat rumah Anda.'
                            : 'Pesanan disiapkan di gerai Botani Mart IPB. Silakan ambil langsung.'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Conditional Address Textarea */}
                {pickupMethod === 'Kirim' && (
                  <div className="pl-6 pt-2 space-y-2 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <label htmlFor="checkout-address" className="text-xs font-bold text-brand-forest uppercase tracking-wider">
                        Alamat Pengiriman <span className="text-red-500">*</span>
                      </label>
                      {addressAutofilled && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wide bg-brand-emerald/10 text-brand-emerald px-2 py-0.5 rounded border border-brand-emerald/5 animate-pulse">
                          Diisi otomatis dari profil
                        </span>
                      )}
                    </div>
                    
                    <textarea
                      id="checkout-address"
                      rows={3}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setAddressAutofilled(false);
                      }}
                      placeholder="Masukkan alamat pengiriman lengkap Anda (Jalan, RT/RW, Blok, Kecamatan, Kota, Kode Pos)..."
                      className="w-full px-4 py-3 text-sm text-zinc-800 bg-[#fbfcfb] border border-[#e2ede7] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all resize-none shadow-inner"
                      required
                    />
                    
                    {addressAutofilled && (
                      <p className="text-[10px] text-brand-sage italic pl-1">
                        *Anda dapat mengubah alamat di atas secara bebas untuk pengiriman pesanan ini.
                      </p>
                    )}
                  </div>
                )}
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

                {/* Validation alert if method not selected */}
                {!pickupMethod && (
                  <div className="mt-4 flex items-center gap-2 p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-800 text-xs font-medium animate-pulse">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Silakan pilih metode pengambilan sebelum bayar.</span>
                  </div>
                )}
                {pickupMethod === 'Kirim' && !address.trim() && (
                  <div className="mt-4 flex items-center gap-2 p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-800 text-xs font-medium animate-pulse">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Harap masukkan alamat pengiriman lengkap Anda.</span>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={processing || !pickupMethod || (pickupMethod === 'Kirim' && !address.trim())}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-full bg-brand-forest hover:bg-brand-emerald text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

      <Footer />

      {/* Demo Checkout Modal */}
      {showDemoModal && cart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-forest/40 backdrop-blur-md transition-all duration-300 animate-fade-in">
          <div className="bg-white/95 rounded-3xl border border-[#e2ede7] p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-scale-in text-brand-forest">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-brand-cream/80 text-brand-sage hover:text-brand-forest transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-3">
                <Leaf className="w-3.5 h-3.5" />
                Mode Demo
              </span>
              <h3 className="text-xl font-bold font-heading">Konfirmasi Pembayaran</h3>
              <p className="text-sm text-brand-sage mt-1">Simulasi penyelesaian transaksi</p>
            </div>

            {/* Payment Summary Box */}
            <div className="bg-brand-cream/50 rounded-2xl p-5 border border-[#e2ede7] mb-6">
              <div className="flex justify-between items-center text-sm border-b border-[#e2ede7]/60 pb-3 mb-3">
                <span className="text-brand-sage">Total Item</span>
                <span className="font-semibold">{cart.totalItems} Tanaman</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-brand-sage uppercase tracking-wider block font-medium">Total Tagihan</span>
                <span className="text-3xl font-extrabold text-brand-emerald tracking-tight mt-1 block">
                  {formatRupiah(cart.totalPrice)}
                </span>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100/80 mb-6 flex gap-3 text-xs text-amber-800 leading-relaxed">
              <HelpCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Informasi Checkout Demo</strong>
                Midtrans belum dikonfigurasi. Klik tombol <strong>Bayar Sekarang</strong> di bawah untuk langsung menandai pesanan sebagai <strong>Lunas (Paid)</strong> dan mengosongkan keranjang belanja Anda untuk keperluan demo/testing.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDemoPayment}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-brand-forest hover:bg-brand-emerald text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Bayar Sekarang (Demo)
              </button>
              <button
                onClick={() => setShowDemoModal(false)}
                className="w-full py-3 rounded-full border border-brand-sage/20 text-brand-sage hover:text-brand-forest font-medium text-sm transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
