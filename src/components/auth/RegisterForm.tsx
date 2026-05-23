'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [strengthColor, setStrengthColor] = useState('bg-zinc-200');

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setStrengthLabel('');
      return;
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setPasswordStrength(score);

    switch (score) {
      case 1:
        setStrengthLabel('Lemah');
        setStrengthColor('bg-red-500');
        break;
      case 2:
        setStrengthLabel('Sedang');
        setStrengthColor('bg-orange-500');
        break;
      case 3:
        setStrengthLabel('Cukup Kuat');
        setStrengthColor('bg-yellow-500');
        break;
      case 4:
        setStrengthLabel('Sangat Kuat');
        setStrengthColor('bg-emerald-500');
        break;
      default:
        setStrengthLabel('Terlalu Singkat');
        setStrengthColor('bg-red-500');
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validations
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setError('Kata sandi harus minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);

    // Simulate API call for registration
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-3xl font-bold font-heading text-brand-forest dark:text-brand-lime mb-2">
          Buat Akun Baru
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Bergabunglah dengan Botani Mart dan nikmati kemudahan merawat tanaman impian Anda.
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
          <span>Registrasi berhasil! Mengalihkan ke halaman masuk...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Full Name Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
            <User className="w-5 h-5" />
          </div>
          <input
            type="text"
            id="fullName"
            placeholder=" "
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading || success}
            className="peer block w-full pl-12 pr-4 pt-6 pb-2 text-sm text-zinc-900 dark:text-zinc-50 bg-brand-cream/50 dark:bg-brand-cream/5 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 transition-all duration-200 placeholder-transparent"
          />
          <label
            htmlFor="fullName"
            className="absolute left-12 top-4 text-sm text-zinc-400 dark:text-zinc-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-brand-emerald peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 origin-[0_0]"
          >
            Nama Lengkap
          </label>
        </div>

        {/* Email Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
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
            type="password"
            id="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || success}
            className="peer block w-full pl-12 pr-4 pt-6 pb-2 text-sm text-zinc-900 dark:text-zinc-50 bg-brand-cream/50 dark:bg-brand-cream/5 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 transition-all duration-200 placeholder-transparent"
          />
          <label
            htmlFor="password"
            className="absolute left-12 top-4 text-sm text-zinc-400 dark:text-zinc-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-brand-emerald peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 origin-[0_0]"
          >
            Kata Sandi
          </label>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="px-2 animate-fade-in-up">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-brand-emerald" /> Keamanan Sandi:
              </span>
              <span className={`font-semibold text-zinc-700 dark:text-zinc-300`}>
                {strengthLabel}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength >= 1 ? strengthColor : 'bg-transparent'}`}></div>
              <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength >= 2 ? strengthColor : 'bg-transparent'}`}></div>
              <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength >= 3 ? strengthColor : 'bg-transparent'}`}></div>
              <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength >= 4 ? strengthColor : 'bg-transparent'}`}></div>
            </div>
          </div>
        )}

        {/* Confirm Password Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type="password"
            id="confirmPassword"
            placeholder=" "
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading || success}
            className="peer block w-full pl-12 pr-4 pt-6 pb-2 text-sm text-zinc-900 dark:text-zinc-50 bg-brand-cream/50 dark:bg-brand-cream/5 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-brand-emerald focus:ring-4 focus:ring-brand-emerald/10 transition-all duration-200 placeholder-transparent"
          />
          <label
            htmlFor="confirmPassword"
            className="absolute left-12 top-4 text-sm text-zinc-400 dark:text-zinc-500 pointer-events-none transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-brand-emerald peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 origin-[0_0]"
          >
            Konfirmasi Kata Sandi
          </label>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="px-1 text-xs sm:text-sm">
          <label className="flex items-start gap-2.5 cursor-pointer text-zinc-600 dark:text-zinc-400 select-none">
            <input
              type="checkbox"
              required
              className="mt-1 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-brand-emerald focus:ring-brand-emerald/20 transition-all"
            />
            <span>
              Saya menyetujui{' '}
              <a href="#" className="font-semibold text-brand-emerald dark:text-brand-sage hover:underline">
                Syarat & Ketentuan
              </a>{' '}
              serta{' '}
              <a href="#" className="font-semibold text-brand-emerald dark:text-brand-sage hover:underline">
                Kebijakan Privasi
              </a>{' '}
              dari Botani Mart.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || success}
          className="relative w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-white font-medium bg-brand-forest dark:bg-brand-emerald hover:bg-brand-emerald dark:hover:bg-brand-sage disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 shadow-lg shadow-brand-forest/10 hover:shadow-xl hover:shadow-brand-emerald/15 transition-all duration-300 cursor-pointer overflow-hidden group"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : success ? (
            'Pendaftaran Berhasil'
          ) : (
            <>
              Daftar Sekarang
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        Sudah memiliki akun?{' '}
        <Link
          href="/login"
          className="font-semibold text-brand-emerald dark:text-brand-sage hover:underline hover:text-brand-forest dark:hover:text-brand-lime transition-all"
        >
          Masuk di Sini
        </Link>
      </div>
    </div>
  );
}
