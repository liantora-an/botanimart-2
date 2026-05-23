import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import { Leaf, ArrowLeft, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      
      {/* Left Panel: Botanical Luxury Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-forest select-none">
        
        {/* Background Image with optimized Next.js Image */}
        <Image
          src="/images/botanical_auth_bg.png"
          alt="Botani Mart Interior Aesthetics"
          fill
          priority
          className="object-cover opacity-90 transition-transform duration-10000 hover:scale-105"
        />
        
        {/* Elegant overlay to guarantee text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/95 via-brand-forest/45 to-brand-forest/10 z-10" />
        
        {/* Back Link on Top Left */}
        <div className="absolute top-8 left-8 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full transition-all duration-300 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-16 text-white">
          <div className="glass-panel p-8 rounded-3xl animate-fade-in-up border border-white/10 shadow-2xl">
            {/* Brand Title */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-brand-lime">
                <Leaf className="w-6 h-6 fill-current" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-brand-lime">
                Botani Mart
              </span>
            </div>

            <h3 className="text-3xl font-bold font-heading mb-3 text-white leading-tight">
              Hadirkan Keindahan Alam di Ruang Hidup Anda
            </h3>
            
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
              Platform e-commerce tanaman hias terkurasi, lengkap dengan panduan perawatan ahli dan integrasi transaksi instan tepercaya.
            </p>

            {/* Premium Features List */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-brand-lime">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <span>Tanaman Terkurasi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-brand-lime">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <span>Pembayaran Aman</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-xs text-white/50 text-center">
            &copy; 2026 Botani Mart. Semua hak dilindungi undang-undang.
          </div>
        </div>
      </div>

      {/* Right Panel: Interactive Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:p-16 lg:p-20 relative">
        
        {/* Brand Mobile Logo & Back Link */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-6 h-6 text-brand-emerald fill-current" />
            <span className="font-heading font-bold text-lg text-brand-forest dark:text-brand-lime">
              Botani Mart
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-brand-emerald font-medium dark:text-zinc-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>

        {/* Center alignment for form */}
        <div className="w-full flex-1 flex items-center justify-center py-8">
          <LoginForm />
        </div>
        
        {/* Footer for Mobile/Tablet */}
        <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 lg:hidden">
          &copy; 2026 Botani Mart.
        </div>
      </div>
      
    </div>
  );
}
