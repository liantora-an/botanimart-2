'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

export default function AuthButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/auth/me?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUser(data.data);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setMenuOpen(false);
      router.push('/');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  // Loading state — show nothing to prevent flash
  if (loading) {
    return (
      <div className="w-[100px] h-10 flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-brand-sage" />
      </div>
    );
  }

  // Not authenticated — show Daftar/Login (responsive)
  if (!user) {
    return (
      <>
        {/* Mobile View — sleek circular login button */}
        <Link
          href="/login"
          className="flex sm:hidden items-center justify-center w-10 h-10 rounded-full bg-brand-cream hover:bg-brand-emerald/10 text-brand-emerald hover:text-brand-forest transition-all duration-300 border border-[#e2ede7] shadow-sm"
          aria-label="Masuk ke Akun"
        >
          <User className="w-5 h-5" />
        </Link>

        {/* Desktop View — full pill button */}
        <Link
          href="/login"
          className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-emerald hover:bg-brand-forest text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300"
        >
          Daftar/Login
        </Link>
      </>
    );
  }

  // Authenticated — show profile button + dropdown
  const initial = (user.full_name || user.email).charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-brand-cream transition-all duration-200 group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-emerald to-brand-forest flex items-center justify-center shadow-sm">
          <span className="text-white text-xs font-bold">{initial}</span>
        </div>
        <span className="hidden sm:block text-sm font-semibold text-brand-forest max-w-[120px] truncate">
          {user.full_name || 'Akun'}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-brand-sage transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e2ede7] py-2 z-50 animate-fade-in-up">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-[#e2ede7]">
            <p className="text-sm font-semibold text-brand-forest truncate">{user.full_name || 'Pengguna'}</p>
            <p className="text-xs text-brand-sage truncate">{user.email}</p>
            {user.role === 'Admin' && (
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <ShieldCheck className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/akun"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-forest hover:bg-brand-cream/60 transition-colors"
            >
              <User className="w-4 h-4 text-brand-sage" />
              Profil Akun
            </Link>

            {user.role === 'Admin' && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-forest hover:bg-brand-cream/60 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-brand-sage" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-[#e2ede7] pt-1">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/60 transition-colors disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
