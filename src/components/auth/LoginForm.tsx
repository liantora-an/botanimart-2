'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call for auth
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@botanimart.com' && password === 'admin123') {
        setSuccess(true);
      } else if (email.includes('@') && password.length >= 6) {
        setSuccess(true);
      } else {
        setError('Email atau kata sandi salah. Silakan coba lagi.');
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-3xl font-bold font-heading text-brand-forest dark:text-brand-lime mb-2">
          Selamat Datang Kembali
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Masuk ke akun Botani Mart Anda untuk mulai berbelanja tanaman premium.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-950/30 animate-fade-in-up">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-sm border border-emerald-100 dark:border-emerald-950/30 animate-fade-in-up">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Login berhasil! Mengalihkan ke dasbor Anda...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 peer-focus:text-brand-emerald">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || success}
            className="peer block w-full pl-12 pr-4 pt-6 pb-2 text-sm text-zinc-900 dark:text-zinc-50 bg-brand-cream/50 dark:bg-brand-cream/5 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 transition-all duration-200 placeholder-transparent"
          />
          <label
            htmlFor="email"
            className="absolute left-12 top-4 text-sm text-zinc-400 dark:text-zinc-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-brand-emerald peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 origin-[0_0]"
          >
            Alamat Email
          </label>
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || success}
            className="peer block w-full pl-12 pr-12 pt-6 pb-2 text-sm text-zinc-900 dark:text-zinc-50 bg-brand-cream/50 dark:bg-brand-cream/5 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 transition-all duration-200 placeholder-transparent"
          />
          <label
            htmlFor="password"
            className="absolute left-12 top-4 text-sm text-zinc-400 dark:text-zinc-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-brand-emerald peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 origin-[0_0]"
          >
            Kata Sandi
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || success}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-brand-emerald focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-zinc-600 dark:text-zinc-400 select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-brand-emerald focus:ring-brand-emerald/20 transition-all"
            />
            Ingat saya
          </label>
          <a
            href="#"
            className="font-medium text-brand-emerald hover:text-brand-forest transition-colors dark:text-brand-sage dark:hover:text-brand-lime"
          >
            Lupa kata sandi?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading || success}
          className="relative w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-white font-medium bg-brand-forest dark:bg-brand-emerald hover:bg-brand-emerald dark:hover:bg-brand-sage disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 shadow-lg shadow-brand-forest/10 hover:shadow-xl hover:shadow-brand-emerald/15 transition-all duration-300 cursor-pointer overflow-hidden group"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : success ? (
            'Berhasil Masuk'
          ) : (
            <>
              Masuk Sekarang
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        Belum memiliki akun?{' '}
        <Link
          href="/register"
          className="font-semibold text-brand-emerald dark:text-brand-sage hover:underline hover:text-brand-forest dark:hover:text-brand-lime transition-all"
        >
          Daftar Gratis
        </Link>
      </div>
    </div>
  );
}
