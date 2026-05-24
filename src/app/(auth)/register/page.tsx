import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto bg-zinc-950">
      
      {/* 1. Full-screen Background Image */}
      <Image
        src="/images/botanical_auth_bg.png"
        alt="Botani Mart Interior"
        fill
        priority
        className="object-cover opacity-90"
      />
      
      {/* 2. Premium Organic Dark Green Tint Overlay */}
      <div className="absolute inset-0 bg-[#253e32]/85 dark:bg-[#0f1a15]/92 z-10" />
      
      {/* 3. Top-Left Back Button (Kembali) */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-30">
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors font-medium text-sm sm:text-base group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* 4. Main Centered Content Container */}
      <div className="relative z-20 w-full max-w-md mx-auto flex flex-col items-center py-12">
        
        {/* Main Header Titles */}
        <div className="text-center text-white mb-6 sm:mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mb-2 tracking-tight drop-shadow-sm">
            Daftar Akun Botani Mart!
          </h1>
          <p className="text-white/85 text-xs sm:text-sm md:text-base font-medium tracking-wide drop-shadow-sm">
            Lengkapi data untuk bergabung bersama kami
          </p>
        </div>

        {/* Premium Frosted Glassmorphism Card */}
        <div className="w-full bg-white/20 dark:bg-black/35 backdrop-blur-xl border border-white/25 rounded-[36px] shadow-2xl p-6 sm:p-8 md:p-10 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <RegisterForm />
        </div>
        
      </div>
      
    </div>
  );
}
