'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Phone, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
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

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center text-brand-forest font-heading mb-6">
        Daftar
      </h2>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-2xl bg-red-50 text-red-600 text-xs sm:text-sm border border-red-100 animate-fade-in-up">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 p-3.5 mb-5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs sm:text-sm border border-emerald-100 animate-fade-in-up">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>Daftar berhasil! Silakan masuk...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="fullName" className="text-sm font-semibold text-brand-forest mb-1.5 px-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Masukkan nama lengkap anda..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading || success}
            className="w-full px-5 py-3.5 text-sm text-zinc-800 bg-white border border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="email" className="text-sm font-semibold text-brand-forest mb-1.5 px-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Masukkan email anda..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || success}
            className="w-full px-5 py-3.5 text-sm text-zinc-800 bg-white border border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col text-left relative">
          <label htmlFor="password" className="text-sm font-semibold text-brand-forest mb-1.5 px-1">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Min. 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || success}
              className="w-full pl-5 pr-12 py-3.5 text-sm text-zinc-800 bg-white border border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading || success}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-zinc-400 hover:text-brand-emerald transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="px-2 animate-fade-in-up">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-brand-sage flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-brand-emerald" /> Keamanan Sandi:
              </span>
              <span className={`font-semibold text-zinc-700`}>
                {strengthLabel}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength >= 1 ? strengthColor : 'bg-transparent'}`}></div>
              <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength >= 2 ? strengthColor : 'bg-transparent'}`}></div>
              <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength >= 3 ? strengthColor : 'bg-transparent'}`}></div>
              <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength >= 4 ? strengthColor : 'bg-transparent'}`}></div>
            </div>
          </div>
        )}

        {/* Confirm Password Input */}
        <div className="flex flex-col text-left">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-brand-forest mb-1.5 px-1">
            Konfirmasi Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Ulangi kata sandi anda..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading || success}
            className="w-full px-5 py-3.5 text-sm text-zinc-800 bg-white border border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-4 rounded-full text-white font-semibold bg-brand-forest hover:bg-brand-emerald shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Daftar'
            )}
          </button>
        </div>
      </form>

      {/* Social Register Separator */}
      <div className="mt-6 text-center">
        <span className="text-xs sm:text-sm text-brand-sage font-medium">
          Atau Daftar dengan
        </span>
        <div className="flex justify-center items-center gap-4 mt-3">
          {/* Phone Option */}
          <button
            type="button"
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Phone className="w-5 h-5 text-zinc-800 fill-zinc-800" />
          </button>
          
          {/* Google Option */}
          <button
            type="button"
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 0 12 0 7.35 0 3.37 2.67 1.48 6.56l3.86 3C6.26 6.94 8.89 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.44c-.28 1.44-1.09 2.67-2.31 3.49l3.58 2.78c2.1-1.94 3.31-4.79 3.31-8.42z"
              />
              <path
                fill="#FBBC05"
                d="M5.34 14.56c-.25-.75-.39-1.55-.39-2.36s.14-1.61.39-2.36l-3.86-3C.56 8.54 0 10.21 0 12s.56 3.46 1.48 5.12l3.86-3z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.58-2.78c-1 .67-2.28 1.07-3.96 1.07-3.11 0-5.74-1.9-6.68-4.52l-3.86 3C3.37 21.33 7.35 24 12 24z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-xs sm:text-sm text-brand-sage font-medium">
        Sudah memiliki akun?{' '}
        <Link
          href="/login"
          className="font-bold text-brand-forest hover:underline transition-all"
        >
          Masuk disini!
        </Link>
      </div>
    </div>
  );
}
