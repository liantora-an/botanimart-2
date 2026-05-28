'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import AuthButton from './AuthButton';

interface NavbarProps {
  activePage?: 'beranda' | 'toko' | 'kegiatan' | 'informasi' | 'kontak';
}

export default function Navbar({ activePage }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Sync cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch(`/api/cart?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setCartCount(data.data.totalItems || 0);
          } else {
            setCartCount(0);
          }
        }
      } catch {
        setCartCount(0);
      }
    };

    fetchCartCount();

    // Listen to custom cart updates
    window.addEventListener('cart-updated', fetchCartCount);
    // Also refetch when navigating
    return () => {
      window.removeEventListener('cart-updated', fetchCartCount);
    };
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/toko?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-[#e2ede7] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo (Cropped Transparent v4) */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-40 h-10 sm:w-48 sm:h-12 md:w-56 md:h-14 lg:w-64 lg:h-16 transition-all duration-300 group-hover:scale-102">
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
          <Link
            href="/"
            className={`text-sm font-semibold transition-all ${
              activePage === 'beranda'
                ? 'text-brand-emerald border-b-2 border-brand-emerald pb-1'
                : 'text-brand-sage hover:text-brand-forest'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/toko"
            className={`text-sm font-semibold transition-all ${
              activePage === 'toko'
                ? 'text-brand-emerald border-b-2 border-brand-emerald pb-1'
                : 'text-brand-sage hover:text-brand-forest'
            }`}
          >
            Toko
          </Link>
          <Link
            href="/kegiatan"
            className={`text-sm font-semibold transition-all ${
              activePage === 'kegiatan'
                ? 'text-brand-emerald border-b-2 border-brand-emerald pb-1'
                : 'text-brand-sage hover:text-brand-forest'
            }`}
          >
            Kegiatan
          </Link>
          <Link
            href="/#informasi"
            className={`text-sm font-semibold transition-all ${
              activePage === 'informasi'
                ? 'text-brand-emerald border-b-2 border-brand-emerald pb-1'
                : 'text-brand-sage hover:text-brand-forest'
            }`}
          >
            Informasi
          </Link>
          <Link
            href="/#kontak"
            className={`text-sm font-semibold transition-all ${
              activePage === 'kontak'
                ? 'text-brand-emerald border-b-2 border-brand-emerald pb-1'
                : 'text-brand-sage hover:text-brand-forest'
            }`}
          >
            Kontak
          </Link>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4 relative z-20">
          
          {/* Search Bar Toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-brand-cream border border-[#e2ede7] rounded-full py-1.5 px-3.5 shadow-sm animate-fade-in-up"
              >
                <input
                  type="text"
                  placeholder="Cari tanaman..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 bg-transparent text-sm font-medium focus:outline-none text-brand-forest"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-brand-sage hover:text-brand-forest ml-2 text-xs font-bold"
                >
                  ✕
                </button>
              </form>
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

          {/* Wishlist Icon */}
          <button
            onClick={() => alert('Fitur Wishlist sedang dikembangkan!')}
            className="p-2.5 rounded-full hover:bg-brand-cream text-brand-sage hover:text-brand-forest transition-all relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>

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
  );
}
